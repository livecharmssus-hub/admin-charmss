import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore, isTokenExpired } from '../../app/stores/auth.store';
import type { User } from '../../app/types/User';

// Mock ApiClientOpen
vi.mock('../../app/services/api/axios/apiClientOpen', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      jwt: null,
      user: null,
      isLoggedIn: false,
    });
  });

  it('should initialize with default state', () => {
    const { jwt, user, isLoggedIn } = useAuthStore.getState();
    expect(jwt).toBeNull();
    expect(user).toBeNull();
    expect(isLoggedIn).toBe(false);
  });

  it('should set credentials correctly', () => {
    const mockJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const mockUser: User = {
      user: {
        id: '1',
        email: 'admin@example.com',
        userName: 'admin',
      },
      admin: {
        id: 1,
        role: 'admin',
        email: 'admin@example.com',
      },
    };

    useAuthStore.getState().setCredentials(mockJwt, mockUser);

    const { jwt, user, isLoggedIn } = useAuthStore.getState();
    expect(jwt).toBe(mockJwt);
    expect(user).toEqual(mockUser);
    expect(isLoggedIn).toBe(true);
  });

  it('should clear credentials correctly', () => {
    // First set some credentials
    const mockJwt = 'test-jwt';
    const mockUser: User = {
      user: { id: '1', email: 'test@example.com' },
    };

    useAuthStore.getState().setCredentials(mockJwt, mockUser);
    expect(useAuthStore.getState().isLoggedIn).toBe(true);

    // Then clear them
    useAuthStore.getState().clearCredentials();

    const { jwt, user, isLoggedIn } = useAuthStore.getState();
    expect(jwt).toBeNull();
    expect(user).toBeNull();
    expect(isLoggedIn).toBe(false);
  });

  it('should update user correctly', () => {
    const mockUser: User = {
      user: {
        id: '1',
        email: 'updated@example.com',
        userName: 'updated-admin',
      },
      admin: {
        id: 1,
        role: 'super_admin',
        email: 'updated@example.com',
      },
    };

    useAuthStore.getState().updateUser(mockUser);

    const { user, isLoggedIn } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(isLoggedIn).toBe(true);
  });

  it('should set logged in status correctly', () => {
    useAuthStore.getState().setLoggedIn(true);
    expect(useAuthStore.getState().isLoggedIn).toBe(true);

    useAuthStore.getState().setLoggedIn(false);
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
  });
});

describe('isTokenExpired utility', () => {
  it('should return false for a valid non-expired token', () => {
    // Create a token that expires in 1 hour
    const payload = {
      sub: '1234567890',
      name: 'John Doe',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };

    const base64Payload = btoa(JSON.stringify(payload));
    const mockToken = `header.${base64Payload}.signature`;

    expect(isTokenExpired(mockToken)).toBe(false);
  });

  it('should return true for an expired token', () => {
    // Create a token that expired 1 hour ago
    const payload = {
      sub: '1234567890',
      name: 'John Doe',
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    };

    const base64Payload = btoa(JSON.stringify(payload));
    const mockToken = `header.${base64Payload}.signature`;

    expect(isTokenExpired(mockToken)).toBe(true);
  });

  it('should return true for an invalid token', () => {
    const invalidToken = 'invalid.token.format';
    expect(isTokenExpired(invalidToken)).toBe(true);
  });

  it('should return true for malformed token', () => {
    const malformedToken = 'not-a-jwt-token';
    expect(isTokenExpired(malformedToken)).toBe(true);
  });
});
