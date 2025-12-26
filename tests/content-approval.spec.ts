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
    await modalApprove.click();

    // After approving, badge should show 'Aprobado'
    await expect(page.locator('text=Aprobado')).toBeVisible();
  });
});
