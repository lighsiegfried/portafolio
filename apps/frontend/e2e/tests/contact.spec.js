import { test, expect } from '@playwright/test';

test.describe('Contacto — Formulario renderizado', () => {
  test('formulario de contacto visible con campos', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('#contact')).toBeAttached({ timeout: 10000 });

    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const messageTextarea = page.locator('textarea[name="message"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(nameInput).toBeVisible({ timeout: 10000 });
    await expect(emailInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });

  test('placeholders con texto en español correcto', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('#contact')).toBeAttached({ timeout: 10000 });

    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const messageTextarea = page.locator('textarea[name="message"]');

    await expect(nameInput).toBeVisible({ timeout: 10000 });
    await expect(emailInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();

    const namePlaceholder = await nameInput.getAttribute('placeholder');
    expect(namePlaceholder).toContain('nombre');

    const emailPlaceholder = await emailInput.getAttribute('placeholder');
    expect(emailPlaceholder).toContain('correo');

    const msgPlaceholder = await messageTextarea.getAttribute('placeholder');
    expect(msgPlaceholder).toContain('ayudar');
  });
});
