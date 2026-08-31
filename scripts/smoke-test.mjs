import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'out');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '' || reqPath === '/') {
    res.writeHead(308, { Location: '/en/' });
    res.end();
    return;
  }
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }
  let filePath = path.join(outDir, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }
  if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

async function runSmokeTests() {
  await new Promise((resolve) => server.listen(3460, resolve));
  console.log('Test server listening on http://localhost:3460');

  const browser = await puppeteer.launch({ 
    headless: true,
    executablePath: CHROME_PATH
  });
  const page = await browser.newPage();
  
  let consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  try {
    console.log('\n--- 1. Testing Deal Analyzer Hydration ---');
    // First setup some local storage
    await page.goto('http://localhost:3460/en/tools/deal-analyzer/');
    await page.evaluate(() => {
      localStorage.setItem('cre_saved_deals', JSON.stringify([
        { name: 'Test Deal', date: '2026-08-31', input: {} }
      ]));
    });

    // Hard load English
    consoleErrors = [];
    await page.goto('http://localhost:3460/en/tools/deal-analyzer/', { waitUntil: 'networkidle0' });
    console.log('EN Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) console.log(consoleErrors);

    // Hard load Chinese
    consoleErrors = [];
    await page.goto('http://localhost:3460/zh/tools/deal-analyzer/', { waitUntil: 'networkidle0' });
    console.log('ZH Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) console.log(consoleErrors);

    console.log('\n--- 2. Testing Deal Analyzer Functions ---');
    await page.goto('http://localhost:3460/en/tools/deal-analyzer/', { waitUntil: 'networkidle0' });
    
    // Check initial DSCR
    const textBase = await page.evaluate(() => document.body.innerText);
    console.log('Base DSCR ~1.34x found:', textBase.includes('1.34x'));
    
    // Toggle stress test
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const stressBtn = btns.find(b => b.innerText.includes('Stress Test'));
      if (stressBtn) stressBtn.click();
    });
    
    // Wait for stress test panel
    await new Promise(r => setTimeout(r, 500));
    const textStress = await page.evaluate(() => document.body.innerText);
    console.log('Stress DSCR ~1.13x found:', textStress.includes('1.13x'));

    // Check PDF export button exists
    const hasPdf = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Export PDF'));
    });
    console.log('PDF Export Button exists:', hasPdf);


    console.log('\n--- 3. Testing NOI Calculator ---');
    await page.goto('http://localhost:3460/en/calculators/noi/', { waitUntil: 'networkidle0' });
    
    // Test A11y tree for spinbuttons
    const snapshot = await page.accessibility.snapshot();
    let spinbuttonCount = 0;
    let namedSpinbuttons = 0;
    const findSpinbuttons = (node) => {
      if (node.role === 'spinbutton') {
        spinbuttonCount++;
        if (node.name) namedSpinbuttons++;
      }
      if (node.children) {
        for (let child of node.children) findSpinbuttons(child);
      }
    };
    findSpinbuttons(snapshot);
    console.log(`NOI Form: Found ${spinbuttonCount} spinbuttons, ${namedSpinbuttons} have accessible names.`);

    // Test calculation
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="number"]');
      if (inputs.length >= 7) {
        const setReactValue = (input, value) => {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          nativeInputValueSetter.call(input, value);
          input.dispatchEvent(new Event('input', { bubbles: true }));
        };
        // GPI
        setReactValue(inputs[0], '360000');
        // Vacancy
        setReactValue(inputs[1], '8');
        // Tax 39000, Insurance 20000, Maintenance 20000, Management 10000, Utilities 10000
        setReactValue(inputs[2], '39000');
        setReactValue(inputs[3], '20000');
        setReactValue(inputs[4], '20000');
        setReactValue(inputs[5], '10000');
        setReactValue(inputs[6], '10000');
      }
    });
    await new Promise(r => setTimeout(r, 500));
    
    const noiHtml = await page.content();
    console.log('EGI = $331,200 found:', noiHtml.includes('331,200'));
    console.log('NOI = $232,200 found:', noiHtml.includes('232,200'));


    console.log('\n--- 4. Testing Conversion Entry Links ---');
    const noiHasDealAnalyzer = noiHtml.includes('href="/en/tools/deal-analyzer/"');
    console.log('NOI Calculator has Deal Analyzer link:', noiHasDealAnalyzer);

    await page.goto('http://localhost:3460/en/guides/how-to-estimate-noi/', { waitUntil: 'networkidle0' });
    const guideHtml = await page.content();
    const guideHasNOI = guideHtml.includes('href="/en/calculators/noi/"');
    const guideHasDeal = guideHtml.includes('href="/en/tools/deal-analyzer/"');
    console.log('NOI Guide has NOI Calculator link:', guideHasNOI);
    console.log('NOI Guide has Deal Analyzer link:', guideHasDeal);

    
    console.log('\n--- 5. Testing Mobile View (375x812) ---');
    await page.setViewport({ width: 375, height: 812 });
    
    const checkOverflow = async (url) => {
      await page.goto(url, { waitUntil: 'networkidle0' });
      const dims = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          brandHeight: document.querySelector('header span.tracking-tight')?.offsetHeight || 0
        };
      });
      console.log(`URL: ${url}`);
      console.log(`  ScrollWidth: ${dims.scrollWidth}, ViewportWidth: ${dims.viewportWidth}, Overflow: ${dims.scrollWidth > dims.viewportWidth}`);
      console.log(`  Brand span height: ${dims.brandHeight}px`);
    };

    await checkOverflow('http://localhost:3460/zh/');
    await checkOverflow('http://localhost:3460/en/');
    await checkOverflow('http://localhost:3460/zh/calculators/noi/');
    await checkOverflow('http://localhost:3460/zh/tools/deal-analyzer/');


  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
    server.close();
  }
}

runSmokeTests();
