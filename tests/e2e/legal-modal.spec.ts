import { test, expect } from '@playwright/test';

const sampleDoc = {
  id: 1,
  name: 'Términos y Condiciones',
  content: `# Términos
  Este es un documento de prueba.

  - Punto A
  - Punto B`,
  version: 'v1.0',
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

test.describe('Legal Modal E2E', () => {
  test('opens modal and closes it', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/legal/name/T%C3%A9rminos%20y%20Condiciones**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleDoc),
      });
    });

    // Inject minimal auth (use token with far future exp to bypass expiration check)
    await page.addInitScript(() => {
      const fakeJwt = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTl9.signature';
      window.sessionStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: { jwt: fakeJwt, user: { id: 'admin' }, isLoggedIn: true },
          version: 0,
        })
      );
    });

    await page.goto('/legal-test');

    await expect(page.locator('text=Prueba LegalModal')).toBeVisible();

    await page.locator('button:has-text("Abrir modal legal")').click();

    await expect(page.locator('text=Términos y Condiciones')).toBeVisible();
    await expect(page.locator('.prose h1:has-text("Términos")')).toBeVisible();

    // Close with X button
    await page.locator('button[title="Cerrar"]').click();
    await expect(page.locator('text=Términos y Condiciones')).not.toBeVisible();
  });

  test('modal is responsive on small viewports', async ({ page }) => {
    await page.route('**/api/legal/name/T%C3%A9rminos%20y%20Condiciones**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleDoc),
      });
    });

    await page.addInitScript(() => {
      const fakeJwt = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTl9.signature';
      window.sessionStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: { jwt: fakeJwt, user: { id: 'admin' }, isLoggedIn: true },
          version: 0,
        })
      );
    });

    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/legal-test');
    await page.locator('button:has-text("Abrir modal legal")').click();
    await expect(page.locator('.prose h1:has-text("Términos")')).toBeVisible();
  });
});
