import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ogDir = path.join(__dirname, '..', 'public', 'og');

if (!fs.existsSync(ogDir)) {
  fs.mkdirSync(ogDir, { recursive: true });
}

const templates = [
  // 1. Default Brand (EN)
  {
    filename: 'cre-calculators-default.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">Commercial Real Estate Suite</span>
        </div>
        <div class="content">
          <h1 class="title">Commercial Real Estate Decision Tools</h1>
          <p class="subtitle">Client-side underwriting calculators for Cap Rate, NOI, Cash-on-Cash, DSCR, and 1031 Exchange analysis.</p>
          <div class="grid grid-4">
            <div class="metric-card">
              <span class="m-label">Cap Rate</span>
              <span class="m-val highlight">8.11%</span>
              <span class="m-sub">Going-in Yield</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Annual NOI</span>
              <span class="m-val">$227,200</span>
              <span class="m-sub">In-place Rents</span>
            </div>
            <div class="metric-card">
              <span class="m-label">DSCR</span>
              <span class="m-val highlight">1.34x</span>
              <span class="m-sub">Lender Cushion</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Cash-on-Cash</span>
              <span class="m-val">7.55%</span>
              <span class="m-sub">Leveraged Yield</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com</span>
          <span class="tagline">Instant • Accurate • Client-Side</span>
        </div>
      </div>
    `,
  },
  // 1b. Default Brand (ZH)
  {
    filename: 'cre-calculators-default-zh.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">美国商业地产投资决策工具包</span>
        </div>
        <div class="content">
          <h1 class="title">专业商业地产投资与承销计算套件</h1>
          <p class="subtitle">覆盖资本化率 Cap Rate、净营业收入 NOI、偿债覆盖率 DSCR、现金回报率 CoC 与 1031 置换深度测算。</p>
          <div class="grid grid-4">
            <div class="metric-card">
              <span class="m-label">资本化率 Cap Rate</span>
              <span class="m-val highlight">8.11%</span>
              <span class="m-sub">基准收益率</span>
            </div>
            <div class="metric-card">
              <span class="m-label">年净收益 NOI</span>
              <span class="m-val">$227,200</span>
              <span class="m-sub">在租真实营运</span>
            </div>
            <div class="metric-card">
              <span class="m-label">偿债覆盖率 DSCR</span>
              <span class="m-val highlight">1.34x</span>
              <span class="m-sub">银行审贷安全垫</span>
            </div>
            <div class="metric-card">
              <span class="m-label">现金回报率 CoC</span>
              <span class="m-val">7.55%</span>
              <span class="m-sub">杠杆现金收益</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/zh/</span>
          <span class="tagline">即时测算 • 透明公式 • 本地运行</span>
        </div>
      </div>
    `,
  },
  // 2. Deal Analyzer (EN)
  {
    filename: 'deal-analyzer.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">Comprehensive Underwriting Suite</span>
        </div>
        <div class="content">
          <h1 class="title">Commercial Real Estate Deal Analyzer</h1>
          <p class="subtitle">Unified financial modeling: Cap Rate, DSCR, Cash-on-Cash, and Break-Even from a single input set with instant stress testing.</p>
          <div class="grid grid-3">
            <div class="metric-card">
              <span class="m-label">Base Case Underwriting</span>
              <span class="m-val highlight">1.34x DSCR</span>
              <span class="m-sub">8.11% Cap Rate • 7.55% CoC</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Stress Case (+100 bps / +5 ppt)</span>
              <span class="m-val text-amber">1.19x DSCR</span>
              <span class="m-sub">7.51% Cap Rate • 4.52% CoC</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Evaluation & Export</span>
              <span class="m-val highlight">Healthy Deal</span>
              <span class="m-sub">One-Page PDF Summary</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/en/tools/deal-analyzer/</span>
          <span class="tagline">Institutional Modeling in One Click</span>
        </div>
      </div>
    `,
  },
  // 2b. Deal Analyzer (ZH)
  {
    filename: 'deal-analyzer-zh.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">全流程综合尽调与承销套件</span>
        </div>
        <div class="content">
          <h1 class="title">Deal Analyzer 商业地产综合尽调工具</h1>
          <p class="subtitle">单次输入全量测算 Cap Rate、DSCR、CoC、保本出租率，支持 +100 bps 加息与 +5 百分点空置压力测试。</p>
          <div class="grid grid-3">
            <div class="metric-card">
              <span class="m-label">基准情景测算</span>
              <span class="m-val highlight">1.34x DSCR</span>
              <span class="m-sub">8.11% Cap Rate • 7.55% CoC</span>
            </div>
            <div class="metric-card">
              <span class="m-label">压力测试情景 (+100 bps/+5%)</span>
              <span class="m-val text-amber">1.19x DSCR</span>
              <span class="m-sub">7.51% Cap Rate • 4.52% CoC</span>
            </div>
            <div class="metric-card">
              <span class="m-label">综合诊断与报告</span>
              <span class="m-val highlight">稳健达标 (Healthy)</span>
              <span class="m-sub">支持一页纸 PDF 导出</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/zh/tools/deal-analyzer/</span>
          <span class="tagline">专业承销 • 压力测试 • 报告导出</span>
        </div>
      </div>
    `,
  },
  // 3. Cap Rate (EN)
  {
    filename: 'cap-rate-calculator.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">Property Valuation & Pricing</span>
        </div>
        <div class="content">
          <h1 class="title">Commercial Real Estate Cap Rate Calculator</h1>
          <p class="subtitle">Calculate capitalization rate from purchase price and NOI, or reverse-calculate the maximum acquisition price for a target yield.</p>
          <div class="grid grid-3">
            <div class="metric-card">
              <span class="m-label">Forward Calculation</span>
              <span class="m-val highlight">Cap Rate (%)</span>
              <span class="m-sub">NOI ÷ Purchase Price</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Reverse Valuation</span>
              <span class="m-val highlight">Max Price ($)</span>
              <span class="m-sub">NOI ÷ Target Cap Rate</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Market Benchmark</span>
              <span class="m-val highlight">0% – 12%</span>
              <span class="m-sub">Indicative Yield Scale</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/en/calculators/cap-rate/</span>
          <span class="tagline">Dual-Mode Valuation Engine</span>
        </div>
      </div>
    `,
  },
  // 3b. Cap Rate (ZH)
  {
    filename: 'cap-rate-calculator-zh.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">商业地产估值与定价工具</span>
        </div>
        <div class="content">
          <h1 class="title">Cap Rate 资本化率计算器</h1>
          <p class="subtitle">从购买价格与年净收益 NOI 快速计算资本化率，或按目标收益率反向推算最高可承受购买价格。</p>
          <div class="grid grid-3">
            <div class="metric-card">
              <span class="m-label">正向测算</span>
              <span class="m-val highlight">资本化率 Cap Rate</span>
              <span class="m-sub">NOI ÷ 购买价格</span>
            </div>
            <div class="metric-card">
              <span class="m-label">反向估值</span>
              <span class="m-val highlight">最高购买价</span>
              <span class="m-sub">NOI ÷ 目标 Cap Rate</span>
            </div>
            <div class="metric-card">
              <span class="m-label">收益参考标尺</span>
              <span class="m-val highlight">0% – 12%</span>
              <span class="m-sub">中性参考收益率区间</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/zh/calculators/cap-rate/</span>
          <span class="tagline">双向估值 • 即时响应 • 市场标尺</span>
        </div>
      </div>
    `,
  },
  // 4. DSCR (EN)
  {
    filename: 'dscr-calculator.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">Debt & Lender Underwriting</span>
        </div>
        <div class="content">
          <h1 class="title">Commercial Real Estate DSCR Calculator</h1>
          <p class="subtitle">Calculate Debt Service Coverage Ratio from NOI and annual mortgage debt service, then benchmark against commercial lender thresholds.</p>
          <div class="grid grid-3">
            <div class="metric-card">
              <span class="m-label">DSCR Ratio</span>
              <span class="m-val highlight">NOI ÷ Debt</span>
              <span class="m-sub">Annual Cash Flow Coverage</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Bank Threshold</span>
              <span class="m-val highlight">≥ 1.25x</span>
              <span class="m-sub">Standard Underwriting Tier</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Max Allowable Loan</span>
              <span class="m-val highlight">Target Debt</span>
              <span class="m-sub">Max Debt for 1.25x DSCR</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/en/calculators/dscr/</span>
          <span class="tagline">Commercial Lender Safety Margin Analysis</span>
        </div>
      </div>
    `,
  },
  // 4b. DSCR (ZH)
  {
    filename: 'dscr-calculator-zh.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">商业地产借贷与承销工具</span>
        </div>
        <div class="content">
          <h1 class="title">DSCR 偿债覆盖率计算器</h1>
          <p class="subtitle">精准测算物业年 NOI 对抵押贷款年还债总额的覆盖倍数，对标商业银行 1.20x–1.25x 核心准入门槛。</p>
          <div class="grid grid-3">
            <div class="metric-card">
              <span class="m-label">偿债覆盖率</span>
              <span class="m-val highlight">NOI ÷ 还款额</span>
              <span class="m-sub">现金流偿债安全倍数</span>
            </div>
            <div class="metric-card">
              <span class="m-label">银行标准门槛</span>
              <span class="m-val highlight">≥ 1.25x</span>
              <span class="m-sub">主流商业机构审贷线</span>
            </div>
            <div class="metric-card">
              <span class="m-label">最高允许负债</span>
              <span class="m-val highlight">反推年还贷</span>
              <span class="m-sub">满足 1.25x 的债务上限</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/zh/calculators/dscr/</span>
          <span class="tagline">审贷合规 • 现金缓冲 • 额度测算</span>
        </div>
      </div>
    `,
  },
  // 5. 1031 Exchange (EN)
  {
    filename: '1031-exchange.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">IRS §1031 Tax Deferral</span>
        </div>
        <div class="content">
          <h1 class="title">1031 Exchange Tax Deferral Calculator</h1>
          <p class="subtitle">Estimate capital gains tax deferral and review strict statutory timelines: 45-day identification and 180-day closing deadlines.</p>
          <div class="grid grid-3">
            <div class="metric-card">
              <span class="m-label">Tax Deferral</span>
              <span class="m-val highlight">Federal & State</span>
              <span class="m-sub">Capital Gains + Depreciation</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Day 45 Window</span>
              <span class="m-val text-amber">45 Calendar Days</span>
              <span class="m-sub">Strict Property Identification</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Day 180 Deadline</span>
              <span class="m-val highlight">180 Calendar Days</span>
              <span class="m-sub">Final Title Closing Deadline</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/en/calculators/1031-exchange/</span>
          <span class="tagline">Tax Planning • Statutory Timeline Visualization</span>
        </div>
      </div>
    `,
  },
  // 5b. 1031 Exchange (ZH)
  {
    filename: '1031-exchange-zh.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">美国税法 §1031 同类置换</span>
        </div>
        <div class="content">
          <h1 class="title">1031 Exchange 延税计算器</h1>
          <p class="subtitle">估算联邦与州资本利得税及折旧回收税延税金额，掌握 45 天识别期与 180 天置换期法定关键节点。</p>
          <div class="grid grid-3">
            <div class="metric-card">
              <span class="m-label">延税总额估算</span>
              <span class="m-val highlight">资本利得延税</span>
              <span class="m-sub">联邦 + 州税 + 折旧回收</span>
            </div>
            <div class="metric-card">
              <span class="m-label">第 45 天识别期</span>
              <span class="m-val text-amber">45 日历天</span>
              <span class="m-sub">向 QI 提交书面替代清单</span>
            </div>
            <div class="metric-card">
              <span class="m-label">第 180 天置换期</span>
              <span class="m-val highlight">180 日历天</span>
              <span class="m-sub">替代物业最终交割截止</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/zh/calculators/1031-exchange/</span>
          <span class="tagline">税务筹划 • 法定时间轴 • 置换规则</span>
        </div>
      </div>
    `,
  },
  // 6. Guides (EN)
  {
    filename: 'cre-guides.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">Knowledge Base & Benchmarks</span>
        </div>
        <div class="content">
          <h1 class="title">Commercial Real Estate Underwriting Guides</h1>
          <p class="subtitle">Practical frameworks for NOI estimation, city cap rate benchmarks, DSCR financing standards, and deal underwriting due diligence.</p>
          <div class="grid grid-3">
            <div class="metric-card">
              <span class="m-label">Underwriting Framework</span>
              <span class="m-val highlight">6-Step Workflow</span>
              <span class="m-sub">From Screening to LOI</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Market Intelligence</span>
              <span class="m-val highlight">City Benchmarks</span>
              <span class="m-sub">Cap Rates by Metro Tier</span>
            </div>
            <div class="metric-card">
              <span class="m-label">Financial Modeling</span>
              <span class="m-val highlight">NOI & DSCR</span>
              <span class="m-sub">Normalization Methods</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/en/guides/</span>
          <span class="tagline">Practical Real Estate Due Diligence</span>
        </div>
      </div>
    `,
  },
  // 6b. Guides (ZH)
  {
    filename: 'cre-guides-zh.png',
    html: `
      <div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
            </div>
            <span class="brand-name">CRE Calculators</span>
          </div>
          <span class="badge">实战指南与市场基准</span>
        </div>
        <div class="content">
          <h1 class="title">商业地产投资与承销实战指南</h1>
          <p class="subtitle">系统掌握净营业收入 NOI 重构、全美主流城市 Cap Rate 基准、DSCR 审贷流程与 6 步标准尽调方法论。</p>
          <div class="grid grid-3">
            <div class="metric-card">
              <span class="m-label">承销方法论</span>
              <span class="m-val highlight">6 步尽调闭环</span>
              <span class="m-sub">从初筛到出价决策</span>
            </div>
            <div class="metric-card">
              <span class="m-label">全美市场数据</span>
              <span class="m-val highlight">城市基准线</span>
              <span class="m-sub">核心与次核心城市梯队</span>
            </div>
            <div class="metric-card">
              <span class="m-label">财务量化分析</span>
              <span class="m-val highlight">NOI 与 DSCR</span>
              <span class="m-sub">报表重构与风控指引</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span class="url">crecalculators.com/zh/guides/</span>
          <span class="tagline">严谨 • 深度 • 实用商业地产尽调</span>
        </div>
      </div>
    `,
  },
];

const css = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  body {
    width: 1200px;
    height: 630px;
    background: #0b1329;
    color: #ffffff;
    display: flex;
    overflow: hidden;
  }
  .card {
    width: 1200px;
    height: 630px;
    padding: 56px 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #0b1329;
    border: 1px solid #1e293b;
    position: relative;
    box-sizing: border-box;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .logo {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand-name {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #ffffff;
  }
  .badge {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 8px 16px;
    border-radius: 9999px;
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 6px;
  }
  .title {
    font-size: 44px;
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -1px;
    color: #ffffff;
  }
  .subtitle {
    font-size: 19px;
    font-weight: 400;
    line-height: 1.45;
    color: #94a3b8;
    max-width: 960px;
  }
  .grid {
    display: grid;
    gap: 16px;
    margin-top: 8px;
  }
  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  .metric-card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .m-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #64748b;
  }
  .m-val {
    font-size: 26px;
    font-weight: 900;
    color: #f8fafc;
    font-feature-settings: "tnum";
  }
  .m-val.highlight {
    color: #10b981;
  }
  .m-val.text-amber {
    color: #f59e0b;
  }
  .m-sub {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 18px;
  }
  .url {
    font-size: 18px;
    font-weight: 700;
    color: #38bdf8;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    white-space: nowrap;
  }
  .tagline {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    white-space: nowrap;
  }
`;

async function main() {
  console.log('Launching headless browser to render OG social sharing cards (1200x630)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  for (const item of templates) {
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${css}</style>
        </head>
        <body>
          ${item.html}
        </body>
      </html>
    `;
    await page.setContent(fullHtml, { waitUntil: 'domcontentloaded' });
    const targetPath = path.join(ogDir, item.filename);
    await page.screenshot({ path: targetPath, type: 'png' });
    const stats = fs.statSync(targetPath);
    console.log(`Generated: ${item.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
  }

  await browser.close();
  console.log('All OG images generated successfully in public/og/!');
}

main().catch(err => {
  console.error('Error generating OG images:', err);
  process.exit(1);
});
