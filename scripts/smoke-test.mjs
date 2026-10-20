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
import {
  setupAnalyticsBlocker
} from './lib/puppeteer-analytics-blocker.mjs';

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
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
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
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('http://localhost:3460', [
    'clipboard-read',
    'clipboard-write',
    'clipboard-sanitized-write'
  ]);
  const page = await browser.newPage();
  const blocker = await setupAnalyticsBlocker(page, { silent: false });

  const accumulatedErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      if (!blocker.isExpectedBlockError(msg)) {
        const errorInfo = {
          type: 'console_error',
          text: msg.text(),
          location: msg.location(),
          url: page.url()
        };
        accumulatedErrors.push(errorInfo);
        console.error(`❌ [Smoke Test ConsoleError] on ${page.url()}:`, errorInfo.text);
      }
    }
  });
  page.on('pageerror', err => {
    // Uncaught runtime exceptions must NEVER pass through analytics error filtering
    const errorInfo = {
      type: 'pageerror',
      message: err.message || String(err),
      stack: err.stack,
      url: page.url()
    };
    accumulatedErrors.push(errorInfo);
    console.error(`❌ [Smoke Test PageError] on ${page.url()}:`, errorInfo.message);
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
    const errorsBeforeEn = accumulatedErrors.length;
    await page.goto('http://localhost:3460/en/tools/deal-analyzer/', { waitUntil: 'networkidle0' });
    const enErrors = accumulatedErrors.length - errorsBeforeEn;
    console.log('EN Console Errors:', enErrors);

    // Hard load Chinese
    const errorsBeforeZh = accumulatedErrors.length;
    await page.goto('http://localhost:3460/zh/tools/deal-analyzer/', { waitUntil: 'networkidle0' });
    const zhErrors = accumulatedErrors.length - errorsBeforeZh;
    console.log('ZH Console Errors:', zhErrors);

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
    await checkOverflow('http://localhost:3460/zh/guides/cap-rate-benchmarks-by-city/');
    await checkOverflow('http://localhost:3460/en/guides/cap-rate-benchmarks-by-city/');






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

    console.log('\n--- 6b. Testing Visible Case Study Scoped Binding & Metrics ---');
    const assertVisibleWorkedExample = async (pageUrl) => {
        await page.goto(pageUrl, { waitUntil: 'networkidle0' });

        // 1. Target the exact worked example container
        const exampleSectionExists = await page.$('[data-testid="worked-example-section"]');
        if (!exampleSectionExists) {
            throw new Error(`Worked example section [data-testid="worked-example-section"] not found on ${pageUrl}`);
        }

        const step2Text = await page.$eval('[data-testid="worked-example-step-2"]', el => el.innerText.trim());
        const step3Text = await page.$eval('[data-testid="worked-example-step-3"]', el => el.innerText.trim());

        const isZh = pageUrl.includes('/zh/');

        // --- Step 2 (Base Case) Label-to-Value Binding Checks ---
        // Verify BER binding to 82.13%
        const berRegex = isZh
            ? /收支平衡比率[^\d]*82\.13%/
            : /Break-Even Ratio[^\d]*82\.13%/i;
        if (!berRegex.test(step2Text)) {
            throw new Error(`Base BER 82.13% not correctly bound to label in Step 2 on ${pageUrl}. Got: "${step2Text}"`);
        }

        // Verify BEO binding to 78.02%
        const beoRegex = isZh
            ? /(Break-Even Occupancy|盈亏入住率)[^\d]*78\.02%/
            : /Break-Even Occupancy[^\d]*78\.02%/i;
        if (!beoRegex.test(step2Text)) {
            throw new Error(`Base BEO 78.02% not correctly bound to label in Step 2 on ${pageUrl}. Got: "${step2Text}"`);
        }

        // Assert 78.02% is NEVER labeled as Break-Even Ratio in Step 2
        const badBer78Regex = isZh
            ? /收支平衡比率[^，。.)]*78\.02%/
            : /Break-Even Ratio[^.)]*is 78\.02%/i;
        if (badBer78Regex.test(step2Text)) {
            throw new Error(`78.02% was erroneously labeled as Break-Even Ratio in Step 2 on ${pageUrl}`);
        }

        // Verify DSCR 1.34x and Cash-on-Cash 7.55% in Step 2
        if (!/1\.34x/.test(step2Text)) {
            throw new Error(`Base DSCR 1.34x not found in Step 2 on ${pageUrl}`);
        }
        if (!/7\.55%/.test(step2Text)) {
            throw new Error(`Base Cash-on-Cash 7.55% not found in Step 2 on ${pageUrl}`);
        }
        if (!/\$170,152/.test(step2Text)) {
            throw new Error(`Base Annual Debt Service $170,152 not found in Step 2 on ${pageUrl}`);
        }

        // --- Step 3 (Stress Case) Label-to-Value Binding Checks ---
        // Stress debt service must be $186,226 (and not $186,225)
        if (!/\$186,226/.test(step3Text)) {
            throw new Error(`Missing stress debt service "$186,226" in Step 3 on ${pageUrl}`);
        }
        if (step3Text.includes('$186,225')) {
            throw new Error(`Outdated debt service "$186,225" found in Step 3 on ${pageUrl}`);
        }

        // Verify Stress BER binding to 92.01%
        const stressBerRegex = isZh
            ? /(收支平衡比率 \(BER\)|收支平衡比率|BER)[^\d]*92\.01%/
            : /Break-Even Ratio[^\d]*92\.01%/i;
        if (!stressBerRegex.test(step3Text)) {
            throw new Error(`Stress BER 92.01% not correctly bound to label in Step 3 on ${pageUrl}. Got: "${step3Text}"`);
        }

        // Verify Stress BEO binding to 82.81%
        const stressBeoRegex = isZh
            ? /(盈亏入住率 BEO|盈亏入住率|BEO)[^\d]*82\.81%/
            : /(Break-Even Occupancy|BEO)[^\d]*82\.81%/i;
        if (!stressBeoRegex.test(step3Text)) {
            throw new Error(`Stress BEO 82.81% not correctly bound to label in Step 3 on ${pageUrl}. Got: "${step3Text}"`);
        }

        // Assert 82.81% is NEVER labeled as Break-Even Ratio in Step 3
        const badBer82Regex = isZh
            ? /收支平衡比率[^，。.)]*82\.81%/
            : /Break-Even Ratio[^.)]*rises to [a-z ]*82\.81%/i;
        if (badBer82Regex.test(step3Text)) {
            throw new Error(`82.81% was erroneously labeled as Break-Even Ratio in Step 3 on ${pageUrl}`);
        }

        // Verify Stress DSCR 1.13x and Cash-on-Cash 3.20%
        if (!/1\.13x/.test(step3Text)) {
            throw new Error(`Stress DSCR 1.13x not found in Step 3 on ${pageUrl}`);
        }
        if (!/3\.20%/.test(step3Text)) {
            throw new Error(`Stress Cash-on-Cash 3.20% not found in Step 3 on ${pageUrl}`);
        }

        // Verify conditional default language in Step 3
        if (isZh) {
            if (!step3Text.includes('是否构成违约取决于具体贷款合同')) {
                throw new Error(`Step 3 on ${pageUrl} lacks conditional default covenant clarification`);
            }
        } else {
            if (!step3Text.includes('depending on the specific loan agreement covenants')) {
                throw new Error(`Step 3 on ${pageUrl} lacks conditional default covenant clarification`);
            }
        }

        console.log(`✅ ${pageUrl} passed scoped case study block & metric binding assertions.`);
    };

    await assertVisibleWorkedExample('http://localhost:3460/en/tools/deal-analyzer/');
    await assertVisibleWorkedExample('http://localhost:3460/zh/tools/deal-analyzer/');

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

    console.log('\n--- 8. Testing Cap Rate Guide Benchmarks & Health Heuristic Text ---');
    const verifyCapRateGuideAndHealth = async () => {
      // Check EN Cap Rate Guide
      await page.goto('http://localhost:3460/en/guides/cap-rate-benchmarks-by-city/', { waitUntil: 'networkidle0' });
      const enGuideText = await page.evaluate(() => document.body.innerText);
      if (enGuideText.includes('~8.4% (national average)') || enGuideText.includes('~8.60%')) {
        throw new Error('EN Cap Rate Guide still contains pseudo-exact national average decimal numbers');
      }
      if (enGuideText.includes('this guide will be updated accordingly')) {
        throw new Error('EN Cap Rate Guide still promises automated synchronization with future surveys');
      }
      if (!enGuideText.includes('Illustrative Benchmark Range')) {
        throw new Error('EN Cap Rate Guide lacks "Illustrative Benchmark Range" table header');
      }

      // Check ZH Cap Rate Guide
      await page.goto('http://localhost:3460/zh/guides/cap-rate-benchmarks-by-city/', { waitUntil: 'networkidle0' });
      const zhGuideText = await page.evaluate(() => document.body.innerText);
      if (zhGuideText.includes('数据基准：2026年全美主流机构交易调研发布')) {
        throw new Error('ZH Cap Rate Guide still claims official institutional survey release in table subtitle');
      }
      if (zhGuideText.includes('约8.4%（全美平均）') || zhGuideText.includes('约8.60%')) {
        throw new Error('ZH Cap Rate Guide still contains pseudo-exact national average decimal numbers');
      }
      if (zhGuideText.includes('这份指南也会跟着更新')) {
        throw new Error('ZH Cap Rate Guide still promises automated synchronization with future surveys');
      }
      if (!zhGuideText.includes('方向性参考区间（教学测算示意）')) {
        throw new Error('ZH Cap Rate Guide lacks "方向性参考区间（教学测算示意）" table header');
      }

      // Check Deal Analyzer Health Heuristic
      await page.goto('http://localhost:3460/en/tools/deal-analyzer/', { waitUntil: 'networkidle0' });
      const enAnalyzerText = await page.evaluate(() => document.body.innerText);
      if (!enAnalyzerText.includes('Illustrative Rule: Stable Cushion')) {
        throw new Error('EN Deal Analyzer does not show "Illustrative Rule: Stable Cushion" health title');
      }
      if (enAnalyzerText.includes('within standard lender thresholds')) {
        throw new Error('EN Deal Analyzer improperly claims "standard lender thresholds" for internal heuristic');
      }

      await page.goto('http://localhost:3460/zh/tools/deal-analyzer/', { waitUntil: 'networkidle0' });
      const zhAnalyzerText = await page.evaluate(() => document.body.innerText);
      if (!zhAnalyzerText.includes('示例评估：稳健区间')) {
        throw new Error('ZH Deal Analyzer does not show "示例评估：稳健区间" health title');
      }

      console.log('✅ Cap Rate Guide educational benchmarks & Deal Analyzer illustrative rules verified on live DOM.');
    };

    await verifyCapRateGuideAndHealth();


    // Test Viewports: 320, 375, 390, 1440 across all 4 locales (including bounding-box non-overlap)
    console.log('\n--- 9. Testing Viewports (320, 375, 390, 1440) & Header Non-Overlap Across All 4 Locales ---');
    const viewports = [320, 375, 390, 1440];
    const locales = ['en', 'zh', 'es', 'pt'];
    for (const vp of viewports) {
      await page.setViewport({ width: vp, height: 812 });
      for (const loc of locales) {
        await page.goto(`http://localhost:3460/${loc}/`, { waitUntil: 'networkidle0' });
        const navMetrics = await page.evaluate(() => {
          const brandLink = document.querySelector('header a');
          const langBtn = document.querySelector('header button[aria-controls="languages-navigation"]');
          const menuBtn = document.querySelector('header button[aria-controls="mobile-navigation"]');
          const brandRect = brandLink?.getBoundingClientRect();
          const langRect = langBtn?.getBoundingClientRect();
          const overlapPx = brandRect && langRect ? Math.max(0, brandRect.right - langRect.left) : 0;
          return {
            scrollWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
            overlapPx,
            langAria: langBtn?.getAttribute('aria-label') || '',
            menuAria: menuBtn?.getAttribute('aria-label') || '',
          };
        });
        if (navMetrics.scrollWidth > navMetrics.viewportWidth) {
          throw new Error(`Horizontal overflow at ${vp}px on /${loc}/: scrollWidth=${navMetrics.scrollWidth}`);
        }
        if (navMetrics.overlapPx > 0) {
          throw new Error(`Brand and language button overlap (${navMetrics.overlapPx}px) at ${vp}px on /${loc}/`);
        }
        if (!navMetrics.langAria || !navMetrics.menuAria) {
          throw new Error(`Missing aria-label on header buttons on /${loc}/`);
        }
      }
      console.log(`✅ Viewport ${vp}px passed across en, zh, es, pt with 0px header overlap.`);
    }

    console.log('\n--- 10. Testing P1/P2 Remediations (DSCR Disabled Form, Share Hash Round-Trip, Load Example, ES/PT Localization) ---');
    await page.setViewport({ width: 1280, height: 900 });

    // 10a. DSCR disabled form & input labels
    await page.goto('http://localhost:3460/en/calculators/dscr/', { waitUntil: 'networkidle0' });
    const dscrCheck = await page.evaluate(() => {
      const disabledNotice = document.querySelector('[data-testid="dscr-lender-service-disabled"]');
      const emailInputs = document.querySelectorAll('input[type="email"]');
      const noiInput = document.getElementById('dscr-noi-input');
      const noiLabel = document.querySelector('label[for="dscr-noi-input"]');
      return {
        hasDisabledNotice: !!disabledNotice,
        emailCount: emailInputs.length,
        hasExplicitLabel: !!noiInput && !!noiLabel,
      };
    });
    if (!dscrCheck.hasDisabledNotice || dscrCheck.emailCount > 0 || !dscrCheck.hasExplicitLabel) {
      throw new Error(`DSCR remediation check failed: ${JSON.stringify(dscrCheck)}`);
    }
    console.log('✅ DSCR calculator shows disabled lender notice, 0 email inputs, and explicit input labels.');

    // 10b. Deal Analyzer Real User Flow: Modify form -> Click share button -> Read copied URL from clipboard -> Open in isolated context -> Assert inputs & Base/Stress match
    await page.goto('http://localhost:3460/en/tools/deal-analyzer/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 200));

    // Clear and set custom form parameters (throws if element not found)
    await page.evaluate(() => {
      const setInput = (id, val) => {
        const el = document.getElementById(id);
        if (!el) {
          throw new Error(`setInput failed: element with id "${id}" not found`);
        }
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (setter) {
          setter.call(el, val);
        } else {
          el.value = val;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      setInput('purchase-price-input', '4000000');
      setInput('gpi-input', '500000');
      setInput('vacancy-input', '6');
      setInput('opex-input', '170000');
      setInput('downpayment-input', '30');
      setInput('rate-input', '6.25');
    });
    await new Promise(r => setTimeout(r, 300));

    // Explicitly assert original page now has down payment 30% and interest rate 6.25%
    const origDp = await page.$eval('#downpayment-input', el => el.value);
    const origRate = await page.$eval('#rate-input', el => el.value);
    if (origDp !== '30' || origRate !== '6.25') {
      throw new Error(`Original page inputs not updated: downpayment=${origDp} (expected 30), rate=${origRate} (expected 6.25)`);
    }

    // Helper to toggle stress test panel
    const toggleStressPanel = async (targetPage) => {
      await targetPage.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const stressBtn = btns.find(b =>
          b.innerText.includes('Stress Test') ||
          b.innerText.includes('压力测试') ||
          b.innerText.includes('Prueba de Estrés') ||
          b.innerText.includes('Teste de Estresse')
        );
        if (stressBtn) stressBtn.click();
      });
      await new Promise(r => setTimeout(r, 200));
    };

    // Toggle stress test panel on so stress metrics are mounted in DOM
    await toggleStressPanel(page);

    // Read on-screen calculated values
    const origBaseNoi = await page.$eval('[data-testid="tool-base-noi"]', el => el.textContent.trim());
    const origBaseCap = await page.$eval('[data-testid="tool-base-cap-rate"]', el => el.textContent.trim());
    const origStressDscr = await page.$eval('[data-testid="tool-stress-dscr"]', el => el.textContent.trim());

    // Click the share button to copy to clipboard
    await page.click('[data-testid="share-deal-btn"]');
    await new Promise(r => setTimeout(r, 200));

    // Read the copied URL directly from the real system clipboard
    const copiedUrl = await page.evaluate(() => navigator.clipboard.readText());
    if (
      !copiedUrl ||
      !copiedUrl.includes('#v=1') ||
      !copiedUrl.includes('pp=4000000') ||
      !copiedUrl.includes('gpi=500000') ||
      !copiedUrl.includes('dp=30') ||
      !copiedUrl.includes('ir=6.25')
    ) {
      throw new Error(`Clipboard share link does not contain serialized parameters: "${copiedUrl}"`);
    }

    // Open in a completely isolated browser context (createBrowserContext)
    const isolatedContext = await browser.createBrowserContext();
    const sharedNewPage = await isolatedContext.newPage();
    await setupAnalyticsBlocker(sharedNewPage, { silent: true });
    await sharedNewPage.goto(copiedUrl, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 300));

    // Assert inputs in the new page were restored accurately
    const restoredPp = await sharedNewPage.$eval('#purchase-price-input', el => el.value);
    const restoredGpi = await sharedNewPage.$eval('#gpi-input', el => el.value);
    const restoredVac = await sharedNewPage.$eval('#vacancy-input', el => el.value);
    const restoredOpex = await sharedNewPage.$eval('#opex-input', el => el.value);
    const restoredDp = await sharedNewPage.$eval('#downpayment-input', el => el.value);
    const restoredRate = await sharedNewPage.$eval('#rate-input', el => el.value);

    if (
      restoredPp !== '4000000' ||
      restoredGpi !== '500000' ||
      restoredVac !== '6' ||
      restoredOpex !== '170000' ||
      restoredDp !== '30' ||
      restoredRate !== '6.25'
    ) {
      throw new Error(`Restored inputs did not match: PP=${restoredPp}, GPI=${restoredGpi}, VAC=${restoredVac}, OPEX=${restoredOpex}, DP=${restoredDp}, RATE=${restoredRate}`);
    }

    // Toggle stress test panel on the shared new page as well
    await toggleStressPanel(sharedNewPage);

    // Assert Base & Stress metrics in the new page match the original modified state
    const newBaseNoi = await sharedNewPage.$eval('[data-testid="tool-base-noi"]', el => el.textContent.trim());
    const newBaseCap = await sharedNewPage.$eval('[data-testid="tool-base-cap-rate"]', el => el.textContent.trim());
    const newStressDscr = await sharedNewPage.$eval('[data-testid="tool-stress-dscr"]', el => el.textContent.trim());

    if (newBaseNoi !== origBaseNoi || newBaseCap !== origBaseCap || newStressDscr !== origStressDscr) {
      throw new Error(`Restored metrics did not match: NOI (${newBaseNoi} vs ${origBaseNoi}), Cap (${newBaseCap} vs ${origBaseCap}), Stress DSCR (${newStressDscr} vs ${origStressDscr})`);
    }
    await sharedNewPage.close();
    await isolatedContext.close();
    console.log(`✅ Deal Analyzer end-to-end share flow passed: form edited -> copied to clipboard -> reopened in isolated context -> inputs & Base/Stress verified (${newBaseNoi}, ${newBaseCap}, ${newStressDscr}).`);

    // Malformed hash fallback
    await page.goto('http://localhost:3460/en/tools/deal-analyzer/#v=1&pp=-500&vac=999&ir=NaN', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 300));
    const fallbackNoi = await page.$eval('[data-testid="tool-base-noi"]', el => el.textContent.trim());
    if (fallbackNoi !== '$227,200') {
      throw new Error(`Malformed hash did not safely fall back to default NOI ($227,200), got ${fallbackNoi}`);
    }
    console.log('✅ Deal Analyzer malformed hash safely fell back to default inputs.');

    // 10c. Cap Rate entry links & Load Page Example button (modify inputs first -> click load example -> assert inputs and result card update)
    await page.goto('http://localhost:3460/en/calculators/cap-rate/', { waitUntil: 'networkidle0' });
    const hasPropLinks = await page.$('[data-testid="property-type-cap-rate-links"]');
    if (!hasPropLinks) {
      throw new Error('Missing property-type-cap-rate-links on /en/calculators/cap-rate/');
    }

    await page.goto('http://localhost:3460/en/calculators/multifamily-cap-rate/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 200));

    // First intentionally alter the inputs to different values
    await page.evaluate(() => {
      const setInput = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
          if (setter) {
            setter.call(el, val);
          } else {
            el.value = val;
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };
      setInput('caprate-price-input', '1000000');
      setInput('caprate-noi-input', '100000');
    });
    await new Promise(r => setTimeout(r, 200));

    const intermediateCap = await page.$eval('[data-testid="cap-rate-result"]', el => el.textContent.trim());
    if (intermediateCap !== '10.00%') {
      throw new Error(`Expected intermediate Cap Rate 10.00%, got ${intermediateCap}`);
    }

    // Now click the "Load Page Example" button
    await page.click('[data-testid="load-page-example-btn"]');
    await new Promise(r => setTimeout(r, 200));

    // Verify input fields updated to the Multifamily example values ($3,500,000 / $218,750)
    const loadedPrice = await page.$eval('#caprate-price-input', el => el.value);
    const loadedNoi = await page.$eval('#caprate-noi-input', el => el.value);
    const loadedCap = await page.$eval('[data-testid="cap-rate-result"]', el => el.textContent.trim());

    if (loadedPrice !== '3500000' || loadedNoi !== '218750' || loadedCap !== '6.25%') {
      throw new Error(`Load Page Example failed to update inputs/result: Price=${loadedPrice} (expected 3500000), NOI=${loadedNoi} (expected 218750), Cap=${loadedCap} (expected 6.25%)`);
    }
    console.log('✅ Cap Rate property-type entry cards and Load Page Example button verified with input & result card assertions ($3,500,000 / $218,750 -> 6.25%).');

    // 10d. Deal Analyzer PDF Printable Card & Link URL in All 4 Locales (No clipping, proper href)
    for (const loc of ['en', 'zh', 'es', 'pt']) {
      await page.goto(`http://localhost:3460/${loc}/tools/deal-analyzer/`, { waitUntil: 'networkidle0' });
      const pdfLinkInfo = await page.evaluate(() => {
        const link = document.querySelector('#pdf-footer-tool-link');
        const card = link ? (link.closest('#deal-analyzer-pdf-template') || link.closest('[data-testid="deal-analyzer-pdf-template"]') || link.closest('[style*="800px"]')) : null;
        return {
          hasLink: !!link,
          href: link ? link.getAttribute('href') : null,
          cardWidth: card ? card.offsetWidth : 0,
        };
      });
      if (!pdfLinkInfo.hasLink) {
        throw new Error(`Missing #pdf-footer-tool-link in PDF template on /${loc}/tools/deal-analyzer/`);
      }
      const expectedHref = `https://crecalculators.com/${loc}/tools/deal-analyzer/`;
      if (pdfLinkInfo.href !== expectedHref) {
        throw new Error(`PDF footer link href mismatch on /${loc}/: expected "${expectedHref}", got "${pdfLinkInfo.href}"`);
      }
      if (pdfLinkInfo.cardWidth !== 800) {
        throw new Error(`PDF template card width on /${loc}/ is ${pdfLinkInfo.cardWidth} (expected 800)`);
      }
    }
    console.log('✅ Deal Analyzer PDF template card & localized links verified across all 4 locales (en/zh/es/pt).');

    // 10e. ES/PT Localization Check on previously English-fallback pages
    const esPtChecks = [
      { url: 'http://localhost:3460/es/calculators/multifamily-cap-rate/', mustContain: 'Calculadora de Cap Rate Multifamiliar', mustNotContain: 'How to Underwrite' },
      { url: 'http://localhost:3460/pt/calculators/multifamily-cap-rate/', mustContain: 'Calculadora de Cap Rate Multifamiliar', mustNotContain: 'How to Underwrite' },
      { url: 'http://localhost:3460/es/guides/cap-rate-benchmarks-by-city/austin-tx-cap-rates/', mustContain: 'Motores Económicos Regionales', mustNotContain: 'Core Regional Economic Drivers' },
      { url: 'http://localhost:3460/pt/guides/cap-rate-benchmarks-by-city/austin-tx-cap-rates/', mustContain: 'Motores Econômicos Regionais', mustNotContain: 'Core Regional Economic Drivers' },
      { url: 'http://localhost:3460/es/privacy/', mustContain: 'Política de Privacidad', mustNotContain: 'Core Commitment: 100% Client-Side' },
      { url: 'http://localhost:3460/pt/privacy/', mustContain: 'Política de Privacidade', mustNotContain: 'Core Commitment: 100% Client-Side' },
      { url: 'http://localhost:3460/es/terms/', mustContain: 'Términos de Uso', mustNotContain: 'Important Financial & Legal Disclaimer' },
      { url: 'http://localhost:3460/pt/terms/', mustContain: 'Termos de Uso', mustNotContain: 'Important Financial & Legal Disclaimer' },
      { url: 'http://localhost:3460/es/editorial/', mustContain: 'Estándares de Evaluación y Fórmulas de Cálculo', mustNotContain: 'Core Formulas & Financial Definitions' },
      { url: 'http://localhost:3460/pt/editorial/', mustContain: 'Padrões de Avaliação e Fórmulas de Cálculo', mustNotContain: 'Core Formulas & Financial Definitions' },
    ];
    for (const checkItem of esPtChecks) {
      await page.goto(checkItem.url, { waitUntil: 'networkidle0' });
      const bodyTxt = await page.evaluate(() => document.body.textContent || '');
      if (!bodyTxt.includes(checkItem.mustContain)) {
        throw new Error(`Missing localized string "${checkItem.mustContain}" on ${checkItem.url}`);
      }
      if (bodyTxt.includes(checkItem.mustNotContain)) {
        throw new Error(`Found unlocalized English fallback "${checkItem.mustNotContain}" on ${checkItem.url}`);
      }
    }
    console.log('✅ All ES/PT property cap rate, city cap rate, privacy, terms, and editorial pages verified localized.');

    if (accumulatedErrors.length > 0) {
      console.error(`\n❌ Smoke tests finished with ${accumulatedErrors.length} real error(s):`);
      for (const err of accumulatedErrors) {
        console.error(`  - [${err.type}] ${err.text || err.message} (at ${err.url || 'unknown'})`);
      }
      throw new Error(`Smoke tests failed due to ${accumulatedErrors.length} runtime/console error(s).`);
    }

    console.log('\n🎉 ALL SMOKE TESTS COMPLETED WITH 0 RUNTIME/CONSOLE ERRORS!');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
    if (accumulatedErrors.length > 0 || process.exitCode) {
      process.exit(1);
    }
    process.exit(0);
  }
}

runSmokeTests();
