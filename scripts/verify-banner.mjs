import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACTS_DIR = '/Users/hemrmicloud.com/.gemini/antigravity/brain/38254bbf-d672-4a68-89f7-56fd707159bf';

async function verifyBanner() {
  console.log('Testing Collapsible Explanation Banner...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });

  // 1. Test Chinese Page
  console.log('Navigating to Chinese Deal Analyzer...');
  await page.goto('https://f53b120e.cre-calculator.pages.dev/zh/tools/deal-analyzer/', { waitUntil: 'networkidle0' });

  // Screenshot Collapsed State
  const zhCollapsedPath = path.join(ARTIFACTS_DIR, 'zh_banner_collapsed.png');
  await page.screenshot({ path: zhCollapsedPath });
  console.log(`📸 Zh Collapsed screenshot: ${zhCollapsedPath}`);

  // Click banner to expand
  console.log('Clicking banner to expand in Chinese...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cap Rate'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Screenshot Expanded State
  const zhExpandedPath = path.join(ARTIFACTS_DIR, 'zh_banner_expanded.png');
  await page.screenshot({ path: zhExpandedPath });
  console.log(`📸 Zh Expanded screenshot: ${zhExpandedPath}`);

  // 2. Test English Page
  console.log('Navigating to English Deal Analyzer...');
  await page.goto('https://f53b120e.cre-calculator.pages.dev/en/tools/deal-analyzer/', { waitUntil: 'networkidle0' });

  const enCollapsedPath = path.join(ARTIFACTS_DIR, 'en_banner_collapsed.png');
  await page.screenshot({ path: enCollapsedPath });
  console.log(`📸 En Collapsed screenshot: ${enCollapsedPath}`);

  // Click banner to expand in English
  console.log('Clicking banner in English...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('One input set calculates'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const enExpandedPath = path.join(ARTIFACTS_DIR, 'en_banner_expanded.png');
  await page.screenshot({ path: enExpandedPath });
  console.log(`📸 En Expanded screenshot: ${enExpandedPath}`);

  await browser.close();
  console.log('✅ Banner Verification Script Completed!');
}

verifyBanner().catch((err) => {
  console.error('Script Error:', err);
  process.exit(1);
});
