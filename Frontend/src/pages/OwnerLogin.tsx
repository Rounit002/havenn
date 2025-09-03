import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authFetch } from '../utils/apiConfig';
import { Eye, EyeOff, Building2, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import ForgotPassword from '../components/ForgotPassword';

interface LoginData {
  phone: string;
  password: string;
}

const OwnerLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<'owner' | 'user'>('owner');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    phone: '',
    password: ''
  });
  const [userData, setUserData] = useState<{ username: string; password: string; libraryCode: string }>({
    username: '',
    password: '',
    libraryCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'owner') {
      if (!formData.phone || !formData.password) {
        toast.error('Phone number and password are required');
        return;
      }
      setIsLoading(true);
      try {
        const response = await authFetch('/owner-auth/login', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Login successful!');
          login(data.owner);
          navigate('/dashboard');
          setTimeout(() => window.location.reload(), 500);
        } else {
          toast.error(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!userData.username || !userData.password) {
        toast.error('Username and password are required');
        return;
      }
      setIsUserLoading(true);
      try {
        const user = await api.login({ username: userData.username, password: userData.password, libraryCode: userData.libraryCode });
        if (user) {
          toast.success('Login successful!');
          login({ ...user, permissions: user.permissions || [] });
          navigate('/dashboard');
          setTimeout(() => window.location.reload(), 300);
        }
      } catch (error: any) {
        toast.error(error?.message || 'Login failed');
      } finally {
        setIsUserLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center p-4">
      {showForgotPassword ? (
        <ForgotPassword 
          mode={mode} 
          onBack={() => setShowForgotPassword(false)} 
        />
      ) : (
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-orange-400 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="text-gray-600 mt-2">Owner or Staff/Admin</p>
        </div>

        {/* Mode Switch */}
        <div className="flex mb-6 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('owner')}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === 'owner' ? 'bg-white shadow border border-gray-200' : 'text-gray-600'}`}
          >
            Owner
          </button>
          <button
            type="button"
            onClick={() => setMode('user')}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === 'user' ? 'bg-white shadow border border-gray-200' : 'text-gray-600'}`}
          >
            Staff / Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'owner' ? (
            <>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-orange-400 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Signing In...' : 'Sign In as Owner'}
              </button>
            </>
          ) : (
            <>
              {/* Library Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Library Code</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="libraryCode"
                    value={userData.libraryCode}
                    onChange={(e) => setUserData(prev => ({ ...prev, libraryCode: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter library code"
                    required
                  />
                </div>
              </div>
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="user_password"
                    value={userData.password}
                    onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUserLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-orange-400 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isUserLoading ? 'Signing In...' : 'Sign In as Staff/Admin'}
              </button>
            </>
          )}
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Forgot Password?
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/owner-register" className="text-purple-600 hover:text-purple-700 font-medium">
              Register your library
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/student-login" className="text-sm text-gray-500 hover:text-gray-700">
            Student Login →
          </Link>
        </div>
        </div>
      )}
    </div>
  );
};

export default OwnerLogin;
