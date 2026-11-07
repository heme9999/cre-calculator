import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  EXPECTED_DEAL_ANALYZER_H1,
  verifyPostBuildDealAnalyzerArtifacts,
  fetchAndVerifyDealAnalyzerTarget,
} from '../scripts/lib/deal-analyzer-link-validator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const validatorCliPath = path.join(__dirname, '..', 'scripts', 'lib', 'deal-analyzer-link-validator.mjs');

function runValidatorSubprocess(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [validatorCliPath, ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', (status) => {
      resolve({ status, stdout, stderr });
    });
  });
}

function writeFixtureFile(baseDir, relPath, content) {
  const fullPath = path.join(baseDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

test('Shared Validator & Subprocess Exit Code Verification (Positive & Negative Fixtures)', async (t) => {
  await t.test('Positive Fixture: Valid HTML artifacts and valid HTTP 200 Deal Analyzer target pass with exit code 0', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cre-pos-fixture-'));
    let server;
    try {
      for (const loc of ['en', 'zh', 'es', 'pt']) {
        writeFixtureFile(
          tempDir,
          `${loc}/calculators/free-rental-property-calculator/index.html`,
          `<!DOCTYPE html><html><body>
            <section class="bg-slate-100 rounded-2xl p-6">
              <a href="/${loc}/tools/deal-analyzer/">Deal Analyzer</a>
            </section>
          </body></html>`
        );
      }
      for (const loc of ['es', 'pt']) {
        writeFixtureFile(
          tempDir,
          `${loc}/index.html`,
          `<!DOCTYPE html><html><body>
            <main><div class="bg-slate-50"><a href="/${loc}/tools/deal-analyzer/">Deal Analyzer</a></div></main>
          </body></html>`
        );
      }

      const directCheck = verifyPostBuildDealAnalyzerArtifacts(tempDir);
      assert.equal(directCheck.errors.length, 0, 'Direct shared artifact check should have 0 errors');
      assert.equal(directCheck.passed.length, 6, 'Direct shared artifact check should pass all 6 checks');

      const procArtifacts = await runValidatorSubprocess([
        '--mode=artifacts',
        `--out-dir=${tempDir}`,
      ]);
      assert.equal(procArtifacts.status, 0, `Positive artifact subprocess must exit 0, got ${procArtifacts.status}`);
      assert.match(procArtifacts.stdout, /Related Tools correctly links to \/en\/tools\/deal-analyzer\//);

      server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', Connection: 'close' });
        res.end(`<!DOCTYPE html><html><body>
          <h1>${EXPECTED_DEAL_ANALYZER_H1.en}</h1>
          <input id="purchase-price-input" type="number" value="2800000" />
        </body></html>`);
      });
      await new Promise((resolve) => server.listen(0, resolve));
      const port = server.address().port;
      const targetUrl = `http://localhost:${port}/en/tools/deal-analyzer/`;

      const directTarget = await fetchAndVerifyDealAnalyzerTarget(targetUrl, 'en');
      assert.equal(directTarget.errors.length, 0, 'Direct target check should have 0 errors');

      const procTarget = await runValidatorSubprocess([
        '--mode=target',
        `--url=${targetUrl}`,
        '--locale=en',
      ]);
      assert.equal(procTarget.status, 0, `Positive target subprocess must exit 0, got ${procTarget.status}`);
      assert.match(procTarget.stdout, /Target verified/);
    } finally {
      if (server) {
        server.closeAllConnections?.();
        server.close();
      }
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  await t.test('Negative Fixture A: Missing required HTML artifact fails with exit code 1', async () => {
    const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cre-neg-missing-'));
    try {
      const directResult = verifyPostBuildDealAnalyzerArtifacts(emptyDir, ['en'], []);
      assert.ok(directResult.errors.length > 0, 'Shared function must report missing artifact');

      const proc = await runValidatorSubprocess([
        '--mode=artifacts',
        `--out-dir=${emptyDir}`,
        '--locales=en',
        '--home-locales=',
      ]);
      assert.equal(proc.status, 1, `Missing artifact subprocess must exit 1, got ${proc.status}`);
      assert.match(
        proc.stderr,
        /Critical build artifact missing: out\/en\/calculators\/free-rental-property-calculator\/index\.html/
      );
    } finally {
      fs.rmSync(emptyDir, { recursive: true, force: true });
    }
  });

  await t.test('Negative Fixture B: Related Tools card reverted to /calculators/deal-analyzer/ fails with exit code 1', async () => {
    const badCardDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cre-neg-badcard-'));
    try {
      // Header has valid /tools/ link, but Related Tools section has broken /calculators/ link
      writeFixtureFile(
        badCardDir,
        'en/calculators/free-rental-property-calculator/index.html',
        `<!DOCTYPE html><html><body>
          <header><a href="/en/tools/deal-analyzer/">Header Nav</a></header>
          <section class="bg-slate-100 rounded-2xl p-6">
            <h2>Related Calculators</h2>
            <a href="/en/calculators/deal-analyzer/">Deal Analyzer</a>
          </section>
        </body></html>`
      );

      const directResult = verifyPostBuildDealAnalyzerArtifacts(badCardDir, ['en'], []);
      assert.ok(directResult.errors.length > 0, 'Shared function must reject invalid Related Tools card href');

      const proc = await runValidatorSubprocess([
        '--mode=artifacts',
        `--out-dir=${badCardDir}`,
        '--locales=en',
        '--home-locales=',
      ]);
      assert.equal(proc.status, 1, `Bad card href subprocess must exit 1, got ${proc.status}`);
      assert.match(proc.stderr, /Related Tools contains invalid 404 target: calculators\/deal-analyzer\//);
      assert.match(proc.stderr, /Related Tools section missing valid link: href="\/en\/tools\/deal-analyzer\/"/);
    } finally {
      fs.rmSync(badCardDir, { recursive: true, force: true });
    }
  });

  await t.test('Negative Fixture C: Target returning HTTP 404 fails with exit code 1', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', Connection: 'close' });
      res.end('<html><body><h1>404 Not Found</h1><p>This page could not be found</p></body></html>');
    });
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const targetUrl = `http://localhost:${port}/en/tools/deal-analyzer/`;

    try {
      const directResult = await fetchAndVerifyDealAnalyzerTarget(targetUrl, 'en');
      assert.ok(directResult.errors.length > 0, 'Shared function must reject HTTP 404');

      const proc = await runValidatorSubprocess([
        '--mode=target',
        `--url=${targetUrl}`,
        '--locale=en',
      ]);
      assert.equal(proc.status, 1, `HTTP 404 target subprocess must exit 1, got ${proc.status}`);
      assert.match(proc.stderr, /Destination HTML HTTP status is 404, expected 200/);
    } finally {
      server.closeAllConnections?.();
      server.close();
    }
  });

  await t.test('Negative Fixture D: Target returning HTTP 200 with error shell or missing tool marker fails with exit code 1', async () => {
    const server = http.createServer((req, res) => {
      if (req.url.includes('error-shell')) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', Connection: 'close' });
        res.end(`<html><body>
          <div id="__next_error__"></div>
          <h1>${EXPECTED_DEAL_ANALYZER_H1.en}</h1>
          <p>This page could not be found</p>
          <input id="purchase-price-input" />
        </body></html>`);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', Connection: 'close' });
        res.end(`<html><body>
          <h1>Wrong Unlocalized Heading</h1>
          <p>Loaded soft shell without calculator input</p>
        </body></html>`);
      }
    });
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      const errorShellUrl = `http://localhost:${port}/en/tools/deal-analyzer/?case=error-shell`;
      const procErrorShell = await runValidatorSubprocess([
        '--mode=target',
        `--url=${errorShellUrl}`,
        '--locale=en',
      ]);
      assert.equal(procErrorShell.status, 1, `HTTP 200 error shell subprocess must exit 1, got ${procErrorShell.status}`);
      assert.match(procErrorShell.stderr, /Destination rendered 404 or error shell!/);

      const missingMarkerUrl = `http://localhost:${port}/en/tools/deal-analyzer/?case=missing-marker`;
      const procMissingMarker = await runValidatorSubprocess([
        '--mode=target',
        `--url=${missingMarkerUrl}`,
        '--locale=en',
      ]);
      assert.equal(procMissingMarker.status, 1, `HTTP 200 missing marker subprocess must exit 1, got ${procMissingMarker.status}`);
      assert.match(procMissingMarker.stderr, /Deal Analyzer H1 mismatch/);
      assert.match(procMissingMarker.stderr, /Destination missing required tool input marker #purchase-price-input/);
    } finally {
      server.closeAllConnections?.();
      server.close();
    }
  });
});
