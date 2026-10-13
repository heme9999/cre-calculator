import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isBadBerOccupancy } from '../scripts/lib/seo-semantic-validation.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

test('New to CRE Onboarding & Jargon Clarity Regression Tests', async (t) => {
  const homePage = fs.readFileSync(path.join(rootDir, 'src/app/[locale]/page.tsx'), 'utf8');
  const previewComp = fs.readFileSync(path.join(rootDir, 'src/components/home/DealAnalyzerPreview.tsx'), 'utf8');
  const capRateComp = fs.readFileSync(path.join(rootDir, 'src/components/calculators/CapRateCalculator.tsx'), 'utf8');
  const noiComp = fs.readFileSync(path.join(rootDir, 'src/components/calculators/NoiCalculator.tsx'), 'utf8');
  const dealAnalyzerComp = fs.readFileSync(path.join(rootDir, 'src/components/tools/DealAnalyzerTool.tsx'), 'utf8');
  const enContent = fs.readFileSync(path.join(rootDir, 'src/content/en.ts'), 'utf8');
  const zhContent = fs.readFileSync(path.join(rootDir, 'src/content/zh.ts'), 'utf8');

  await t.test('1. Homepage has "New to CRE? Start here / 商业地产新手？从这里开始" 3-step path and full DSCR/BER explanations', () => {
    assert.ok(homePage.includes('New to CRE? Start here'), 'Homepage must include "New to CRE? Start here"');
    assert.ok(homePage.includes('商业地产新手？从这里开始'), 'Homepage must include "商业地产新手？从这里开始"');
    assert.ok(homePage.includes('data-testid="new-to-cre-start-here"'), 'Homepage onboarding nav must have data-testid');

    // Links to the 3-step existing pages
    assert.ok(homePage.includes('href={`/${locale}/calculators/noi/`}'), 'Step 1 links to /calculators/noi/');
    assert.ok(homePage.includes('href={`/${locale}/calculators/cap-rate/`}'), 'Step 2 links to /calculators/cap-rate/');
    assert.ok(homePage.includes('href={`/${locale}/tools/deal-analyzer/`}'), 'Step 3 links to /tools/deal-analyzer/');

    // First appearance of DSCR & BER includes full name + plain-language explanation
    assert.ok(homePage.includes('Debt Service Coverage Ratio'), 'Homepage explains DSCR full name');
    assert.ok(homePage.includes('Break-Even Ratio'), 'Homepage explains BER full name');
    assert.ok(previewComp.includes('NOI ÷ Annual Debt'), 'Homepage preview explains DSCR in plain formula terms');
    assert.ok(previewComp.includes('Break-Even Ratio (BER)'), 'Homepage preview shows full name and BER acronym');
  });

  await t.test('2. Cap Rate Calculator NOI input has always-visible formula explanation and link to NOI calculator', () => {
    assert.ok(capRateComp.includes('htmlFor="caprate-noi-input"'), 'NOI label is bound to input via htmlFor');
    assert.ok(capRateComp.includes('aria-describedby="caprate-noi-help"'), 'NOI input is bound to helper text via aria-describedby');
    assert.ok(capRateComp.includes('href={`/${locale}/calculators/noi/`}'), 'Cap Rate NOI helper links directly to NOI calculator');
    assert.ok(capRateComp.includes('How to calculate NOI'), 'EN "How to calculate NOI" link text present');
    assert.ok(capRateComp.includes('不知道如何计算 NOI？用 NOI 计算器分步算出'), 'ZH NOI calculator link text present');
    assert.ok(noiComp.includes('href={`/${locale}/calculators/cap-rate/`}'), 'NOI calculator links forward to Cap Rate');
  });

  await t.test('3. Deal Analyzer has always-visible explanations and links for GPI, EGI, NOI, DSCR, BER, and BEO', () => {
    assert.ok(dealAnalyzerComp.includes('aria-describedby="gpi-help"'), 'GPI input has aria-describedby helper');
    assert.ok(dealAnalyzerComp.includes('100% full-occupancy annual rent'), 'GPI helper explains full-occupancy rent');
    assert.ok(dealAnalyzerComp.includes('GPI × (1 − Vacancy %)'), 'EGI formula explanation is always visible');
    assert.ok(dealAnalyzerComp.includes('EGI − Operating Expenses (OpEx)'), 'NOI formula explanation is always visible');
    assert.ok(dealAnalyzerComp.includes('NOI ÷ Annual Debt Service'), 'DSCR formula explanation is always visible');
    assert.ok(dealAnalyzerComp.includes('(Operating Expenses + Annual Debt Service) ÷ EGI'), 'BER formula explanation is always visible');
    assert.ok(dealAnalyzerComp.includes('(Operating Expenses + Annual Debt Service) ÷ GPI'), 'BEO formula explanation is always visible');

    // Links to standalone calculators
    assert.ok(dealAnalyzerComp.includes('href={`/${locale}/calculators/noi/`}'), 'Links to NOI calculator');
    assert.ok(dealAnalyzerComp.includes('href={`/${locale}/calculators/cap-rate/`}'), 'Links to Cap Rate calculator');
    assert.ok(dealAnalyzerComp.includes('href={`/${locale}/calculators/cash-on-cash/`}'), 'Links to Cash-on-Cash calculator');
    assert.ok(dealAnalyzerComp.includes('href={`/${locale}/calculators/dscr/`}'), 'Links to DSCR calculator');
    assert.ok(dealAnalyzerComp.includes('href={`/${locale}/calculators/break-even-ratio/`}'), 'Links to Break-Even Ratio calculator');

    // Expandable banner supports aria-expanded and Escape key
    assert.ok(dealAnalyzerComp.includes('aria-expanded={isInfoExpanded}'), 'Expandable banner has aria-expanded');
    assert.ok(dealAnalyzerComp.includes("e.key === 'Escape' && isInfoExpanded"), 'Expandable banner closes on Escape');

    // Semantic validation check
    assert.strictEqual(isBadBerOccupancy(dealAnalyzerComp), false, 'DealAnalyzerTool.tsx must not confuse BER with occupancy');
  });

  await t.test('4. Underwriting Guide defines comps, T-12, rent roll, bps, and pencils inline in both EN and ZH', () => {
    // English inline definitions
    assert.ok(
      enContent.includes('comparable sales (\\"comps\\" — recent closed sales or leases of similar nearby properties used as pricing benchmarks)'),
      'EN guide defines comps inline'
    );
    assert.ok(
      enContent.includes('trailing-12 (T-12 — an income and expense statement showing actual monthly operating performance over the past 12 months)'),
      'EN guide defines T-12 inline'
    );
    assert.ok(
      enContent.includes('rent roll (the unit-by-unit or suite-by-suite schedule of tenants, lease terms, contracted rents, and vacancies)'),
      'EN guide defines rent roll inline'
    );
    assert.ok(
      enContent.includes('bps (basis points, where 100 bps = 1.00 percentage point)'),
      'EN guide defines bps inline'
    );
    assert.ok(
      enContent.includes('\\"pencils\\" (industry shorthand meaning the numbers still work and meet your cash flow and debt-coverage targets when calculated)'),
      'EN guide defines pencils inline'
    );

    // Chinese inline definitions
    assert.ok(
      zhContent.includes('可比成交案例（comps，即 comparable sales，指附近条件相近物业近期真实成交或出租的价格参考）'),
      'ZH guide defines comps inline'
    );
    assert.ok(
      zhContent.includes('Trailing-12（简称 T-12，即过去连续 12 个月逐月记录实际租金收入与运营支出的损益表）'),
      'ZH guide defines T-12 inline'
    );
    assert.ok(
      zhContent.includes('租约清单（rent roll，即逐户或逐铺位列出租客、租期、合同租金及空置状态的明细表）'),
      'ZH guide defines rent roll inline'
    );
    assert.ok(
      zhContent.includes('基点（bps，即 basis points，100 bps = 1.00 个百分点）'),
      'ZH guide defines bps inline'
    );
    assert.ok(
      zhContent.includes('“算得过账”（英文行话叫 the deal still pencils，指把各项收入、开支和贷款代入表格测算后，现金流与偿债指标依然能跑通并达到目标门槛）'),
      'ZH guide defines pencils inline'
    );
  });
});
