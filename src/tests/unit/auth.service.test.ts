import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the API client
vi.mock('../../app/services/api/axios/apiClientOpen', () => ({
  default: {
    get: vi.fn(),
  },
}));

import { fetchLoginConfig, validateAuthCallback } from '../../app/services/auth.service';
import ApiClientOpen from '../../app/services/api/axios/apiClientOpen';
import type { Mock } from 'vitest';

// Cast to a limited typed mock to avoid `any`
const mockApiClient = ApiClientOpen as unknown as { get: Mock };

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variables
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000');
  });

  describe('fetchLoginConfig', () => {
    it('should return login configuration', async () => {
      const config = await fetchLoginConfig(0); // No delay for testing

      expect(config).toHaveProperty('title');
      expect(config).toHaveProperty('subtitle');
      expect(config).toHaveProperty('features');
      expect(config).toHaveProperty('oauth');

      expect(config.title).toBe('Welcome to Charmss Admin');
      expect(config.subtitle).toBe('Manage your platform with confidence');
      expect(config.features).toHaveLength(4);
      expect(config.oauth.google.enabled).toBe(true);
      expect(config.oauth.facebook.enabled).toBe(true);
    });

    it('should have correct OAuth URLs', async () => {
      const config = await fetchLoginConfig(0);

      expect(config.oauth.google.url).toBe('http://localhost:3000/api/auth/google?role=admin');
      expect(config.oauth.facebook.url).toBe('http://localhost:3000/api/auth/facebook?role=admin');
    });

    it('should include correct features with icons and colors', async () => {
      const config = await fetchLoginConfig(0);

      const expectedFeatures = [
        { icon: 'Users', text: 'User Management', color: 'text-blue-400' },
        { icon: 'BarChart3', text: 'Analytics Dashboard', color: 'text-green-400' },
        { icon: 'Shield', text: 'Security Controls', color: 'text-purple-400' },
        { icon: 'Settings', text: 'System Configuration', color: 'text-orange-400' },
      ];

      expect(config.features).toEqual(expectedFeatures);
    });
  });

  describe('validateAuthCallback', () => {
    it('should call API with correct parameters', async () => {
      const mockResponse = {
        data: {
          jwt: 'mock-jwt-token',
          user: {
            user: { id: '1', email: 'admin@test.com' },
            admin: { id: 1, role: 'admin' },
          },
        },
      };

      mockApiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await validateAuthCallback('user123', 'google', 'admin');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        'api/auth/provider/validate-callback?userId=user123&provider=google&role=admin'
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should use default role when not provided', async () => {
      const mockResponse = {
        data: {
          jwt: 'mock-jwt-token',
          user: { user: { id: '1' } },
        },
      };

      mockApiClient.get.mockResolvedValueOnce(mockResponse);

      await validateAuthCallback('user123', 'facebook');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        'api/auth/provider/validate-callback?userId=user123&provider=facebook&role=admin'
      );
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockApiClient.get.mockRejectedValueOnce(mockError);

      await expect(validateAuthCallback('user123', 'google', 'admin')).rejects.toThrow('API Error');
    });

    it('should log errors to console', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = new Error('Network Error');
      mockApiClient.get.mockRejectedValueOnce(mockError);

      try {
        await validateAuthCallback('user123', 'google', 'admin');
      } catch {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith('Auth validation error:', mockError);
      consoleSpy.mockRestore();
    });
  });
});
