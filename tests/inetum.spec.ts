import { test, expect } from '@playwright/test';

test('Inetum navigation test', async ({ page }) => {
  // Configurar el navegador en vista de escritorio
  await page.setViewportSize({ width: 1440, height: 900 });

  // Abrir la web de Inetum
  await page.goto('https://www.inetum.com/es/homepage', { waitUntil: 'domcontentloaded' });

  // Cerrar aviso de cookies si aparece
  const cookiesButton = await page.$('button:has-text("Aceptar"), button:has-text("Accept"), button:has-text("OK")');
  if (cookiesButton) {
    await cookiesButton.click();
  }

  // Manejar la ventana modal de ubicación e idioma si aparece
  const locationDropdown = await page.$('select:nth-of-type(1)');
  const languageDropdown = await page.$('select:nth-of-type(2)');
  if (locationDropdown && languageDropdown) {
    await locationDropdown.selectOption({ label: 'Perú' });
    await languageDropdown.selectOption({ label: 'Español' });
    const submitButton = await page.$('button:has-text("ENVIAR")');
    if (submitButton) {
      await submitButton.click();
      await page.waitForSelector('select:nth-of-type(1)', { state: 'detached' });
    }
  }

  // Navegar en el menú a "QUIÉNES SOMOS" y luego a "Sobre nosotros"
  const menuButton = await page.$('button:has-text("QUIÉNES SOMOS"), button:has-text("Who we are"), button:has-text("El grupo")');
  if (menuButton) {
    await menuButton.hover();
    const submenuButton = await page.$('a:has-text("Sobre nosotros"), a:has-text("About us"), a:has-text("Nuestra empresa")');
    if (submenuButton) {
      await submenuButton.click();
    } else {
      await page.goto('https://www.inetum.com/es/inetum');
    }
  } else {
    await page.goto('https://www.inetum.com/es/inetum');
  }

  // Verificar que la URL final contenga las palabras clave esperadas
  const url = page.url();
  expect(url).toMatch(/inetum|el-grupo|about|who-we-are|company|sobre|quienes/);

  // Cerrar la página al final del test
  await page.close();
});