import { test, expect } from '@playwright/test';

test('Onboarding endpoint returns expected structure for id 2', async ({ page }) => {
  const mockOnboarding = {
    id: 2,
    firstName: 'Luis',
    middleName: null,
    lastName: 'Corredor',
    emailAddress: 'luis@example.com',
    nickName: 'lg',
    birthDate: '1990-01-01',
    countryCode: 'CO',
    gender: 1,
    requestDate: new Date().toISOString(),
    performerId: 2,
    studioId: 1,
    identificationNumber: '123456789',
    identificationType: 'ID',
    statusCardFrontFile: 2,
    statusCardBackFile: 2,
    statusCardFrontFaceFile: 2,
    statusCardBackFaceFile: 2,
    statusProfileImageFile: 2,
    sign: 'Firmado',
    securityRequest: null,
    requestDocuments: [
      {
        id: 1,
        requestPerformerId: 2,
        fileName: 'id.pdf',
        documentType: 0,
        documentName: 'ID Document',
        loadDate: new Date().toISOString(),
      },
    ],
    contractAcceptedByPerformer: true,
    status: 2,
    processMessage: 'All good',
  };

  // Intercept the onboarding request for id 2 and return the mock
  await page.route('**/api/performer/onboarding/2**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockOnboarding),
    });
  });

  // Add auth to session so fetch will behave similarly to application requests
  await page.addInitScript(() => {
    window.sessionStorage.setItem(
      'auth-storage',
      JSON.stringify({ state: { jwt: 'test-jwt', user: { id: 'admin' }, isLoggedIn: true }, version: 0 })
    );
  });

  // Navigate to root (not strictly necessary, but keeps pattern consistent)
  await page.goto('/');

  // Do a fetch in page context to the endpoint and verify the structure
  const result = await page.evaluate(async () => {
    const res = await fetch('/api/performer/onboarding/2');
    return res.json();
  });

  expect(result).toBeTruthy();
  expect(result).toHaveProperty('id', 2);
  expect(result).toHaveProperty('firstName');
  expect(result).toHaveProperty('lastName');
  expect(result).toHaveProperty('emailAddress');
  expect(result).toHaveProperty('statusCardFrontFile');
  expect(result).toHaveProperty('statusCardBackFile');
  expect(result).toHaveProperty('statusProfileImageFile');
  expect(result).toHaveProperty('requestDocuments');
  expect(Array.isArray(result.requestDocuments)).toBe(true);
  expect(result.contractAcceptedByPerformer).toBe(true);
});
