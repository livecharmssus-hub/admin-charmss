import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { revokeGoogleToken, revokeFacebookToken } from '../services/auth.service';
import type { User } from '../types/User';

interface AuthState {
  jwt: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setCredentials: (jwt: string, user: User) => void;
  updateUser: (user: User) => void;
  clearCredentials: () => void;
  logout: () => Promise<void>;
  setLoggedIn: (loggedIn: boolean) => void;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const parsedPayload = JSON.parse(decodedPayload);
    const currentTime = Math.floor(Date.now() / 1000);
    return parsedPayload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return true;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwt: null,
      user: null,
      isLoggedIn: false,

      setCredentials: (jwt: string, user: User) => set({ jwt, user, isLoggedIn: true }),

      clearCredentials: () => set({ jwt: null, user: null, isLoggedIn: false }),

      updateUser: (user: User) => set({ isLoggedIn: true, user }),

      setLoggedIn: (loggedIn: boolean) => set({ isLoggedIn: loggedIn }),

      logout: async () => {
        try {
          const { user } = useAuthStore.getState();
          // `user` in state now contains the object { user: AuthUser, admin?: AdminUser }
          const userId = (user as any)?.user?.id || (user as any)?.id; // fallback to older shape if needed
          
          if (userId) {
            // Revoke OAuth tokens in parallel
            await Promise.allSettled([
              revokeGoogleToken(userId),
              revokeFacebookToken(userId)
            ]);
          }
        } catch (error) {
          console.error('Logout API call failed:', error);
        } finally {
          set({ jwt: null, user: null, isLoggedIn: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const validateAuthState = () => {
  const { jwt } = useAuthStore.getState();
  return jwt !== null && !isTokenExpired(jwt);
};
