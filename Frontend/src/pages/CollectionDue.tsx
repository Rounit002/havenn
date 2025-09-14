import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Download, Eye, Search, Loader2, AlertCircle, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Interface for a single collection record
interface Collection {
  historyId: number;
  studentId: number;
  name: string;
  shiftTitle: string | null;
  totalFee: number;
  amountPaid: number;
  dueAmount: number;
  cash: number;
  online: number;
  securityMoney: number;
  remark: string;
  createdAt: string | null;
  branchId?: number;
  seatNumber?: string | null;
}

// Interface for the branch filter
interface Branch {
  id: number;
  name: string;
}

const CollectionDue: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  // State for UI and filters
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleBarcodeClick = () => {
    // TODO: Implement barcode scanning functionality
    toast.info('Barcode scanning functionality is not yet implemented.');
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  
  // New filter states
  const [showOnlyDue, setShowOnlyDue] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Initialize filters from URL parameters
  useEffect(() => {
    const showOnlyDueParam = searchParams.get('showOnlyDue');
    if (showOnlyDueParam === 'true') {
      setShowOnlyDue(true);
    }
  }, [searchParams]);

  // State for the payment modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | null>(null);

  // Fetch branches for the filter dropdown
  useEffect(() => {
    api.getBranches().then(setBranches).catch(() => toast.error('Failed to load branches'));
  }, []);

  // --- Data Fetching with React Query ---

  // QUERY 1: Fetch the list of individual collections
  const { data: collectionsData, isLoading: isCollectionsLoading } = useQuery({
    queryKey: ['collections', selectedMonth, selectedBranchId, fromDate, toDate],
    queryFn: () => {
      const params: any = { branchId: selectedBranchId || undefined };
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      } else {
        params.month = selectedMonth;
      }
      return api.getCollections(params);
    },
  });

  // QUERY 2: Fetch aggregate financial statistics (ADMINS ONLY)
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['collectionStats', selectedMonth, selectedBranchId, fromDate, toDate],
    queryFn: () => {
      const params: any = { branchId: selectedBranchId || undefined };
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      } else {
        params.month = selectedMonth;
      }
      return api.getCollectionStats(params);
    },
    enabled: !!user && user.role === 'admin',
  });

  // --- Mutations ---

  const paymentMutation = useMutation({
    mutationFn: (variables: { historyId: number; amount: number; method: 'cash' | 'online' }) =>
      api.updateCollectionPayment(variables.historyId, { amount: variables.amount, method: variables.method }),
    onSuccess: () => {
      toast.success('Payment updated successfully');
      setIsPayModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      if (user?.role === 'admin') {
        queryClient.invalidateQueries({ queryKey: ['collectionStats'] });
      }
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update payment');
    },
  });

  // --- Event Handlers ---

  const handlePayDue = (collection: Collection) => {
    setSelectedCollection(collection);
    setPaymentAmount(collection.dueAmount.toFixed(2));
    setPaymentMethod(null);
    setIsPayModalOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (!selectedCollection || !paymentMethod || !paymentAmount) {
      toast.error('Please select a payment method and enter a payment amount');
      return;
    }
    const payment = parseFloat(paymentAmount);
    if (isNaN(payment) || payment <= 0 || payment > selectedCollection.dueAmount + 0.01) {
      toast.error('Invalid payment amount. Cannot be zero or more than the due amount.');
      return;
    }
    paymentMutation.mutate({
      historyId: selectedCollection.historyId,
      amount: payment,
      method: paymentMethod,
    });
  };

  const generateInvoicePdf = async (collection: Collection, forDownload = true) => {
    try {
      const invoiceElement = document.getElementById(`invoice-${collection.historyId}`);
      if (!invoiceElement) return null;
      
      const canvas = await html2canvas(invoiceElement, { 
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      if (forDownload) {
        pdf.save(`invoice-${collection.studentId}-${new Date().toISOString().split('T')[0]}.pdf`);
      }
      
      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate invoice PDF');
      return null;
    }
  };

  const downloadInvoiceAsPdf = async (collection: Collection) => {
    await generateInvoicePdf(collection, true);
  };

  const shareOnWhatsApp = async (collection: Collection) => {
    try {
      const pdf = await generateInvoicePdf(collection, false);
      if (!pdf) return;
      
      // Convert PDF to blob
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], `invoice-${collection.studentId}.pdf`, { type: 'application/pdf' });
      
      // Create a temporary URL for the blob
      const fileUrl = URL.createObjectURL(pdfFile);
      
      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `invoice-${collection.studentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(fileUrl);
      }, 100);
      
      // Open WhatsApp with the file
      const whatsappUrl = `https://wa.me/?text=Here%20is%20the%20invoice%20for%20${encodeURIComponent(collection.name)}`;
      window.open(whatsappUrl, '_blank');
      
    } catch (error) {
      console.error('Error sharing on WhatsApp:', error);
      toast.error('Failed to share on WhatsApp');
    }
  };

  const closeModal = () => {
    setSelectedCollection(null);
  };

  // Filter collections locally for the search bar and due filter
  const filteredCollections = collectionsData?.collections.filter(col => {
    const matchesSearch = col.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDueFilter = !showOnlyDue || col.dueAmount > 0;
    return matchesSearch && matchesDueFilter;
  }) || [];
  
  // Get total students count from the unfiltered data
  const totalStudents = collectionsData?.collections.length || 0;

  return (
    <div className="flex h-screen overflow-hidden bg-[#fef9f6]">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} onBarcodeClick={handleBarcodeClick} />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">📊 Collection & Due</h1>
          
          <div className="mb-6 space-y-4">
            {/* First row - Search and Due filter */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2 border rounded-md"
              />
              <label className="flex items-center space-x-2 p-2 border rounded-md bg-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyDue}
                  onChange={(e) => setShowOnlyDue(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show Only Due</span>
              </label>
            </div>
            
            {/* Second row - All date filters and Branch */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 border rounded-md"
                placeholder="Month"
              />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-2 border rounded-md"
                placeholder="From Date"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-2 border rounded-md"
                placeholder="To Date"
              />
              <select
                value={selectedBranchId || ''}
                onChange={(e) => setSelectedBranchId(e.target.value ? Number(e.target.value) : null)}
                className="p-2 border rounded-md"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </div>
          </div>

          {/* CONDITIONAL ADMIN-ONLY STATS BLOCK */}
          {user?.role === 'admin' && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <StatCard title="Total Students" value={totalStudents} isLoading={isCollectionsLoading} />
              <StatCard title="Total Collected" value={statsData?.totalPaid} isLoading={isStatsLoading} isCurrency color="text-green-600" />
              <StatCard title="Total Due" value={statsData?.totalDue} isLoading={isStatsLoading} isCurrency color="text-red-600" />
              <StatCard title="Cash Collected" value={statsData?.totalCash} isLoading={isStatsLoading} isCurrency color="text-blue-600" />
              <StatCard title="Online Collected" value={statsData?.totalOnline} isLoading={isStatsLoading} isCurrency color="text-purple-600" />
              
            </motion.div>
          )}

          <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
            {isCollectionsLoading ? (
              <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Fee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cash</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Online</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Security</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remark</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCollections.length === 0 ? (
                    <tr><td colSpan={13} className="px-4 py-4 text-center text-gray-500">No collections found.</td></tr>
                  ) : (
                    filteredCollections.map((collection) => (
                      <tr key={collection.historyId}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{collection.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{branches.find(b => b.id === collection.branchId)?.name || 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{collection.shiftTitle || 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{collection.seatNumber || 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">₹{collection.totalFee.toFixed(2)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">₹{collection.cash.toFixed(2)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">₹{collection.online.toFixed(2)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">₹{collection.securityMoney.toFixed(2)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-600">₹{collection.amountPaid.toFixed(2)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">₹{collection.dueAmount.toFixed(2)}</td>
                        <td className="px-4 py-4 whitespace-wrap text-sm text-gray-500">{collection.remark || 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{collection.createdAt ? new Date(collection.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {collection.dueAmount > 0 && (
                            <button onClick={() => handlePayDue(collection)} className="text-purple-600 hover:text-purple-800 font-medium">Pay Due</button>
                          )}
                          <div className="flex space-x-1">
                            <button
                              className="p-1 text-gray-500 hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadInvoiceAsPdf(collection);
                              }}
                              title="Download Invoice"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-gray-500 hover:text-green-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                shareOnWhatsApp(collection);
                              }}
                              title="Share on WhatsApp"
                            >
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.498 14.382v-.002c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.136-.135.297-.354.446-.521.146-.181.194-.296.297-.494.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.15.195 2.105 3.195 5.1 4.485.714.3 1.27.489 1.704.621.714.227 1.365.195 1.88.121.574-.09 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.36m-5.446 7.443h-.016a9.87 9.87 0 01-5.031-1.379l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.86 9.86 0 01-1.51-5.26c.001-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.86 2.909 4.35 2.909 6.99-.004 5.444-4.458 9.885-9.933 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.462 0 .103 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.01 12.01 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Payment Modal */}
        {isPayModalOpen && selectedCollection && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Pay Due for {selectedCollection.name}</h3>
              <p className="text-sm text-gray-600 mb-2">Total Due Amount: ₹{selectedCollection.dueAmount.toFixed(2)}</p>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Payment Method:</p>
                <div className="flex space-x-4">
                  <label className="flex items-center"><input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="mr-2" />Cash</label>
                  <label className="flex items-center"><input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="mr-2" />Online</label>
                </div>
              </div>
              <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Enter payment amount" className="w-full p-2 border rounded-md mb-4" max={selectedCollection.dueAmount.toString()} />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsPayModalOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                <button onClick={handlePaymentSubmit} disabled={paymentMutation.isPending} className="px-4 py-2 bg-purple-600 text-white rounded-md disabled:bg-purple-300">
                  {paymentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Payment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for rendering the stat cards for admins
const StatCard = ({ title, value, isLoading, isCurrency = false, color = 'text-gray-800' }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <div className={`text-xl font-bold ${color}`}>
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isCurrency ? `₹${(value || 0).toFixed(2)}` : (value || 0))}
    </div>
  </div>
);

export default CollectionDue;
