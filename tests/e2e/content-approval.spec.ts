import { test, expect } from '@playwright/test';

test.describe('Content Approval Modal E2E', () => {
  test('loads modal and approves an item', async ({ page }) => {
    // Mock performers list to include a performer with performerProfile.id = 1
    await page.route('**/api/performers**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 2,
              firstName: 'Luis',
              lastName: 'Corredor',
              email: 'luis@example.com',
              studioId: 2,
              status: 0,
              appUserId: 'abc',
              performerProfile: { id: 1, performerId: 2, nickName: 'lgabrielcor' },
            },
          ],
          meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
        }),
      });
    });

    // Mock content album for performerProfile id = 1
    await page.route('**/api/album/performer/1**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Test Album',
          creationDate: new Date().toISOString(),
          performerProfileId: 1,
          albumType: 0,
          premiumContent: false,
          price: 0,
          totalLike: 0,
          totalComment: 0,
          assets: [
            {
              id: 10,
              assetName: 'Test Photo',
              albumId: 1,
              assetType: 1,
              loadDate: new Date().toISOString(),
              deactivatedDate: null,
              isActive: true,
              fileURL: 'file.jpg',
              fileURLThumb: 'thumb.jpg',
              price: 0,
              status: 1,
              assetOrder: 0,
              totalLike: 0,
              totalComment: 0,
            },
          ],
        }),
      });
    });

    // Inject a valid auth state into sessionStorage so the page is accessible
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            jwt: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJleHAiOjE5MDAwMDAwMDB9.',
            user: { id: 'test-admin-id', email: 'admin@test.com' },
            isLoggedIn: true,
          },
          version: 0,
        })
      );
    });

    await page.goto('/performers');

    await expect(page.locator('text=Administración de Performers')).toBeVisible();

    // Click the Approve content button for the first performer
    const approveButtons = page.locator('button[title="Aprobar contenido"]');
    await expect(approveButtons.first()).toBeVisible();
    await approveButtons.first().click();

    // Modal should be visible and content should load
    await expect(page.locator('text=Aprobación de Contenido')).toBeVisible();
    await expect(page.locator('text=Test Photo')).toBeVisible();

    // Click Approve on the item
    const modalApprove = page.locator('button:has-text("Aprobar")').first();
    await expect(modalApprove).toBeVisible();

    // Mock PATCH for approve
    await page.route('**/api/asset/10/status', (route) => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      } else {
        route.continue();
      }
    });

    await modalApprove.click();

    // Confirm should appear and accept
    await expect(page.locator('text=Confirmar aprobación')).toBeVisible();
    await page.locator('button:has-text("Aceptar")').click();

    // After approving, badge should show 'Aprobado' (specific pill)
    await expect(page.locator('[data-testid="asset-statuscode-10"]')).toBeVisible();
  });

  test('rejects an item with reason and does not close approval modal', async ({ page }) => {
    // Mock performers and album (same as first test)
    await page.route('**/api/performers**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 2,
              firstName: 'Luis',
              lastName: 'Corredor',
              email: 'luis@example.com',
              studioId: 2,
              status: 0,
              appUserId: 'abc',
              performerProfile: { id: 1, performerId: 2, nickName: 'lgabrielcor' },
            },
          ],
          meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
        }),
      });
    });

    await page.route('**/api/album/performer/1**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Test Album',
          creationDate: new Date().toISOString(),
          performerProfileId: 1,
          albumType: 0,
          premiumContent: false,
          price: 0,
          totalLike: 0,
          totalComment: 0,
          assets: [
            {
              id: 10,
              assetName: 'Test Photo',
              albumId: 1,
              assetType: 1,
              loadDate: new Date().toISOString(),
              deactivatedDate: null,
              isActive: true,
              fileURL: 'file.jpg',
              fileURLThumb: 'thumb.jpg',
              price: 0,
              status: 1,
              assetOrder: 0,
              totalLike: 0,
              totalComment: 0,
            },
          ],
        }),
      });
    });

    // Inject auth state and visit
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'auth-storage',
        JSON.stringify({ state: { jwt: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJleHAiOjE5MDAwMDAwMDB9.', user: { id: 'test-admin-id' }, isLoggedIn: true }, version: 0 })
      );
    });

    await page.goto('/performers');

    // Click the Approve content button for the first performer
    const approveButtons = page.locator('button[title="Aprobar contenido"]');
    await expect(approveButtons.first()).toBeVisible();
    await approveButtons.first().click();

    // Modal should be visible and content should load
    await expect(page.locator('text=Aprobación de Contenido')).toBeVisible();
    await expect(page.locator('text=Test Photo')).toBeVisible();

    // Click Reject on item (open reject UI)
    const rejectBtn = page.locator('button:has-text("Rechazar")').first();
    await expect(rejectBtn).toBeVisible();
    await rejectBtn.click();

    // Fill reason and submit — intercept PATCH
    await page.locator('textarea[aria-label="Motivo de rechazo"]').fill('No cumple con políticas');
    await page.route('**/api/asset/10/status', (route) => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      } else {
        route.continue();
      }
    });

    await page.locator('button:has-text("Enviar rechazo")').click();

    // Ensure rejected badge appears and parent modal still visible (check specific pill)
    await expect(page.locator('[data-testid="asset-statuscode-10"]')).toBeVisible();
    await expect(page.locator('text=Aprobación de Contenido')).toBeVisible();
  });

  test('opens preview modal and closes without closing parent approval modal', async ({ page }) => {
    // Mock performers list to include a performer with performerProfile.id = 1
    await page.route('**/api/performers**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 2,
              firstName: 'Luis',
              lastName: 'Corredor',
              email: 'luis@example.com',
              studioId: 2,
              status: 0,
              appUserId: 'abc',
              performerProfile: { id: 1, performerId: 2, nickName: 'lgabrielcor' },
            },
          ],
          meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
        }),
      });
    });

    // Mock content album for performerProfile id = 1
    await page.route('**/api/album/performer/1**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Test Album',
          creationDate: new Date().toISOString(),
          performerProfileId: 1,
          albumType: 0,
          premiumContent: false,
          price: 0,
          totalLike: 0,
          totalComment: 0,
          assets: [
            {
              id: 10,
              assetName: 'Test Photo',
              albumId: 1,
              assetType: 1,
              loadDate: new Date().toISOString(),
              deactivatedDate: null,
              isActive: true,
              fileURL: 'file.jpg',
              fileURLThumb: 'thumb.jpg',
              price: 0,
              status: 1,
              assetOrder: 0,
              totalLike: 0,
              totalComment: 0,
            },
          ],
        }),
      });
    });

    // Inject a valid auth state into sessionStorage so the page is accessible
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            jwt: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJleHAiOjE5MDAwMDAwMDB9.',
            user: { id: 'test-admin-id', email: 'admin@test.com' },
            isLoggedIn: true,
          },
          version: 0,
        })
      );
    });

    await page.goto('/performers');

    // Click the Approve content button for the first performer
    const approveButtons = page.locator('button[title="Aprobar contenido"]');
    await expect(approveButtons.first()).toBeVisible();
    await approveButtons.first().click();

    // Modal should be visible and content should load
    await expect(page.locator('text=Aprobación de Contenido')).toBeVisible();
    await expect(page.locator('text=Test Photo')).toBeVisible();

    // Click the asset thumbnail to open preview (use data-testid to disambiguate)
    await page.locator('[data-testid="asset-thumb-10"]').click();

    // Preview should show details and the close button
    await expect(page.locator('button[aria-label="Cerrar preview"]')).toBeVisible();
    await expect(page.locator('[data-testid="asset-preview-10"]')).toBeVisible(); // shared layout node

    // Close preview
    await page.locator('button[aria-label="Cerrar preview"]').click();

    // Parent approval modal should still be visible
    await expect(page.locator('text=Aprobación de Contenido')).toBeVisible();
  });
});
