export type UserRole = 'admin' | 'super_admin' | 'moderator';

import { User } from '../app/types/User';

export interface AuthValidationResponse {
  jwt: string;
  user: User;
}

export interface OAuth2Provider {
  id: string;
  name: string;
  enabled: boolean;
  url: string;
  iconColor: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface LoginState {
  status: AuthStatus;
  error?: AuthError | null;
}
