import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface FestivalBannerProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
  clickable?: boolean;
}

const FestivalBanner: React.FC<FestivalBannerProps> = ({ 
  variant = 'full', 
  className = '',
  clickable = true
}) => {
  const navigate = useNavigate();
  
  // Safely handle useAuth to avoid errors if context is not provided
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext?.user || null;
  } catch (error) {
    console.warn('Auth context not available in FestivalBanner');
    user = null;
  }

  const handleBannerClick = () => {
    if (!clickable) return;
    
    if (user) {
      // User is logged in, redirect to subscription page
      navigate('/subscription');
      toast.success('🎉 Check out our festival offers!');
    } else {
      // User is not logged in, show message and redirect to login
      toast.error('Please log in first to view subscription offers');
      navigate('/owner-login');
    }
  };

  const bannerProps = clickable ? {
    onClick: handleBannerClick,
    style: { cursor: 'pointer' },
    className: `${className} ${clickable ? 'hover:scale-105 transition-transform duration-300' : ''}`
  } : {
    className
  };
  if (variant === 'minimal') {
    return (
      <div {...bannerProps} className={`bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg text-center shadow-lg ${bannerProps.className}`}>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg">🪔</span>
          <span className="font-bold text-sm md:text-base">Durga Puja Festival Offer - Up to 35% OFF!</span>
          <span className="text-lg">🎉</span>
          {clickable && <span className="text-xs opacity-75">👆 Click here!</span>}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div {...bannerProps} className={`bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl shadow-xl p-4 md:p-6 text-center relative overflow-hidden ${bannerProps.className}`}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-20 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl md:text-3xl mr-2 animate-bounce">🪔</span>
            <h3 className="text-lg md:text-xl font-black text-white tracking-wide drop-shadow-lg">
              Durga Puja Festival Offer
            </h3>
            <span className="text-2xl md:text-3xl ml-2 animate-bounce">🎉</span>
          </div>
          <p className="text-sm md:text-base text-white font-bold drop-shadow-md">
            Celebrate with up to 35% OFF on all plans!
          </p>
          <div className="mt-3 inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-900 rounded-full px-4 py-1 font-black text-xs md:text-sm shadow-lg">
            <span>🕉️ Festival Special Pricing 🕉️</span>
          </div>
          {clickable && (
            <div className="mt-2">
              <span className="text-xs text-yellow-200 font-bold animate-pulse">👆 Click to view offers!</span>
            </div>
          )}
        </div>
        {/* Decorative elements */}
        <div className="absolute top-2 left-2 text-yellow-300 opacity-50">
          <span className="text-lg">✨</span>
        </div>
        <div className="absolute top-2 right-2 text-yellow-300 opacity-50">
          <span className="text-xl">🌟</span>
        </div>
        <div className="absolute bottom-2 left-2 text-yellow-300 opacity-50">
          <span className="text-lg">✨</span>
        </div>
        <div className="absolute bottom-2 right-2 text-yellow-300 opacity-50">
          <span className="text-lg">🎊</span>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div {...bannerProps} className={`bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl shadow-2xl p-8 md:p-10 text-center relative overflow-hidden transform hover:scale-105 transition-all duration-300 ${bannerProps.className}`}>
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-20 animate-pulse"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <span className="text-4xl md:text-5xl mr-4 animate-bounce">🪔</span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-wide drop-shadow-lg">
            Durga Puja Festival Offer
          </h2>
          <span className="text-4xl md:text-5xl ml-4 animate-bounce">🎉</span>
        </div>
        <p className="text-xl md:text-3xl text-white font-bold mb-4 drop-shadow-md">
          Celebrate with up to 35% OFF on all plans!
        </p>
        <p className="text-lg md:text-xl text-orange-100 font-medium">
          Limited time offer - Transform your library management this festive season
        </p>
        <div className="mt-6 inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-900 rounded-full px-6 md:px-8 py-2 md:py-3 font-black text-base md:text-lg shadow-xl transform hover:scale-110 transition-all duration-300">
          <span>🕉️ Festival Special Pricing 🕉️</span>
        </div>
        {clickable && (
          <div className="mt-4">
            <span className="text-sm text-yellow-200 font-bold animate-pulse">👆 Click anywhere to explore our offers!</span>
          </div>
        )}
      </div>
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 text-yellow-300 opacity-50">
        <span className="text-2xl">✨</span>
      </div>
      <div className="absolute top-8 right-8 text-yellow-300 opacity-50">
        <span className="text-3xl">🌟</span>
      </div>
      <div className="absolute bottom-4 left-8 text-yellow-300 opacity-50">
        <span className="text-2xl">✨</span>
      </div>
      <div className="absolute bottom-8 right-4 text-yellow-300 opacity-50">
        <span className="text-2xl">🎊</span>
      </div>
    </div>
  );
};

export default FestivalBanner;
