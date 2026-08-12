import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/hemrmicloud.com/.gemini/antigravity/brain/38254bbf-d672-4a68-89f7-56fd707159bf';
const DOWNLOAD_DIR = '/tmp/pdf_downloads';

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

async function verifyPdfMargin() {
  console.log('Testing PDF margin with Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: DOWNLOAD_DIR,
  });

  console.log('Navigating to Chinese Deal Analyzer (Latest Deployment 176b831b)...');
  await page.goto('https://176b831b.cre-calculator.pages.dev/zh/tools/deal-analyzer/', { waitUntil: 'networkidle0' });

  // Click Export PDF Button
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text.includes('导出')) {
      console.log('Clicking Export PDF...');
      await btn.click();
      break;
    }
  }

  // Wait for file to download
  await new Promise((r) => setTimeout(r, 4000));

  const files = fs.readdirSync(DOWNLOAD_DIR);
  console.log('Downloaded files in /tmp/pdf_downloads:', files);

  const pdfFile = files.find((f) => f.endsWith('.pdf'));
  if (pdfFile) {
    const pdfPath = path.join(DOWNLOAD_DIR, pdfFile);
    console.log(`Opening downloaded PDF: ${pdfPath}...`);

    const pdfPage = await browser.newPage();
    await pdfPage.setViewport({ width: 1000, height: 1300 });
    await pdfPage.goto(`file://${pdfPath}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    const screenshotPath = `${ARTIFACT_DIR}/pdf_margin_verification.png`;
    await pdfPage.screenshot({ path: screenshotPath });
    console.log(`📸 PDF page screenshot saved to: ${screenshotPath}`);
  } else {
    console.error('❌ No PDF file was downloaded.');
  }

  await browser.close();
}

verifyPdfMargin();
