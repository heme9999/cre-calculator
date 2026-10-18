/**
 * scripts/verify-analytics-beacon.mjs
 *
 * Standalone explicit mode to verify that Cloudflare Web Analytics reporting is working.
 *
 * NOTE: This script intentionally allows Cloudflare Beacon and /cdn-cgi/rum to fire
 * in order to verify live tracking functionality. It outputs the exact test timestamp
 * and request details so that analytics administrators can audit this intentional visit.
 *
 * Verification Rules:
 * 1. Only passes if a confirmed Beacon GET request succeeds (HTTP 200) AND its corresponding
 *    RUM POST request receives a successful response (HTTP 200 or 204).
 * 2. GET /cdn-cgi/rum, beacon loaded without RUM reporting, or failed reporting MUST exit non-zero.
 * 3. Requests and responses are strictly linked to the same request object.
 */

import puppeteer from 'puppeteer-core';
import { isCloudflareAnalyticsRequest } from './lib/puppeteer-analytics-blocker.mjs';

const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TARGET_URL = process.env.TEST_TARGET_URL || process.argv[2] || 'https://crecalculators.com/en/';

export async function verifyAnalyticsReporting(targetUrl = TARGET_URL, options = {}) {
  const testStartTime = new Date();
  const parsedTarget = new URL(targetUrl);
  const allowedOrigins = [parsedTarget.origin, parsedTarget.hostname, ...(options.allowedOrigins || [])];
  const waitMs = options.waitMs ?? 3000;
  const executablePath = options.executablePath || CHROME_PATH;

  console.log('================================================================');
  console.log('📡 EXPLICIT CLOUDFLARE WEB ANALYTICS VERIFICATION MODE');
  console.log('================================================================');
  console.log(`Target URL:      ${targetUrl}`);
  console.log(`Test Time (UTC): ${testStartTime.toISOString()}`);
  console.log(`Test Time (Loc): ${testStartTime.toLocaleString()}`);
  console.log(`Mode:            EXPLICIT AUDIT (Beacon & RUM transmission ALLOWED)`);
  console.log('----------------------------------------------------------------\n');

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Map each HTTPRequest instance to its tracked metadata & response
  const trackedRequests = new Map();

  await page.setRequestInterception(true);

  page.on('request', (req) => {
    const url = req.url();
    if (isCloudflareAnalyticsRequest(url, allowedOrigins)) {
      let isRum = false;
      try {
        isRum = new URL(url).pathname === '/cdn-cgi/rum';
      } catch {
        isRum = false;
      }
      const type = isRum ? 'RUM Report' : 'Beacon Script';
      trackedRequests.set(req, {
        req,
        url,
        method: req.method(),
        type,
        requestTime: new Date().toISOString(),
        response: null,
        failure: null,
      });
      console.log(`[OUTGOING] ${type} (${req.method()}) -> ${url}`);

      // Optional local mock response for beacon during isolated testing
      if (options.mockResponses && !isRum) {
        req.respond({
          status: 200,
          contentType: 'application/javascript',
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: '/* mock beacon */',
        });
        return;
      }
    }
    req.continue();
  });

  page.on('response', (res) => {
    const req = res.request();
    const tracked = trackedRequests.get(req);
    if (tracked) {
      tracked.response = {
        status: res.status(),
        statusText: res.statusText(),
        responseTime: new Date().toISOString(),
      };
      console.log(`[RESPONSE] ${tracked.type} HTTP ${res.status()} <- ${tracked.url}`);
    }
  });

  page.on('requestfailed', (req) => {
    const tracked = trackedRequests.get(req);
    if (tracked && !tracked.response) {
      tracked.failure = req.failure()?.errorText || 'Unknown failure';
      console.error(`[REQUEST FAILED] ${tracked.type} failed (${tracked.failure}) <- ${tracked.url}`);
    }
  });

  try {
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Allow sufficient time for the deferred beacon script to execute and send POST /cdn-cgi/rum
    await new Promise((r) => setTimeout(r, waitMs));

    console.log('\n================================================================');
    console.log('📊 AUDIT SUMMARY & VERIFICATION RESULTS');
    console.log('================================================================');

    const transactions = Array.from(trackedRequests.values());
    const beaconTransactions = transactions.filter((t) => t.type === 'Beacon Script');
    const rumTransactions = transactions.filter((t) => t.type === 'RUM Report');

    // Strict Pairing & Validation
    const confirmedBeacon = beaconTransactions.find(
      (t) => t.method === 'GET' && t.response && t.response.status === 200
    );

    const nonPostRum = rumTransactions.find((t) => t.method !== 'POST');
    const confirmedRum = rumTransactions.find(
      (t) => t.method === 'POST' && t.response && (t.response.status === 200 || t.response.status === 204)
    );

    console.log(`1. Cloudflare Beacon Script:`);
    console.log(`   - Transactions tracked: ${beaconTransactions.length}`);
    if (confirmedBeacon) {
      console.log(`   - Confirmed GET 200:    ✅ (${confirmedBeacon.url})`);
    } else {
      console.log(`   - Confirmed GET 200:    ❌ Missing or non-200 status`);
    }

    console.log(`2. Cloudflare /cdn-cgi/rum Reporting:`);
    console.log(`   - Transactions tracked: ${rumTransactions.length}`);
    if (nonPostRum) {
      console.log(`   - Method check:         ❌ Invalid method detected (${nonPostRum.method} ${nonPostRum.url})`);
    } else if (rumTransactions.length > 0) {
      console.log(`   - Method check:         ✅ Strictly POST`);
    } else {
      console.log(`   - Method check:         ❌ No RUM requests detected`);
    }

    if (confirmedRum) {
      console.log(`   - Confirmed POST res:   ✅ HTTP ${confirmedRum.response.status}`);
    } else {
      console.log(`   - Confirmed POST res:   ❌ Missing successful 200/204 response`);
    }

    console.log('----------------------------------------------------------------');
    console.log(`AUDIT LOG RECORD:`);
    console.log(`  Timestamp UTC:   ${testStartTime.toISOString()}`);
    console.log(`  Timestamp Local: ${testStartTime.toLocaleString()}`);
    console.log(`  Target Host:     ${parsedTarget.hostname}`);
    console.log(`  Events Logged:   ${transactions.length}`);
    const passed = !!confirmedBeacon && !nonPostRum && !!confirmedRum;
    console.log(`  Status:          ${passed ? 'VERIFIED (Working normally)' : 'FAILED / INCOMPLETE'}`);
    console.log('================================================================\n');

    if (!confirmedBeacon) {
      throw new Error(`Cloudflare Beacon script request failed or did not return HTTP 200.`);
    }

    if (nonPostRum) {
      throw new Error(`Invalid /cdn-cgi/rum request method: expected POST, found ${nonPostRum.method}.`);
    }

    if (rumTransactions.length === 0) {
      throw new Error(`Beacon script loaded, but no /cdn-cgi/rum report was issued.`);
    }

    if (!confirmedRum) {
      throw new Error(`Cloudflare /cdn-cgi/rum POST report failed or did not receive HTTP 200/204.`);
    }

    console.log('✅ Cloudflare Web Analytics verified: Beacon fetched and RUM POST successfully recorded.');
    return {
      success: true,
      confirmedBeacon,
      confirmedRum,
      timestamp: testStartTime.toISOString(),
    };
  } finally {
    await browser.close();
  }
}

// Only auto-run if executed directly as entrypoint CLI
if (process.argv[1] && process.argv[1].endsWith('verify-analytics-beacon.mjs')) {
  verifyAnalyticsReporting().catch((err) => {
    console.error('❌ Error verifying analytics reporting:', err.message);
    process.exit(1);
  });
}
