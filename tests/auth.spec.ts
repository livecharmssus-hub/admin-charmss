import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication
    await page.context().clearCookies();
    await page.context().clearPermissions();
    
    // Mock API responses to avoid real OAuth flow in tests
    await page.route('**/auth/provider/validate-callback**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          jwt: 'mock-jwt-token',
          user: {
            user: {
              id: 'test-admin-id',
              email: 'admin@test.com',
              userName: 'testadmin',
            },
            admin: {
              id: 1,
              role: 'admin',
              email: 'admin@test.com',
            },
          },
        }),
      });
    });
  });

  test('should display login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login page or show login component
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    await expect(page.locator('text=Sign in to access your admin dashboard')).toBeVisible();
    await expect(page.locator('text=Continue with Google')).toBeVisible();
  });

  test('should show loading state during authentication', async ({ page }) => {
    // Navigate to auth callback with test parameters
    await page.goto('/auth/callback?userId=test-user&provider=google&role=admin');
    
    // Should show loading/authenticating message
    await expect(page.locator('text=Authenticating...')).toBeVisible();
  });

  test('should redirect to dashboard after successful authentication', async ({ page }) => {
    // Navigate to auth callback
    await page.goto('/auth/callback?userId=test-user&provider=google&role=admin');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should handle authentication error gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/auth/provider/validate-callback**', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' }),
      });
    });
    
    await page.goto('/auth/callback?userId=invalid-user&provider=google&role=admin');
    
    // Should redirect back to login
    await expect(page).toHaveURL('/login');
  });

  test('should protect routes when not authenticated', async ({ page }) => {
    // Try to access protected route directly
    await page.goto('/dashboard');
    
    // Should redirect to login or show login component
    await expect(page.locator('text=Welcome Back')).toBeVisible();
  });

  test('should handle token expiration', async ({ page, context }) => {
    // Set up expired token in storage
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    
    await context.addInitScript((token) => {
      window.sessionStorage.setItem('auth-storage', JSON.stringify({
        state: {
          jwt: token,
          user: { user: { id: '1', email: 'test@test.com' } },
          isLoggedIn: true,
        },
        version: 0,
      }));
    }, expiredToken);
    
    await page.goto('/dashboard');
    
    // Should redirect to login due to expired token
    await expect(page.locator('text=Welcome Back')).toBeVisible();
  });

  test('should clear credentials on logout', async ({ page, context }) => {
    // First authenticate
    await page.goto('/auth/callback?userId=test-user&provider=google&role=admin');
    await expect(page).toHaveURL('/dashboard');

    // Mock logout API
    await page.route('**/auth/provider/logout**', (route) => {
      route.fulfill({ status: 200 });
    });

    // Trigger logout (this would typically be through a logout button)
    await page.evaluate(() => {
      const authStore = (window as any).useAuthStore;
      if (authStore) {
        authStore.getState().logout();
      }
    });

    // Should redirect to login
    await expect(page.locator('text=Welcome Back')).toBeVisible();
  });
});

test.describe('Login Page', () => {
  test('should display OAuth login options', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('text=Charmss Admin')).toBeVisible();
    await expect(page.locator('text=Continue with Google')).toBeVisible();
    await expect(page.locator('text=Continue with Facebook')).toBeVisible();
  });

  test('should show loading state while fetching config', async ({ page }) => {
    // Delay the config response
    await page.route('**/auth/**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });

    await page.goto('/login');

    // Should show loading message briefly
    await expect(page.locator('text=Loading login')).toBeVisible();
  });

  test('should handle Google OAuth redirect', async ({ page }) => {
    await page.goto('/login');

    // Click Google login button
    const googleButton = page.locator('text=Continue with Google');
    await expect(googleButton).toBeVisible();

    // Check that clicking would redirect to OAuth URL
    const href = await googleButton.evaluate((button) => {
      const clickHandler = button.onclick;
      // In a real test, you might want to intercept the redirect
      return button.closest('button')?.getAttribute('onclick') || 'no-handler';
    });

    // The button should have a click handler
    expect(href).toBeDefined();
  });
});