import fs from 'fs';
import path from 'path';

const outDir = './out';
let failures = 0;

const contentPage = /out\/(?:en|zh)\/.+\.html$/;

function checkHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkHtmlFiles(full);
    } else if (f.endsWith('.html')) {
      const html = fs.readFileSync(full, 'utf8');

      // Redirect shells, framework error pages and ownership-verification files
      // are not indexable content pages and intentionally have no H1/canonical.
      if (!contentPage.test(full)) continue;

      // Check H1 count
      const h1Matches = html.match(/<h1\b[^>]*>/gi) || [];
      if (h1Matches.length !== 1) {
        console.error(`🚨 ERROR: ${full} has ${h1Matches.length} <h1> tags!`);
        failures += 1;
      }

      // Check Analytics count
      const cfBeacons = (html.match(/static\.cloudflareinsights\.com/g) || []).length;
      if (cfBeacons > 1) {
        console.error(`🚨 ERROR: ${full} has ${cfBeacons} Cloudflare beacon scripts!`);
        failures += 1;
      }

      // Check Canonical
      if (!html.includes('<link rel="canonical"') && !html.includes('<link href="https://crecalculators.com/')) {
        console.error(`🚨 ERROR: ${full} missing canonical`);
        failures += 1;
      }
    }
  }
}

console.log('Running SEO, H1 & Script Integrity Check across all HTML pages...');
checkHtmlFiles(outDir);
if (failures > 0) {
  console.error(`❌ Integrity check failed with ${failures} error(s).`);
  process.exit(1);
}
console.log('✅ Integrity check complete: All localized content pages have exactly 1 <h1>, valid canonicals, and no duplicate analytics scripts.');
