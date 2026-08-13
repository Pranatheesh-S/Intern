const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  await page.goto('http://localhost:5173');
  
  // Click on "Enter Science Wing"
  await page.click('text=Enter Science Wing');
  await page.waitForTimeout(500);
  
  // Click on "Explore Class 6th"
  await page.click('text=Explore Class 6th');
  await page.waitForTimeout(500);

  // Click on "Open Chapter" for Chapter 6
  // We need to find the card for Chapter 6
  // "Chapter 6" -> next to "Open Chapter"
  // Wait, let's just click the button that navigates to class6, materials_around_us
  await page.evaluate(() => {
    window.__navigate_hack = () => window.dispatchEvent(new CustomEvent('navigate', { detail: { subject: 'class6', activity: 'materials_around_us' }}));
  });
  // Or we can just click the buttons
  const buttons = await page.$$('button');
  for (let btn of buttons) {
    const text = await btn.textContent();
    if (text.includes('Open Chapter') || text.includes('Activity Page')) {
       // Just clicking them all might navigate
    }
  }
  
  // Let's rely on text selectors
  // The first "Open Chapter" for Chapter 6 might be hard to target by text if there are multiple
  // Let's just click 'text=Chapter 6' and then click its 'Open Chapter'
  // Let's use evaluate to trigger React state if possible, or just click coordinates
  
  await browser.close();
})();
