import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'out');
const ogDir = path.join(__dirname, '..', 'public', 'og');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
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

// Discover all static HTML pages in out/
function getAllHtmlRoutes(dir, base = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getAllHtmlRoutes(fullPath, relPath));
    } else if (entry.name === 'index.html') {
      const route = '/' + base.replace(/\\/g, '/');
      const normalized = route === '/' ? '/' : (route.endsWith('/') ? route : route + '/');
      results.push(normalized);
    }
  }
  return results;
}

async function runVerification() {
  await new Promise((resolve) => server.listen(3459, resolve));
  console.log('Static test server listening on http://localhost:3459');

  let totalErrors = 0;

  // 1. Verify OG Images on Disk
  console.log('\n==================================================');
  console.log('1. Checking OG Image Assets (public/og/)');
  console.log('==================================================');
  const expectedOgImages = [
    'cre-calculators-default.png',
    'cre-calculators-default-zh.png',
    'deal-analyzer.png',
    'deal-analyzer-zh.png',
    'cap-rate-calculator.png',
    'cap-rate-calculator-zh.png',
    'dscr-calculator.png',
    'dscr-calculator-zh.png',
    '1031-exchange.png',
    '1031-exchange-zh.png',
    'cre-guides.png',
    'cre-guides-zh.png',
  ];

  for (const imgName of expectedOgImages) {
    const imgPath = path.join(ogDir, imgName);
    if (!fs.existsSync(imgPath)) {
      console.error(`❌ Missing OG image: ${imgName}`);
      totalErrors++;
    } else {
      const stats = fs.statSync(imgPath);
      const sizeKb = stats.size / 1024;
      if (sizeKb > 200) {
        console.warn(`⚠️ OG image > 200KB: ${imgName} (${sizeKb.toFixed(1)} KB)`);
      } else {
        console.log(`✅ OG image OK: ${imgName} (${sizeKb.toFixed(1)} KB)`);
      }
    }
  }

  // 2. Scan and Test ALL HTML routes
  const allRoutes = getAllHtmlRoutes(outDir).filter(r => r.startsWith('/en/') || r.startsWith('/zh/'));
  console.log(`\n==================================================`);
  console.log(`2. Full-Coverage Headless Verification of All ${allRoutes.length} Static Routes`);
  console.log(`==================================================`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let verifiedCount = 0;

  for (const route of allRoutes) {
    const isZh = route.startsWith('/zh/');
    const expectedLang = isZh ? 'zh-Hans' : 'en-US';
    const testUrl = `http://localhost:3459${route}`;

    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.toString()));

    await page.goto(testUrl, { waitUntil: 'networkidle0' });

    const currentUrlPath = new URL(page.url()).pathname;
    const normalizedCurrentPath = currentUrlPath.endsWith('/') ? currentUrlPath : `${currentUrlPath}/`;

    const evaluated = await page.evaluate(() => {
      const isNextError = !!document.getElementById('__next_error__') || document.documentElement.id === '__next_error__';
      const htmlLang = document.documentElement.getAttribute('lang');
      const title = document.title;
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const h1Count = document.querySelectorAll('h1').length;
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
      const ogImageWidth = document.querySelector('meta[property="og:image:width"]')?.getAttribute('content');
      const ogImageHeight = document.querySelector('meta[property="og:image:height"]')?.getAttribute('content');
      const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
      const twitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
      const googleVerification = document.querySelector('meta[name="google-site-verification"]')?.getAttribute('content');

      const jsonLdElements = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      const jsonLdErrors = [];
      const jsonLdData = jsonLdElements.map(el => {
        try {
          return JSON.parse(el.textContent || '');
        } catch (e) {
          jsonLdErrors.push(e.message);
          return null;
        }
      });

      return {
        isNextError,
        htmlLang,
        title,
        metaDesc,
        canonical,
        h1Count,
        ogImage,
        ogImageWidth,
        ogImageHeight,
        twitterCard,
        twitterImage,
        googleVerification,
        jsonLdErrors,
        jsonLdCount: jsonLdData.length,
      };
    });

    let routeErrors = 0;

    // Strict Check 1: Must not be Next.js error shell
    if (evaluated.isNextError) {
      console.error(`❌ [${route}] Detected Next.js __next_error__ shell!`);
      routeErrors++;
    }

    // Strict Check 2: Must not redirect away from original route
    if (normalizedCurrentPath !== route) {
      console.error(`❌ [${route}] Unexpected redirect to: "${normalizedCurrentPath}"`);
      routeErrors++;
    }

    // Strict Check 3: Strictly match html lang (no exemptions)
    if (evaluated.htmlLang !== expectedLang) {
      console.error(`❌ [${route}] Lang mismatch: got "${evaluated.htmlLang}", expected "${expectedLang}"`);
      routeErrors++;
    }

    // Strict Check 4: Exactly one H1
    if (evaluated.h1Count !== 1) {
      console.error(`❌ [${route}] Invalid H1 count: ${evaluated.h1Count}`);
      routeErrors++;
    }

    // Strict Check 5: Canonical strictly matches expected URL
    const expectedCanonical = `https://crecalculators.com${route}`;
    if (evaluated.canonical !== expectedCanonical) {
      console.error(`❌ [${route}] Canonical mismatch: got "${evaluated.canonical}", expected "${expectedCanonical}"`);
      routeErrors++;
    }

    // Strict Check 6: 1200x630 OG image
    if (!evaluated.ogImage || evaluated.ogImageWidth !== '1200' || evaluated.ogImageHeight !== '630') {
      console.error(`❌ [${route}] Invalid OG image tags: ${evaluated.ogImage} (${evaluated.ogImageWidth}x${evaluated.ogImageHeight})`);
      routeErrors++;
    }

    // Strict Check 7: Twitter summary_large_image
    if (evaluated.twitterCard !== 'summary_large_image' || !evaluated.twitterImage) {
      console.error(`❌ [${route}] Invalid Twitter card tags`);
      routeErrors++;
    }

    // Strict Check 8: Valid JSON-LD if present
    if (evaluated.jsonLdErrors.length > 0) {
      console.error(`❌ [${route}] JSON-LD parse errors:`, evaluated.jsonLdErrors);
      routeErrors++;
    }

    // Strict Check 9: Zero Console/Hydration errors
    if (consoleErrors.length > 0) {
      console.error(`❌ [${route}] Console / Hydration errors:`, consoleErrors);
      routeErrors++;
    }

    if (routeErrors === 0) {
      verifiedCount++;
    } else {
      totalErrors += routeErrors;
    }

    await page.close();
  }

  await browser.close();
  server.close();

  console.log(`\n==================================================`);
  console.log(`Verification Summary: ${verifiedCount}/${allRoutes.length} static routes verified with 0 errors`);
  console.log(`==================================================`);

  if (totalErrors > 0) {
    console.error(`\n❌ Full verification finished with ${totalErrors} error(s).`);
    process.exit(1);
  } else {
    console.log(`\n🎉 100% OF ALL ${allRoutes.length} STATIC ROUTES PASSED ALL STRICT CHECKS!`);
  }
}

runVerification().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
