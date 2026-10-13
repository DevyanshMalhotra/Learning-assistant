const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    for (const width of [375, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Learn from what you see.' }).waitFor();

      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
      }));
      assert.ok(dimensions.document <= dimensions.viewport + 2,
        `Unexpected horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`);

      if (width < 1024) await page.getByRole('button', { name: 'Open menu' }).click();

      await page.getByRole('button', { name: /Ask a question/ }).click();
      await page.getByRole('heading', { name: 'A clearer way to understand.' }).waitFor();
      await page.getByLabel('Your question').fill('What is binary search?');

      await page.getByRole('button', { name: 'Switch to dark mode' }).click();
      assert.equal(await page.locator('html.dark').count(), 1, 'Theme toggle must enable dark mode');

      if (width < 1024) await page.getByRole('button', { name: 'Open menu' }).click();
      await page.getByRole('button', { name: /Session history/ }).click();
      await page.getByRole('heading', { name: 'Your learning journey starts here' }).waitFor({ state: 'visible' }).catch(async () => {
        await page.getByText('Your learning journey starts here').waitFor();
      });

      assert.deepEqual(errors, [], `Page errors at ${width}px`);
      console.log(`PASS viewport ${width}px: layout, navigation, input, theme, history`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
