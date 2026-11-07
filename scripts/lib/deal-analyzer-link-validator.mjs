import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

export const EXPECTED_DEAL_ANALYZER_H1 = {
  en: 'Commercial Real Estate Investment Calculator & Deal Analyzer',
  zh: '商业地产综合尽调计算器 (Deal Analyzer)',
  es: 'Deal Analyzer: Suite Integral de Debida Diligencia Comercial',
  pt: 'Deal Analyzer: Suite Completa de Due Diligence Comercial',
};

export function verifyRelatedToolsHtml(htmlContent, loc) {
  const errors = [];
  const relatedSectionMatch = htmlContent.match(
    /<section[^>]*class="[^"]*bg-slate-100[^"]*"[^>]*>([\s\S]*?)<\/section>/
  );
  if (!relatedSectionMatch) {
    errors.push(`[${loc}] free-rental-property-calculator missing Related Tools <section class="bg-slate-100">`);
    return errors;
  }

  const relatedHtml = relatedSectionMatch[1];
  const correctHref = `href="/${loc}/tools/deal-analyzer/"`;
  const forbiddenHref1 = `href="/${loc}/calculators/deal-analyzer/"`;
  const forbiddenHref2 = `href="/calculators/deal-analyzer/"`;

  if (relatedHtml.includes(forbiddenHref1) || relatedHtml.includes(forbiddenHref2)) {
    errors.push(`[${loc}] Related Tools contains invalid 404 target: calculators/deal-analyzer/`);
  }
  if (!relatedHtml.includes(correctHref)) {
    errors.push(`[${loc}] Related Tools section missing valid link: ${correctHref}`);
  }
  return errors;
}

export function verifyHomepageHubHtml(homeHtml, loc) {
  const errors = [];
  const correctHubHref = `href="/${loc}/tools/deal-analyzer/"`;
  const forbiddenHubHref1 = `href="/${loc}/calculators/deal-analyzer/"`;
  const forbiddenHubHref2 = `href="/calculators/deal-analyzer/"`;

  if (homeHtml.includes(forbiddenHubHref1) || homeHtml.includes(forbiddenHubHref2)) {
    errors.push(`[${loc}] Homepage contains invalid 404 target: calculators/deal-analyzer/`);
  }
  if (!homeHtml.includes(correctHubHref)) {
    errors.push(`[${loc}] Homepage missing valid Deal Analyzer link: ${correctHubHref}`);
  }
  return errors;
}

export function verifyPostBuildDealAnalyzerArtifacts(
  outDir,
  locales = ['en', 'zh', 'es', 'pt'],
  homeLocales = ['es', 'pt']
) {
  const errors = [];
  const passed = [];

  for (const loc of locales) {
    const htmlFile = path.join(outDir, loc, 'calculators', 'free-rental-property-calculator', 'index.html');
    if (!fs.existsSync(htmlFile)) {
      errors.push(`Critical build artifact missing: out/${loc}/calculators/free-rental-property-calculator/index.html`);
      continue;
    }
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    const sectionErrors = verifyRelatedToolsHtml(htmlContent, loc);
    if (sectionErrors.length > 0) {
      errors.push(...sectionErrors);
    } else {
      passed.push(`[${loc}] Related Tools correctly links to /${loc}/tools/deal-analyzer/`);
    }
  }

  for (const loc of homeLocales) {
    const homeHtmlFile = path.join(outDir, loc, 'index.html');
    if (!fs.existsSync(homeHtmlFile)) {
      errors.push(`Critical homepage artifact missing: out/${loc}/index.html`);
      continue;
    }
    const homeHtml = fs.readFileSync(homeHtmlFile, 'utf8');
    const hubErrors = verifyHomepageHubHtml(homeHtml, loc);
    if (hubErrors.length > 0) {
      errors.push(...hubErrors);
    } else {
      passed.push(`[${loc}] Homepage correctly links Deal Analyzer to /${loc}/tools/deal-analyzer/`);
    }
  }

  return { errors, passed };
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'");
}

export function validateDealAnalyzerTargetPayload({
  locale,
  statusCode,
  html,
  h1Text,
  hasPriceInput,
  bodyText,
}) {
  const errors = [];
  const expectedH1 = EXPECTED_DEAL_ANALYZER_H1[locale];
  if (!expectedH1) {
    errors.push(`Unknown locale "${locale}" for Deal Analyzer verification`);
    return errors;
  }

  if (statusCode !== 200) {
    errors.push(`Destination HTML HTTP status is ${statusCode}, expected 200`);
  }

  const rawHtml = html || '';
  const visibleHtml = rawHtml
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const textToCheck =
    bodyText !== undefined
      ? bodyText
      : decodeHtmlEntities(visibleHtml.replace(/<[^>]+>/g, ' '));

  if (
    /<(?:html|div)\b[^>]*id="__next_error__"/i.test(rawHtml) ||
    textToCheck.includes('This page could not be found') ||
    textToCheck.includes('Page Not Found') ||
    /<h1>\s*404\b/i.test(visibleHtml)
  ) {
    errors.push('Destination rendered 404 or error shell!');
  }

  let resolvedH1 = h1Text;
  if (resolvedH1 === undefined && visibleHtml) {
    const h1Match = visibleHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    resolvedH1 = h1Match ? decodeHtmlEntities(h1Match[1].replace(/<[^>]+>/g, '').trim()) : '';
  }

  if (resolvedH1 !== expectedH1) {
    errors.push(`Deal Analyzer H1 mismatch: expected "${expectedH1}", got "${resolvedH1 || ''}"`);
  }

  const inputPresent =
    hasPriceInput !== undefined
      ? Boolean(hasPriceInput)
      : visibleHtml.includes('id="purchase-price-input"');

  if (!inputPresent) {
    errors.push('Destination missing required tool input marker #purchase-price-input');
  }

  return errors;
}

