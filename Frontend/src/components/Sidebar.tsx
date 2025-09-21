import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, UserPlus, Building2, Calendar, Clock, Grid, DollarSign, Wallet, ShoppingBag, BarChart2, Settings, ChevronRight, UserCheck, AlertTriangle, Menu, X, LogOut, MapPin, Package, ToggleLeft, Archive, Users, QrCode, Megaphone, HelpCircle, ShieldCheck, UserCog } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import logo from './logo.jpg';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onBarcodeClick: () => void;
}

const hasPermission = (user, permission) => {
    if (!user || !user.permissions) return false;
    if (user.role === 'admin') return true;
    
    // Special case for lockers - allow both admin and staff users
    if (permission === 'manage_lockers_or_staff') {
        return user.role === 'admin' || user.role === 'staff';
    }
    
    return user.permissions.includes(permission);
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, onBarcodeClick }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showHostelDropdown, setShowHostelDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const effectiveIsCollapsed = isMobile ? false : isCollapsed;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  
  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Home', permission: null, iconBg: 'bg-indigo-100', iconBgHover: 'group-hover:bg-indigo-200', iconActive: 'bg-indigo-200', iconColor: 'text-indigo-600' },
    { path: '/students', icon: UserPlus, label: 'Library Students', hasDropdown: true, permission: 'manage_library_students', iconBg: 'bg-violet-100', iconBgHover: 'group-hover:bg-violet-200', iconActive: 'bg-violet-200', iconColor: 'text-violet-600' },
    { path: '/attendance', icon: Users, label: 'Attendance', permission: 'manage_library_students', iconBg: 'bg-cyan-100', iconBgHover: 'group-hover:bg-cyan-200', iconActive: 'bg-cyan-200', iconColor: 'text-cyan-600' },
    { path: '#', icon: QrCode, label: 'Barcode', permission: 'manage_library_students', onClick: onBarcodeClick, iconBg: 'bg-emerald-100', iconBgHover: 'group-hover:bg-emerald-200', iconActive: 'bg-emerald-200', iconColor: 'text-emerald-600' },
    { path: '/announcements', icon: Megaphone, label: 'Announcements', permission: 'manage_library_students', iconBg: 'bg-amber-100', iconBgHover: 'group-hover:bg-amber-200', iconActive: 'bg-amber-200', iconColor: 'text-amber-600' },
    { path: '/admission-requests', icon: UserCog, label: 'Admission Requests', permission: 'manage_library_students', iconBg: 'bg-indigo-100', iconBgHover: 'group-hover:bg-indigo-200', iconActive: 'bg-indigo-200', iconColor: 'text-indigo-600' },
    // { path: '/public-queries', icon: HelpCircle, label: 'Public Queries', permission: 'manage_library_students', iconBg: 'bg-teal-100', iconBgHover: 'group-hover:bg-teal-200', iconActive: 'bg-teal-200', iconColor: 'text-teal-600' },
    { path: '/admin/queries', icon: ShieldCheck, label: 'Admin Queries', permission: 'admin_only', iconBg: 'bg-rose-100', iconBgHover: 'group-hover:bg-rose-200', iconActive: 'bg-rose-200', iconColor: 'text-rose-600' },
    // { path: '/hostel', icon: Building2, label: 'Hostel Students', hasDropdown: true, permission: 'manage_hostel_students', iconBg: 'bg-blue-100', iconBgHover: 'group-hover:bg-blue-200', iconActive: 'bg-blue-200', iconColor: 'text-blue-600' },
    { path: '/schedule', icon: Calendar, label: 'Schedule', permission: 'manage_schedules', iconBg: 'bg-sky-100', iconBgHover: 'group-hover:bg-sky-200', iconActive: 'bg-sky-200', iconColor: 'text-sky-600' },
    { path: '/shifts', icon: Clock, label: 'Shifts', permission: 'manage_schedules', iconBg: 'bg-teal-100', iconBgHover: 'group-hover:bg-teal-200', iconActive: 'bg-teal-200', iconColor: 'text-teal-600' },
    { path: '/seats', icon: Grid, label: 'Seats', permission: 'manage_seats', iconBg: 'bg-purple-100', iconBgHover: 'group-hover:bg-purple-200', iconActive: 'bg-purple-200', iconColor: 'text-purple-600' },
    { path: '/branches', icon: MapPin, label: 'Manage Branches', permission: 'manage_branches', iconBg: 'bg-fuchsia-100', iconBgHover: 'group-hover:bg-fuchsia-200', iconActive: 'bg-fuchsia-200', iconColor: 'text-fuchsia-600' },
    { path: '/products', icon: Package, label: 'Products', permission: 'manage_products', iconBg: 'bg-pink-100', iconBgHover: 'group-hover:bg-pink-200', iconActive: 'bg-pink-200', iconColor: 'text-pink-600' },
    { path: '/transactions', icon: DollarSign, label: 'Transactions', permission: 'view_transactions', iconBg: 'bg-emerald-100', iconBgHover: 'group-hover:bg-emerald-200', iconActive: 'bg-emerald-200', iconColor: 'text-emerald-600' },
    { path: '/collections', icon: Wallet, label: 'Collection & Due', permission: 'view_collections', iconBg: 'bg-green-100', iconBgHover: 'group-hover:bg-green-200', iconActive: 'bg-green-200', iconColor: 'text-green-600' },
    { path: '/expenses', icon: ShoppingBag, label: 'Expenses', permission: 'manage_expenses', iconBg: 'bg-amber-100', iconBgHover: 'group-hover:bg-amber-200', iconActive: 'bg-amber-200', iconColor: 'text-amber-600' },
    { path: '/profit-loss', icon: BarChart2, label: 'Profit & Loss', permission: 'view_reports', iconBg: 'bg-indigo-100', iconBgHover: 'group-hover:bg-indigo-200', iconActive: 'bg-indigo-200', iconColor: 'text-indigo-600' },
    { path: '/lockers', icon: Archive, label: 'Lockers', permission: 'manage_lockers_or_staff', iconBg: 'bg-slate-100', iconBgHover: 'group-hover:bg-slate-200', iconActive: 'bg-slate-200', iconColor: 'text-slate-600' },
    { path: '/settings', icon: Settings, label: 'Settings', permission: 'admin_only', iconBg: 'bg-gray-100', iconBgHover: 'group-hover:bg-gray-200', iconActive: 'bg-gray-200', iconColor: 'text-gray-700' },
    { path: '/subscription', icon: ShoppingBag, label: 'Subscription', permission: 'admin_only', iconBg: 'bg-violet-100', iconBgHover: 'group-hover:bg-violet-200', iconActive: 'bg-violet-200', iconColor: 'text-violet-600' },
  ];

  const handleLogout = () => {
    navigate('/');
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <>
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-white shadow-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 border-r border-gray-100 flex flex-col min-h-0 transition-all duration-300 ${
          isMobile ? (isSidebarOpen ? 'fixed top-0 left-0 z-50 w-64' : 'hidden') : (effectiveIsCollapsed ? 'w-16' : 'w-64')
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {!effectiveIsCollapsed && (
            <div className="flex items-center gap-2">
              <img src={logo} alt="Library Logo" className="h-10 w-10 rounded-full object-cover" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 text-transparent bg-clip-text">
                HAVENN <br />
                <p className="text-sm text-gray-500">Library into Heaven</p>
              </h1>
            </div>
          )}
          {isMobile ? (
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={20} className={`${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              let canView = false;
              if (item.permission === null) {
                canView = true;
              } else if (item.permission === 'admin_only') {
                canView = user?.role === 'admin';
              } else {
                canView = hasPermission(user, item.permission);
              }

              if (canView) {
                return (
                  <li key={item.path}>
                    {item.onClick ? (
                      <button
                        onClick={() => {
                          console.log('Barcode button clicked!', item.label);
                          if (item.onClick) {
                            console.log('Calling onClick handler');
                            item.onClick();
                          } else {
                            console.log('No onClick handler found');
                          }
                          if (isMobile) setIsSidebarOpen(false);
                        }}
                        className={`group flex items-center w-full text-left py-2.5 px-4 rounded-lg transition-colors duration-200 ${
                          effectiveIsCollapsed ? 'justify-center' : ''
                        } ${
                          isActive(item.path)
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-700 hover:bg-slate-100'
                        }`}>
                        <span className={`mr-3 ${effectiveIsCollapsed ? '' : ''}`}>
                          <span className={`inline-flex items-center justify-center p-1.5 rounded-md ${item.iconBg} ${item.iconBgHover} ${isActive(item.path) ? item.iconActive : ''}`}>
                            {(() => { const Icon = item.icon; return <Icon size={18} className={`${item.iconColor}`} />; })()}
                          </span>
                        </span>
                        {!effectiveIsCollapsed && <span className="font-medium">{item.label}</span>}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={(e) => {
                          if (item.hasDropdown && !effectiveIsCollapsed) {
                            e.preventDefault();
                            if (item.label === 'Library Students') {
                              setShowStudentDropdown(!showStudentDropdown);
                            } else if (item.label === 'Hostel Students') {
                              setShowHostelDropdown(!showHostelDropdown);
                            }
                          } else if (isMobile) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        className={`group flex items-center py-2.5 px-4 rounded-lg transition-colors duration-200 ${
                          effectiveIsCollapsed ? 'justify-center' : ''
                        } ${
                          isActive(item.path)
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-700 hover:bg-slate-100'
                        }`}>
                        <span className={`mr-3 ${effectiveIsCollapsed ? '' : ''}`}>
                          <span className={`inline-flex items-center justify-center p-1.5 rounded-md ${item.iconBg} ${item.iconBgHover} ${isActive(item.path) ? item.iconActive : ''}`}>
                            {(() => { const Icon = item.icon; return <Icon size={18} className={`${item.iconColor}`} />; })()}
                          </span>
                        </span>
                        {!effectiveIsCollapsed && (
                          <div className="flex justify-between items-center w-full">
                            <span className="font-medium">{item.label}</span>
                            {item.hasDropdown && (
                              <ChevronRight
                                size={16}
                                className={`transition-transform ${
                                  (item.label === 'Library Students' && showStudentDropdown) ||
                                  (item.label === 'Hostel Students' && showHostelDropdown)
                                    ? 'rotate-90'
                                    : ''
                                }`}
                              />
                            )}
                          </div>
                        )}
                      </Link>
                    )}
                    {!effectiveIsCollapsed && item.hasDropdown && showStudentDropdown && item.label === 'Library Students' && (
                      <div className="ml-8 mt-1 space-y-1 animate-fade-in">
                        <Link to="/students/add" className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive('/students/add') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-slate-100'}`} onClick={() => isMobile && setIsSidebarOpen(false)}>Add Student</Link>
                        <Link to="/students" className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive('/students') && location.pathname.split('/').length === 2 ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-slate-100'}`} onClick={() => isMobile && setIsSidebarOpen(false)}>View All</Link>
                        <Link to="/active-students" className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${isActive('/active-students') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-slate-100'}`} onClick={() => isMobile && setIsSidebarOpen(false)}><UserCheck size={14} className="mr-1.5" />Active Students</Link>
                        <Link to="/expired-memberships" className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${isActive('/expired-memberships')? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-slate-100'}`} onClick={() => isMobile && setIsSidebarOpen(false)}><AlertTriangle size={14} className="mr-1.5" />Expired Members</Link>
                        <Link to="/inactive-students" className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${isActive('/inactive-students') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-slate-100'}`} onClick={() => isMobile && setIsSidebarOpen(false)}><ToggleLeft size={14} className="mr-1.5" />Inactive Students</Link>
                      </div>
                    )}
                    {!effectiveIsCollapsed && item.hasDropdown && showHostelDropdown && item.label === 'Hostel Students' && (
                      <div className="ml-8 mt-1 space-y-1 animate-fade-in">
                        <Link to="/hostel-dashboard" className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive('/hostel-dashboard') ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => isMobile && setIsSidebarOpen(false)}>Hostel Dashboard</Link>
                        <Link to="/hostel/active-students" className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${isActive('/hostel/active-students') ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => isMobile && setIsSidebarOpen(false)}><UserCheck size={14} className="mr-1.5" />Active Students</Link>
                        <Link to="/hostel/collections" className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive('/hostel/collections') ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => isMobile && setIsSidebarOpen(false)}>Collection & Due</Link>
                        <Link to="/hostel/expired" className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive('/hostel/expired') ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => isMobile && setIsSidebarOpen(false)}>Expired Memberships</Link>
                        <Link to="/hostel" className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive('/hostel') && location.pathname.split('/').length === 2 ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => isMobile && setIsSidebarOpen(false)}>Student Management</Link>
                      </div>
                    )}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </nav>
        <div className="p-2">
          <button
            className={`flex items-center w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
              effectiveIsCollapsed ? 'justify-center' : ''
            }`}
            onClick={handleLogout}
          >
            <div className={`flex items-center gap-3 ${effectiveIsCollapsed ? 'justify-center' : ''}`}>
              <LogOut size={20} className="text-gray-500" />
              {!effectiveIsCollapsed && <span className="font-medium">Logout</span>}
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;