import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  isBadBerOccupancy,
  invalidSamples,
  validSamples
} from './lib/seo-semantic-validation.mjs';

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
  console.log('\n--- 0. Running Semantic Validation Logic Self-Test ---');
  for (const sample of invalidSamples) {
    if (!isBadBerOccupancy(sample)) {
      throw new Error(`Semantic validator self-test failed: invalid sample was NOT rejected: "${sample}"`);
    }
  }
  for (const sample of validSamples) {
    if (isBadBerOccupancy(sample)) {
      throw new Error(`Semantic validator self-test failed: valid sample was falsely rejected: "${sample}"`);
    }
  }
  console.log('Semantic validation logic self-test passed');

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






    console.log('\n--- 6. Testing New Explicit Assertions ---');

    const assertMetrics = async (pageUrl, isStress) => {
        const isDealAnalyzer = pageUrl.includes('/tools/deal-analyzer/');
        if (isStress && !isDealAnalyzer) {
            throw new Error(`Stress test is only supported on Deal Analyzer, but requested for ${pageUrl}`);
        }

        await page.goto(pageUrl, { waitUntil: 'networkidle0' });

        if (isStress) {
            const btnClicked = await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                const stressBtn = btns.find(b => b.innerText.includes('Stress Test') || b.innerText.includes('压力测试'));
                if (stressBtn) {
                    stressBtn.click();
                    return true;
                }
                return false;
            });
            if (!btnClicked) throw new Error(`Stress Test button not found on ${pageUrl}`);
            await new Promise(r => setTimeout(r, 500));
        }

        const getVal = async (testid) => {
           const val = await page.evaluate((id) => {
               const el = document.querySelector(`[data-testid="${id}"]`);
               return el ? el.textContent.trim() : null;
           }, testid);
           if (val === null) throw new Error(`Missing data-testid "${testid}" on ${pageUrl}`);
           return val;
        };

        const prefix = isDealAnalyzer ? (isStress ? 'tool-stress-' : 'tool-base-') : 'base-';

        const ber = await getVal(prefix + 'ber');
        const beo = await getVal(prefix + 'beo');
        const dscr = await getVal(prefix + 'dscr');

        let noi, cap, coc;
        if (!isStress) {
            noi = await getVal(prefix + 'noi');
            cap = await getVal(prefix + 'cap-rate');
            coc = await getVal(prefix + 'cash-on-cash');
        }

        const expected = isStress ? {
            ber: '92.01%', beo: '82.81%', dscr: '1.13x'
        } : {
            ber: '82.13%', beo: '78.02%', dscr: '1.34x', noi: '$227,200', cap: '8.11%', coc: '7.55%'
        };

        const check = (name, actual, exp) => {
            if (actual !== exp) throw new Error(`Assertion failed on ${pageUrl}: ${name} expected "${exp}", got "${actual}"`);
        };

        check('BER', ber, expected.ber);
        check('BEO', beo, expected.beo);
        check('DSCR', dscr, expected.dscr);
        if (!isStress) {
            check('NOI', noi, expected.noi);
            check('Cap Rate', cap, expected.cap);
            check('Cash-on-Cash', coc, expected.coc);
        }
        console.log(`✅ ${pageUrl} (${isStress ? 'Stress' : 'Base'}) passed all assertions.`);
    };

    await assertMetrics('http://localhost:3460/en/', false);
    await assertMetrics('http://localhost:3460/zh/', false);
    await assertMetrics('http://localhost:3460/en/tools/deal-analyzer/', false);
    await assertMetrics('http://localhost:3460/zh/tools/deal-analyzer/', false);
    await assertMetrics('http://localhost:3460/en/tools/deal-analyzer/', true);
    await assertMetrics('http://localhost:3460/zh/tools/deal-analyzer/', true);

    console.log('\n--- 7. Testing JSON-LD Consistency ---');

    const verifyJsonLd = async (pageUrl) => {
        await page.goto(pageUrl, { waitUntil: 'networkidle0' });
        const html = await page.content();
        const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

        if (ldMatches.length === 0) throw new Error(`No JSON-LD found on ${pageUrl}`);

        const isZh = pageUrl.includes('/zh/');
        const terms = {
            ber: isZh ? ['收支平衡比率', 'BER'] : ['BER', 'Break-Even Ratio'],
            egi: isZh ? ['有效毛收入', 'EGI'] : ['EGI', 'Effective Gross Income'],
            beo: isZh ? ['盈亏入住率', 'BEO'] : ['BEO', 'Break-Even Occupancy'],
            gpi: isZh ? ['潜在毛收入', 'GPI'] : ['GPI', 'Gross Potential Income']
        };

        let foundSoftwareLd = false;
        let foundFaqLd = false;

        // Get visible FAQs from DOM
        const visibleFaqs = await page.evaluate(() => {
            const list = document.querySelector('[data-testid="faq-list"]');
            if (!list) return [];
            const items = Array.from(list.querySelectorAll('[data-testid="faq-item"]'));
            return items.map(item => ({
                question: item.querySelector('[data-testid="faq-question"]')?.innerText.trim() || '',
                answer: item.querySelector('[data-testid="faq-answer"]')?.innerText.trim() || ''
            }));
        });

        // Find deeply nested entities
        const extractEntities = (obj, results = []) => {
            if (Array.isArray(obj)) {
                obj.forEach(o => extractEntities(o, results));
            } else if (obj && typeof obj === 'object') {
                if (obj['@type']) results.push(obj);
                Object.values(obj).forEach(v => extractEntities(v, results));
            }
            return results;
        };

        let pairedBerEgi = false;
        let pairedBeoGpi = false;

        const checkTextPairing = (text) => {
            if (!text) return;
            const hasBer = terms.ber.some(t => text.includes(t));
            const hasEgi = terms.egi.some(t => text.includes(t));
            const hasBeo = terms.beo.some(t => text.includes(t));
            const hasGpi = terms.gpi.some(t => text.includes(t));

            if (hasBer && hasEgi) pairedBerEgi = true;
            if (hasBeo && hasGpi) pairedBeoGpi = true;

            // Negative tests using shared semantic validator
            if (isBadBerOccupancy(text)) {
                throw new Error(`Confused BER/occupancy wording found: "${text}"`);
            }
        };

        for (const match of ldMatches) {
            const jsonText = match[1];
            let ld;
            try {
                ld = JSON.parse(jsonText);
            } catch (err) {
                throw new Error(`Failed to parse JSON-LD on ${pageUrl}: ${err.message}\nRaw: ${jsonText}`);
            }

            const entities = extractEntities(ld);
            for (const entity of entities) {
                const type = entity['@type'];
                const isSoftware = Array.isArray(type) ? type.includes('SoftwareApplication') : type === 'SoftwareApplication';

                if (isSoftware) {
                    foundSoftwareLd = true;
                    checkTextPairing(entity.description);
                }

                if (type === 'FAQPage') {
                    foundFaqLd = true;
                    const mainEntity = entity.mainEntity || [];
                    if (mainEntity.length !== visibleFaqs.length) {
                        throw new Error(`FAQ count mismatch on ${pageUrl}: JSON-LD has ${mainEntity.length}, Page has ${visibleFaqs.length}`);
                    }
                    for (let i = 0; i < mainEntity.length; i++) {
                        const q = mainEntity[i].name?.trim() || '';
                        const a = mainEntity[i].acceptedAnswer?.text?.trim() || '';
                        const normalizeWhitespace = (str) => str.replace(/\s+/g, ' ').trim();
                        if (normalizeWhitespace(q) !== normalizeWhitespace(visibleFaqs[i].question) || normalizeWhitespace(a) !== normalizeWhitespace(visibleFaqs[i].answer)) {
                            throw new Error(`FAQ mismatch on ${pageUrl} at index ${i}:\nJSON-LD: ${q} / ${a}\nPage: ${visibleFaqs[i].question} / ${visibleFaqs[i].answer}`);
                        }
                        checkTextPairing(q);
                        checkTextPairing(a);
                    }
                }
            }
        }

        if (!foundSoftwareLd) throw new Error(`Could not find SoftwareApplication JSON-LD entity on ${pageUrl}`);
        if (!foundFaqLd) throw new Error(`Could not find FAQPage JSON-LD entity on ${pageUrl}`);
        if (!pairedBerEgi) throw new Error(`Failed to positively assert BER+EGI pairing in any single text definition on ${pageUrl}`);
        if (!pairedBeoGpi) throw new Error(`Failed to positively assert BEO+GPI pairing in any single text definition on ${pageUrl}`);

        console.log(`✅ ${pageUrl} JSON-LD perfectly aligned (Software + FAQ verified against DOM + semantic rules verified).`);
    };

    await verifyJsonLd('http://localhost:3460/en/calculators/break-even-ratio/');
    await verifyJsonLd('http://localhost:3460/zh/calculators/break-even-ratio/');


    // Test Viewports: 320, 375, 1440
    const viewports = [320, 375, 1440];
    for (const vp of viewports) {
      await page.setViewport({ width: vp, height: Math.max(812, vp) });
      await page.goto('http://localhost:3460/en/', { waitUntil: 'networkidle0' });
      const dims = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          brandVisible: document.querySelector('header span.tracking-tight')?.textContent === 'CRE Calculators'
        };
      });
      console.log(`Viewport ${vp}px - Overflow: ${dims.scrollWidth > dims.viewportWidth}, Brand Full Visible: ${dims.brandVisible}`);
    }

  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
    process.exit(process.exitCode || 0);
  }
}

runSmokeTests();
