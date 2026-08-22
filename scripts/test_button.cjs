const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/#subject=class6&activity=intro_magnets');
  await page.waitForTimeout(2000);
  console.log("Current URL before click:", page.url());
  await page.click('button:has-text("Back to Class 6 Chapter 4")');
  await page.waitForTimeout(1000);
  console.log("Current URL after click:", page.url());
  await browser.close();
})();
