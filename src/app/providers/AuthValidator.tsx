import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { validateAuthCallback } from '../services/auth.service';

const AuthValidator = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const provider = searchParams.get('provider');
  const role = searchParams.get('role') || 'admin';
  const navigate = useNavigate();

  // Use a ref to ensure the auth flow runs only once even with StrictMode
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (hasExecutedRef.current) return; // Prevent execution in StrictMode's second call
    hasExecutedRef.current = true;

    const handleAuth = async () => {
      try {
        if (userId && provider) {
          const response = await validateAuthCallback(userId, provider, role);

          if (response.jwt && response.user) {
            const userForStore = { ...response.user };
            useAuthStore.getState().setCredentials(response.jwt, userForStore);
            useAuthStore.getState().setLoggedIn(true);
            navigate('/dashboard');
          } else {
            console.error('Invalid response from auth callback:', response);
            //navigate('/login');
          }
        } else {
          console.error('Missing userId or provider in callback');
          //navigate('/login');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        //navigate('/login');
      }
    };

    handleAuth();
  }, [userId, provider, navigate, role]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Authenticating...</p>
        <p className="text-blue-200 text-sm mt-2">Please wait while we verify your credentials</p>
      </div>
    </div>
  );
};

export default AuthValidator;
