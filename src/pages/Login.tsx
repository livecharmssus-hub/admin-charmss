import React, { useState } from 'react';
import { Camera, Video, Heart, Star, Mail, Lock, EyeOff, Eye, User } from 'lucide-react';
import ForgotPassword from '../components/ForgotPassword';
import livecharmss2t from '../assets/images/livecharmss2t.png'

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Simulate login process
      onLogin();
    } else {
      // Handle registration logic here
      console.log('Registration:', formData);
    }
  };

  const features = [
    { icon: Camera, text: 'Live Streaming', color: 'text-pink-400' },
    { icon: Video, text: 'Video Calls', color: 'text-purple-400' },
    { icon: Heart, text: 'Fan Interaction', color: 'text-red-400' },
    { icon: Star, text: 'Premium Content', color: 'text-yellow-400' }
  ];

  // Show Forgot Password component
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex flex-col">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-red-900/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-16 w-32 h-32 bg-red-800/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 bg-pink-900/25 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-red-700/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 pt-8 pb-4 px-4 text-center">
          <img 
            src={livecharmss2t} 
            alt="Live Charmss" 
            className="h-12 w-auto mx-auto mb-4"
          />
        </div>

        {/* Forgot Password Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-gray-700/50 shadow-2xl">
              <ForgotPassword onBack={() => setShowForgotPassword(false)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-900/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-32 h-32 bg-red-800/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-pink-900/25 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-red-700/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4 px-4 text-center">
        <img 
          src={livecharmss2t} 
          alt="Live Charmss" 
          className="h-12 w-auto mx-auto mb-4"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Welcome to LiveCharmss
        </h1>
        <p className="text-white/70 text-sm md:text-base">
          Connect, Create, and Earn with your audience
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Login/Register Card */}
          <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-gray-700/50 shadow-2xl">
            {/* Toggle Buttons */}
            <div className="flex bg-black/30 rounded-2xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  isLogin 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  !isLogin 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Terms (Register only) - Moved to top */}
              {!isLogin && (
                <div className="flex items-start space-x-3 mb-6 p-4 bg-black/20 rounded-2xl border border-gray-700/30">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-red-600 bg-black/20 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="terms" className="text-white/70 text-sm">
                    I agree to the{' '}
                    <button type="button" className="text-red-400 hover:text-red-300 underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-red-400 hover:text-red-300 underline">
                      Privacy Policy
                    </button>
                  </label>
                </div>
              )}

              {/* Google Login - Prioritized */}
              <div className="mb-6">
                <button 
                  type="button"
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 py-4 px-4 rounded-2xl transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg border border-gray-200 font-semibold"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="px-4 text-white/50 text-sm">or continue with email</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Username (Register only) */}
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full bg-black/20 border border-gray-600/50 text-white placeholder-white/50 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-black/20 border border-gray-600/50 text-white placeholder-white/50 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full bg-black/20 border border-gray-600/50 text-white placeholder-white/50 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm Password (Register only) */}
              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full bg-black/20 border border-gray-600/50 text-white placeholder-white/50 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-right">
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    type="button"
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>

          {/* Features Preview */}
          <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
            <h3 className="text-white font-semibold text-center mb-4">Why Choose LiveCharmss?</h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="text-white/80 text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
            <div className="text-center space-y-3">
              <div className="flex justify-center space-x-6 text-xs">
                <button className="text-white/60 hover:text-white/80 transition-colors">
                  Terms
                </button>
                <button className="text-white/60 hover:text-white/80 transition-colors">
                  Privacy conditions
                </button>
                <button className="text-white/60 hover:text-white/80 transition-colors">
                  About
                </button>
                <button className="text-white/60 hover:text-white/80 transition-colors">
                  Faq
                </button>
                <button className="text-white/60 hover:text-white/80 transition-colors">
                  Contact Us
                </button>
              </div>
              <div className="text-xs text-white/40">
                <p>© 2025 <span className="text-red-400">FEDESY SISTEMAS INFORMATICOS EN LINEA CORP</span>. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;