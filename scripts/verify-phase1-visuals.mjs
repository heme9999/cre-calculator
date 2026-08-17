import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'out');
const artifactsDir = '/Users/hemrmicloud.com/.gemini/antigravity/brain/38254bbf-d672-4a68-89f7-56fd707159bf';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  } else if (!path.extname(reqPath)) {
    reqPath += '/index.html';
  }

  let filePath = path.join(outDir, reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(outDir, '404.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = 3456;

server.listen(PORT, async () => {
  console.log(`Static server running at http://localhost:${PORT}`);

  try {
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const targets = [
      { url: `http://localhost:${PORT}/en/`, name: 'en_home_desktop', width: 1440, height: 900 },
      { url: `http://localhost:${PORT}/en/`, name: 'en_home_mobile_375', width: 375, height: 812 },
      { url: `http://localhost:${PORT}/en/`, name: 'en_home_mobile_320', width: 320, height: 700 },
      { url: `http://localhost:${PORT}/zh/`, name: 'zh_home_desktop', width: 1440, height: 900 },
      { url: `http://localhost:${PORT}/en/calculators/cap-rate/`, name: 'en_caprate_desktop', width: 1440, height: 900 },
      { url: `http://localhost:${PORT}/en/calculators/cap-rate/`, name: 'en_caprate_mobile_375', width: 375, height: 812 },
      { url: `http://localhost:${PORT}/en/calculators/dscr/`, name: 'en_dscr_desktop', width: 1440, height: 900 },
      { url: `http://localhost:${PORT}/en/calculators/dscr/`, name: 'en_dscr_mobile_375', width: 375, height: 812 },
      { url: `http://localhost:${PORT}/en/calculators/1031-exchange/`, name: 'en_1031_desktop', width: 1440, height: 900 },
      { url: `http://localhost:${PORT}/en/calculators/1031-exchange/`, name: 'en_1031_mobile_375', width: 375, height: 812 },
      { url: `http://localhost:${PORT}/en/guides/how-to-underwrite-a-deal/`, name: 'en_underwrite_guide_desktop', width: 1440, height: 900 },
      { url: `http://localhost:${PORT}/zh/guides/how-to-underwrite-a-deal/`, name: 'zh_underwrite_guide_desktop', width: 1440, height: 900 },
    ];

    for (const t of targets) {
      console.log(`Navigating to ${t.url} (${t.width}x${t.height})...`);
      await page.setViewport({ width: t.width, height: t.height });
      await page.goto(t.url, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 400));

      const screenshotPath = path.join(artifactsDir, `${t.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Saved screenshot: ${screenshotPath}`);
    }

    await browser.close();
    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
