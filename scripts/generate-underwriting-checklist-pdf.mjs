import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Commercial Real Estate Underwriting Checklist</title>
<style>
  @page {
    size: letter portrait;
    margin: 10mm 12mm 10mm 12mm;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    background: #ffffff;
    margin: 0;
    padding: 0;
    font-size: 8.5pt;
    line-height: 1.35;
  }
  .header {
    border-bottom: 2px solid #059669;
    padding-bottom: 6px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    font-size: 14pt;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 2px 0;
    letter-spacing: -0.3px;
  }
  .header .subtitle {
    font-size: 8pt;
    color: #475569;
    font-weight: 500;
  }
  .header .badge {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #047857;
    font-size: 7.5pt;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .section {
    border: 1px solid #cbd5e1;
    border-radius: 5px;
    padding: 6px 8px;
    background: #ffffff;
  }
  .section.full {
    grid-column: 1 / -1;
  }
  .sec-header {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 9pt;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 3px;
    margin-bottom: 5px;
  }
  .sec-num {
    background: #0f172a;
    color: #ffffff;
    width: 14px;
    height: 14px;
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 7pt;
    font-weight: 800;
  }
  .sec-title {
    color: #047857;
    font-weight: 800;
  }
  ul.check-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ul.check-list li {
    position: relative;
    padding-left: 14px;
    margin-bottom: 3.5px;
    font-size: 8pt;
    color: #1e293b;
  }
  ul.check-list li::before {
    content: "□";
    position: absolute;
    left: 0;
    top: -1px;
    color: #059669;
    font-size: 9pt;
    font-weight: bold;
  }
  ul.check-list li strong {
    color: #0f172a;
  }
  .benchmark-box {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 4px;
    padding: 4px 6px;
    margin-top: 4px;
    font-size: 7.5pt;
    color: #334155;
  }
  .benchmark-box strong {
    color: #047857;
  }
  .footer {
    margin-top: 8px;
    border-top: 1px solid #e2e8f0;
    padding-top: 4px;
    display: flex;
    justify-content: space-between;
    font-size: 7pt;
    color: #64748b;
  }
  .footer strong {
    color: #059669;
  }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>Commercial Real Estate Underwriting Checklist</h1>
    <div class="subtitle">A 5-Stage Institutional Framework for Deal Sizing, Due Diligence & Investment Committee Review</div>
  </div>
  <div class="badge">crecalculators.com</div>
</div>

<div class="grid">
  <!-- Section 1 -->
  <div class="section">
    <div class="sec-header">
      <span class="sec-num">1</span>
      <span>Property & Rent Roll Due Diligence</span>
    </div>
    <ul class="check-list">
      <li><strong>Rent Roll vs Bank Deposits:</strong> Reconcile trailing 12-month actual collections against signed lease agreements; verify tenant concessions and delinquency.</li>
      <li><strong>Lease Rollover Schedule:</strong> Audit lease expiration concentration; ensure no single year exceeds 20% of net rentable area without structured capital reserves.</li>
      <li><strong>Tenant Credit & Co-Tenancy:</strong> Review anchor credit ratings, sales volume reporting thresholds, sublease clauses, and exclusive-use provisions.</li>
      <li><strong>Property Condition Assessment (PCA):</strong> Inspect roof life, HVAC age, foundation integrity, and ADA compliance. Budget immediate day-1 repair reserves.</li>
      <li><strong>Zoning & Title Review:</strong> Validate lawful conforming use, parking ratio compliance, easements, and absence of mechanics' or tax liens.</li>
    </ul>
    <div class="benchmark-box">
      <strong>Target Benchmark:</strong> WALT &gt; 4.0 years for commercial retail/industrial; lease collections &gt; 97% of billed rent.
    </div>
  </div>

  <!-- Section 2 -->
  <div class="section">
    <div class="sec-header">
      <span class="sec-num">2</span>
      <span>T-12 Quality of Earnings & NOI Normalization</span>
    </div>
    <ul class="check-list">
      <li><strong>Gross Potential Income (GPI):</strong> Baseline in-place rents; compare against submarket comps to establish realistic market rent upside.</li>
      <li><strong>Economic Vacancy & Credit Loss:</strong> Apply realistic market vacancy floor (underwrite 5.0%–8.0% minimum, even if historical is 0%).</li>
      <li><strong>Management Fee Normalization:</strong> Impute professional third-party management fee (4.0%–6.0% of EGI) if seller was self-managing.</li>
      <li><strong>Tax & Insurance Reassessment:</strong> Model post-sale property tax assessment at actual purchase price; obtain binding builder/hazard insurance quotes.</li>
      <li><strong>Replacement Reserves:</strong> Deduct ongoing capital reserve below the line ($250–$350/unit for multifamily; $0.15–$0.30/sqft for commercial).</li>
    </ul>
    <div class="benchmark-box">
      <strong>Rule of Thumb:</strong> Multifamily OpEx ratio typically 35%–45% of EGI; NNN retail/industrial OpEx 12%–20%.
    </div>
  </div>

  <!-- Section 3 -->
  <div class="section">
    <div class="sec-header">
      <span class="sec-num">3</span>
      <span>3-Way Commercial Debt Sizing Engine</span>
    </div>
    <ul class="check-list">
      <li><strong>Constraint 1: Maximum LTV Sizing:</strong> Compute loan cap = Property Purchase Price × Target LTV (typically 65%–75% for bank/agency loans).</li>
      <li><strong>Constraint 2: Minimum DSCR Sizing:</strong> Compute loan cap = Reconstructed NOI ÷ Minimum DSCR (1.25x) ÷ Annual Debt Constant (k).</li>
      <li><strong>Constraint 3: Minimum Debt Yield Sizing:</strong> Compute loan cap = Reconstructed NOI ÷ Lender Minimum Debt Yield (9.0%–10.0%).</li>
      <li><strong>Identify Binding Constraint:</strong> Pinpoint whether LTV, DSCR, or Debt Yield establishes the maximum permissible loan amount.</li>
      <li><strong>Amortization & Refinancing Terms:</strong> Model 20–30 year amortization schedule with balloon payoff at year 5, 7, or 10.</li>
    </ul>
    <div class="benchmark-box">
      <strong>Sizing Formula:</strong> Max Debt = MIN(Price × LTV, NOI ÷ DSCR ÷ k, NOI ÷ Target DY).
    </div>
  </div>

  <!-- Section 4 -->
  <div class="section">
    <div class="sec-header">
      <span class="sec-num">4</span>
      <span>Equity Capital & Leveraged Return Yields</span>
    </div>
    <ul class="check-list">
      <li><strong>Total Cash Required:</strong> Sum purchase down payment (25%–35%) + closing costs (1.5%–2.5%) + lender escrow reserves + upfront capex.</li>
      <li><strong>Year-1 Cash-on-Cash Return:</strong> Calculate pre-tax net cash flow (NOI − Annual Debt Service) ÷ Total Initial Cash Invested.</li>
      <li><strong>Positive vs Negative Leverage Check:</strong> Compare Going-In Cap Rate against the Annual Debt Constant. If Debt Constant &gt; Cap Rate, leverage is dilutive.</li>
      <li><strong>Unleveraged vs Leveraged IRR:</strong> Run 5-to-10 year discounted cash flow projection with terminal exit cap rate expanded by 25–50 bps.</li>
      <li><strong>Sponsor Waterfall Structure:</strong> Define preferred return hurdles (7%–8%) and promote splits (80/20, 70/30) for LP investors.</li>
    </ul>
    <div class="benchmark-box">
      <strong>Target Return:</strong> Class B core-plus multifamily target CoC 7.5%–9.5%; 10-year levered IRR 13.0%–16.0%.
    </div>
  </div>

  <!-- Section 5 -->
  <div class="section full">
    <div class="sec-header">
      <span class="sec-num">5</span>
      <span>Downside Sensitivity, Stress Testing & IC Decision Matrix</span>
    </div>
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
      <ul class="check-list">
        <li><strong>Interest Rate Shock (+100 bps / +200 bps):</strong> Re-evaluate DSCR and cash flow if floating rate resets or refinancing rate spikes at loan maturity.</li>
        <li><strong>Vacancy Stress (+300 bps / +500 bps):</strong> Verify Break-Even Occupancy = (OpEx + Debt Service) ÷ GPI. Must remain comfortably below 80%.</li>
        <li><strong>Expense Inflation (+10% Spike):</strong> Stress test property tax reassessment spikes, utility tariff jumps, and insurance premium increases.</li>
        <li><strong>Refinancing Exit Test:</strong> Ensure exit loan balance can be refinanced at year 10 assuming terminal cap rate expands by 50 bps.</li>
      </ul>
      <div style="border-left: 1px solid #e2e8f0; padding-left: 8px;">
        <div style="font-weight: 700; font-size: 8pt; color: #0f172a; margin-bottom: 3px;">Investment Decision Matrix:</div>
        <div style="font-size: 7.5pt; color: #334155; line-height: 1.4;">
          <div><strong style="color: #059669;">✔ PASS / ADVANCE:</strong> DSCR ≥ 1.30x under base case, ≥ 1.15x under +100 bps shock; CoC ≥ 8.0%.</div>
          <div><strong style="color: #d97706;">⚠ RE-TRADE / ADJUST:</strong> Binding DSCR curtails loan; renegotiate asking price to restore equity yield.</div>
          <div><strong style="color: #dc2626;">✖ WALK AWAY:</strong> Negative leverage, BER &gt; 85%, or environmental / structural defects.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="footer">
  <div>Published by <strong>crecalculators.com</strong> • Free institutional commercial real estate underwriting resources</div>
  <div>Interactive Calculators: Cap Rate • NOI • DSCR Sizing • Cash-on-Cash • Deal Analyzer</div>
</div>

</body>
</html>
`;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');

  const outDir = path.resolve('public/assets');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPdf = path.join(outDir, 'commercial-real-estate-underwriting-checklist.pdf');
  await page.pdf({
    path: outPdf,
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '10mm',
      bottom: '10mm',
      left: '12mm',
      right: '12mm'
    }
  });

  await browser.close();

  const stats = fs.statSync(outPdf);
  console.log(`Successfully generated vector PDF: ${outPdf}`);
  console.log(`File size: ${stats.size} bytes (${(stats.size / 1024).toFixed(1)} KB)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
