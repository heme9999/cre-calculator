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
      assert.strictEqual(Math.round(stressResult.annualDebtService), 186226);
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

  test('Deal Analyzer Case Study Text & Content Regression Checks', async (t) => {
    const dealAnalyzerPagePath = path.join(__dirname, '../src/app/[locale]/tools/deal-analyzer/page.tsx');
    const dealAnalyzerPage = fs.readFileSync(dealAnalyzerPagePath, 'utf8');

    const cashOnCashPagePath = path.join(__dirname, '../src/app/[locale]/calculators/cash-on-cash/page.tsx');
    const cashOnCashPage = fs.readFileSync(cashOnCashPagePath, 'utf8');

    const zhPath = path.join(__dirname, '../src/content/zh.ts');
    const zhContent = fs.readFileSync(zhPath, 'utf8');

    const enPath = path.join(__dirname, '../src/content/en.ts');
    const enContent = fs.readFileSync(enPath, 'utf8');

    await t.test('Visible Deal Analyzer example text has exact base & stress values and no outdated debt service', () => {
      assert.ok(dealAnalyzerPage.includes('$186,226'), 'deal-analyzer page should include stress debt service $186,226');
      assert.ok(!dealAnalyzerPage.includes('$186,225'), 'deal-analyzer page should NOT include outdated $186,225');

      assert.ok(cashOnCashPage.includes('$186,226'), 'cash-on-cash page should include stress debt service $186,226');
      assert.ok(!cashOnCashPage.includes('$186,225'), 'cash-on-cash page should NOT include outdated $186,225');

      assert.ok(dealAnalyzerPage.includes('82.13%'), 'deal-analyzer page should include base BER 82.13%');
      assert.ok(dealAnalyzerPage.includes('78.02%'), 'deal-analyzer page should include base BEO 78.02%');
      assert.ok(dealAnalyzerPage.includes('92.01%'), 'deal-analyzer page should include stress BER 92.01%');
      assert.ok(dealAnalyzerPage.includes('82.81%'), 'deal-analyzer page should include stress BEO 82.81%');

      // Neither 78.02% nor 82.81% should be described as Break-Even Ratio or BER
      assert.ok(!dealAnalyzerPage.match(/(Break-Even Ratio|收支平衡比率)[^，。.)]*78\.02%/i), '78.02% must NOT be labeled as Break-Even Ratio');
      assert.ok(!dealAnalyzerPage.match(/(Break-Even Ratio|收支平衡比率)[^，。.)]*82\.81%/i), '82.81% must NOT be labeled as Break-Even Ratio');
    });

    await t.test('Stress test notes avoid mandatory language and DSCR 1.13x is conditional', () => {
      assert.ok(!dealAnalyzerPage.includes('必须施加 +5 个百分点空置'), 'Stress test parameters should not be stated as mandatory for all deals');
      assert.ok(dealAnalyzerPage.includes('是否构成违约取决于具体贷款合同'), 'ZH DSCR 1.13x must be conditional on loan covenants');
      assert.ok(dealAnalyzerPage.includes('depending on the specific loan agreement covenants'), 'EN DSCR 1.13x must be conditional on loan covenants');
    });

    await t.test('Content files have consistent examples and no typos', () => {
      assert.ok(enContent.includes('Break-Even Ratio: 82.13% · Break-Even Occupancy: 78.02%'));
      assert.ok(enContent.includes('Break-Even Ratio rises to 92.01% (BEO to 82.81%)'));
      assert.ok(zhContent.includes('Break-Even Ratio：82.13% · 盈亏平衡入住率：78.02%'));
      assert.ok(zhContent.includes('Break-Even Ratio升至92.01% (BEO升至82.81%)'));

      assert.ok(!zhContent.includes('会 me 和我'), 'zh.ts must not contain "会 me 和我" typo');
      assert.ok(zhContent.includes('这个算出来的数字，会和我单独用各个计算器算的不一样吗？'));
    });

    await t.test('Cap Rate Benchmarks Guide accurately states Market Tier and removes unsupported citations', () => {
      assert.ok(!enContent.includes("metaTitle: 'US Cap Rate Benchmarks by City"));
      assert.ok(enContent.includes("metaTitle: 'US Cap Rate Benchmarks by Market Tier & Property Type (2026)'"));
      assert.ok(zhContent.includes("metaTitle: '全美 Cap Rate 基准数据指南 — 市场层级与物业类型 (2026)'"));

      // Must not claim unsupported mid-year update or multiple public reports
      assert.ok(!enContent.includes('with Mid-Year Market Updates'));
      assert.ok(!zhContent.includes('年中市场观察'));
      assert.ok(!enContent.includes('based on multiple public industry market reports'));
      assert.ok(!zhContent.includes('多家公开市场报告'));

      // Must not claim official publication in table subtitle
      const capRatePagePath = path.join(__dirname, '../src/app/[locale]/guides/cap-rate-benchmarks-by-city/page.tsx');
      const capRatePage = fs.readFileSync(capRatePagePath, 'utf8');
      assert.ok(!capRatePage.includes('数据基准：2026年全美主流机构交易调研发布'));

      // Must not present pseudo-exact decimal averages
      assert.ok(!enContent.includes('~8.4% (national average)'));
      assert.ok(!zhContent.includes('约8.4%（全美平均）'));
      assert.ok(!enContent.includes('~8.60%'));
      assert.ok(!zhContent.includes('约8.60%'));

      // Accurately cites 2026-02-18 Newmark survey and clarifies educational benchmarks
      assert.ok(enContent.includes("date: '2026-02-18'"));
      assert.ok(zhContent.includes("date: '2026-02-18'"));
      assert.ok(enContent.includes('educational directional benchmarks'));
      assert.ok(zhContent.includes('方向性参考基准'));

      // FAQ must not promise automated/future report sync
      assert.ok(!enContent.includes('this guide will be updated accordingly'));
      assert.ok(!zhContent.includes('这份指南也会跟着更新'));
    });

    await t.test('Deal Analyzer health evaluation and badges use illustrative rules rather than standard lender thresholds', () => {
      const calcPath = path.join(__dirname, '../src/lib/dealAnalyzerCalculations.ts');
      const calcCode = fs.readFileSync(calcPath, 'utf8');

      assert.ok(!calcCode.includes('within standard lender thresholds'));
      assert.ok(!calcCode.includes('处于健康区间（DSCR ≥ 1.25x 且 Break-Even Ratio ≤ 85%）'));
      assert.ok(calcCode.includes('Illustrative Rule: Stable Cushion'));
      assert.ok(calcCode.includes('示例评估：稳健区间'));
      assert.ok(calcCode.includes('实际贷款审批门槛因贷方机构、贷款产品'));

      const toolComponentPath = path.join(__dirname, '../src/components/tools/DealAnalyzerTool.tsx');
      const toolCode = fs.readFileSync(toolComponentPath, 'utf8');
      assert.ok(toolCode.includes("'Illustrative: Stable Cushion'"));
      assert.ok(toolCode.includes("'Illustrative: Near Threshold'"));
      assert.ok(toolCode.includes("'Illustrative: Elevated Risk'"));
      assert.ok(toolCode.includes("'示例评级：稳健'"));
      assert.ok(toolCode.includes("'示例评级：临界'"));
      assert.ok(toolCode.includes("'示例评级：高风险'"));
    });

    await t.test('Break-Even Ratio 82.13% avoids misleading "under 80%-85%" and clarifies illustrative <=85% rule', () => {
      assert.ok(!enContent.includes('under 80%–85%'));
      assert.ok(!zhContent.includes('低于 80%–85%'));
      assert.ok(enContent.includes('satisfying this tool\\\'s illustrative reference rule of ≤85%'));
      assert.ok(zhContent.includes('满足本站示例设定的 ≤85% 风险参考规则'));
    });

    await t.test('DSCR FAQ underwriting and Cap Rate statements are conditional rather than absolute', () => {
      assert.ok(!zhContent.includes('银行会直接拒绝审批'));
      assert.ok(!enContent.includes('banks will outright reject'));
      assert.ok(zhContent.includes('能否获批取决于具体贷款产品'));
      assert.ok(enContent.includes('approval may depend on the loan program'));
      assert.ok(zhContent.includes('是否构成违约及具体后果'));
      assert.ok(enContent.includes('depends strictly on the covenants and cure provisions in the specific loan agreement'));

      // Cap Rate valuation is conditional on sustainable NOI, not absolute
      assert.ok(!zhContent.includes('Cap Rate 决定了物业的总价值与购买价'));
      assert.ok(zhContent.includes('在给定且可持续的 NOI、市场适用 Cap Rate 及其他交易条件下，可用 NOI ÷ Cap Rate 作估值参考'));
    });
  });
} catch (e) {
  console.error('Test setup or compilation failed:');
  console.error(e.stdout?.toString() || e.message);
  process.exit(1);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
