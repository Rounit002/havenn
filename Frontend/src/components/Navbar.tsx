
import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Calculate days left in trial
  const calculateDaysLeft = () => {
    if (user?.subscription_end_date) {
      const endDate = new Date(user.subscription_end_date);
      const currentDate = new Date();
      const timeDiff = endDate.getTime() - currentDate.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return days > 0 ? days : 0;
    }
    return null;
  };

  const daysLeft = calculateDaysLeft();

  // Get subscription plan display name
  const getSubscriptionPlanName = () => {
    if (!user?.subscription_plan) return 'No Plan';
    
    const planNames: Record<string, string> = {
      'free_trial': 'Free Trial',
      '1_month': 'Monthly Plan',
      '3_month': 'Quarterly Plan',
      '6_month': 'Half-Yearly Plan',
      '9_month': 'Nine-Month Plan',
      '12_month': 'Annual Plan'
    };
    
    return planNames[user.subscription_plan] || user.subscription_plan;
  };

  const subscriptionPlanName = getSubscriptionPlanName();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Subscription status banner */}
      {user?.is_trial && daysLeft !== null && daysLeft > 0 && (
        <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-700 px-4 py-2 text-center text-sm font-medium">
          🟢 {subscriptionPlanName} Active – {daysLeft} Days Left
        </div>
      )}
      {user?.is_subscription_active && !user?.is_trial && (
        <div className="bg-indigo-50 border-b border-indigo-200 text-indigo-700 px-4 py-2 text-center text-sm font-medium">
          🔵 {subscriptionPlanName} Active
        </div>
      )}
      {!user?.is_subscription_active && !user?.is_trial && user?.role === 'admin' && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-700 px-4 py-2 text-center text-sm font-medium">
          ⚠️ No Active Subscription – <a href="/subscription-plans" className="underline font-bold">Subscribe Now</a>
        </div>
      )}
      <div className="flex items-center justify-between py-2 px-4 border-b border-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-sm">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/30 bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/60"
            />
          </div>
        </div>
      
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/10">
            <Bell className="h-5 w-5 text-white" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white">
              {user && user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.username || 'User'}</p>
              <button onClick={handleLogout} className="text-xs text-white/80 hover:text-white">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
