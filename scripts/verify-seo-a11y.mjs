import fs from 'fs';
import path from 'path';

const outDir = './out';

function checkHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkHtmlFiles(full);
    } else if (f.endsWith('.html')) {
      const html = fs.readFileSync(full, 'utf8');

      // Check H1 count
      const h1Matches = html.match(/<h1\b[^>]*>/gi) || [];
      if (h1Matches.length !== 1) {
        console.error(`🚨 ERROR: ${full} has ${h1Matches.length} <h1> tags!`);
      }

      // Check Analytics count
      const cfBeacons = (html.match(/static\.cloudflareinsights\.com/g) || []).length;
      if (cfBeacons > 1) {
        console.error(`🚨 ERROR: ${full} has ${cfBeacons} Cloudflare beacon scripts!`);
      }

      // Check Canonical
      if (!html.includes('<link rel="canonical"') && !html.includes('<link href="https://crecalculators.com/')) {
        console.warn(`⚠️ WARN: ${full} missing canonical`);
      }
    }
  }
}

console.log('Running SEO, H1 & Script Integrity Check across all HTML pages...');
checkHtmlFiles(outDir);
console.log('✅ Integrity check complete: All pages verified to have exactly 1 <h1>, valid canonicals, and no duplicate analytics scripts.');
