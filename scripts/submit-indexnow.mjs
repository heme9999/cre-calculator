const HOST = 'cre-calculator.pages.dev';
const KEY = '4f82a9c1e3b567890d2e4f6a8b1c3d5e';
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

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    console.log(`IndexNow Response Status: ${response.status} ${response.statusText}`);
    if (response.status === 200 || response.status === 202) {
      console.log('✅ Successfully submitted all URLs to Bing / IndexNow!');
    } else {
      const text = await response.text();
      console.error('❌ IndexNow submission returned non-success response:', text);
    }
  } catch (err) {
    console.error('❌ Error submitting to IndexNow:', err);
  }
}

submitIndexNow();
