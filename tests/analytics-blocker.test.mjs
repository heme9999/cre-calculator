import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import puppeteer from 'puppeteer-core';
import {
  isCloudflareAnalyticsRequest,
  isExpectedAnalyticsBlockError,
  filterRealErrors,
  setupAnalyticsBlocker,
} from '../scripts/lib/puppeteer-analytics-blocker.mjs';
import { verifyAnalyticsReporting } from '../scripts/verify-analytics-beacon.mjs';

const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

test('isCloudflareAnalyticsRequest strict matching rules', () => {
  // 1. Beacon script: ONLY official host static.cloudflareinsights.com and /beacon.min.js path
  assert.equal(
    isCloudflareAnalyticsRequest('https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092'),
    true,
    'Official beacon with version hash must match'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('https://static.cloudflareinsights.com/beacon.min.js'),
    true,
    'Official beacon root path must match'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('https://static.cloudflareinsights.com/other-script.js'),
    false,
    'Non-beacon path on official host must NOT match'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('https://example.com/beacon.min.js'),
    false,
    'Arbitrary host with beacon.min.js must NOT match'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('https://evil.com/static.cloudflareinsights.com/beacon.min.js'),
    false,
    'Deceptive domain must NOT match'
  );

  // 2. RUM report: ONLY exact pathname /cdn-cgi/rum on allowed targets
  assert.equal(
    isCloudflareAnalyticsRequest('https://crecalculators.com/cdn-cgi/rum'),
    true,
    'Production RUM endpoint must match'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('https://crecalculators.com/cdn-cgi/rum?token=123'),
    true,
    'Production RUM with query params must match'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('https://cloudflareinsights.com/cdn-cgi/rum'),
    true,
    'Official cloudflareinsights RUM endpoint must match'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('https://test-preview.cre-calculator.pages.dev/cdn-cgi/rum'),
    true,
    'Pages.dev preview RUM endpoint must match'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('http://localhost:3000/cdn-cgi/rum'),
    true,
    'Localhost RUM endpoint must match'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('http://127.0.0.1:3460/cdn-cgi/rum'),
    true,
    '127.0.0.1 RUM endpoint must match'
  );

  // Strict negative tests for RUM
  assert.equal(
    isCloudflareAnalyticsRequest('https://crecalculators.com/cdn-cgi/rumor'),
    false,
    'Must NOT match /cdn-cgi/rumor'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('https://crecalculators.com/cdn-cgi/rum_test'),
    false,
    'Must NOT match /cdn-cgi/rum_test'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('https://attacker.com/cdn-cgi/rum'),
    false,
    'Unpermitted origin with /cdn-cgi/rum must NOT match'
  );

  // Custom allowed origins support
  assert.equal(
    isCloudflareAnalyticsRequest('https://custom-staging.org/cdn-cgi/rum', ['https://custom-staging.org']),
    true,
    'Custom permitted origin must match'
  );
  assert.equal(
    isCloudflareAnalyticsRequest('https://other.org/cdn-cgi/rum', ['https://custom-staging.org']),
    false,
    'Non-listed origin must NOT match'
  );

  // 3. Invalid URLs and broad includes suppression
  assert.equal(isCloudflareAnalyticsRequest(null), false);
  assert.equal(isCloudflareAnalyticsRequest(undefined), false);
  assert.equal(isCloudflareAnalyticsRequest(''), false);
  assert.equal(isCloudflareAnalyticsRequest('not a valid url /cdn-cgi/rum'), false);
  assert.equal(isCloudflareAnalyticsRequest('invalid::/static.cloudflareinsights.com/beacon.min.js'), false);
});

