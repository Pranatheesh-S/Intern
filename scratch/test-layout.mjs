import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/#?activity=materials_around_us_new');
  
  // Wait for the h2 to appear
  await page.waitForSelector('h2:has-text("What are Objects Made Of?")');
  
  // Get heights
  const rects = await page.evaluate(() => {
    const title = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('What are Objects Made Of?'));
    const container = title.parentElement;
    const lookAround = title.nextElementSibling;
    const p = lookAround.querySelector('p');
    const material = lookAround.nextElementSibling;
    const examples = material.nextElementSibling;
    const think = examples.nextElementSibling;
    
    return {
      containerHeight: container.getBoundingClientRect().height,
      titleHeight: title.getBoundingClientRect().height,
      lookAroundHeight: lookAround.getBoundingClientRect().height,
      pHeight: p.getBoundingClientRect().height,
      materialHeight: material.getBoundingClientRect().height,
      examplesHeight: examples.getBoundingClientRect().height,
      thinkHeight: think.getBoundingClientRect().height,
      materialTop: material.getBoundingClientRect().top,
      lookAroundBottom: lookAround.getBoundingClientRect().bottom,
    };
  });
  
  console.log(rects);
  await browser.close();
})();