export async function fetchAndVerifyDealAnalyzerTarget(targetUrl, locale) {
  const response = await new Promise((resolve) => {
    http
      .get(targetUrl, { agent: false }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode || 0, body: data });
        });
      })
      .on('error', (err) => {
        resolve({ statusCode: 0, body: '', error: err.message });
      });
  });

  const errors = validateDealAnalyzerTargetPayload({
    locale,
    statusCode: response.statusCode,
    html: response.body,
  });

  return { errors, statusCode: response.statusCode, body: response.body };
}

export async function verifyDealAnalyzerClickNavigation(
  page,
  { route, locale, cardSelector, baseUrl }
) {
  const errors = [];

  const invalidLink = await page.$('a[href*="/calculators/deal-analyzer"]');
  if (invalidLink) {
    errors.push(`[${route}] Found forbidden link to "/calculators/deal-analyzer"!`);
  }

  const cardHandle = await page.$(cardSelector);
  if (!cardHandle) {
    errors.push(`[${route}] Missing expected Deal Analyzer link (${cardSelector})!`);
    return { errors };
  }

  const clickErrors = [];
  const pageErrorListener = (err) => clickErrors.push(err.message || String(err));
  const consoleListener = (msg) => {
    if (msg.type() === 'error') clickErrors.push(msg.text());
  };
  page.on('pageerror', pageErrorListener);
  page.on('console', consoleListener);

  try {
    await cardHandle.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center' }));
    await cardHandle.click();

    await page.waitForFunction(
      (expected) =>
        window.location.pathname === expected ||
        window.location.pathname === expected.replace(/\/$/, ''),
      { timeout: 7000 },
      `/${locale}/tools/deal-analyzer/`
    );

    await page.waitForSelector('#purchase-price-input', { visible: true, timeout: 7000 });

    const domState = await page.evaluate(() => ({
      h1Text: document.querySelector('h1')?.textContent?.trim() || '',
      hasPriceInput: Boolean(document.querySelector('#purchase-price-input')),
      bodyText: document.body?.innerText || '',
    }));

    const targetUrl = `${baseUrl}/${locale}/tools/deal-analyzer/`;
    const httpCheck = await fetchAndVerifyDealAnalyzerTarget(targetUrl, locale);

    const domErrors = validateDealAnalyzerTargetPayload({
      locale,
      statusCode: httpCheck.statusCode,
      h1Text: domState.h1Text,
      hasPriceInput: domState.hasPriceInput,
      bodyText: domState.bodyText,
    });

    for (const errMsg of [...new Set([...domErrors, ...httpCheck.errors])]) {
      errors.push(`[${route}] ${errMsg}`);
    }
  } catch (e) {
    errors.push(
      `[${route}] Browser click navigation failed to reach "/${locale}/tools/deal-analyzer/": current URL is "${page.url()}". Error: ${e.message}`
    );
  } finally {
    page.off('pageerror', pageErrorListener);
    page.off('console', consoleListener);
    if (clickErrors.length > 0) {
      errors.push(`[${route}] Post-click runtime errors: ${JSON.stringify(clickErrors)}`);
    }
  }

  return { errors };
}

// CLI Runner Entrypoint for direct subprocess execution and fixture verification
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
      const idx = arg.indexOf('=');
      if (arg.startsWith('--') && idx !== -1) {
        return [arg.slice(2, idx), arg.slice(idx + 1)];
      }
      return [arg.replace(/^--/, ''), 'true'];
    })
  );

  (async () => {
    if (args.mode === 'artifacts') {
      const outDir = args['out-dir'];
      const locales = args.locales ? args.locales.split(',').filter(Boolean) : ['en', 'zh', 'es', 'pt'];
      const homeLocales = args['home-locales'] !== undefined
        ? args['home-locales'].split(',').filter(Boolean)
        : ['es', 'pt'];

      const { errors, passed } = verifyPostBuildDealAnalyzerArtifacts(outDir, locales, homeLocales);
      for (const msg of passed) console.log(`✅ ${msg}`);
      for (const err of errors) console.error(`❌ ${err}`);
      process.exit(errors.length > 0 ? 1 : 0);
    } else if (args.mode === 'target') {
      const targetUrl = args.url;
      const locale = args.locale || 'en';
      const { errors } = await fetchAndVerifyDealAnalyzerTarget(targetUrl, locale);
      if (errors.length === 0) {
        console.log(`✅ Target verified: ${targetUrl} (${locale})`);
        process.exit(0);
      } else {
        for (const err of errors) console.error(`❌ ${err}`);
        process.exit(1);
      }
    } else {
      console.error('Usage: node deal-analyzer-link-validator.mjs --mode=artifacts|target ...');
      process.exit(2);
    }
  })();
}