test('isExpectedAnalyticsBlockError strictly requires exact aborted request correlation', () => {
  const abortedUrls = new Set([
    'https://static.cloudflareinsights.com/beacon.min.js',
    'http://localhost:3000/cdn-cgi/rum',
  ]);

  // 1. 空集合、未传集合均不得忽略（即使包含 Cloudflare 官方 URL）
  assert.equal(
    isExpectedAnalyticsBlockError(
      {
        text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
        location: () => ({ url: 'https://static.cloudflareinsights.com/beacon.min.js' }),
      },
      undefined
    ),
    false,
    '未传 abortedUrls 必须返回 false'
  );
  assert.equal(
    isExpectedAnalyticsBlockError(
      {
        text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
        location: () => ({ url: 'https://static.cloudflareinsights.com/beacon.min.js' }),
      },
      new Set()
    ),
    false,
    'abortedUrls 为空 Set 必须返回 false'
  );
  assert.equal(
    isExpectedAnalyticsBlockError(
      {
        text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
        location: () => ({ url: 'https://static.cloudflareinsights.com/beacon.min.js' }),
      },
      []
    ),
    false,
    'abortedUrls 为空数组必须返回 false'
  );

  // 2. 实际主动中止且 URL 完全一致时可以忽略
  assert.equal(
    isExpectedAnalyticsBlockError(
      {
        text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
        location: () => ({ url: 'https://static.cloudflareinsights.com/beacon.min.js' }),
      },
      abortedUrls
    ),
    true,
    'location.url 与中止集合完全一致时可以忽略'
  );
  assert.equal(
    isExpectedAnalyticsBlockError(
      {
        text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
        location: () => ({ url: 'http://localhost:3000/cdn-cgi/rum' }),
      },
      abortedUrls
    ),
    true,
    'location.url 匹配 abortedUrls 中的 RUM URL'
  );
  assert.equal(
    isExpectedAnalyticsBlockError(
      'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT https://static.cloudflareinsights.com/beacon.min.js',
      abortedUrls
    ),
    true,
    '无 location.url 时提取文本中的完整 URL 精确匹配通过'
  );

  // 3. 仅有 URL 前缀相同不得忽略（禁止 text.includes(abortedUrl)，避免不同路径、版本或查询参数被混同）
  assert.equal(
    isExpectedAnalyticsBlockError(
      {
        text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
        location: () => ({ url: 'https://static.cloudflareinsights.com/beacon.min.js/v99999' }),
      },
      abortedUrls
    ),
    false,
    'URL 路径不同（仅前缀相同）不得忽略'
  );
  assert.equal(
    isExpectedAnalyticsBlockError(
      {
        text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
        location: () => ({ url: 'http://localhost:3000/cdn-cgi/rum?query=1' }),
      },
      abortedUrls
    ),
    false,
    'URL 查询参数不同不得忽略'
  );
  assert.equal(
    isExpectedAnalyticsBlockError(
      'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT https://static.cloudflareinsights.com/beacon.min.js/v99999',
      abortedUrls
    ),
    false,
    '错误文本中的 URL 仅前缀相同绝不得忽略'
  );

  // 4. 普通业务错误、未确认来源的错误及运行时异常继续保留
  assert.equal(
    isExpectedAnalyticsBlockError(
      {
        text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
        location: () => ({ url: 'http://localhost:3000/api/business-data.js' }),
      },
      abortedUrls
    ),
    false,
    '非中止集合的业务资源 ERR_BLOCKED_BY_CLIENT 绝不忽略'
  );
  assert.equal(
    isExpectedAnalyticsBlockError(
      {
        text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
        location: () => ({ url: '' }),
      },
      abortedUrls
    ),
    false,
    '无 URL 的 ERR_BLOCKED_BY_CLIENT 绝不忽略'
  );
  assert.equal(
    isExpectedAnalyticsBlockError('Failed to load resource: net::ERR_BLOCKED_BY_CLIENT', abortedUrls),
    false,
    '无明确 URL 的纯文本错误绝不忽略'
  );
  assert.equal(
    isExpectedAnalyticsBlockError('Error: Hydration failed because the server-rendered HTML did not match', abortedUrls),
    false,
    '水合错误绝不忽略'
  );
  assert.equal(
    isExpectedAnalyticsBlockError('ReferenceError: calculateDealAnalysis is not defined', abortedUrls),
    false,
    'JS 运行时 ReferenceError 绝不忽略'
  );
  assert.equal(
    isExpectedAnalyticsBlockError('Failed to load resource: the server responded with a status of 404 (Not Found)', abortedUrls),
    false,
    '404 资源缺失绝不忽略'
  );
});

test('filterRealErrors preserves actual errors while removing verified analytics block logs', () => {
  const abortedUrls = new Set(['https://static.cloudflareinsights.com/beacon.min.js']);

  const mixedErrors = [
    {
      text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
      location: () => ({ url: 'https://static.cloudflareinsights.com/beacon.min.js' }),
    },
    'ReferenceError: calculateNoi is not defined',
    {
      text: () => 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT',
      location: () => ({ url: 'http://localhost:3000/_next/static/chunk-123.js' }),
    },
    'Error: React hydration mismatch',
  ];

  const filtered = filterRealErrors(mixedErrors, abortedUrls);
  assert.equal(filtered.length, 3, 'Must retain the 3 non-analytics errors');
  assert.equal(filtered[0], 'ReferenceError: calculateNoi is not defined');
  assert.equal(filtered[2], 'Error: React hydration mismatch');
});

