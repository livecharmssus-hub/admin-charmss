import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import AppRouter from '../router/AppRouter';

export const Providers: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
};
