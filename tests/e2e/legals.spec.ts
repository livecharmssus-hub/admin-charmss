import { test, expect } from '@playwright/test';

test('CRUD flow on legals page (mocked API)', async ({ page }) => {
  // In-memory mock data
  let nextId = 1;

  // Intercept GET list
  type TestLegal = {
    id: number;
    name?: string;
    content?: string;
    version?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };

  const legals: TestLegal[] = [];

  await page.route('**/api/legal', async (route) => {
    const req = route.request();
    if (req.method() === 'GET') {
      route.fulfill({
        status: 200,
        body: JSON.stringify(legals),
        headers: { 'Content-Type': 'application/json' },
      });
      return;
    }

    if (req.method() === 'POST') {
      const d = await req.postData();
      try {
        const data = d ? (JSON.parse(d) as Record<string, unknown>) : {};
        const created = {
          id: nextId++,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        legals.unshift(created as TestLegal);
        route.fulfill({
          status: 201,
          body: JSON.stringify(created),
          headers: { 'Content-Type': 'application/json' },
        });
      } catch {
        route.fulfill({ status: 400 });
      }
      return;
    }

    route.continue();
  });

  // Intercept PATCH and DELETE
  await page.route('**/api/legal/**', async (route) => {
    const req = route.request();
    const url = req.url();
    const parts = url.split('/');
    const idStr = parts[parts.length - 1];
    const id = Number(idStr);

    if (req.method() === 'PATCH') {
      const body = JSON.parse((await req.postData()) || '{}');
      const idx = legals.findIndex((l) => l.id === id);
      if (idx >= 0) {
        legals[idx] = { ...legals[idx], ...body, updatedAt: new Date().toISOString() };
        route.fulfill({
          status: 200,
          body: JSON.stringify(legals[idx]),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        route.fulfill({ status: 404 });
      }
      return;
    }

    if (req.method() === 'DELETE') {
      const idx = legals.findIndex((l) => l.id === id);
      if (idx >= 0) {
        legals.splice(idx, 1);
        route.fulfill({ status: 204 });
      } else {
        route.fulfill({ status: 404 });
      }
      return;
    }

    if (req.method() === 'GET' && url.includes('/api/legal/name/')) {
      const name = decodeURIComponent(url.split('/api/legal/name/')[1]);
      const found = legals.find((l) => l.name === name);
      if (found) {
        route.fulfill({
          status: 200,
          body: JSON.stringify(found),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        route.fulfill({ status: 404 });
      }
      return;
    }

    route.continue();
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

  await page.goto('/legals');
  await expect(page.locator('text=Documentos legales')).toBeVisible();

  // Create
  await page.click('[data-testid="create-legal"]');
  await page.fill('label:has-text("Nombre") input', 'Mi Doc');
  await page.fill('label:has-text("Versión") input', '1.0');
  await page.fill('label:has-text("Contenido") textarea', 'Contenido de prueba');
  await page.click('text=Guardar');

  // Wait for created to appear
  await expect(page.locator('text=Mi Doc')).toBeVisible();

  // View
  await page.click('button[title="Ver"]');
  const modal = page.locator('div.fixed.inset-0');
  await expect(modal.locator('text=Contenido de prueba')).toBeVisible();
  await modal.locator('button[title="Cerrar"]').click();

  // Edit - open edit modal by clicking Edit and changing name
  await page.click('button[title="Editar"]');
  await page.fill('label:has-text("Nombre") input', 'Mi Doc Editado');
  await page.click('text=Guardar');
  await expect(page.locator('text=Mi Doc Editado')).toBeVisible();

  // Delete
  page.on('dialog', (dialog) => dialog.accept());
  await page.click('button[title="Borrar"]');
  await expect(page.locator('text=Mi Doc Editado')).not.toBeVisible();
});
