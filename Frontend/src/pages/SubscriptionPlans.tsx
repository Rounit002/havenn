import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// Load Razorpay script
declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load subscription info on component mount
  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        const response = await axios.get('/api/subscriptions/status');
        setSubscriptionInfo(response.data.subscription);
      } catch (error) {
        console.error('Error fetching subscription info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, []);

  // Verify payment and update subscription
  const verifyPayment = async (paymentResponse: any, plan: any) => {
    try {
      const verifyResponse = await axios.post('/api/subscriptions/verify-payment', {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        planId: plan.id
      });

      if (verifyResponse.data.success) {
        // Refresh subscription info
        const response = await axios.get('/api/subscriptions/status');
        setSubscriptionInfo(response.data.subscription);
        alert('Payment successful! Your subscription has been activated.');
      } else {
        alert('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Error verifying payment. Please contact support.');
    }
  };

  // Handle Razorpay payment
  const handlePayment = async (plan: any) => {
    // Load Razorpay script if not already loaded
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Failed to load Razorpay. Please check your internet connection.');
      return;
    }

    // Get order details from backend
    try {
      const orderResponse = await axios.post('/api/subscriptions/create-order', {
        planId: plan.id,
        amount: plan.amount
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
        amount: orderResponse.data.amount,
        currency: 'INR',
        name: 'StudyLib',
        description: `Subscription for ${plan.name}`,
        order_id: orderResponse.data.id,
        handler: async function (response: any) {
          await verifyPayment(response, plan);
        },
        prefill: {
          name: user?.username || '',
          email: '',
          contact: ''
        },
        notes: {
          plan_id: plan.id
        },
        theme: {
          color: '#6366f1'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      alert('Error initiating payment. Please try again.');
    }
  };

  // Calculate end date based on plan
  const calculateEndDate = (planId: string) => {
    const startDate = new Date();
    const endDate = new Date(startDate);

    switch(planId) {
      case '1_day':
        endDate.setDate(endDate.getDate() + 1);
        break;
      case '1_month':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case '3_month':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case '6_month':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case '9_month':
        endDate.setMonth(endDate.getMonth() + 9);
        break;
      case '12_month':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }

    return endDate;
  };

  // Consider a plan current only if still active and not expired
  const isPlanActive = (planId: string) => {
    if (!subscriptionInfo || subscriptionInfo.plan !== planId) return false;
    const end = subscriptionInfo.endDate ? new Date(subscriptionInfo.endDate) : null;
    const now = new Date();
    return Boolean(subscriptionInfo.isActive) && !!end && end.getTime() > now.getTime();
  };

  // Subscription plans data with standard pricing
  const plans = [
    {
      id: 'free_trial',
      name: 'Free Trial Plan',
      description: 'Kickstart Your Journey – 7 Days Free',
      price: '₹0',
      originalPrice: null,
      amount: 0,
      features: [
        'Full access to all features',
        'Manage unlimited students',
        'Track attendance',
        'Generate reports'
      ],
      cta: 'Current Plan',
      isCurrent: isPlanActive('free_trial'),
      disabled: true,
      discount: null
    },
    {
      id: '1_month',
      name: '1-Month Plan',
      description: 'One Month to Build a Routine',
      price: '₹300',
      originalPrice: null,
      amount: 30000, // Amount in paise (₹300 = 30000 paise)
      features: [
        'Unlimited student addition',
        'All library management features',
        'Priority support',
        'No restrictions'
      ],
      cta: 'Get Started',
      isCurrent: isPlanActive('1_month'),
      disabled: false,
      discount: null
    },
    {
      id: '3_month',
      name: '3-Month Plan',
      description: 'Stay Focused for 90 Days',
      price: '₹850',
      originalPrice: null,
      amount: 85000, // Amount in paise (₹850 = 85000 paise)
      features: [
        'Unlimited students',
        'All features included',
        'Priority support',
        'Save compared to monthly'
      ],
      cta: 'Choose Plan',
      isCurrent: isPlanActive('3_month'),
      disabled: false,
      discount: null
    },
    {
      id: '6_month',
      name: '6-Month Plan',
      description: 'Make This Your Growth Phase',
      price: '₹1600',
      originalPrice: null,
      amount: 160000, // Amount in paise (₹1600 = 160000 paise)
      features: [
        'Great value package',
        'All premium features',
        'Extended support',
        'Best for growing libraries'
      ],
      cta: 'Get Started',
      isCurrent: isPlanActive('6_month'),
      disabled: false,
      discount: null
    },
    {
      id: '12_month',
      name: '12-Month Plan',
      description: 'All In for the Year',
      price: '₹3000',
      originalPrice: null,
      amount: 300000, // Amount in paise (₹3000 = 300000 paise)
      features: [
        'Best value',
        'All features unlocked',
        '24/7 priority support',
        'Focus for the long term'
      ],
      cta: 'Get Best Value',
      isCurrent: isPlanActive('12_month'),
      disabled: false,
      discount: null
    },
    {
      id: '1_day',
      name: '1-Day Plan',
      description: 'Full access for 24 hours',
      price: '₹10',
      originalPrice: null,
      amount: 1000, // Amount in paise (₹10 = 1000 paise)
      features: [
        'All features for 1 day',
        'Great for quick needs',
        'Priority support'
      ],
      cta: 'Get 1 Day Access',
      isCurrent: isPlanActive('1_day'),
      disabled: false,
      discount: null
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div
          className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}>
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} onBarcodeClick={() => {}} />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading subscription details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} onBarcodeClick={() => {}} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-8">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6 tracking-tight">Subscription Plans</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            Choose a plan that fits your library's growth journey and unlock the full potential of modern library management
          </p>
        </div>

        {/* Trial status banner */}
        {user?.is_trial && subscriptionInfo?.daysLeft !== null && subscriptionInfo?.daysLeft > 0 && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-8 text-center">
            <p className="font-bold">🟢 7-Day Free Trial Active – {subscriptionInfo.daysLeft} Days Left</p>
          </div>
        )}

        {/* Motivational section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 mb-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">Most people don't finish what they start. Not you.</h2>
            <p className="text-lg text-blue-100 font-medium leading-relaxed">
              This subscription isn't just a payment — it's your decision to run things smarter.
              And it starts now.
            </p>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-2xl shadow-2xl overflow-hidden border-2 relative transform hover:scale-105 transition-all duration-300 hover:shadow-3xl ${
                plan.isCurrent ? 'border-purple-500 ring-4 ring-purple-200' : 'border-gray-200'
              }`}
            >
              {/* Festival Discount Badge */}
              {plan.discount && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-2xl z-10 animate-pulse">
                  {plan.discount}
                </div>
              )}
              
              {/* Card Header with Gradient */}
              <div className={`h-2 ${plan.discount ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'}`}></div>
              
              <div className="p-8">
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{plan.name}</h3>
                <p className="text-gray-600 mb-6 font-medium text-lg leading-relaxed">{plan.description}</p>
                
                {/* Enhanced Pricing with original price strikethrough */}
                <div className="mb-8">
                  {plan.originalPrice ? (
                    <div className="space-y-2">
                      <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{plan.price}</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">Previously:</span>
                        <div className="text-xl text-red-500 line-through font-bold bg-red-50 px-3 py-1 rounded-full">{plan.originalPrice}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{plan.price}</div>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center group">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 mr-4 group-hover:scale-110 transition-transform duration-200">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium text-lg group-hover:text-gray-900 transition-colors duration-200">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePayment(plan)}
                  disabled={plan.disabled || plan.isCurrent}
                  className={`w-full py-4 px-6 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 ${
                    plan.isCurrent
                      ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 cursor-default shadow-lg'
                      : plan.disabled
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : plan.discount
                      ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 shadow-2xl hover:shadow-3xl'
                      : 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 shadow-xl hover:shadow-2xl'
                  }`}
                >
                  {plan.isCurrent ? '✅ Current Plan' : plan.cta}
                </button>
              </div>
            </div>
          ))}
          
          {/* 9-Month Plan */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200 relative transform hover:scale-105 transition-all duration-300 hover:shadow-3xl">
            {/* Card Header with Standard Gradient */}
            <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            
            <div className="p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">9-Month Plan</h3>
              <p className="text-gray-600 mb-6 font-medium text-lg leading-relaxed">The Transformation Period</p>
              
              {/* Standard Pricing */}
              <div className="mb-8">
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹2200</div>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center group">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 mr-4 group-hover:scale-110 transition-transform duration-200">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium text-lg group-hover:text-gray-900 transition-colors duration-200">All premium features</span>
                </li>
                <li className="flex items-center group">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 mr-4 group-hover:scale-110 transition-transform duration-200">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium text-lg group-hover:text-gray-900 transition-colors duration-200">Best value for serious libraries</span>
                </li>
                <li className="flex items-center group">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 mr-4 group-hover:scale-110 transition-transform duration-200">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium text-lg group-hover:text-gray-900 transition-colors duration-200">Extended support period</span>
                </li>
              </ul>
              
              {(() => {
                const current = isPlanActive('9_month');
                return (
                  <button
                    onClick={() => handlePayment({ id: '9_month', name: '9-Month Plan', amount: 220000 })}
                    disabled={current}
                    className={`w-full py-4 px-6 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 ${
                      current
                        ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 cursor-default shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl'
                    }`}
                  >
                    {current ? '✅ Current Plan' : 'Get Started'}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Enhanced Motivational Footer */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-8 mb-8">
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-lg">
                💡 Smart Investment, Smarter Results
              </h3>
              <p className="text-xl text-emerald-100 font-bold mb-2">
                "Just ₹10/day to manage your study space professionally."
              </p>
              <p className="text-lg text-emerald-100 font-medium">
                "Join 300+ libraries building distraction-free environments."
              </p>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-bold text-gray-900 mb-2">Fast Setup</h4>
              <p className="text-gray-600">Get started in minutes, not hours</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🔒</div>
              <h4 className="font-bold text-gray-900 mb-2">Secure & Reliable</h4>
              <p className="text-gray-600">Your data is safe with us</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-gray-600">We're here when you need us</p>
            </div>
          </div>
        </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
