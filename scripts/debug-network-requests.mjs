import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function debugNetwork() {
  console.log('Starting Network Request Audit for https://cre-calculator.pages.dev/en/tools/deal-analyzer/...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  const networkRequests = [];
  const failedRequests = [];

  page.on('request', (request) => {
    networkRequests.push({
      url: request.url(),
      resourceType: request.resourceType(),
    });
  });

  page.on('response', (response) => {
    const status = response.status();
    const url = response.url();
    if (status >= 400) {
      failedRequests.push({
        url,
        status,
        statusText: response.statusText(),
      });
      console.log(`🚨 HTTP ${status} ERROR: ${url}`);
    } else {
      if (url.includes('.css')) {
        console.log(`✅ CSS LOADED (${status}): ${url}`);
      }
    }
  });

  await page.goto('https://cre-calculator.pages.dev/en/tools/deal-analyzer/', {
    waitUntil: 'networkidle0',
  });

  console.log(`\n==================================================`);
  console.log(`Audit Summary:`);
  console.log(`Total Network Requests: ${networkRequests.length}`);
  console.log(`Total Failed (4xx/5xx) Requests: ${failedRequests.length}`);
  console.log(`==================================================`);

  if (failedRequests.length > 0) {
    console.log('Failed requests detail:', JSON.stringify(failedRequests, null, 2));
  } else {
    console.log('🎉 ZERO 404/Failed Network Requests detected!');
  }

  await browser.close();
}

debugNetwork();
