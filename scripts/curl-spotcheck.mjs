import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'out');

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

async function runSpotCheck() {
  await new Promise((resolve) => server.listen(3460, resolve));
  console.log('Spot-check server running on http://localhost:3460\n');

  const spotUrls = [
    '/',
    '/en/',
    '/en/calculators/cap-rate/',
    '/en/calculators/noi/',
    '/en/calculators/dscr/',
    '/en/calculators/cash-on-cash/',
    '/en/tools/deal-analyzer/',
    '/zh/calculators/cap-rate/',
    '/en/about/',
    '/robots.txt',
    '/sitemap.xml',
  ];

  for (const urlPath of spotUrls) {
    const res = await fetch(`http://localhost:3460${urlPath}`, { redirect: 'manual' });
    console.log(`==================================================`);
    console.log(`URL: ${urlPath}`);
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    console.log(`Content-Type: ${res.headers.get('content-type')}`);

    if (res.status === 301 || res.status === 308) {
      console.log(`Redirect Location: ${res.headers.get('location')}`);
    } else {
      const text = await res.text();
      if (urlPath.endsWith('.xml') || urlPath.endsWith('.txt')) {
        console.log(`Snippet / Line count:\n${text.trim().split('\n').slice(0, 10).join('\n')}`);
      } else {
        const titleMatch = text.match(/<title>([^<]*)<\/title>/i);
        const descMatch = text.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
        const robotsMatch = text.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);
        const canonicalMatch = text.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
        const hreflangMatches = [...text.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]*)"\s+href="([^"]*)"/gi)].map(m => `${m[1]} -> ${m[2]}`);

        console.log(`Title: ${titleMatch ? titleMatch[1] : 'N/A'}`);
        console.log(`Meta Description: ${descMatch ? descMatch[1] : 'N/A'}`);
        console.log(`Canonical: ${canonicalMatch ? canonicalMatch[1] : 'N/A'}`);
        console.log(`Robots Meta: ${robotsMatch ? robotsMatch[1] : 'index, follow (default)'}`);
        console.log(`Hreflangs: ${hreflangMatches.length > 0 ? hreflangMatches.join(', ') : 'None'}`);
      }
    }
  }

  server.close();
}

runSpotCheck().catch(err => {
  console.error(err);
  process.exit(1);
});