test('Puppeteer test: default mode blocks BOTH Beacon and RUM, verifying 0 RUM POSTs received locally', async () => {
  let serverReceivedRumPosts = 0;
  let serverReceivedBeaconGets = 0;
  let serverReceivedBusinessGets = 0;

  const testHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Analytics Test</title>
        <!-- Mock Cloudflare beacon script -->
        <script src="https://static.cloudflareinsights.com/beacon.min.js/v123" defer></script>
      </head>
      <body>
        <h1 id="title">Test App</h1>
        <div id="output">Initial</div>
        <button id="calc-btn">Run</button>
        <script>
          document.getElementById('calc-btn').addEventListener('click', async () => {
            document.getElementById('output').textContent = 'Calculated 1.34x';
            // Normal business request
            await fetch('/api/business-data.json');
            // RUM report
            await fetch('/cdn-cgi/rum', { method: 'POST', body: JSON.stringify({ event: 'test' }) }).catch(() => {});
          });
        </script>
      </body>
    </html>
  `;

  const server = http.createServer((req, res) => {
    const parsed = new URL(req.url, `http://${req.headers.host}`);
    if (parsed.pathname === '/cdn-cgi/rum') {
      if (req.method === 'POST') {
        serverReceivedRumPosts++;
      }
      res.writeHead(204);
      res.end();
      return;
    }
    if (parsed.pathname === '/api/business-data.json') {
      serverReceivedBusinessGets++;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', dscr: 1.34 }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(testHtml);
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const testUrl = `http://localhost:${port}/`;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    // Setup analytics blocker before navigation
    const blocker = await setupAnalyticsBlocker(page, { silent: true });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        if (!blocker.isExpectedBlockError(msg)) {
          consoleErrors.push(msg.text());
        }
      }
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.toString());
    });

    await page.goto(testUrl, { waitUntil: 'networkidle0' });

    // Click button to execute business logic and trigger RUM report
    await page.click('#calc-btn');
    await new Promise((r) => setTimeout(r, 400));

    // Verify application functionality
    const outputText = await page.$eval('#output', (el) => el.textContent);
    assert.equal(outputText, 'Calculated 1.34x', 'Application interaction must function properly');

    // 1. Assert BOTH Beacon and RUM were blocked by client
    const blocked = blocker.getBlockedRequests();
    const hasBlockedBeacon = blocked.some((r) => r.type === 'beacon_script');
    const hasBlockedRum = blocked.some((r) => r.type === 'rum_report');
    assert.ok(hasBlockedBeacon, 'Beacon script MUST be blocked');
    assert.ok(hasBlockedRum, 'RUM POST report MUST be blocked');

    // 2. Assert local server received ZERO RUM POSTs or Beacon GETs
    assert.equal(serverReceivedRumPosts, 0, 'Local server MUST receive 0 RUM POST requests');
    assert.equal(serverReceivedBeaconGets, 0, 'Local server MUST receive 0 Beacon GET requests');

    // 3. Assert normal business resource was NOT blocked
    assert.equal(serverReceivedBusinessGets, 1, 'Business API endpoint must be fetched normally');

    // 4. Assert zero unexpected console or page errors
    assert.equal(consoleErrors.length, 0, `No real console errors expected, got: ${JSON.stringify(consoleErrors)}`);
    assert.equal(pageErrors.length, 0, `No page errors expected, got: ${JSON.stringify(pageErrors)}`);
  } finally {
    await browser.close();
    server.close();
  }
});

