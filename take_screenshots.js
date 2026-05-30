const { chromium } = require('playwright');
const path = require('path');

const OUTPUT_DIR = '/home/coder/.gemini/antigravity/brain/a29c35d4-ac0b-4635-819d-54e5f82b3fc0';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(`Page Error: ${err.message}`);
  });

  console.log('Navigating to http://localhost:3001...');
  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.error('Navigation error:', e.message);
    await browser.close();
    process.exit(1);
  }

  // Wait for hero content
  console.log('Waiting for page content...');
  try {
    await page.waitForSelector('text=simplest way', { timeout: 10000 });
    console.log('Found hero text.');
  } catch (e) {
    console.log('Could not find exact hero text, trying alternatives...');
    try {
      await page.waitForSelector('h1', { timeout: 5000 });
      const h1Text = await page.textContent('h1');
      console.log('Found h1:', h1Text);
    } catch (e2) {
      console.log('No h1 found either, proceeding anyway...');
    }
  }

  // Screenshot 1: Hero section
  console.log('\n--- Screenshot 1: Hero Section ---');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'landing_hero.png'), fullPage: false });
  console.log('Saved landing_hero.png');

  // Describe what we see
  const heroContent = await page.evaluate(() => {
    const el = document.querySelector('section') || document.querySelector('main') || document.body;
    return el ? el.innerText.substring(0, 500) : 'No content';
  });
  console.log('Hero visible text (first 500 chars):', heroContent);

  // Screenshot 2: How It Works section
  console.log('\n--- Screenshot 2: How It Works ---');
  const howItWorksFound = await page.evaluate(() => {
    const els = document.querySelectorAll('h2, h3, [class*="how"], [id*="how"]');
    for (const el of els) {
      if (el.textContent.toLowerCase().includes('how it works') || el.textContent.toLowerCase().includes('how')) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        return el.textContent.trim();
      }
    }
    // Try scrolling down a bit
    window.scrollBy(0, 900);
    return null;
  });
  console.log('How It Works heading found:', howItWorksFound);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'landing_howitworks.png'), fullPage: false });
  console.log('Saved landing_howitworks.png');

  // Screenshot 3: Benefits section
  console.log('\n--- Screenshot 3: Benefits ---');
  const benefitsFound = await page.evaluate(() => {
    const els = document.querySelectorAll('h2, h3, section, [class*="benefit"], [id*="benefit"]');
    for (const el of els) {
      if (el.textContent.toLowerCase().includes('benefit') || el.textContent.toLowerCase().includes('why choose')) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        return el.textContent.trim().substring(0, 200);
      }
    }
    window.scrollBy(0, 900);
    return null;
  });
  console.log('Benefits heading found:', benefitsFound);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'landing_benefits.png'), fullPage: false });
  console.log('Saved landing_benefits.png');

  // Screenshot 4: Transparency Calculator
  console.log('\n--- Screenshot 4: Transparency Calculator ---');
  const calcFound = await page.evaluate(() => {
    const els = document.querySelectorAll('h2, h3, section, [class*="calc"], [id*="calc"], [class*="transparency"], [id*="transparency"]');
    for (const el of els) {
      if (el.textContent.toLowerCase().includes('calculator') || el.textContent.toLowerCase().includes('transparency') || el.textContent.toLowerCase().includes('pricing')) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        return el.textContent.trim().substring(0, 200);
      }
    }
    window.scrollBy(0, 900);
    return null;
  });
  console.log('Calculator heading found:', calcFound);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'landing_calculator.png'), fullPage: false });
  console.log('Saved landing_calculator.png');

  // Screenshot 5: Bottom CTA
  console.log('\n--- Screenshot 5: Bottom CTA ---');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(500);
  // Try to find CTA section
  const ctaFound = await page.evaluate(() => {
    const els = document.querySelectorAll('section, [class*="cta"], [id*="cta"], [class*="footer"]');
    const last = els[els.length - 1];
    if (last) {
      return last.textContent.trim().substring(0, 200);
    }
    return null;
  });
  console.log('CTA section text:', ctaFound);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'landing_cta.png'), fullPage: false });
  console.log('Saved landing_cta.png');

  // Report console errors
  console.log('\n\n=== CONSOLE ERRORS ===');
  if (consoleErrors.length === 0) {
    console.log('No console errors detected.');
  } else {
    consoleErrors.forEach((err, i) => {
      console.log(`Error ${i + 1}: ${err}`);
    });
  }

  // Check for visual issues
  console.log('\n=== VISUAL CHECKS ===');
  const visualChecks = await page.evaluate(() => {
    const issues = [];
    
    // Check for missing images
    const imgs = document.querySelectorAll('img');
    imgs.forEach((img, i) => {
      if (!img.complete || img.naturalWidth === 0) {
        issues.push(`Broken image: ${img.src || 'no src'} (alt: ${img.alt || 'none'})`);
      }
    });
    
    // Check for elements with no visible content but should have
    const emptyHeadings = document.querySelectorAll('h1, h2, h3');
    emptyHeadings.forEach(h => {
      if (h.textContent.trim() === '') {
        issues.push(`Empty heading: <${h.tagName}>`);
      }
    });
    
    // Check for elements overflowing viewport
    const body = document.body;
    if (body.scrollWidth > window.innerWidth) {
      issues.push(`Horizontal overflow detected: body scrollWidth(${body.scrollWidth}) > viewport(${window.innerWidth})`);
    }
    
    // Check for zero-height sections
    const sections = document.querySelectorAll('section');
    sections.forEach((s, i) => {
      const rect = s.getBoundingClientRect();
      if (rect.height === 0) {
        issues.push(`Zero-height section found (index ${i})`);
      }
    });

    // Get all page text for analysis
    const allText = document.body.innerText;
    
    return { issues, allText: allText.substring(0, 3000) };
  });

  if (visualChecks.issues.length === 0) {
    console.log('No visual issues detected.');
  } else {
    visualChecks.issues.forEach((issue, i) => {
      console.log(`Issue ${i + 1}: ${issue}`);
    });
  }

  console.log('\n=== FULL PAGE TEXT (first 3000 chars) ===');
  console.log(visualChecks.allText);

  // Take a full-page screenshot for reference
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'landing_fullpage.png'), fullPage: true });
  console.log('\nSaved landing_fullpage.png (full page)');

  await browser.close();
  console.log('\nDone!');
})();
