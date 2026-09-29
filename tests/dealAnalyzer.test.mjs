import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cre-deal-test-'));

try {
  const tsconfigContent = JSON.stringify({
    compilerOptions: { target: "es2022", module: "NodeNext", moduleResolution: "NodeNext", outDir: tempDir, skipLibCheck: true, strict: false },
    include: [
      path.join(__dirname, "../src/lib/dealAnalyzerCalculations.ts").replace(/\\/g, '/'),
      path.join(__dirname, "../src/lib/loanCalculations.ts").replace(/\\/g, '/')
    ]
  });
  const tsconfigPath = path.join(tempDir, 'tsconfig.test.json');
  fs.writeFileSync(tsconfigPath, tsconfigContent);
  
  execSync(`npx tsc -p ${tsconfigPath}`, { cwd: __dirname, stdio: 'pipe' });

  const { calculateSingleScenario, DEFAULT_DEAL_INPUT } = await import(path.join(tempDir, 'dealAnalyzerCalculations.js'));

  test('Deal Analyzer Calculation Consistency', async (t) => {
    await t.test('24-unit Base Scenario calculations', () => {
      const baseResult = calculateSingleScenario(DEFAULT_DEAL_INPUT);
      assert.strictEqual(Math.round(baseResult.annualDebtService), 170152);
      
      const capRate = (baseResult.noi / DEFAULT_DEAL_INPUT.purchasePrice) * 100;
      assert.strictEqual(capRate.toFixed(2), '8.11');

      assert.strictEqual(baseResult.breakEvenRatio.toFixed(2), '82.13');
      assert.strictEqual(baseResult.breakEvenOccupancy.toFixed(2), '78.02');
      assert.strictEqual(baseResult.dscr.toFixed(2), '1.34');
      
      const downPayment = DEFAULT_DEAL_INPUT.purchasePrice * (DEFAULT_DEAL_INPUT.downPaymentPercent / 100);
      const totalCash = downPayment + (DEFAULT_DEAL_INPUT.purchasePrice * (DEFAULT_DEAL_INPUT.closingCostsPercent / 100));
      const ptcf = baseResult.noi - baseResult.annualDebtService;
      assert.strictEqual((ptcf / totalCash * 100).toFixed(2), '7.55');
    });

    await t.test('24-unit Stress Scenario calculations', () => {
      const stressInput = {
        ...DEFAULT_DEAL_INPUT,
        vacancyRate: DEFAULT_DEAL_INPUT.vacancyRate + 5.0,
        interestRate: DEFAULT_DEAL_INPUT.interestRate + 1.0,
      };
      const stressResult = calculateSingleScenario(stressInput);
      assert.strictEqual(stressResult.dscr.toFixed(2), '1.13');
      assert.strictEqual(stressResult.breakEvenRatio.toFixed(2), '92.01');
      assert.strictEqual(stressResult.breakEvenOccupancy.toFixed(2), '82.81');
    });

    await t.test('5% vacancy yields EGI of 319,200', () => {
      const input = { ...DEFAULT_DEAL_INPUT, grossPotentialIncome: 336000, vacancyRate: 5 };
      const result = calculateSingleScenario(input);
      const expectedEGI = 336000 * (1 - 0.05);
      assert.strictEqual(expectedEGI, 319200);
      assert.strictEqual(result.noi + input.operatingExpenses, 319200);
    });

    await t.test('BER uses EGI and BEO uses GPI (No Confusion)', () => {
      const input = { ...DEFAULT_DEAL_INPUT, grossPotentialIncome: 336000, vacancyRate: 5 };
      const result = calculateSingleScenario(input);
      
      const EGI = 336000 * 0.95;
      const FixedObligations = input.operatingExpenses + result.annualDebtService;
      
      const expectedBER = (FixedObligations / EGI) * 100;
      const expectedBEO = (FixedObligations / 336000) * 100;
      
      assert.strictEqual(result.breakEvenRatio, expectedBER);
      assert.strictEqual(result.breakEvenOccupancy, expectedBEO);
      assert.notStrictEqual(result.breakEvenRatio, result.breakEvenOccupancy);
    });

    await t.test('GPI = 0 prevents Infinity/NaN', () => {
      const input = { ...DEFAULT_DEAL_INPUT, grossPotentialIncome: 0 };
      const result = calculateSingleScenario(input);
      assert.ok(isFinite(result.breakEvenOccupancy));
      assert.ok(isFinite(result.breakEvenRatio));
      assert.strictEqual(result.breakEvenOccupancy, 0);
    });

    await t.test('EGI = 0 prevents Infinity/NaN', () => {
      const input = { ...DEFAULT_DEAL_INPUT, vacancyRate: 100 };
      const result = calculateSingleScenario(input);
      assert.ok(isFinite(result.breakEvenRatio));
      assert.strictEqual(result.breakEvenRatio, 0);
    });
  });
} catch (e) {
  console.error('Test setup or compilation failed:');
  console.error(e.stdout?.toString() || e.message);
  process.exit(1);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
