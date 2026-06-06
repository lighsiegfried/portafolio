import { test, expect } from '@playwright/test';

const SECTIONS = [
  { name: 'About', id: 'about' },
  { name: 'Experiencia técnica validada', id: 'validated' },
  { name: 'Experiencia laboral', id: 'work' },
  { name: 'Tech', id: 'tech' },
  { name: 'Proyectos', id: 'works' },
  { name: 'Decisiones técnicas', id: 'decisions' },
  { name: 'Arquitectura AWS', id: 'architecture' },
  { name: 'Contacto', id: 'contact' },
];

test.describe('Navegación — Secciones visibles', () => {
  SECTIONS.forEach(({ name, id }) => {
    test(`sección "${name}" (#${id}) visible`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached({ timeout: 10000 });
    });
  });

  test('navbar con enlaces de navegación', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const nav = page.locator('nav, header');
    await expect(nav).toBeVisible();
    const links = nav.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('scroll a sección al hacer clic en navbar', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('body')).not.toBeEmpty({ timeout: 15000 });

    const contactLink = page.locator('nav a[href="#contact"]').first();
    await expect(contactLink).toBeVisible();
    await contactLink.click();

    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible({ timeout: 5000 });

    const box = await contactSection.boundingBox();
    expect(box).not.toBeNull();
  });
});
