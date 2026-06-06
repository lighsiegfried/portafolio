import { test, expect } from '@playwright/test';

test.describe('Responsive — Layout visual', () => {
  const sections = ['about', 'validated', 'work', 'tech', 'works', 'decisions', 'architecture', 'contact'];

  sections.forEach((id) => {
    test(`sección #${id} visible`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached({ timeout: 15000 });

      const box = await section.boundingBox();
      expect(box).not.toBeNull();
      expect(box.width).toBeGreaterThan(100);
      expect(box.height).toBeGreaterThan(50);
    });
  });

  test('sin scroll horizontal', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth - viewportWidth).toBeLessThanOrEqual(5);
  });
});
