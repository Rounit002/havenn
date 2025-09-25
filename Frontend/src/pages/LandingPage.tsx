import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Users, GraduationCap, Zap, Shield, Award, Sparkles } from 'lucide-react';
import FestivalBanner from '../components/FestivalBanner';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-10 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-7xl w-full">
          {/* Mobile Festival Offer Bar - Simple */}
          <div className="lg:hidden mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 text-center relative overflow-hidden mx-2 sm:mx-0">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-2xl sm:text-3xl mr-2 animate-bounce">🪔</span>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-wide drop-shadow-lg">Durga Puja Festival Offer</h3>
                  <span className="text-2xl sm:text-3xl ml-2 animate-bounce">🎉</span>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-900 rounded-full px-4 py-2 font-black text-base sm:text-lg shadow-xl mb-3">
                  <span>UP TO 35% OFF</span>
                </div>
                <p className="text-white font-bold text-sm sm:text-base mb-3 drop-shadow-md">
                  Transform your library management this festive season
                </p>
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-4 py-2 font-black text-sm animate-pulse shadow-xl">
                  🕉️ LIMITED TIME OFFER - GRAB NOW! 🕉️
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Festival Banner - Minimal */}
          <div className="hidden lg:block mb-8">
            <FestivalBanner variant="minimal" clickable={false} />
          </div>
          
          {/* Responsive Main Content */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start justify-center">
            {/* Main Content - Responsive Centered */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-0">
              {/* Responsive Header */}
              <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8">
                  <div className="relative mb-4 sm:mb-0">
                    <BookOpen className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text sm:mr-4 lg:mr-6" style={{WebkitBackgroundClip: 'text'}} />
                    <Sparkles className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-400 animate-bounce" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                      HAVENN
                    </h1>
                    <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-700 mt-2 lg:mt-3">
                      Library Management System
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsive User Type Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto mb-8 sm:mb-12 lg:mb-16">
                {/* Library Owner Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                  <CardHeader className="text-center relative z-10">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30"></div>
                        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                          <Users className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      🏢 Library Owner / Staff
                    </CardTitle>
                    <CardDescription className="text-gray-700 font-medium text-sm">
                      Complete library ecosystem management with advanced analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 relative z-10 p-4 sm:p-6">
                    <Button 
                      onClick={() => navigate('/owner-login')}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      🚀 Owner Login
                    </Button>
                    <Button 
                      onClick={() => navigate('/owner-register')}
                      variant="outline" 
                      className="w-full border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 font-bold py-3 sm:py-4 text-sm sm:text-base rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      ✨ Register New Library
                    </Button>
                    <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-600 font-medium">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      <span>Secure & Multi-tenant</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Student Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-white via-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10"></div>
                  <CardHeader className="text-center relative z-10">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur-lg opacity-30"></div>
                        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full">
                          <GraduationCap className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      🎓 Student Access
                    </CardTitle>
                    <CardDescription className="text-gray-700 font-medium text-sm">
                      Smart attendance tracking and personalized dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 relative z-10 p-4 sm:p-6">
                    <Button 
                      onClick={() => navigate('/student-login')}
                      className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      🎯 Student Login
                    </Button>
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-2 sm:p-3 text-center">
                      <div className="text-xs sm:text-sm text-green-800 font-bold">
                        💡 Use library code + phone number
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-600 font-medium">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      <span>Instant Access</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Right Sidebar - Simple Festival Offer Card */}
            <div className="hidden lg:block lg:w-80 xl:w-96 order-first lg:order-last">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden sticky top-8 border-4 border-yellow-300 animate-pulse">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-20 animate-pulse"></div>
                
                <div className="relative z-10">
                  {/* Main Festival Header */}
                  <div className="flex items-center justify-center mb-6">
                    <span className="text-4xl mr-3 animate-bounce">🪔</span>
                    <h3 className="text-2xl font-black text-white tracking-wide drop-shadow-lg">
                      Durga Puja Festival
                    </h3>
                    <span className="text-4xl ml-3 animate-bounce">🎉</span>
                  </div>
                  
                  {/* Offer Badge */}
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-900 rounded-full px-6 py-4 font-black text-2xl shadow-xl mb-6 transform -rotate-1">
                    <span>UP TO 35% OFF</span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-white font-bold text-lg mb-8 drop-shadow-md leading-relaxed">
                    Transform your library management this festive season with our special pricing
                  </p>
                  
                  {/* Call to Action */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-300 to-orange-300 text-orange-900 rounded-2xl p-4 shadow-2xl border-2 border-yellow-400">
                      <div className="text-xl font-black mb-2">🎯 SPECIAL FESTIVAL PRICING</div>
                      <div className="text-sm font-bold">Multiple plans available with huge discounts!</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-6 py-4 font-black text-lg animate-bounce shadow-xl">
                      🕉️ LIMITED TIME OFFER - GRAB NOW! 🕉️
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Decorative elements */}
                <div className="absolute top-4 left-4 text-yellow-300 opacity-80 animate-spin" style={{animationDuration: '3s'}}>
                  <span className="text-3xl">✨</span>
                </div>
                <div className="absolute top-4 right-4 text-yellow-300 opacity-80 animate-bounce">
                  <span className="text-4xl">🌟</span>
                </div>
                <div className="absolute bottom-4 left-4 text-yellow-300 opacity-80 animate-pulse">
                  <span className="text-3xl">🎊</span>
                </div>
                <div className="absolute bottom-4 right-4 text-yellow-300 opacity-80 animate-spin" style={{animationDuration: '2s'}}>
                  <span className="text-3xl">✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
