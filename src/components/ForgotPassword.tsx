import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Check your email</h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            We've sent a password reset link to
          </p>
          <p className="text-pink-400 font-medium text-sm md:text-base">{email}</p>
          <p className="text-white/60 text-xs md:text-sm">
            If you don't see the email, check your spam folder or try again with a different email
            address.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white/5 rounded-2xl p-4 md:p-6 text-left">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-red-400" />
            Next steps:
          </h3>
          <ol className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start">
              <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                1
              </span>
              Check your email inbox for a message from LiveCharmss
            </li>
            <li className="flex items-start">
              <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                2
              </span>
              Click the "Reset Password\" link in the email
            </li>
            <li className="flex items-start">
              <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                3
              </span>
              Create a new secure password for your account
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            Back to Sign In
          </button>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
            className="w-full text-red-400 hover:text-red-300 py-2 text-sm transition-colors"
          >
            Try with different email
          </button>
        </div>

        {/* Resend Timer */}
        <div className="text-center">
          <p className="text-white/50 text-xs">
            Didn't receive the email? You can request a new one in 60 seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <button
          onClick={onBack}
          className="flex items-center text-pink-400 hover:text-pink-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Sign In
        </button>

        <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-pink-400" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white">Forgot Password?</h2>
        <p className="text-white/70 text-sm md:text-base leading-relaxed">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/20 border border-gray-600/50 text-white placeholder-white/50 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!email || isLoading}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              <span>Send Reset Link</span>
            </>
          )}
        </button>
      </form>

      {/* Security Note */}
      <div className="bg-black/20 rounded-2xl p-4 border border-gray-700/30">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-400 text-xs">🔒</span>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-1">Security Notice</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              For your security, the reset link will expire in 15 minutes. If you don't receive the
              email within a few minutes, please check your spam folder.
            </p>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="text-center">
        <p className="text-white/50 text-xs mb-2">Still having trouble?</p>
        <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
