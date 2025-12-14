import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, isTokenExpired } from '../stores/auth.store';
import Login from '../../pages/Login';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const jwt = useAuthStore((state) => state.jwt);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const clearCredentials = useAuthStore((state) => state.clearCredentials);

  useEffect(() => {
    let shouldRedirectToLogin = false;

    if (jwt) {
      if (isTokenExpired(jwt)) {
        clearCredentials();
        shouldRedirectToLogin = true;
      }
    } else if (isLoggedIn) {
      clearCredentials();
      shouldRedirectToLogin = true;
    } else {
      // No jwt and not logged in - check if we're on an auth callback route
      const isAuthCallback = location.pathname === '/auth/callback';
      if (!isAuthCallback) {
        shouldRedirectToLogin = true;
      }
    }

    // If redirection is needed and not already on the login page or auth callback
    if (
      shouldRedirectToLogin &&
      location.pathname !== '/login' &&
      location.pathname !== '/auth/callback'
    ) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [jwt, isLoggedIn, clearCredentials, navigate, location.pathname]);

  // Allow auth callback route to render without authentication
  if (location.pathname === '/auth/callback') {
    return <>{children}</>;
  }

  // Render children only if currently logged in
  return isLoggedIn ? <>{children}</> : <Login />;
};

export default AuthProvider;
