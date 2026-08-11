const HOST = 'cre-calculator.pages.dev';
const KEY = 'b8687ac0745e47fa98319b0ee0b5cda6';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const routes = [
  '',
  'calculators/cap-rate',
  'calculators/noi',
  'calculators/cash-on-cash',
  'calculators/loan-payment',
  'calculators/dscr',
  'calculators/1031-exchange',
  'calculators/lease-vs-buy',
  'calculators/break-even-ratio',
  'guides',
  'guides/cap-rate-benchmarks-by-city',
  'guides/how-to-estimate-noi',
  'guides/1031-exchange-process',
  'guides/how-to-underwrite-a-deal',
  'tools',
  'tools/deal-analyzer',
];

const locales = ['en', 'zh'];
const urlList = [];

for (const loc of locales) {
  for (const route of routes) {
    const path = route ? `${loc}/${route}/` : `${loc}/`;
    urlList.push(`https://${HOST}/${path}`);
  }
}

// Add Chinese-only DSCR guide route
urlList.push(`https://${HOST}/zh/guides/dscr-loan-guide-chinese-investors/`);

async function submitIndexNow() {
  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);
  
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList,
  };

  const endpoints = [
    'https://www.bing.com/indexnow',
    'https://api.indexnow.org/indexnow',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Sending to ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      console.log(`Status (${endpoint}): ${response.status} ${response.statusText}`);
      if (response.status === 200 || response.status === 202) {
        console.log(`✅ Successfully submitted all ${urlList.length} URLs to ${endpoint}!`);
      } else {
        const text = await response.text();
        console.error(`❌ ${endpoint} POST returned non-success response:`, text);

        // Fallback to GET for each URL
        console.log(`Attempting GET submission fallback to ${endpoint}...`);
        let successCount = 0;
        for (const url of urlList) {
          const getUrl = `${endpoint}?url=${encodeURIComponent(url)}&key=${KEY}`;
          const getRes = await fetch(getUrl);
          if (getRes.status === 200 || getRes.status === 202) {
            successCount++;
          }
        }
        console.log(`✅ Fallback GET submission complete: ${successCount}/${urlList.length} URLs returned HTTP 200/202 from ${endpoint}`);
      }
    } catch (err) {
      console.error(`❌ Error submitting to ${endpoint}:`, err);
    }
  }
}

submitIndexNow();
