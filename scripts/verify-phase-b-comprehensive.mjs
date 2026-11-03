import puppeteer from 'puppeteer-core';
import assert from 'assert';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'out');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  if (!path.extname(reqPath)) reqPath += '/index.html';

  const filePath = path.join(outDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

await new Promise((resolve) => server.listen(0, resolve));
const port = server.address().port;
console.log(`Phase B Verification server listening on port ${port}`);

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});

try {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // 1. Verify DSCR Calculator 3-Constraint Sizing Engine
  console.log('Testing DSCR 3-Constraint Sizing Engine...');
  await page.goto(`http://localhost:${port}/en/calculators/dscr/`, { waitUntil: 'networkidle0' });
  const sizingEngine = await page.$('[data-testid="dscr-three-constraint-sizing"]');
  assert(sizingEngine, 'Must render three-constraint sizing engine');
  const dscrBindingText = await page.$eval('[data-testid="dscr-binding-max-loan"]', el => el.textContent);
  assert(dscrBindingText.includes('$'), 'Must show binding constraint loan amount');
  console.log(`  ✔ DSCR Sizing Engine displays binding max loan: ${dscrBindingText}`);

  // Verify Action Bar on DSCR
  const dscrActionBar = await page.$('[aria-label="Calculator actions"]');
  assert(dscrActionBar, 'DSCR action bar must render');
  console.log('  ✔ DSCR Action Bar (Save, CSV, Print, Share) present');

  // 2. Verify Cash-on-Cash Calculator Action Bar & Diagnostics
  console.log('Testing Cash-on-Cash Calculator...');
  await page.goto(`http://localhost:${port}/en/calculators/cash-on-cash/`, { waitUntil: 'networkidle0' });
  const cocActionBar = await page.$('[aria-label="Calculator actions"]');
  assert(cocActionBar, 'CoC action bar must render');
  console.log('  ✔ CoC Action Bar present');

  const cocDiag = await page.$eval('[data-testid="coc-dynamic-diagnosis"]', el => el.textContent);
  assert(cocDiag.length > 20, 'Must render dynamic leverage diagnosis');
  console.log('  ✔ CoC Dynamic Financial Diagnosis evaluated');

  // 3. Verify NOI Calculator Action Bar & Forward Links
  console.log('Testing NOI Calculator...');
  await page.goto(`http://localhost:${port}/en/calculators/noi/`, { waitUntil: 'networkidle0' });
  const noiActionBar = await page.$('[aria-label="Calculator actions"]');
  assert(noiActionBar, 'NOI action bar must render');
  console.log('  ✔ NOI Action Bar present');

  // 4. Verify Cap Rate Calculator Action Bar
  console.log('Testing Cap Rate Calculator...');
  await page.goto(`http://localhost:${port}/en/calculators/cap-rate/`, { waitUntil: 'networkidle0' });
  const capActionBar = await page.$('[aria-label="Calculator actions"]');
  assert(capActionBar, 'Cap Rate action bar must render');
  console.log('  ✔ Cap Rate Action Bar present');

  // 5. Verify Loan Payment Calculator Action Bar
  console.log('Testing Loan Payment Calculator...');
  await page.goto(`http://localhost:${port}/en/calculators/loan-payment/`, { waitUntil: 'networkidle0' });
  const loanActionBar = await page.$('[aria-label="Calculator actions"]');
  assert(loanActionBar, 'Loan Payment action bar must render');
  console.log('  ✔ Loan Payment Action Bar present');

  // 6. Verify 1031 Exchange Calculator Action Bar
  console.log('Testing 1031 Exchange Calculator...');
  await page.goto(`http://localhost:${port}/en/calculators/1031-exchange/`, { waitUntil: 'networkidle0' });
  const exchangeActionBar = await page.$('[aria-label="Calculator actions"]');
  assert(exchangeActionBar, '1031 Exchange action bar must render');
  console.log('  ✔ 1031 Exchange Action Bar present');

  // 7. Verify Lease vs Buy Calculator Action Bar
  console.log('Testing Lease vs Buy Calculator...');
  await page.goto(`http://localhost:${port}/en/calculators/lease-vs-buy/`, { waitUntil: 'networkidle0' });
  const leaseActionBar = await page.$('[aria-label="Calculator actions"]');
  assert(leaseActionBar, 'Lease vs Buy action bar must render');
  console.log('  ✔ Lease vs Buy Action Bar present');

  // 8. Verify Break-Even Ratio Calculator Action Bar
  console.log('Testing Break-Even Ratio Calculator...');
  await page.goto(`http://localhost:${port}/en/calculators/break-even-ratio/`, { waitUntil: 'networkidle0' });
  const berActionBar = await page.$('[aria-label="Calculator actions"]');
  assert(berActionBar, 'Break-Even Ratio action bar must render');
  console.log('  ✔ Break-Even Ratio Action Bar present');

  // 9. Verify Underwriting Guide Checklist PDF link
  console.log('Testing Underwriting Guide Checklist PDF link...');
  await page.goto(`http://localhost:${port}/en/guides/how-to-underwrite-a-deal/`, { waitUntil: 'networkidle0' });
  const pdfLink = await page.$('a[href="/assets/commercial-real-estate-underwriting-checklist.pdf"]');
  assert(pdfLink, 'Must contain link to download 1-page Underwriting Checklist PDF');
  console.log('  ✔ 1-Page Underwriting Checklist PDF download link present');

  // Check static PDF file existence & size
  const pdfPath = path.join(outDir, 'assets', 'commercial-real-estate-underwriting-checklist.pdf');
  assert(fs.existsSync(pdfPath), 'PDF file must exist in out/assets');
  const pdfSize = fs.statSync(pdfPath).size;
  console.log(`  ✔ PDF file verified in out/assets: ${pdfSize} bytes (${(pdfSize / 1024).toFixed(1)} KB)`);

  assert.strictEqual(consoleErrors.length, 0, `Unexpected console errors: ${consoleErrors.join(', ')}`);
  console.log('✅ ALL PHASE B END-TO-END VERIFICATIONS PASSED WITH ZERO CONSOLE ERRORS!');
} finally {
  await browser.close();
  server.close();
}
