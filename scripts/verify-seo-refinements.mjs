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
  '.xml': 'application/xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') {
    // Check root redirect
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

const APPROVED_SITEMAP_URLS = new Set([
  'https://crecalculators.com/en/',
  'https://crecalculators.com/en/calculators/cap-rate/',
  'https://crecalculators.com/en/calculators/noi/',
  'https://crecalculators.com/en/calculators/cash-on-cash/',
  'https://crecalculators.com/en/calculators/loan-payment/',
  'https://crecalculators.com/en/calculators/dscr/',
  'https://crecalculators.com/en/calculators/1031-exchange/',
  'https://crecalculators.com/en/calculators/lease-vs-buy/',
  'https://crecalculators.com/en/calculators/break-even-ratio/',
  'https://crecalculators.com/en/tools/deal-analyzer/',
  'https://crecalculators.com/en/guides/',
  'https://crecalculators.com/en/guides/cap-rate-benchmarks-by-city/',
  'https://crecalculators.com/en/guides/how-to-estimate-noi/',
  'https://crecalculators.com/en/guides/1031-exchange-process/',
  'https://crecalculators.com/en/guides/how-to-underwrite-a-deal/',
  'https://crecalculators.com/zh/',
  'https://crecalculators.com/zh/calculators/cap-rate/',
  'https://crecalculators.com/zh/calculators/noi/',
  'https://crecalculators.com/zh/calculators/dscr/',
]);

const BILINGUAL_PAIRED_ROUTES = new Set([
  '/en/',
  '/zh/',
  '/en/calculators/cap-rate/',
  '/zh/calculators/cap-rate/',
  '/en/calculators/noi/',
  '/zh/calculators/noi/',
  '/en/calculators/dscr/',
  '/zh/calculators/dscr/',
]);

const PRIORITY_ROUTES = [
  '/en/calculators/cap-rate/',
  '/en/calculators/noi/',
  '/en/calculators/dscr/',
  '/en/calculators/cash-on-cash/',
  '/en/tools/deal-analyzer/',
];

async function runVerification() {
  await new Promise((resolve) => server.listen(3459, resolve));
  console.log('Static test server listening on http://localhost:3459');

  let totalErrors = 0;

  // 1. Verify Sitemap XML
  console.log('\n==================================================');
  console.log('1. Checking Sitemap Structure & URL Count (out/sitemap.xml)');
  console.log('==================================================');
  const sitemapPath = path.join(outDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ out/sitemap.xml does not exist!');
    totalErrors++;
  } else {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    console.log(`Found ${locMatches.length} URLs in sitemap.xml (Expected: 19)`);

    if (locMatches.length !== 19) {
      console.error(`❌ Sitemap URL count mismatch: got ${locMatches.length}, expected 19`);
      totalErrors++;
    }

    // Check for uniform weekly/0.9
    if (sitemapContent.includes('<changefreq>weekly</changefreq>')) {
      console.error('❌ Sitemap contains arbitrary <changefreq>weekly</changefreq>');
      totalErrors++;
    }
    if (sitemapContent.includes('<priority>0.9</priority>')) {
      console.error('❌ Sitemap contains uniform <priority>0.9</priority>');
      totalErrors++;
    }

    for (const url of locMatches) {
      if (!APPROVED_SITEMAP_URLS.has(url)) {
        console.error(`❌ Non-approved URL found in sitemap: ${url}`);
        totalErrors++;
      } else {
        console.log(`  ✅ Approved sitemap URL: ${url}`);
      }
    }
  }

  // 2. Verify Robots.txt
  console.log('\n==================================================');
  console.log('2. Checking robots.txt (out/robots.txt)');
  console.log('==================================================');
  const robotsPath = path.join(outDir, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    console.error('❌ out/robots.txt does not exist!');
    totalErrors++;
  } else {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    if (!robotsContent.includes('Allow: /') || !robotsContent.includes('Sitemap: https://crecalculators.com/sitemap.xml')) {
      console.error('❌ Invalid robots.txt content:\n', robotsContent);
      totalErrors++;
    } else {
      console.log('✅ robots.txt verified');
    }
  }

  // 3. Verify OG Images on Disk
  console.log('\n==================================================');
  console.log('3. Checking OG Image Assets (public/og/)');
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
      console.log(`✅ OG image OK: ${imgName} (${sizeKb.toFixed(1)} KB)`);
    }
  }

  // 4. Scan and Test ALL HTML routes via Headless Browser
  const allRoutes = getAllHtmlRoutes(outDir).filter(r => r.startsWith('/en/') || r.startsWith('/zh/'));
  console.log(`\n==================================================`);
  console.log(`4. Headless Browser Verification across All ${allRoutes.length} Routes`);
  console.log(`==================================================`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let verifiedCount = 0;
  const uniqueTitles = new Set();
  const uniqueDescriptions = new Set();

  for (const route of allRoutes) {
    const isZh = route.startsWith('/zh/');
    const expectedLang = isZh ? 'zh-Hans' : 'en-US';
    const testUrl = `http://localhost:3459${route}`;
    const fullCanonicalUrl = `https://crecalculators.com${route}`;
    const isSitemapApproved = APPROVED_SITEMAP_URLS.has(fullCanonicalUrl);

    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.toString()));

    await page.goto(testUrl, { waitUntil: 'networkidle0' });

    const evaluated = await page.evaluate(() => {
      const isNextError = !!document.getElementById('__next_error__') || document.documentElement.id === '__next_error__';
      const htmlLang = document.documentElement.getAttribute('lang');
      const title = document.title;
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const robotsMeta = document.querySelector('meta[name="robots"]')?.getAttribute('content');
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const h1Count = document.querySelectorAll('h1').length;
      const h1Text = document.querySelector('h1')?.textContent?.trim();
      const inBodyLinks = Array.from(document.querySelectorAll('main a, article a')).map(a => a.getAttribute('href'));

      // Hreflang alternates
      const hreflangs = {};
      document.querySelectorAll('link[rel="alternate"]').forEach(el => {
        const lang = el.getAttribute('hreflang');
        const href = el.getAttribute('href');
        if (lang && href) hreflangs[lang] = href;
      });

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
        robotsMeta,
        canonical,
        h1Count,
        h1Text,
        inBodyLinksCount: inBodyLinks.length,
        hreflangs,
        jsonLdErrors,
        jsonLdData,
      };
    });

    let routeErrors = 0;

    // Strict Check 1: Must not be Next.js error shell
    if (evaluated.isNextError) {
      console.error(`❌ [${route}] Detected Next.js __next_error__ shell!`);
      routeErrors++;
    }

    // Strict Check 2: HTML Lang
    if (evaluated.htmlLang !== expectedLang) {
      console.error(`❌ [${route}] Lang mismatch: got "${evaluated.htmlLang}", expected "${expectedLang}"`);
      routeErrors++;
    }

    // Strict Check 3: Canonical self-referencing
    if (evaluated.canonical !== fullCanonicalUrl) {
      console.error(`❌ [${route}] Canonical mismatch: got "${evaluated.canonical}", expected "${fullCanonicalUrl}"`);
      routeErrors++;
    }

    // Strict Check 4: Exactly one H1
    if (evaluated.h1Count !== 1) {
      console.error(`❌ [${route}] Invalid H1 count: ${evaluated.h1Count}`);
      routeErrors++;
    }

    // Strict Check 5: Robots meta index / noindex
    if (isSitemapApproved) {
      if (evaluated.robotsMeta && evaluated.robotsMeta.includes('noindex')) {
        console.error(`❌ [${route}] Approved core page has unintended NOINDEX!`);
        routeErrors++;
      }
    } else {
      if (!evaluated.robotsMeta || !evaluated.robotsMeta.includes('noindex')) {
        console.error(`❌ [${route}] Excluded low-value page missing NOINDEX! Got: "${evaluated.robotsMeta}"`);
        routeErrors++;
      }
    }

    // Strict Check 6: Hreflang rules
    if (isSitemapApproved) {
      if (BILINGUAL_PAIRED_ROUTES.has(route)) {
        if (!evaluated.hreflangs['en-US'] || !evaluated.hreflangs['zh-Hans'] || !evaluated.hreflangs['x-default']) {
          console.error(`❌ [${route}] Bilingual route missing expected hreflangs:`, evaluated.hreflangs);
          routeErrors++;
        }
      } else {
        // English-only indexable
        if (evaluated.hreflangs['zh-Hans']) {
          console.error(`❌ [${route}] English-only route unexpectedly declared zh-Hans alternate!`, evaluated.hreflangs);
          routeErrors++;
        }
        if (!evaluated.hreflangs['en-US'] || !evaluated.hreflangs['x-default']) {
          console.error(`❌ [${route}] English route missing en-US or x-default:`, evaluated.hreflangs);
          routeErrors++;
        }
      }
    }

    // Strict Check 7: Priority Pages Deep Validation
    if (PRIORITY_ROUTES.includes(route)) {
      if (uniqueTitles.has(evaluated.title)) {
        console.error(`❌ [${route}] Duplicate title detected: "${evaluated.title}"`);
        routeErrors++;
      }
      uniqueTitles.add(evaluated.title);

      if (uniqueDescriptions.has(evaluated.metaDesc)) {
        console.error(`❌ [${route}] Duplicate meta description detected: "${evaluated.metaDesc}"`);
        routeErrors++;
      }
      uniqueDescriptions.add(evaluated.metaDesc);

      if (evaluated.inBodyLinksCount === 0) {
        console.error(`❌ [${route}] Missing in-body contextual links!`);
        routeErrors++;
      }

      // Check JSON-LD for WebApplication / SoftwareApplication, FAQPage, BreadcrumbList
      const schemas = evaluated.jsonLdData.flat();
      const hasSoftware = schemas.some(s => {
        const type = s?.['@type'];
        return type === 'SoftwareApplication' || (Array.isArray(type) && type.includes('SoftwareApplication'));
      });
      const hasFaq = schemas.some(s => s?.['@type'] === 'FAQPage');
      const hasBreadcrumb = schemas.some(s => s?.['@type'] === 'BreadcrumbList');

      if (!hasSoftware || !hasFaq || !hasBreadcrumb) {
        console.error(`❌ [${route}] Missing required schema (hasSoftware: ${hasSoftware}, hasFaq: ${hasFaq}, hasBreadcrumb: ${hasBreadcrumb})`);
        routeErrors++;
      }
    }

    // Strict Check 8: Zero console errors
    if (consoleErrors.length > 0) {
      console.error(`❌ [${route}] Console errors:`, consoleErrors);
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
