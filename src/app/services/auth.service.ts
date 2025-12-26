import ApiClient from './api/axios/apiClient';
import ApiClientOpen from './api/axios/apiClientOpen';
import { User } from '../types/User';

export interface LoginConfig {
  title: string;
  subtitle: string;
  features: Array<{
    icon: string;
    text: string;
    color: string;
  }>;
  oauth: {
    google: {
      enabled: boolean;
      url: string;
    };
    facebook: {
      enabled: boolean;
      url: string;
    };
  };
}

export const fetchLoginConfig = async (delayMs = 1000): Promise<LoginConfig> => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return {
    title: 'Welcome to Charmss Admin',
    subtitle: 'Manage your platform with confidence',
    features: [
      { icon: 'Users', text: 'User Management', color: 'text-blue-400' },
      { icon: 'BarChart3', text: 'Analytics Dashboard', color: 'text-green-400' },
      { icon: 'Shield', text: 'Security Controls', color: 'text-purple-400' },
      { icon: 'Settings', text: 'System Configuration', color: 'text-orange-400' },
    ],
    oauth: {
      google: {
        enabled: true,
        url: `${baseUrl}/api/auth/google?role=admin`,
      },
      facebook: {
        enabled: true,
        url: `${baseUrl}/api/auth/facebook?role=admin`,
      },
    },
  };
};

export const validateAuthCallback = async (
  userId: string,
  provider: string,
  role = 'admin'
): Promise<{
  user: User;
  jwt: string;
  userId: string;
  provider: string;
  role: string;
}> => {
  try {
    const response = await ApiClientOpen.get(
      `api/auth/provider/validate-callback?userId=${userId}&provider=${provider}&role=${role}`
    );
    return response.data;
  } catch (error) {
    console.error('Auth validation error:', error);
    throw error;
  }
};

// Revoke Google OAuth token
export const revokeGoogleToken = async (userId: string): Promise<void> => {
  try {
    await ApiClient.post('/api/auth/google/revoke', { userId });
  } catch (error) {
    console.error('Google token revocation error:', error);
    throw error;
  }
};

// Revoke Facebook OAuth token
export const revokeFacebookToken = async (userId: string): Promise<void> => {
  try {
    await ApiClient.post('/api/auth/facebook/revoke', { userId });
  } catch (error) {
    console.error('Facebook token revocation error:', error);
    throw error;
  }
};
