import ApiClientOpen from './api/axios/apiClientOpen';

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
        url: `${baseUrl}/auth/google?role=admin`,
      },
      facebook: {
        enabled: true,
        url: `${baseUrl}/auth/facebook?role=admin`,
      },
    },
  };
};

export const validateAuthCallback = async (
  userId: string,
  provider: string,
  role = 'admin'
): Promise<any> => {
  try {
    const response = await ApiClientOpen.get(
      `/auth/provider/validate-callback?userId=${userId}&provider=${provider}&role=${role}`
    );
    return response.data;
  } catch (error) {
    console.error('Auth validation error:', error);
    throw error;
  }
};
