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
      path.join(__dirname, "../src/lib/loanCalculations.ts").replace(/\\/g, '/'),
      path.join(__dirname, "../src/content/cityCapRates.ts").replace(/\\/g, '/'),
      path.join(__dirname, "../src/content/propertyCapRates.ts").replace(/\\/g, '/')
    ]
  });
  const tsconfigPath = path.join(tempDir, 'tsconfig.test.json');
  fs.writeFileSync(tsconfigPath, tsconfigContent);
  
  execSync(`npx tsc -p ${tsconfigPath}`, { cwd: __dirname, stdio: 'pipe' });

  const {
    calculateSingleScenario,
    DEFAULT_DEAL_INPUT,
    encodeDealAnalyzerHash,
    decodeDealAnalyzerHash,
    sanitizeDealAnalyzerInput,
    escapeCsvCell,
    generateDealAnalyzerCsv,
  } = await import(path.join(tempDir, 'lib/dealAnalyzerCalculations.js'));
  const { calculateLoanDetails } = await import(path.join(tempDir, 'lib/loanCalculations.js'));
  const { cityCapRatesContent } = await import(path.join(tempDir, 'content/cityCapRates.js'));
  const { propertyCapRatesContent } = await import(path.join(tempDir, 'content/propertyCapRates.js'));

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

    await t.test('Share hash round-trip encodes and decodes whitelisted parameters accurately', () => {
      const customInput = {
        purchasePrice: 4250000,
        closingCostsPercent: 2.5,
        grossPotentialIncome: 510000,
        vacancyRate: 6.5,
        operatingExpenses: 175000,
        downPaymentPercent: 30,
        interestRate: 6.25,
        amortizationYears: 25,
        paymentType: 'principal',
        hasBalloon: true,
        balloonYears: 7,
      };
      const hash = encodeDealAnalyzerHash(customInput);
      assert.ok(hash.startsWith('v=1&'), 'Encoded hash must include version v=1');
      assert.ok(!hash.includes('email'), 'Encoded hash must never include email');
      assert.ok(!hash.includes('audit'), 'Encoded hash must never include audit');

      const decoded = decodeDealAnalyzerHash(`#${hash}&email=test@example.com&audit=1&foo=bar`);
      assert.deepStrictEqual(decoded, customInput);

      const baseAfterDecode = calculateSingleScenario(decoded, 'en');
      const baseOriginal = calculateSingleScenario(customInput, 'en');
      assert.strictEqual(baseAfterDecode.noi, baseOriginal.noi);
      assert.strictEqual(baseAfterDecode.dscr, baseOriginal.dscr);
      assert.strictEqual(baseAfterDecode.cashOnCashReturn, baseOriginal.cashOnCashReturn);
    });

    await t.test('Share hash safely falls back on malformed or out-of-range inputs', () => {
      const malformed = decodeDealAnalyzerHash('#v=1&pp=-999&cc=999&gpi=NaN&vac=150&opex=-50&dp=120&ir=-3&ay=0&pt=invalid&hb=maybe&by=999');
      assert.strictEqual(malformed.purchasePrice, DEFAULT_DEAL_INPUT.purchasePrice);
      assert.strictEqual(malformed.closingCostsPercent, DEFAULT_DEAL_INPUT.closingCostsPercent);
      assert.strictEqual(malformed.grossPotentialIncome, DEFAULT_DEAL_INPUT.grossPotentialIncome);
      assert.strictEqual(malformed.vacancyRate, DEFAULT_DEAL_INPUT.vacancyRate);
      assert.strictEqual(malformed.operatingExpenses, DEFAULT_DEAL_INPUT.operatingExpenses);
      assert.strictEqual(malformed.downPaymentPercent, DEFAULT_DEAL_INPUT.downPaymentPercent);
      assert.strictEqual(malformed.interestRate, DEFAULT_DEAL_INPUT.interestRate);
      assert.strictEqual(malformed.amortizationYears, DEFAULT_DEAL_INPUT.amortizationYears);
      assert.strictEqual(malformed.paymentType, DEFAULT_DEAL_INPUT.paymentType);
      assert.strictEqual(malformed.hasBalloon, false);
      assert.strictEqual(malformed.balloonYears, DEFAULT_DEAL_INPUT.balloonYears);

      const sanitized = sanitizeDealAnalyzerInput({ purchasePrice: Infinity, balloonYears: 30, amortizationYears: 20, hasBalloon: true });
      assert.strictEqual(sanitized.purchasePrice, DEFAULT_DEAL_INPUT.purchasePrice);
      assert.strictEqual(sanitized.balloonYears, 20);
    });

    await t.test('Austin, Dallas, and Multifamily worked examples match calculateLoanDetails() across all 4 locales', () => {
      const austinLoan = calculateLoanDetails({
        loanAmount: 14200000 * 0.65,
        interestRate: 5.75,
        amortizationYears: 30,
        balloonYears: 30,
        paymentType: 'installment',
        hasBalloon: false,
      });
      const ausAdsFormatted = Math.round(austinLoan.firstYearDebtService).toLocaleString('en-US');
      const ausConstant = ((austinLoan.firstYearDebtService / (14200000 * 0.65)) * 100).toFixed(2);
      const ausDscr = (880400 / austinLoan.firstYearDebtService).toFixed(2);
      const ausCoc = (((880400 - austinLoan.firstYearDebtService) / (14200000 * 0.37)) * 100).toFixed(2);

      const dallasLoan = calculateLoanDetails({
        loanAmount: 18500000 * 0.65,
        interestRate: 5.60,
        amortizationYears: 30,
        balloonYears: 30,
        paymentType: 'installment',
        hasBalloon: false,
      });
      const dalAdsFormatted = Math.round(dallasLoan.firstYearDebtService).toLocaleString('en-US');
      const dalConstant = ((dallasLoan.firstYearDebtService / (18500000 * 0.65)) * 100).toFixed(2);
      const dalDscr = (1073000 / dallasLoan.firstYearDebtService).toFixed(2);
      const dalCoc = (((1073000 - dallasLoan.firstYearDebtService) / (18500000 * 0.37)) * 100).toFixed(2);

      const mfLoan = calculateLoanDetails({
        loanAmount: 3500000 * 0.65,
        interestRate: 5.85,
        amortizationYears: 30,
        balloonYears: 30,
        paymentType: 'installment',
        hasBalloon: false,
      });
      const mfAdsFormatted = Math.round(mfLoan.firstYearDebtService).toLocaleString('en-US');
      const mfConstant = ((mfLoan.firstYearDebtService / (3500000 * 0.65)) * 100).toFixed(2);
      const mfDscr = (218750 / mfLoan.firstYearDebtService).toFixed(2);
      const mfCoc = (((218750 - mfLoan.firstYearDebtService) / (3500000 * 0.37)) * 100).toFixed(2);

      for (const loc of ['en', 'zh', 'es', 'pt']) {
        const ausText = JSON.stringify(cityCapRatesContent[loc]['austin-tx-cap-rates'].underwritingExample);
        assert.ok(ausText.includes(`$${ausAdsFormatted}`), `Austin [${loc}] missing ADS $${ausAdsFormatted}`);
        assert.ok(ausText.includes(`${ausConstant}%`), `Austin [${loc}] missing debt constant ${ausConstant}%`);
        assert.ok(ausText.includes(`${ausDscr}x`), `Austin [${loc}] missing DSCR ${ausDscr}x`);
        assert.ok(ausText.includes(`${ausCoc}%`), `Austin [${loc}] missing Cash-on-Cash ${ausCoc}%`);

        const dalText = JSON.stringify(cityCapRatesContent[loc]['dallas-tx-cap-rates'].underwritingExample);
        assert.ok(dalText.includes(`$${dalAdsFormatted}`), `Dallas [${loc}] missing ADS $${dalAdsFormatted}`);
        assert.ok(dalText.includes(`${dalConstant}%`), `Dallas [${loc}] missing debt constant ${dalConstant}%`);
        assert.ok(dalText.includes(`${dalDscr}x`), `Dallas [${loc}] missing DSCR ${dalDscr}x`);
        assert.ok(dalText.includes(`${dalCoc}%`), `Dallas [${loc}] missing Cash-on-Cash ${dalCoc}%`);

        const mfText = JSON.stringify(propertyCapRatesContent[loc]['multifamily-cap-rate'].workedExample);
        assert.ok(mfText.includes(`$${mfAdsFormatted}`), `Multifamily [${loc}] missing ADS $${mfAdsFormatted}`);
        assert.ok(mfText.includes(`${mfConstant}%`), `Multifamily [${loc}] missing debt constant ${mfConstant}%`);
        assert.ok(mfText.includes(`${mfDscr}x`), `Multifamily [${loc}] missing DSCR ${mfDscr}x`);
        assert.ok(mfText.includes(`${mfCoc}%`), `Multifamily [${loc}] missing Cash-on-Cash ${mfCoc}%`);
      }
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
      assert.ok(enContent.includes("metaTitle: 'US Cap Rate Benchmarks by Market Tier & Property Type (Illustrative Guide)'"));
      assert.ok(zhContent.includes("metaTitle: '全美 Cap Rate 示意区间指南 — 市场层级与物业类型 (教学参考)'"));

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

    await t.test('Cross-language consistency: zero Spanish/Portuguese contamination in pt.ts and es.ts', () => {
      const ptPath = path.join(__dirname, '../src/content/pt.ts');
      const ptContent = fs.readFileSync(ptPath, 'utf8');

      const esPath = path.join(__dirname, '../src/content/es.ts');
      const esContent = fs.readFileSync(esPath, 'utf8');

      const transPath = path.join(__dirname, '../src/lib/dealAnalyzerTranslations.ts');
      const transContent = fs.readFileSync(transPath, 'utf8');

      // Portuguese must not contain Spanish Frecuentes, Preguntas, or Alquilar
      assert.ok(!ptContent.includes('Frecuentes'), 'pt.ts must NOT contain Spanish "Frecuentes"');
      assert.ok(!ptContent.includes('Preguntas'), 'pt.ts must NOT contain Spanish "Preguntas"');
      assert.ok(!ptContent.includes('Alquilar'), 'pt.ts must NOT contain Spanish "Alquilar"');

      // Spanish must not contain Portuguese Regras or Perguntas
      assert.ok(!esContent.includes('Regras'), 'es.ts must NOT contain Portuguese "Regras"');
      assert.ok(!esContent.includes('Perguntas'), 'es.ts must NOT contain Portuguese "Perguntas"');
      assert.ok(!esContent.includes('Alugar'), 'es.ts must NOT contain Portuguese "Alugar"');

      // Check translations file
      const esSection = transContent.substring(transContent.indexOf('es: {'), transContent.indexOf('pt: {'));
      assert.ok(!esSection.includes('Regras'), 'dealAnalyzerTranslations.ts ES section must NOT contain Portuguese "Regras"');
      assert.ok(esSection.includes('Evaluación de Reglas Ilustrativas'), 'dealAnalyzerTranslations.ts ES section must have "Reglas"');
    });

    await t.test('Micro-flaw regression: Detalhe spelling, Não in Cash-on-Cash, Loan Payment a11y labels, and brackets cleanup', () => {
      const calcIndexPath = path.join(__dirname, '../src/app/[locale]/calculators/page.tsx');
      const calcIndexContent = fs.readFileSync(calcIndexPath, 'utf8');
      assert.ok(!calcIndexContent.includes('Detallhe'), 'calculators/page.tsx must NOT contain typo "Detallhe"');
      assert.ok(calcIndexContent.includes('Detalhe'), 'calculators/page.tsx must contain correct Portuguese "Detalhe"');

      const cocPath = path.join(__dirname, '../src/app/[locale]/calculators/cash-on-cash/page.tsx');
      const cocContent = fs.readFileSync(cocPath, 'utf8');
      assert.ok(cocContent.includes("isPt ? 'Não' : 'No'"), 'cash-on-cash table must show "Não" for Portuguese');

      const loanCalcPath = path.join(__dirname, '../src/components/calculators/LoanPaymentCalculator.tsx');
      const loanCalcContent = fs.readFileSync(loanCalcPath, 'utf8');
      assert.ok(loanCalcContent.includes('Establecer monto del préstamo en'), 'Loan payment shortcut buttons must have Spanish aria-label');
      assert.ok(loanCalcContent.includes('Definir valor do financiamento em'), 'Loan payment shortcut buttons must have Portuguese aria-label');

      const ptContent = fs.readFileSync(path.join(__dirname, '../src/content/pt.ts'), 'utf8');
      const esContent = fs.readFileSync(path.join(__dirname, '../src/content/es.ts'), 'utf8');
      const enContent = fs.readFileSync(path.join(__dirname, '../src/content/en.ts'), 'utf8');
      assert.ok(!ptContent.includes('【') && !ptContent.includes('】'), 'pt.ts must NOT contain full-width brackets');
      assert.ok(!esContent.includes('【') && !esContent.includes('】'), 'es.ts must NOT contain full-width brackets');
      assert.ok(!enContent.includes('【') && !enContent.includes('】'), 'en.ts must NOT contain full-width brackets');
    });

    await t.test('P1 & P2 Audit Remediation: DSCR lender form disabled, no fake QR code, 4-locale city/property/legal pages', () => {
      const dscrCalcContent = fs.readFileSync(path.join(__dirname, '../src/components/calculators/DscrCalculator.tsx'), 'utf8');
      const translationsContent = fs.readFileSync(path.join(__dirname, '../src/lib/translations.ts'), 'utf8');
      assert.ok(!dscrCalcContent.includes('setLeadSubmitted(true)'), 'DscrCalculator must not fake lead submission');
      assert.ok(dscrCalcContent.includes('data-testid="dscr-lender-service-disabled"'), 'DscrCalculator must display service-disabled notice');
      assert.ok(!translationsContent.includes('Quote Request Received'), 'translations.ts must not contain fake Quote Request Received promise');
      assert.ok(!translationsContent.includes('vetted institutional CRE lenders'), 'translations.ts must not claim vetted institutional lender transmission');

      const dealToolContent = fs.readFileSync(path.join(__dirname, '../src/components/tools/DealAnalyzerTool.tsx'), 'utf8');
      const dealTransContent = fs.readFileSync(path.join(__dirname, '../src/lib/dealAnalyzerTranslations.ts'), 'utf8');
      assert.ok(!dealToolContent.includes('M3 3h6v6H3V3z'), 'DealAnalyzerTool must not render fake static QR SVG');
      assert.ok(!dealTransContent.includes('crecalculators.com/tools/deal-analyzer'), 'dealAnalyzerTranslations must not use non-localized 404 URL');
      assert.ok(!dealTransContent.includes('Scan QR'), 'dealAnalyzerTranslations must not mention Scan QR');

      const cityContent = fs.readFileSync(path.join(__dirname, '../src/content/cityCapRates.ts'), 'utf8');
      const propContent = fs.readFileSync(path.join(__dirname, '../src/content/propertyCapRates.ts'), 'utf8');
      assert.ok(!cityContent.includes('Current 2026'), 'cityCapRates.ts must not claim Current 2026 market quotes');
      assert.ok(!propContent.includes('Current 2026'), 'propertyCapRates.ts must not claim Current 2026 market quotes');
      assert.ok(cityContent.includes('es: {') && cityContent.includes('pt: {'), 'cityCapRates.ts must include es and pt locales');
      assert.ok(propContent.includes('es: {') && propContent.includes('pt: {'), 'propertyCapRates.ts must include es and pt locales');
    });

    await t.test('RFC 4180 CSV Export: UTF-8 BOM, strictly 3 columns, proper quoting and values matching UI', () => {
      // Direct unit test for escapeCsvCell helper
      assert.strictEqual(escapeCsvCell('simple'), 'simple');
      assert.strictEqual(escapeCsvCell('hello, world'), '"hello, world"');
      assert.strictEqual(escapeCsvCell('say "hi"'), '"say ""hi"""');
      assert.strictEqual(escapeCsvCell('line1\nline2'), '"line1\nline2"');
      assert.strictEqual(escapeCsvCell(12345), '12345');

      function parseRfc4180Csv(text) {
        assert.ok(text.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM');
        const clean = text.slice(1);
        const pRows = [];
        let curRow = [];
        let curCell = '';
        let inQuotes = false;

        for (let i = 0; i < clean.length; i++) {
          const ch = clean[i];
          const next = clean[i + 1];
          if (inQuotes) {
            if (ch === '"' && next === '"') {
              curCell += '"';
              i++;
            } else if (ch === '"') {
              inQuotes = false;
            } else {
              curCell += ch;
            }
          } else {
            if (ch === '"') {
              inQuotes = true;
            } else if (ch === ',') {
              curRow.push(curCell);
              curCell = '';
            } else if (ch === '\r' && next === '\n') {
              curRow.push(curCell);
              pRows.push(curRow);
              curRow = [];
              curCell = '';
              i++;
            } else if (ch === '\n' || ch === '\r') {
              curRow.push(curCell);
              pRows.push(curRow);
              curRow = [];
              curCell = '';
            } else {
              curCell += ch;
            }
          }
        }
        if (curCell.length > 0 || curRow.length > 0) {
          curRow.push(curCell);
          pRows.push(curRow);
        }
        return pRows;
      }

      // 1. Default scenario export
      const baseDefault = calculateSingleScenario(DEFAULT_DEAL_INPUT, 'en');
      const stressDefault = calculateSingleScenario({
        ...DEFAULT_DEAL_INPUT,
        vacancyRate: DEFAULT_DEAL_INPUT.vacancyRate + 5.0,
        interestRate: DEFAULT_DEAL_INPUT.interestRate + 1.0,
      }, 'en');
      const defaultCsv = generateDealAnalyzerCsv(DEFAULT_DEAL_INPUT, baseDefault, stressDefault);
      const defaultRows = parseRfc4180Csv(defaultCsv);

      assert.strictEqual(defaultRows.length, 9, 'CSV must have 9 rows');
      defaultRows.forEach((row, idx) => {
        assert.strictEqual(row.length, 3, `Row ${idx} must have strictly 3 columns, got ${row.length}`);
      });
      assert.deepStrictEqual(defaultRows[0], ['Metric', 'Base Case Value', 'Stress Test Value']);
      assert.strictEqual(defaultRows[1][0], 'Purchase Price');
      assert.strictEqual(defaultRows[1][1], '$2,800,000');
      assert.strictEqual(defaultRows[1][2], '$2,800,000');
      assert.strictEqual(defaultRows[2][0], 'Annual NOI');
      assert.strictEqual(defaultRows[2][1], '$227,200');
      assert.strictEqual(defaultRows[3][0], 'Cap Rate');
      assert.strictEqual(defaultRows[3][1], '8.11%');
      assert.strictEqual(defaultRows[4][0], 'DSCR');
      assert.strictEqual(defaultRows[4][1], '1.34x');

      // 2. Custom scenario with negative cash flow
      const customInput = {
        ...DEFAULT_DEAL_INPUT,
        purchasePrice: 5000000,
        grossPotentialIncome: 200000,
        vacancyRate: 10,
        operatingExpenses: 150000, // NOI = 180k - 150k = 30k, debt service ~303k => negative cash flow
      };
      const baseCustom = calculateSingleScenario(customInput, 'en');
      const stressCustom = calculateSingleScenario({
        ...customInput,
        vacancyRate: customInput.vacancyRate + 5.0,
        interestRate: customInput.interestRate + 1.0,
      }, 'en');
      const customCsv = generateDealAnalyzerCsv(customInput, baseCustom, stressCustom);
      const customRows = parseRfc4180Csv(customCsv);
      assert.strictEqual(customRows.length, 9);
      customRows.forEach((row, idx) => {
        assert.strictEqual(row.length, 3, `Custom row ${idx} must have strictly 3 columns`);
      });
      const netCashFlowRow = customRows.find(r => r[0] === 'Net Annual Cash Flow');
      assert.ok(netCashFlowRow, 'Net Annual Cash Flow row must exist');
      assert.ok(netCashFlowRow[1].startsWith('-$'), `Base cash flow must be negative, got ${netCashFlowRow[1]}`);
      assert.ok(netCashFlowRow[2].startsWith('-$'), `Stress cash flow must be negative, got ${netCashFlowRow[2]}`);

      // 3. Zero values scenario
      const zeroInput = {
        ...DEFAULT_DEAL_INPUT,
        purchasePrice: 0,
        grossPotentialIncome: 0,
        operatingExpenses: 0,
      };
      const baseZero = calculateSingleScenario(zeroInput, 'en');
      const stressZero = calculateSingleScenario(zeroInput, 'en');
      const zeroCsv = generateDealAnalyzerCsv(zeroInput, baseZero, stressZero);
      const zeroRows = parseRfc4180Csv(zeroCsv);
      zeroRows.forEach((row, idx) => {
        assert.strictEqual(row.length, 3, `Zero row ${idx} must have strictly 3 columns`);
      });
      assert.strictEqual(zeroRows[1][1], '$0');
      assert.strictEqual(zeroRows[2][1], '$0');
    });

    await t.test('Multifamily Cap Rate definition is balanced across all 4 locales without absolute valuation claims', () => {
      const enWhatIs = propertyCapRatesContent.en['multifamily-cap-rate'].whatIsContent;
      const zhWhatIs = propertyCapRatesContent.zh['multifamily-cap-rate'].whatIsContent;
      const esWhatIs = propertyCapRatesContent.es['multifamily-cap-rate'].whatIsContent;
      const ptWhatIs = propertyCapRatesContent.pt['multifamily-cap-rate'].whatIsContent;

      // English
      assert.ok(enWhatIs.includes('Cap Rate = Annual NOI ÷ Purchase Price; when sustainable NOI and an applicable market Cap Rate are known, NOI ÷ Cap Rate can be used as a valuation reference.'));
      assert.ok(!enWhatIs.includes('are valued primarily on their Net Operating Income'));

      // Chinese
      assert.ok(zhWhatIs.includes('Cap Rate = 年度 NOI ÷ 购买价格；在可持续 NOI 与适用 Cap Rate 已知时，可用 NOI ÷ Cap Rate 作估值参考。'));
      assert.ok(!zhWhatIs.includes('严格按照'));

      // Spanish
      assert.ok(esWhatIs.includes('Cap Rate = NOI Anual ÷ Precio de Compra; cuando se conocen el NOI sostenible y el Cap Rate aplicable del mercado, puede utilizarse NOI ÷ Cap Rate como referencia de valuación.'));
      assert.ok(!esWhatIs.includes('se valoran principalmente dividiendo su Ingreso'));

      // Portuguese
      assert.ok(ptWhatIs.includes('Cap Rate = NOI Anual ÷ Preço de Compra; quando o NOI sustentável e a taxa de capitalização aplicável de mercado são conhecidos, pode-se utilizar NOI ÷ Cap Rate como referência de avaliação.'));
      assert.ok(!ptWhatIs.includes('são avaliadas principalmente dividindo-se a Receita'));
    });

    await t.test('Exported PDF contains interactive /Link annotations and /URI for all 4 locales', async () => {
      const { jsPDF } = await import('jspdf');
      const locales = ['en', 'zh', 'es', 'pt'];
      for (const loc of locales) {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        doc.text('Deal Analyzer Underwriting Summary', 10, 10);
        const url = `https://crecalculators.com/${loc}/tools/deal-analyzer/`;
        doc.link(10, 260, 60, 8, { url });
        const pdfOutput = doc.output();
        assert.ok(pdfOutput.includes('/Link'), `PDF for ${loc} must contain /Link object`);
        assert.ok(pdfOutput.includes('/URI'), `PDF for ${loc} must contain /URI annotation`);
        assert.ok(pdfOutput.includes(url), `PDF for ${loc} must contain correct URL ${url}`);
      }
    });
  });
} catch (e) {
  console.error('Test setup or compilation failed:');
  console.error(e.stdout?.toString() || e.message);
  process.exit(1);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