test('Puppeteer test: business 404 and runtime errors are NOT filtered and cause test failure', async () => {
  const errorHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Error Capture Test</title>
        <!-- Injected missing business asset -->
        <script src="/missing-business-asset.js"></script>
      </head>
      <body>
        <h1>Error Test</h1>
        <script>
          // Injected uncaught runtime error
          setTimeout(() => {
            throw new Error('Injected critical business logic failure');
          }, 100);
        </script>
      </body>
    </html>
  `;

  const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    if (req.url === '/missing-business-asset.js') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(errorHtml);
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const testUrl = `http://localhost:${port}/`;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const blocker = await setupAnalyticsBlocker(page, { silent: true });

    const capturedConsoleErrors = [];
    const capturedPageErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        if (!blocker.isExpectedBlockError(msg)) {
          capturedConsoleErrors.push({
            text: msg.text(),
            url: msg.location()?.url,
          });
        }
      }
    });

    page.on('pageerror', (err) => {
      // Uncaught runtime exception must NEVER pass through analytics filtering
      capturedPageErrors.push(err.message || String(err));
    });

    await page.goto(testUrl, { waitUntil: 'load', timeout: 10000 });
    await new Promise((r) => setTimeout(r, 300));

    // Verify 404 was NOT filtered
    assert.ok(
      capturedConsoleErrors.some(
        (e) => e.text.includes('404') && (e.url?.includes('missing-business-asset.js') || e.text.includes('missing-business-asset.js'))
      ),
      'Business 404 error must be retained in console errors'
    );

    // Verify uncaught exception was NOT filtered
    assert.ok(
      capturedPageErrors.some((m) => m.includes('Injected critical business logic failure')),
      'Uncaught pageerror must be captured and never filtered'
    );
  } finally {
    await browser.close();
    server.close();
  }
});

test('verifyAnalyticsReporting (explicit mode) succeeds on valid local mock, rejects invalid scenarios', async () => {
  // Scenario 1: Valid mock server (GET beacon 200, POST /cdn-cgi/rum 204)
  const validMockServer = http.createServer((req, res) => {
    const parsed = new URL(req.url, `http://${req.headers.host}`);
    if (parsed.pathname === '/cdn-cgi/rum' && req.method === 'POST') {
      res.writeHead(204);
      res.end();
      return;
    }
    // HTML that triggers Beacon and POST /cdn-cgi/rum
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            // Emulate beacon load and subsequent POST
            fetch('https://static.cloudflareinsights.com/beacon.min.js')
              .then(() => fetch('/cdn-cgi/rum', { method: 'POST', body: '{}' }));
          </script>
        </body>
      </html>
    `);
  });

  await new Promise((resolve) => validMockServer.listen(0, resolve));
  const validPort = validMockServer.address().port;
  const validUrl = `http://localhost:${validPort}/`;

  try {
    const res = await verifyAnalyticsReporting(validUrl, {
      allowedOrigins: [`http://localhost:${validPort}`],
      mockResponses: true,
      waitMs: 1500,
    });
    assert.equal(res.success, true, 'Valid mock must succeed');
  } finally {
    validMockServer.close();
  }

  // Scenario 2: Rejects GET /cdn-cgi/rum
  const getRumServer = http.createServer((req, res) => {
    const parsed = new URL(req.url, `http://${req.headers.host}`);
    if (parsed.pathname === '/cdn-cgi/rum') {
      res.writeHead(200);
      res.end('ok');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            fetch('https://static.cloudflareinsights.com/beacon.min.js')
              .then(() => fetch('/cdn-cgi/rum', { method: 'GET' })); // INVALID METHOD
          </script>
        </body>
      </html>
    `);
  });

  await new Promise((resolve) => getRumServer.listen(0, resolve));
  const getRumPort = getRumServer.address().port;

  try {
    await assert.rejects(
      async () => {
        await verifyAnalyticsReporting(`http://localhost:${getRumPort}/`, {
          allowedOrigins: [`http://localhost:${getRumPort}`],
          mockResponses: true,
          waitMs: 1500,
        });
      },
      /Invalid \/cdn-cgi\/rum request method: expected POST, found GET/
    );
  } finally {
    getRumServer.close();
  }

  // Scenario 3: Rejects missing RUM report (Beacon loads but no RUM)
  const noRumServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            fetch('https://static.cloudflareinsights.com/beacon.min.js'); // No RUM sent
          </script>
        </body>
      </html>
    `);
  });

  await new Promise((resolve) => noRumServer.listen(0, resolve));
  const noRumPort = noRumServer.address().port;

  try {
    await assert.rejects(
      async () => {
        await verifyAnalyticsReporting(`http://localhost:${noRumPort}/`, {
          allowedOrigins: [`http://localhost:${noRumPort}`],
          mockResponses: true,
          waitMs: 1500,
        });
      },
      /Beacon script loaded, but no \/cdn-cgi\/rum report was issued/
    );
  } finally {
    noRumServer.close();
  }
});
