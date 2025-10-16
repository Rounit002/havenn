import React from 'react';
import { Gift, Sparkles } from 'lucide-react';

interface FestivalBannerProps {
  variant?: 'compact' | 'full';
  clickable?: boolean;
}

const FestivalBanner: React.FC<FestivalBannerProps> = ({ variant = 'full', clickable = false }) => {
  const handleClick = () => {
    if (clickable) {
      // Scroll to subscription section or navigate to subscription page
      window.location.href = '/subscription';
    }
  };

  if (variant === 'compact') {
    return (
      <div
        className={`bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${clickable ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-2">
            <Gift className="h-6 w-6 animate-bounce" />
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="font-black text-lg tracking-wide">🎉 DIWALI SPECIAL OFFER 🎉</p>
            <p className="text-sm opacity-90 font-medium">Up to 33% OFF on subscriptions!</p>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <Gift className="h-6 w-6 animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-3xl ${clickable ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="text-4xl animate-bounce">🪔</div>
          <h2 className="text-3xl font-black tracking-wider">DIWALI SPECIAL OFFER</h2>
          <div className="text-4xl animate-bounce">🪔</div>
        </div>

        <div className="bg-white/20 rounded-xl p-4 mb-4 backdrop-blur-sm">
          <p className="text-xl font-bold mb-2 flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 animate-pulse" />
            <span>UP TO 33% OFF ON ALL SUBSCRIPTION PLANS</span>
            <Sparkles className="h-6 w-6 animate-pulse" />
          </p>
          <p className="text-lg opacity-90 font-medium">
            Limited Time Offer • Valid till October 31st, 2025
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4 text-base font-semibold">
          <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
            <span className="line-through opacity-75 text-sm">₹300</span>
            <span className="ml-2 font-bold">₹225</span>
            <div className="text-xs opacity-75">Monthly</div>
          </div>
          <div className="text-xl">|</div>
          <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
            <span className="line-through opacity-75 text-sm">₹850</span>
            <span className="ml-2 font-bold">₹650</span>
            <div className="text-xs opacity-75">3-Month</div>
          </div>
          <div className="text-xl">|</div>
          <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
            <span className="line-through opacity-75 text-sm">₹3000</span>
            <span className="ml-2 font-bold">₹1999</span>
            <div className="text-xs opacity-75">Yearly</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-2 text-sm opacity-90">
          <Gift className="h-5 w-5 animate-bounce" />
          <span>Click to grab this amazing offer!</span>
          <Gift className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default FestivalBanner;
