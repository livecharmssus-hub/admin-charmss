export type UserRole = 'admin' | 'super_admin' | 'moderator';

export interface AuthValidationResponse {
  jwt: string;
  user: any;
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
  details?: any;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface LoginState {
  status: AuthStatus;
  error?: AuthError | null;
}
