import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/hemrmicloud.com/.gemini/antigravity/brain/38254bbf-d672-4a68-89f7-56fd707159bf';

async function verifyPage(url, locale) {
  console.log(`\n==================================================`);
  console.log(`Verifying: ${url} (${locale})`);
  console.log(`==================================================`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  const consoleLogs = [];
  const consoleErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error' || text.includes('418') || text.includes('Hydration') || text.includes('mismatch')) {
      consoleErrors.push(text);
      console.error(`🚨 CONSOLE ERROR: ${text}`);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
    console.error(`🚨 UNCAUGHT PAGE ERROR: ${err.toString()}`);
  });

  // 1. Initial Page Load
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0' });

  console.log(`Initial load console error count: ${consoleErrors.length}`);
  if (consoleErrors.length === 0) {
    console.log(`✅ Initial load clean: ZERO console errors / hydration mismatches found!`);
  } else {
    console.log(`⚠️ Console errors detected:`, consoleErrors);
  }

  // 2. Locate and Click Stress Test Button
  const buttonSelector = 'button';
  const buttons = await page.$$(buttonSelector);
  let stressBtn = null;

  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text.includes('Stress Test') || text.includes('压力测试')) {
      stressBtn = btn;
      break;
    }
  }

  if (!stressBtn) {
    console.error(`❌ Stress Test button not found!`);
  } else {
    console.log(`Clicking Stress Test button...`);
    await stressBtn.click();
    await new Promise((r) => setTimeout(r, 1000));

    // Verify side-by-side panel is visible
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasBaseCase = pageText.includes('Base') || pageText.includes('基础');
    const hasStressCase = pageText.includes('Stress') || pageText.includes('压力');
    const has134x = pageText.includes('1.34x');
    const has113x = pageText.includes('1.13x');

    console.log(`Panel text check: BaseCase=${hasBaseCase}, StressCase=${hasStressCase}, BaseDSCR(1.34x)=${has134x}, StressDSCR(1.13x)=${has113x}`);

    // Take Screenshot of Stress Test Panel
    const screenshotPath = `${ARTIFACT_DIR}/${locale}_stress_test_panel.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
  }

  // 3. Locate and Click Export PDF Button
  const allButtons = await page.$$(buttonSelector);
  let pdfBtn = null;

  for (const btn of allButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text.includes('Export') || text.includes('导出')) {
      pdfBtn = btn;
      break;
    }
  }

  if (!pdfBtn) {
    console.error(`❌ PDF Export button not found!`);
  } else {
    console.log(`Clicking PDF Export button...`);
    await pdfBtn.click();
    await new Promise((r) => setTimeout(r, 3000));
    console.log(`PDF Export action triggered successfully.`);
  }

  await browser.close();
  return { consoleErrors, consoleLogs };
}

async function main() {
  await verifyPage('https://cre-calculator.pages.dev/en/tools/deal-analyzer/', 'en');
  await verifyPage('https://cre-calculator.pages.dev/zh/tools/deal-analyzer/', 'zh');
}

main();
