import { test, expect } from '@playwright/test';

test.describe('Smoke — Carga inicial', () => {
  test('página carga sin errores de consola críticos', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push({ text: msg.text(), url: msg.location()?.url });
    });
    page.on('pageerror', (err) => errors.push({ text: err.message }));

    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('body')).not.toBeEmpty({ timeout: 15000 });

    const criticalErrors = errors.filter(e =>
      !e.text.includes('favicon') &&
      !e.text.includes('smoothscroll') &&
      !e.text.includes('third-party') &&
      !e.text.includes('Failed to load resource') &&
      !e.text.includes('findDOMNode') &&
      !e.text.includes('computeBoundingSphere')
    );

    expect(criticalErrors).toEqual([]);
  });

  test('título de página correcto', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(page).toHaveTitle(/Wilson|Portafolio|Portfolio/);
  });

  test('body visible con contenido', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const text = await body.innerText();
    expect(text.length).toBeGreaterThan(100);
  });
});
