export const BRAND_NAME = 'Charmss Admin';
export const APP_VERSION = '1.0.0';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
};

export const OAUTH_CONFIG = {
  PROVIDERS: {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
  },
  ROLES: {
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
    MODERATOR: 'moderator',
  },
  REDIRECT_PATHS: {
    SUCCESS: '/',
    ERROR: '/login',
  },
};
