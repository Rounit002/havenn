import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

interface Branch {
  id: number;
  name: string;
}

const ProfitLoss: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchesData = await api.getBranches();
        setBranches(branchesData);
      } catch (error) {
        console.error('Failed to fetch branches:', error);
        toast.error('Failed to load branches');
      }
    };
    fetchBranches();
  }, []);

  const handleFetch = async () => {
    try {
      const params = { month, branchId: selectedBranchId };
      const response = await api.getProfitLoss(params);
      setData(response);
    } catch (error) {
      console.error('Failed to fetch profit/loss:', error);
      toast.error('Failed to load profit/loss data');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            📈 Profit & Loss
          </motion.h1>
          <div className="mb-6 h-2 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 dark:from-indigo-600 dark:via-fuchsia-600 dark:to-sky-600 shadow-sm ring-1 ring-white/30" />

          <motion.div
            className="bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700 ring-1 ring-indigo-100/70 dark:ring-indigo-900/40"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <label
              htmlFor="month"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Month
            </label>
            <input
              type="month"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-2 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-white/95 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm mb-4"
            />
            <label
              htmlFor="branch"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Branch
            </label>
            <select
              id="branch"
              value={selectedBranchId || ''}
              onChange={(e) => setSelectedBranchId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white/95 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-sm mb-4"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleFetch}
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 text-white px-6 py-2 rounded-md shadow-md hover:from-violet-500 hover:via-fuchsia-400 hover:to-sky-400 focus:ring-2 focus:ring-violet-300 ring-1 ring-white/20 transition"
            >
              Fetch Report
            </button>
          </motion.div>

          {data && (
            <motion.div
              className="rounded-2xl p-[3px] bg-gradient-to-br from-indigo-600/80 via-amber-500/80 to-rose-500/80 shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="rounded-[14px] bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-10 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center px-4 font-semibold">
                  Financial Summary
                </div>
                <div className="p-6 space-y-3 text-sm sm:text-base">
                  <p className="text-gray-700 dark:text-gray-200">Month: <span className="font-semibold">{data.month}</span></p>
                  <p className="text-emerald-700 dark:text-emerald-300">Total Collected: <span className="font-semibold">{data.totalCollected.toFixed(2)}</span></p>
                  <p className="text-rose-700 dark:text-rose-300">Total Expenses: <span className="font-semibold">{data.totalExpenses.toFixed(2)}</span></p>
                  <p className={`font-semibold ${data.profitLoss >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                    {data.profitLoss >= 0 ? 'Profit' : 'Loss'}: {Math.abs(data.profitLoss).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfitLoss;