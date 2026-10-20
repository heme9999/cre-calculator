import { FAQItem } from './types';
import { calculateLoanDetails } from '../lib/loanCalculations';

export interface PropertyCapRateContent {
  slug: string;
  propertyTypeName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  defaultPrice: number;
  defaultNoi: number;
  benchmarkRange: string;
  whatIsTitle: string;
  whatIsContent: string;
  metricsExploration: {
    title: string;
    points: { label: string; text?: string; desc?: string }[];
  };
  workedExample: {
    title: string;
    intro: string;
    points: string[];
    analysis: string;
  };
  pitfallsTitle: string;
  pitfalls: { title: string; desc: string }[];
  faqs: FAQItem[];
}

export const PROPERTY_CAP_RATE_SLUGS = [
  'multifamily-cap-rate',
  'industrial-cap-rate',
  'self-storage-cap-rate',
  'nnn-lease-cap-rate',
] as const;

export type PropertyCapRateSlug = (typeof PROPERTY_CAP_RATE_SLUGS)[number];

// Shared deterministic worked-example math for Multifamily (32-unit example)
const MF_PRICE = 3500000;
const MF_GPI = 385000;
const MF_VACANCY_RATE = 5.0;
const MF_VACANCY_LOSS = MF_GPI * (MF_VACANCY_RATE / 100); // $19,250
const MF_EGI = MF_GPI - MF_VACANCY_LOSS; // $365,750
const MF_OPEX_AND_RESERVES = 147000; // Includes $12,000 ($375/unit) capital replacement reserve
const MF_NOI = MF_EGI - MF_OPEX_AND_RESERVES; // $218,750
const MF_CAP_RATE = (MF_NOI / MF_PRICE) * 100; // 6.25%
const MF_DOWN_PCT = 35;
const MF_CLOSING_PCT = 2.0;
const MF_DOWN_PAYMENT = MF_PRICE * (MF_DOWN_PCT / 100); // $1,225,000
const MF_CLOSING_COSTS = MF_PRICE * (MF_CLOSING_PCT / 100); // $70,000
const MF_TOTAL_CASH = MF_DOWN_PAYMENT + MF_CLOSING_COSTS; // $1,295,000
const MF_LOAN_AMOUNT = MF_PRICE - MF_DOWN_PAYMENT; // $2,275,000
const MF_INTEREST_RATE = 5.85;
const MF_AMORT_YEARS = 30;
const MF_LOAN_RES = calculateLoanDetails({
  loanAmount: MF_LOAN_AMOUNT,
  interestRate: MF_INTEREST_RATE,
  amortizationYears: MF_AMORT_YEARS,
  balloonYears: MF_AMORT_YEARS,
  hasBalloon: false,
  paymentType: 'installment',
});
const MF_ADS = Math.round(MF_LOAN_RES.firstYearDebtService); // $161,054 (monthly ~$13,421.16)
const MF_DEBT_CONSTANT = (MF_LOAN_RES.firstYearDebtService / MF_LOAN_AMOUNT) * 100; // 7.08%
const MF_DSCR = MF_NOI / MF_LOAN_RES.firstYearDebtService; // 1.36x
const MF_PRETAX_CF = Math.round(MF_NOI - MF_LOAN_RES.firstYearDebtService); // $57,696
const MF_COC = ((MF_NOI - MF_LOAN_RES.firstYearDebtService) / MF_TOTAL_CASH) * 100; // 4.46%

export const propertyCapRatesContent: Record<string, Record<PropertyCapRateSlug, PropertyCapRateContent>> = {
  en: {
    'multifamily-cap-rate': {
      slug: 'multifamily-cap-rate',
      propertyTypeName: 'Multifamily (5+ Units)',
      metaTitle: 'Multifamily Cap Rate Calculator | Apartment Underwriting Scenarios',
      metaDescription:
        'Calculate capitalization rates for 5+ unit apartment buildings using illustrative underwriting ranges, expense ratio structures, and step-by-step NOI examples.',
      h1: 'Multifamily Cap Rate Calculator & Underwriting Scenarios',
      subtitle:
        'Evaluate 5+ unit apartment acquisitions using the universal Cap Rate formula (NOI ÷ Purchase Price) alongside illustrative Class A, B, and C modeling assumptions.',
      defaultPrice: MF_PRICE,
      defaultNoi: MF_NOI,
      benchmarkRange: '4.75% – 6.75% (Illustrative)',
      whatIsTitle: 'How Multifamily Cap Rate Modeling Works',
      whatIsContent:
        'In commercial real estate (CRE), Cap Rate = Annual NOI ÷ Purchase Price; when sustainable NOI and an applicable market Cap Rate are known, NOI ÷ Cap Rate can be used as a valuation reference. Because residential leases typically reset every 12 months, apartment income streams adjust more quickly to local rent and occupancy shifts than long-term commercial leases.\n\nIn educational underwriting models, newer Class A apartments are commonly modeled with lower illustrative cap rates (e.g., 4.75% to 5.50%) to reflect lower near-term capital expenditure needs, whereas older Class B and Class C value-add properties are often modeled at higher illustrative yields (e.g., 5.50% to 6.75%+) to account for unit turnover, maintenance reserves, and renovation risk. These ranges are illustrative modeling assumptions—not live market quotes.',
      metricsExploration: {
        title: 'Key Multifamily Underwriting Drivers',
        points: [
          {
            label: 'Illustrative Expense Ratios (35% – 50% of EGI)',
            text: 'Multifamily landlords typically pay property taxes, property insurance, common-area utilities, on-site management, and routine unit turn costs. Underwriting below a 35% expense ratio on older garden apartments often overstates NOI.',
          },
          {
            label: 'Debt Constant vs. Going-In Cap Rate',
            text: 'A nominal interest rate below the Cap Rate does not automatically create positive cash-flow leverage. Because 25–30 year amortizing loans include principal paydown, the annual debt constant must be compared against the Cap Rate.',
          },
          {
            label: 'Replacement Reserves ($250–$450 / Unit / Year)',
            text: 'Prudent apartment underwriting deducts recurring capital reserves for HVAC, appliances, roofs, and flooring before arriving at sustainable cash flow.',
          },
        ],
      },
      workedExample: {
        title: 'Worked Multifamily Underwriting Example (32-Unit Garden Apartment)',
        intro:
          'Consider an illustrative acquisition of a 32-unit Class B multifamily property using explicit income, reserve, and amortizing debt assumptions:',
        points: [
          `Purchase Price: $${MF_PRICE.toLocaleString()} ($109,375 per unit) | Closing Costs (2.0%): $${MF_CLOSING_COSTS.toLocaleString()}`,
          `Gross Potential Income (GPI): $${MF_GPI.toLocaleString()}/year | Vacancy & Credit Loss (5.0%): -$${MF_VACANCY_LOSS.toLocaleString()} → Effective Gross Income (EGI): $${MF_EGI.toLocaleString()}`,
          `Operating Expenses & Replacement Reserves (includes $12,000 / $375 per unit annual reserve): -$${MF_OPEX_AND_RESERVES.toLocaleString()} (40.19% of EGI)`,
          `Net Operating Income (NOI): $${MF_NOI.toLocaleString()} → Unleveraged Cap Rate = $${MF_NOI.toLocaleString()} ÷ $${MF_PRICE.toLocaleString()} = ${MF_CAP_RATE.toFixed(2)}%`,
          `Financing Assumptions: 65% LTV ($${MF_LOAN_AMOUNT.toLocaleString()} loan, $${MF_DOWN_PAYMENT.toLocaleString()} down payment, $${MF_TOTAL_CASH.toLocaleString()} total cash invested), ${MF_INTEREST_RATE.toFixed(2)}% fixed interest, ${MF_AMORT_YEARS}-year equal P&I amortization`,
          `Annual Debt Service: $${MF_ADS.toLocaleString()}/year (annual loan constant = ${MF_DEBT_CONSTANT.toFixed(2)}%) → DSCR = ${MF_DSCR.toFixed(2)}x | Pre-Tax Cash Flow = $${MF_PRETAX_CF.toLocaleString()}/year`,
        ],
        analysis: `Underwriting Takeaway: Even though the ${MF_INTEREST_RATE.toFixed(2)}% nominal interest rate is lower than the ${MF_CAP_RATE.toFixed(2)}% Cap Rate, the ${MF_AMORT_YEARS}-year amortizing loan constant is ${MF_DEBT_CONSTANT.toFixed(2)}% due to principal paydown. After accounting for principal amortization and 2.0% closing costs ($${MF_TOTAL_CASH.toLocaleString()} total cash invested), Year-1 Cash-on-Cash Return is ${MF_COC.toFixed(2)}% with a ${MF_DSCR.toFixed(2)}x DSCR.`,
      },
      pitfallsTitle: 'Common Multifamily Cap Rate Pitfalls',
      pitfalls: [
        {
          title: 'Ignoring Post-Sale Property Tax Reassessment',
          desc: 'In many jurisdictions, municipal tax assessors re-evaluate property value upon sale. Underwriting with the seller’s historical tax bill instead of reassessed taxes can inflate Going-In Cap Rate by 50–100 bps.',
        },
        {
          title: 'Confusing Nominal Interest Rate with Loan Constant',
          desc: 'Comparing Cap Rate only to the stated mortgage interest rate ignores principal amortization and closing costs. Always compute full Annual Debt Service and Total Cash Invested.',
        },
        {
          title: 'Using Broker Pro-Forma Rents Without CapEx Budget',
          desc: 'If a listing quotes a Cap Rate based on post-renovation market rents, ensure the required unit interior renovation budget is added to your total capital outlay.',
        },
      ],
      faqs: [
        {
          question: 'What is a typical illustrative cap rate range for multifamily properties?',
          answer:
            'In educational underwriting scenarios, multifamily cap rates are often modeled between 4.75% and 6.75% depending on asset class (Class A, B, or C), building age, and submarket risk. Actual transaction yields vary by market and period; always verify local comparable sales.',
        },
        {
          question: 'Does this multifamily calculator use a different formula than the universal Cap Rate calculator?',
          answer:
            'No. It applies the exact same universal formula: Cap Rate = (Annual NOI ÷ Purchase Price) × 100, pre-loaded with the $3,500,000 / $218,750 worked example from this page.',
        },
        {
          question: 'Should replacement reserves be deducted when calculating multifamily Cap Rate?',
          answer:
            'Institutional underwriters and lenders typically deduct an annual replacement reserve ($250 to $450 per unit) to evaluate sustainable cash flow and Debt Service Coverage Ratio (DSCR).',
        },
      ],
    },
    'industrial-cap-rate': {
      slug: 'industrial-cap-rate',
      propertyTypeName: 'Industrial & Warehouse',
      metaTitle: 'Industrial & Warehouse Cap Rate Calculator | CRE Underwriting',
      metaDescription:
        'Calculate capitalization rates for industrial warehouses, distribution centers, and flex properties using illustrative modeling ranges and NNN lease examples.',
      h1: 'Industrial & Warehouse Cap Rate Calculator & Modeling Guide',
      subtitle:
        'Underwrite distribution centers, shallow-bay warehouses, and flex industrial facilities using the universal Cap Rate formula and illustrative NNN lease assumptions.',
      defaultPrice: 8000000,
      defaultNoi: 472000,
      benchmarkRange: '5.25% – 7.00% (Illustrative)',
      whatIsTitle: 'Understanding Industrial & Logistics Cap Rate Modeling',
      whatIsContent:
        'Industrial real estate—spanning last-mile logistics warehouses, cold storage, light manufacturing, and flex space—frequently utilizes Triple Net (NNN) or Modified Gross leases where tenants reimburse property taxes, building insurance, and common area maintenance (CAM).\n\nIn illustrative underwriting models, modern high-clear-height distribution facilities are often modeled at lower cap rates (e.g., 5.25% to 6.00%), while older shallow-bay or specialized manufacturing buildings are modeled at wider illustrative yields (e.g., 6.25% to 7.25%+) to reflect functional obsolescence and re-leasing downtime. All ranges on this page are educational modeling assumptions rather than live market quotes.',
      metricsExploration: {
        title: 'Core Industrial Valuation Factors',
        points: [
          {
            label: 'Clear Height & Dock Door Functionality',
            text: 'Modern logistics tenants often require 32\'–40\' clear heights, ESFR sprinkler systems, and ample dock-high doors. Older low-clearance buildings typically require higher yield assumptions.',
          },
          {
            label: 'Below-Market Rent Rollover (Mark-to-Market)',
            text: 'A low going-in Cap Rate on an industrial asset may reflect legacy 5-to-10-year leases signed below current market rents, requiring careful rollover and downtime modeling.',
          },
          {
            label: 'Structural Roof & Parking Lot CapEx',
            text: 'Even under NNN leases, landlords are frequently responsible for structural roof replacement and heavy truck-court concrete resurfacing.',
          },
        ],
      },
      workedExample: {
        title: 'Worked Industrial Underwriting Example (60,000 SF Distribution Warehouse)',
        intro:
          'Suppose you are modeling an illustrative 60,000 sq. ft. multi-tenant shallow-bay industrial warehouse on NNN leases:',
        points: [
          'Purchase Price: $8,000,000 ($133.33 per sq. ft.)',
          'Base NNN Rental Revenue: $504,000 ($8.40 / SF NNN) + CAM/Tax Reimbursements (pass-through neutral)',
          'Vacancy & Collection Loss Allowance (4.0%): -$20,160',
          'Unreimbursed Landlord Expenses (Structural Reserve & Asset Management): -$11,840',
          'Stabilized Net Operating Income (NOI): $472,000 → Unleveraged Cap Rate = $472,000 ÷ $8,000,000 = 5.90%',
        ],
        analysis:
          'Underwriting Takeaway: At an illustrative 5.90% Going-In Cap Rate with 3.0% annual contractual rent escalations, unleveraged yield-on-cost grows to 6.64% by Year 5—provided tenant rollover and structural roof reserves are properly budgeted.',
      },
      pitfallsTitle: 'Industrial Underwriting Pitfalls to Avoid',
      pitfalls: [
        {
          title: 'Overlooking Environmental Phase I / Phase II Risks',
          desc: 'Historical manufacturing, dry cleaning, or automotive uses can leave soil or groundwater contamination that impairs financing and exit liquidity.',
        },
        {
          title: 'Assuming Zero Landlord Expenses on NNN Industrial Leases',
          desc: 'Many industrial NNN leases exclude roof structure, foundation, and non-reimbursable property management fees during vacancy periods.',
        },
      ],
      faqs: [
        {
          question: 'What is an illustrative cap rate range for industrial warehouses?',
          answer:
            'In educational underwriting scenarios, logistics and multi-tenant industrial properties are commonly modeled between 5.25% and 7.00% depending on building specifications, tenant credit, and remaining lease term. Always verify local market comparables.',
        },
        {
          question: 'How do NNN expense reimbursements affect industrial NOI?',
          answer:
            'In a true NNN lease, reimbursed property taxes, insurance, and CAM flow through as both gross revenue and operating expense, leaving base rent (less vacancy and non-reimbursable owner reserves) as the primary driver of NOI.',
        },
      ],
    },
    'self-storage-cap-rate': {
      slug: 'self-storage-cap-rate',
      propertyTypeName: 'Self-Storage Facility',
      metaTitle: 'Self-Storage Cap Rate Calculator | Facility Underwriting Guide',
      metaDescription:
        'Calculate self-storage capitalization rates using illustrative underwriting scenarios, economic vs. physical occupancy checks, and NOI modeling.',
      h1: 'Self-Storage Cap Rate Calculator & Underwriting Guide',
      subtitle:
        'Model climate-controlled and drive-up self-storage acquisitions using the universal Cap Rate formula and illustrative occupancy and expense assumptions.',
      defaultPrice: 4200000,
      defaultNoi: 273000,
      benchmarkRange: '5.50% – 7.25% (Illustrative)',
      whatIsTitle: 'How Self-Storage Cap Rate Underwriting Works',
      whatIsContent:
        'Self-storage facilities operate on month-to-month rental agreements with no tenant improvement (TI) allowances or leasing commissions upon unit turnover. Because rental rates can be adjusted monthly, storage income responds rapidly to local supply and demand.\n\nIn educational underwriting models, institutional climate-controlled facilities are commonly modeled at illustrative cap rates of 5.50% to 6.25%, while secondary drive-up facilities are often modeled between 6.25% and 7.25%+. These figures are illustrative underwriting assumptions for analysis and education—not live market benchmarks.',
      metricsExploration: {
        title: 'Key Self-Storage Underwriting Metrics',
        points: [
          {
            label: 'Physical vs. Economic Occupancy',
            text: 'A facility may be 90% physically occupied, but if tenants receive move-in discounts or are delinquent, economic occupancy (actual collected rent ÷ gross potential street rent) may be only 78%–82%.',
          },
          {
            label: 'Illustrative Operating Expense Ratio (28% – 38% of EGI)',
            text: 'Storage facilities have no interior kitchens or plumbing per unit, keeping routine maintenance low; major expenses are property taxes, digital marketing, software, and staffing.',
          },
          {
            label: '3-to-5 Mile Radius Supply Pipeline',
            text: 'Self-storage demand is hyper-local. New competing facilities within a 3-mile trade area can compress street rates and extend lease-up timelines.',
          },
        ],
      },
      workedExample: {
        title: 'Worked Self-Storage Underwriting Example (55,000 Net Rentable SF)',
        intro:
          'Consider an illustrative 450-unit hybrid drive-up and climate-controlled storage facility:',
        points: [
          'Purchase Price: $4,200,000 ($76.36 per net rentable sq. ft.)',
          'Gross Potential Street Rent + Ancillary Late/Admin Fees: $495,000',
          'Physical Vacancy, Move-In Concessions & Bad Debt (16% combined economic loss): -$79,200 → Effective Gross Income (EGI): $415,800',
          'Annual Operating Expenses (Property Tax, Insurance, On-Site/Remote Mgmt, Paid Search): -$142,800 (34.3% of EGI)',
          'Net Operating Income (NOI): $273,000 → Unleveraged Cap Rate = $273,000 ÷ $4,200,000 = 6.50%',
        ],
        analysis:
          'Underwriting Takeaway: The facility models at a 6.50% Going-In Cap Rate on in-place collections. Always verify whether seller revenue reflects discounted promotional move-in rates or stabilized existing Customer Rate Increases (ECRI).',
      },
      pitfallsTitle: 'Self-Storage Valuation Traps',
      pitfalls: [
        {
          title: 'Underwriting Gross Potential Rent at 100% Street Rates',
          desc: 'Existing tenants often pay rates different from current advertised web rates, and move-in promotions reduce effective revenue. Always audit trailing 12-month bank deposits.',
        },
        {
          title: 'Omitting Third-Party Management & Marketing Costs',
          desc: 'Mom-and-pop owners frequently self-manage without charging a management fee or digital advertising budget. Normalize operating expenses with a 5%–6% management fee.',
        },
      ],
      faqs: [
        {
          question: 'What is an illustrative cap rate range for self-storage facilities?',
          answer:
            'In educational underwriting models, self-storage cap rates are typically modeled between 5.50% and 7.25% depending on climate-control mix, facility age, and local supply within a 3-to-5 mile radius.',
        },
        {
          question: 'What is a typical operating expense ratio for self-storage?',
          answer:
            'Stabilized self-storage properties are commonly modeled with operating expense ratios between 28% and 38% of Effective Gross Income (EGI), though property tax reassessment after acquisition can increase this share.',
        },
      ],
    },
    'nnn-lease-cap-rate': {
      slug: 'nnn-lease-cap-rate',
      propertyTypeName: 'Single-Tenant NNN Lease',
      metaTitle: 'NNN Lease Cap Rate Calculator | Triple Net Retail Valuation',
      metaDescription:
        'Calculate Triple Net (NNN) lease capitalization rates and reverse-solve property price from annual net rent and illustrative tenant credit scenarios.',
      h1: 'NNN Lease Cap Rate Calculator & Single-Tenant Valuation Guide',
      subtitle:
        'Value single-tenant net lease retail, medical, and industrial properties using the universal Cap Rate formula and illustrative credit-spread scenarios.',
      defaultPrice: 2800000,
      defaultNoi: 182000,
      benchmarkRange: '5.50% – 7.25% (Illustrative)',
      whatIsTitle: 'How Single-Tenant NNN Cap Rate Valuation Works',
      whatIsContent:
        'In an Absolute Triple Net (NNN) lease, the corporate or franchisee tenant pays 100% of property taxes, property insurance, and maintenance directly, leaving the landlord’s Net Operating Income (NOI) virtually equal to the contractual annual base rent (less any owner-level accounting or reserve allowance).\n\nBecause operating expense volatility is transferred to the tenant during the base lease term, NNN valuation behaves similarly to a fixed-income corporate bond: illustrative cap rates vary primarily with the tenant’s creditworthiness, remaining primary lease term, and underlying land residual value. All ranges on this page are illustrative modeling scenarios rather than live dealer quotes.',
      metricsExploration: {
        title: 'Three Pillars of NNN Lease Pricing',
        points: [
          {
            label: 'Corporate vs. Franchisee Guaranty',
            text: 'An lease guaranteed by an investment-grade parent corporation carries lower default risk than a lease guaranteed only by a local 3-unit franchisee entity.',
          },
          {
            label: 'Remaining Primary Lease Term',
            text: 'Properties with 12–20 years of remaining primary term typically command lower cap rates in financing models than properties with fewer than 6 years remaining, where refinancing and dark-store risk rise.',
          },
          {
            label: 'Rent-to-Sales Health Ratio',
            text: 'Underwriters examine store-level gross sales to confirm occupancy cost (Rent + NNN ÷ Gross Sales) is sustainable for that retail category (often 6%–9%).',
          },
        ],
      },
      workedExample: {
        title: 'Worked NNN Valuation Example (Freestanding Drive-Thru QSR)',
        intro:
          'Consider an illustrative single-tenant quick-service restaurant (QSR) on a 15-year Absolute NNN lease:',
        points: [
          'Purchase Price: $2,800,000',
          'Contractual Annual Base Rent: $182,000 ($15,167 / month)',
          'Property Taxes, Insurance & Maintenance: 100% paid directly by Tenant (Absolute NNN)',
          'Net Operating Income (NOI): $182,000 → Unleveraged Cap Rate = $182,000 ÷ $2,800,000 = 6.50%',
          'Scheduled Rent Escalation: 10% every 5 years (Years 6–10 NOI rises to $200,200 → 7.15% yield on original cost)',
        ],
        analysis:
          'Underwriting Takeaway: If the tenant exercises a renewal or if the property is sold with only 4 years remaining on the lease, the exit buyer may require a wider illustrative Cap Rate (e.g., 7.25%) to compensate for near-term rollover risk.',
      },
      pitfallsTitle: 'Critical NNN Investment Risks',
      pitfalls: [
        {
          title: 'Above-Market Rent & Specialized Building Box',
          desc: 'Build-to-suit NNN properties sometimes have high initial rents tied to construction costs. If the tenant vacates at lease expiration, re-tenanting a specialized building may require a 30%–40% rent reduction and heavy tenant improvement capital.',
        },
        {
          title: 'NN ("Double Net") Disguised as NNN',
          desc: 'Always read the lease responsibility matrix. If the landlord remains responsible for roof, structure, HVAC replacement, or parking lot replacement, deduct an annual CapEx reserve from base rent.',
        },
      ],
      faqs: [
        {
          question: 'What is an illustrative cap rate range for NNN properties?',
          answer:
            'In educational underwriting models, single-tenant NNN properties are commonly modeled between 5.50% and 7.25% depending on corporate credit rating, remaining lease term, rent escalations, and real estate fundamentals.',
        },
        {
          question: 'Why does remaining lease term impact NNN Cap Rates so strongly?',
          answer:
            'Commercial lenders and buyers evaluate the certainty of cash flow over the loan term. Once a single-tenant lease drops below 7–8 years remaining, refinancing options narrow and re-tenanting capital reserves become necessary.',
        },
      ],
    },
  },
  zh: {
    'multifamily-cap-rate': {
      slug: 'multifamily-cap-rate',
      propertyTypeName: 'Multifamily 多户住宅 (5+ 单元)',
      metaTitle: 'Multifamily 多户住宅 Cap Rate 计算器 | 公寓承销测算案例',
      metaDescription:
        '使用通用 Cap Rate 公式与教学承销假设，测算 5 单元以上多户住宅公寓的资本化率、运营费用率、资本储备金及摊销贷款现金回报率。',
      h1: 'Multifamily 多户住宅公寓 Cap Rate 计算器与承销指南',
      subtitle:
        '基于通用 Cap Rate 公式（年 NOI ÷ 购买价格），结合 Class A/B/C 公寓教学承销区间与完整摊销贷款算例评估多户住宅交易。',
      defaultPrice: MF_PRICE,
      defaultNoi: MF_NOI,
      benchmarkRange: '4.75% – 6.75% (教学示例区间)',
      whatIsTitle: '如何进行 Multifamily 多户住宅 Cap Rate 承销建模',
      whatIsContent:
        '在商业地产（CRE）中，Cap Rate = 年度 NOI ÷ 购买价格；在可持续 NOI 与适用 Cap Rate 已知时，可用 NOI ÷ Cap Rate 作估值参考。由于公寓租约通常每 12 个月重签一次，其租金与入住率对本地供需变化的反应快于长期商业租约。\n\n在教学承销模型中，楼龄较新的核心区 Class A 公寓通常设定较低的示例 Cap Rate（如 4.75%–5.50%），以反映较低的近期大修需求；而楼龄较老的 Class B/C 增值型公寓通常采用较高的示例收益率区间（如 5.50%–6.75%+），以覆盖租客换手翻新、维修储备及运营波动风险。本页所列区间均为教学建模假设，不代表实时市场成交报价。',
      metricsExploration: {
        title: '多户住宅承销的三大核心变量',
        points: [
          {
            label: '教学示例运营费用率 (占 EGI 的 35% – 50%)',
            text: '多户公寓业主需承担房产税、商业保险、公共水电、驻场管理及租客换手清洁维修。若对老旧花园式公寓假设低于 35% 的费用率，往往会人为虚增 NOI。',
          },
          {
            label: '年度贷款常数 vs. 初始 Cap Rate',
            text: '名义贷款利率低于 Cap Rate 并不自动产生正现金流杠杆！因为 25–30 年摊销贷款包含每期本金偿还，必须将“年度贷款常数（年还贷总额 ÷ 贷款额）”与 Cap Rate 对比。',
          },
          {
            label: '每单元资本性支出储备 ($250–$450 / 单元 / 年)',
            text: '审慎的机构承销会在计算可持续现金流前，按每单元每年扣除空调、厨电、屋顶与地板更换储备金（Replacement Reserves）。',
          },
        ],
      },
      workedExample: {
        title: 'Multifamily 实操测算案例（32 单元花园式公寓）',
        intro: '假设您正在对一处 32 单元 Class B 多户住宅公寓进行完整承销建模（含明确收入、资本储备金与摊销贷款假设）：',
        points: [
          `购买价格: $${MF_PRICE.toLocaleString()}（折合每单元 $109,375）| 过户交割成本 (2.0%): $${MF_CLOSING_COSTS.toLocaleString()}`,
          `总潜在年收入 (GPI): $${MF_GPI.toLocaleString()}/年 | 空置与坏账损失 (5.0%): -$${MF_VACANCY_LOSS.toLocaleString()} → 有效毛收入 (EGI): $${MF_EGI.toLocaleString()}`,
          `年运营费用与大修储备金（含每年 $12,000 即 $375/单元资本储备）: -$${MF_OPEX_AND_RESERVES.toLocaleString()}（占 EGI 的 40.19%）`,
          `净营业收入 (NOI): $${MF_NOI.toLocaleString()} → 无杠杆 Cap Rate = $${MF_NOI.toLocaleString()} ÷ $${MF_PRICE.toLocaleString()} = ${MF_CAP_RATE.toFixed(2)}%`,
          `融资假设: 65% LTV（贷款额 $${MF_LOAN_AMOUNT.toLocaleString()}，首付 $${MF_DOWN_PAYMENT.toLocaleString()}，含过户费总投入现金 $${MF_TOTAL_CASH.toLocaleString()}），年利率 ${MF_INTEREST_RATE.toFixed(2)}%，${MF_AMORT_YEARS} 年等额本息摊销`,
          `年还贷总额 (Annual Debt Service): $${MF_ADS.toLocaleString()}/年（年度贷款常数 = ${MF_DEBT_CONSTANT.toFixed(2)}%）→ DSCR = ${MF_DSCR.toFixed(2)}x | 税前净现金流 = $${MF_PRETAX_CF.toLocaleString()}/年`,
        ],
        analysis: `承销结论：尽管名义利率（${MF_INTEREST_RATE.toFixed(2)}%）低于 Cap Rate（${MF_CAP_RATE.toFixed(2)}%），但由于 ${MF_AMORT_YEARS} 年等额本息包含本金偿还，年度贷款常数为 ${MF_DEBT_CONSTANT.toFixed(2)}%（高于 6.25%）。计入本金摊销与 2.0% 过户成本（总投入现金 $${MF_TOTAL_CASH.toLocaleString()}）后，首年现金回报率（Cash-on-Cash Return）为 ${MF_COC.toFixed(2)}%，偿债覆盖率（DSCR）为 ${MF_DSCR.toFixed(2)}x。`,
      },
      pitfallsTitle: '多户住宅 Cap Rate 测算常见误区',
      pitfalls: [
        {
          title: '忽略交易过户后的房产税重估 (Tax Reassessment)',
          desc: '在德州、佛州、加州等多数地区，房产过户后市政评估机构会按新成交价重新核定房产税。直接沿用卖方历史低税单会虚增初始 Cap Rate 达 50–100 个基点。',
        },
        {
          title: '混淆名义利率与年度贷款常数',
          desc: '仅凭“Cap Rate > 贷款名义利率”就断言正杠杆是常见误区。等额本息还款中的本金部分同样消耗现金流，必须完整计算年还贷总额与含过户费的总投入现金。',
        },
        {
          title: '直接使用经纪人 Pro-Forma 翻新后租金',
          desc: '若卖方按翻新后预期租金宣称高 Cap Rate，买方必须将室内翻新工程预算与空置期损失计入总投资成本。',
        },
      ],
      faqs: [
        {
          question: '多户住宅（Multifamily）的教学示例 Cap Rate 区间是多少？',
          answer:
            '在商业地产教学承销模型中，多户住宅通常按资产等级（Class A/B/C）、楼龄与城市层级在 4.75% 至 6.75% 之间设置建模假设。实际成交水平随市场周期波动，请以标的所在子市场近期真实可比交易为准。',
        },
        {
          question: '本页计算器与通用 Cap Rate 计算器公式相同吗？',
          answer:
            '完全相同，均采用通用公式 Cap Rate = (年 NOI ÷ 购买价格) × 100，并预载了本页 32 单元公寓案例数据（$3,500,000 / $218,750 NOI），不内置隐蔽的费用扣除逻辑。',
        },
        {
          question: '计算多户住宅 NOI 时需要扣除每单元大修储备金吗？',
          answer:
            '是的。商业银行与机构投资人在核定可持续 NOI 与 DSCR 时，通常会扣除每单元每年 $250–$450 的资本性更换储备金（Replacement Reserves）。',
        },
      ],
    },
    'industrial-cap-rate': {
      slug: 'industrial-cap-rate',
      propertyTypeName: 'Industrial 工业与仓储物流',
      metaTitle: 'Industrial 工业地产 Cap Rate 计算器 | 仓储物流承销指南',
      metaDescription:
        '使用通用 Cap Rate 公式与 NNN 租赁教学案例，测算工业仓库、物流配送中心及轻工业物业的资本化率与现金流。',
      h1: 'Industrial 工业与仓储物流 Cap Rate 计算器与承销指南',
      subtitle:
        '结合通用 Cap Rate 公式（NOI ÷ 购买价格）与工业 NNN 租约教学假设，评估物流仓库、轻工业及研发办公（Flex）资产。',
      defaultPrice: 8000000,
      defaultNoi: 472000,
      benchmarkRange: '5.25% – 7.00% (教学示例区间)',
      whatIsTitle: '如何进行工业与仓储物流 Cap Rate 承销建模',
      whatIsContent:
        '工业地产（涵盖最后一公里物流仓、冷链仓储、轻工业厂房及 Flex 研发楼）普遍采用三净租赁（NNN）或改良毛租约（Modified Gross），由租户按比例分摊或报销房产税、保险与公共区域维护费（CAM）。\n\n在教学承销模型中，高挑高、带标准卸货平台的现代化物流仓通常设定较低的示例 Cap Rate（如 5.25%–6.00%），而老旧低挑高厂房或单用途工业楼则设定较高的示例收益率（如 6.25%–7.25%+），以补偿功能折旧与换租空置期风险。本页所列区间均为教学建模假设，而非实时行情报价。',
      metricsExploration: {
        title: '工业仓储资产估值的三大核心指标',
        points: [
          {
            label: '净层高 (Clear Height) 与卸货平台配置',
            text: '现代物流租户通常要求 32–40 英尺净层高、ESFR 喷淋系统及充足的高台卸货门（Dock-High Doors）。层高受限的老旧厂房在模型中需预留更高风险溢价。',
          },
          {
            label: '存量租约与市场租金价差 (Mark-to-Market)',
            text: '工业物业初始 Cap Rate 偏低，可能是因为现有 5–10 年期租约早年签约租金低于当前市价，需重点测算租约到期重签时的租金跳升与空置期成本。',
          },
          {
            label: '屋顶结构与重卡停车场资本储备',
            text: '即便在 NNN 租约下，业主通常仍需承担屋顶主体结构更换、外墙结构及重型卡车周转场地的混凝土翻修储备。',
          },
        ],
      },
      workedExample: {
        title: '工业地产实操测算案例（60,000 平方英尺多租户物流仓）',
        intro: '假设您正在评估一处 60,000 平方英尺、采用 NNN 租约的多租户轻工业物流仓库：',
        points: [
          '购买价格: $8,000,000（折合每平方英尺 $133.33）',
          '合同基础 NNN 年租金: $504,000（$8.40 / 平方英尺 / 年），房产税与 CAM 由租户报销冲抵',
          '空置与收租损失准备金 (4.0%): -$20,160',
          '业主不可转嫁开支（屋顶结构储备金与资产管理费）: -$11,840',
          '稳定期净营业收入 (NOI): $472,000 → 无杠杆 Cap Rate = $472,000 ÷ $8,000,000 = 5.90%',
        ],
        analysis:
          '承销结论：按首年 5.90% 的无杠杆 Cap Rate 及每年 3.0% 的合同租金递增测算，若租户按约续租且屋顶结构储备充足，第 5 年相对初始成本的无杠杆收益率（Yield-on-Cost）将升至 6.64%。',
      },
      pitfallsTitle: '工业地产承销常见误区',
      pitfalls: [
        {
          title: '忽视 Phase I / Phase II 环境污染评估',
          desc: '曾用于机械制造、化工或汽修的工业地块可能存在土壤或地下水污染，过户前必须完成 Phase I ESA 环境尽调。',
        },
        {
          title: '误以为 NNN 工业租约业主零支出',
          desc: '多数工业 NNN 租约不涵盖屋顶结构层更换、地基沉降维修及空置期间的不可报销管理费，承销时不可将运营支出设为零。',
        },
      ],
      faqs: [
        {
          question: '工业与仓储物流物业的教学示例 Cap Rate 区间是多少？',
          answer:
            '在教学承销模型中，工业与物流物业通常在 5.25% 至 7.00% 之间设置建模假设，具体取决于层高规格、租户信用及剩余租期。实际交易价格请核实标的所在工业走廊的可比交易。',
        },
        {
          question: 'NNN 费用报销如何影响工业地产 NOI 计算？',
          answer:
            '在标准 NNN 租约下，租户报销的房产税、保险与 CAM 同时计入有效收入与运营支出并相互抵消，因此基础净租金扣除空置准备金与业主结构储备金后即构成核心 NOI。',
        },
      ],
    },
    'self-storage-cap-rate': {
      slug: 'self-storage-cap-rate',
      propertyTypeName: 'Self-Storage 自助仓储',
      metaTitle: 'Self-Storage 自助仓储 Cap Rate 计算器 | 仓储设施承销指南',
      metaDescription:
        '使用通用 Cap Rate 公式测算温控与通道式自助仓储（Self-Storage）的资本化率，对比物理入住率与经济入住率差异。',
      h1: 'Self-Storage 自助仓储 Cap Rate 计算器与承销指南',
      subtitle:
        '基于通用 Cap Rate 公式（NOI ÷ 购买价格）与经济入住率教学假设，评估温控型与通道式自助仓储设施。',
      defaultPrice: 4200000,
      defaultNoi: 273000,
      benchmarkRange: '5.50% – 7.25% (教学示例区间)',
      whatIsTitle: '如何进行 Self-Storage 自助仓储 Cap Rate 承销建模',
      whatIsContent:
        '自助仓储（Self-Storage）采用按月续期的租赁合同，租客退租换手时无需业主投入室内装修补贴（TI）或高额租赁佣金。由于挂牌租金可按月动态调整，其现金流对本地供需变化高度敏感。\n\n在教学承销模型中，核心城区现代化温控自助仓通常采用 5.50%–6.25% 的示例 Cap Rate，而次级市场通道式（Drive-Up）设施通常在 6.25%–7.25%+ 区间建模。本页数值均为教学承销假设，不代表实时市场成交报价。',
      metricsExploration: {
        title: '自助仓储承销的三大关键指标',
        points: [
          {
            label: '物理入住率 vs. 经济入住率 (Economic Occupancy)',
            text: '即便物理出租率达到 90%，若存在首月免租促销、老租客历史低价或欠费坏账，实际经济入住率（实收租金 ÷ 满租挂牌潜在租金）可能仅为 78%–82%。',
          },
          {
            label: '教学示例运营费用率 (占 EGI 的 28% – 38%)',
            text: '自助仓单元无独立厨卫管线，日常维修成本较低；主要开支集中在房产税、保险、智能门禁软件、线上搜索广告（SEO/SEM）及驻场管理。',
          },
          {
            label: '3–5 英里半径新增供给核查',
            text: '自助仓储客源高度本地化。若 3 英里商圈内有新建大型温控仓入市，往往会引发首月折扣价格战并拉长稳定期。',
          },
        ],
      },
      workedExample: {
        title: 'Self-Storage 实操测算案例（55,000 可租平方英尺混合自助仓）',
        intro: '假设您正在评估一处包含 450 个储物单元的通道式与温控混合自助仓储设施：',
        points: [
          '购买价格: $4,200,000（折合每可租平方英尺 $76.36）',
          '满租挂牌潜在租金 + 滞纳金/管理杂费: $495,000/年',
          '物理空置、首月促销折扣及欠租坏账（合计 16.0% 经济折损）: -$79,200 → 有效毛收入 (EGI): $415,800',
          '年运营费用（房产税、保险、管理软件、线上获客及管理费）: -$142,800（占 EGI 的 34.3%）',
          '净营业收入 (NOI): $273,000 → 无杠杆 Cap Rate = $273,000 ÷ $4,200,000 = 6.50%',
        ],
        analysis:
          '承销结论：按实收口径测算的初始无杠杆 Cap Rate 为 6.50%。尽调时需重点核对过去 12 个月银行流水，区分“新租客促销折扣价”与“存量租客提价（ECRI）”的真实持续性。',
      },
      pitfallsTitle: '自助仓储估值常见陷阱',
      pitfalls: [
        {
          title: '直接按 100% 挂牌价 (Street Rate) 估算总收入',
          desc: '网站挂牌价随季节波动，且新客户通常享有首月折扣，不能直接用挂牌单价乘以总面积作为有效收入。',
        },
        {
          title: '漏算第三方专业管理费与线上营销预算',
          desc: '夫妻店（Mom-and-Pop）老业主往往亲自看店且不计管理费。机构承销时必须按 EGI 的 5%–6% 计提专业管理费与常态化数字营销开支。',
        },
      ],
      faqs: [
        {
          question: 'Self-Storage 自助仓储的教学示例 Cap Rate 区间是多少？',
          answer:
            '在商业地产教学模型中，自助仓储通常在 5.50% 至 7.25% 之间设置建模假设，具体取决于温控仓占比、设施楼龄以及周边 3–5 英里内的新增竞争供给。',
        },
        {
          question: '自助仓储的典型运营费用率是多少？',
          answer:
            '稳定运营的自助仓储设施在教学模型中通常假设运营费用率占有效毛收入（EGI）的 28% 至 38%，但收购后的房产税重估可能会推高这一比例。',
        },
      ],
    },
    'nnn-lease-cap-rate': {
      slug: 'nnn-lease-cap-rate',
      propertyTypeName: 'NNN 单租户三净租赁',
      metaTitle: 'NNN 三净租赁 Cap Rate 计算器 | 单租户商业零售估值指南',
      metaDescription:
        '使用通用 Cap Rate 公式计算单租户绝对三净租赁（Absolute NNN）物业的资本化率与最高出价，解析租户信用与剩余租期影响。',
      h1: 'NNN 单租户三净租赁 Cap Rate 计算器与估值指南',
      subtitle:
        '基于通用 Cap Rate 公式（NOI ÷ 购买价格）与租户信用利差教学案例，评估单租户快餐店（QSR）、药店、医疗及零售 NNN 资产。',
      defaultPrice: 2800000,
      defaultNoi: 182000,
      benchmarkRange: '5.50% – 7.25% (教学示例区间)',
      whatIsTitle: '如何进行单租户 NNN 租赁 Cap Rate 估值建模',
      whatIsContent:
        '在绝对三净租赁（Absolute Triple Net / NNN）合同下，企业租户或加盟商直接承担 100% 的房产税、商业保险及日常维修，使得业主的净营业收入（NOI）基本等于合同约定的年度基础净租金（扣除极少量业主层面管理或储备预留）。\n\n由于基础租期内的运营费用波动已转移给租户，单租户 NNN 物业的定价逻辑类似于企业固定收益债券：教学模型中的 Cap Rate 主要取决于担保方信用等级、剩余主租期年限（Remaining Lease Term）以及底层土地重租价值。本页所有区间均为教学建模假设，而非实时交易商报价。',
      metricsExploration: {
        title: '决定 NNN 物业估值的三大支柱',
        points: [
          {
            label: '集团总部担保 vs. 加盟商担保',
            text: '由投资级上市母公司（Corporate Guaranty）直接提供租约担保的物业违约风险低；若仅由名下只有几家门店的本地加盟商（Franchisee）担保，承销时需计入更高风险溢价。',
          },
          {
            label: '剩余基础租期年限 (Remaining Primary Term)',
            text: '剩余主租期在 12–20 年的资产更易获得长期低息贷款；一旦剩余租期跌破 6–7 年，再融资难度与到期空置（Dark Store）风险显著上升。',
          },
          {
            label: '租售比健康度 (Rent-to-Sales Ratio)',
            text: '尽调时需核查单店年营业额，确认租金占门店总销售额比例（通常以 6%–9% 为健康参考线）具备商业可持续性。',
          },
        ],
      },
      workedExample: {
        title: 'NNN 实操测算案例（带得来速通道的独立快餐店 QSR）',
        intro: '假设您正在评估一处签有 15 年绝对三净租约（Absolute NNN）的单租户连锁快餐物业：',
        points: [
          '购买价格: $2,800,000',
          '合同年度净租金 (Annual Base Rent): $182,000（$15,167 / 月）',
          '房产税、保险与全部维修: 100% 由租户按合同直接支付（Absolute NNN）',
          '净营业收入 (NOI): $182,000 → 无杠杆 Cap Rate = $182,000 ÷ $2,800,000 = 6.50%',
          '合同租金递增条款: 每 5 年递增 10%（第 6–10 年 NOI 升至 $200,200，对应初始买价的成本收益率升至 7.15%）',
        ],
        analysis:
          '承销结论：虽然首年无杠杆 Cap Rate 为 6.50%，但若持有 11 年后在仅剩 4 年租期时出售，下家买方可能会要求更高的退出 Cap Rate（例如 7.25%）以补偿租约即将到期的续租不确定性。',
      },
      pitfallsTitle: 'NNN 三净租赁投资的核心风险',
      pitfalls: [
        {
          title: '定制建筑 (Build-to-Suit) 租金高于市场水平',
          desc: '部分早期按租户定制建造的物业初始租金包含了高昂建安摊销。若租户到期不续租，改造为通用商铺往往面临 30%–40% 的租金下调及高额改造投入。',
        },
        {
          title: '把双净租约 (NN) 误作绝对三净 (Absolute NNN)',
          desc: '务必逐条核对租约维修责任表。若业主仍需承担屋顶、主体结构、大型空调主机或停车场翻修，必须从年租金中预提年度资本性支出储备。',
        },
      ],
      faqs: [
        {
          question: '单租户 NNN 物业的教学示例 Cap Rate 区间是多少？',
          answer:
            '在商业地产教学承销模型中，单租户 NNN 物业通常在 5.50% 至 7.25% 之间设置建模假设，具体取决于租户信用评级、剩余主租期年限、租金递增条款及地段重租潜力。',
        },
        {
          question: '为什么剩余租期对 NNN 物业的 Cap Rate 影响极大？',
          answer:
            '因为商业贷款机构与买方高度看重贷款期内的确定性现金流。一旦单租户租约剩余年限不足 7–8 年，再融资杠杆会收紧，且买方需预留租户退租后的改造与招租空置准备金。',
        },
      ],
    },
  },
  es: {
    'multifamily-cap-rate': {
      slug: 'multifamily-cap-rate',
      propertyTypeName: 'Multifamiliar (5+ Unidades)',
      metaTitle: 'Calculadora de Cap Rate Multifamiliar | Escenarios de Evaluación',
      metaDescription:
        'Calcule la tasa de capitalización para edificios de apartamentos de 5+ unidades con rangos ilustrativos de modelado, gastos operativos y ejemplos de NOI.',
      h1: 'Calculadora de Cap Rate Multifamiliar y Escenarios de Evaluación',
      subtitle:
        'Evalúe adquisiciones de edificios residenciales de 5+ unidades aplicando la fórmula universal de Cap Rate (NOI ÷ Precio de Compra) y supuestos educativos para activos Clase A, B y C.',
      defaultPrice: MF_PRICE,
      defaultNoi: MF_NOI,
      benchmarkRange: '4.75% – 6.75% (Ilustrativo)',
      whatIsTitle: 'Cómo Funciona el Modelado de Cap Rate en Propiedades Multifamiliares',
      whatIsContent:
        'En bienes raíces comerciales (CRE), Cap Rate = NOI Anual ÷ Precio de Compra; cuando se conocen el NOI sostenible y el Cap Rate aplicable del mercado, puede utilizarse NOI ÷ Cap Rate como referencia de valuación. Dado que los contratos residenciales suelen renovarse cada 12 meses, los ingresos se ajustan con mayor rapidez a los cambios de renta y ocupación que los arrendamientos comerciales de largo plazo.\n\nEn modelos educativos de evaluación financiera, los edificios Clase A suelen modelarse con tasas de capitalización ilustrativas más bajas (ej. 4.75% a 5.50%) por su menor requerimiento inmediato de capital, mientras que las propiedades Clase B y Clase C se modelan con rendimientos ilustrativos mayores (ej. 5.50% a 6.75%+) para reflejar rotación de inquilinos, reservas de mantenimiento y riesgo de renovación. Estos rangos son supuestos ilustrativos de modelado y no cotizaciones del mercado en tiempo real.',
      metricsExploration: {
        title: 'Factores Clave en la Evaluación Multifamiliar',
        points: [
          {
            label: 'Ratio Ilustrativo de Gastos Operativos (35% – 50% del EGI)',
            text: 'El propietario asume impuestos prediales, seguros, servicios de áreas comunes, administración y reacondicionamiento de unidades. Asumir menos del 35% en edificios antiguos suele sobreestimar el NOI.',
          },
          {
            label: 'Constante Anual de Deuda vs. Cap Rate de Entrada',
            text: 'Una tasa de interés nominal inferior al Cap Rate no garantiza apalancamiento positivo en flujo de caja. Como los préstamos amortizables a 25–30 años incluyen pago de principal, debe compararse la constante anual de deuda con el Cap Rate.',
          },
          {
            label: 'Reservas de Reemplazo ($250–$450 / Unidad / Año)',
            text: 'Una evaluación prudente deduce reservas anuales de capital para climatización, techos, electrodomésticos y pisos antes de proyectar el flujo de caja.',
          },
        ],
      },
      workedExample: {
        title: 'Caso Práctico Multifamiliar (Edificio de 32 Unidades Clase B)',
        intro:
          'Considere un escenario ilustrativo de adquisición de un edificio multifamiliar de 32 unidades con supuestos explícitos de ingresos, reservas y deuda amortizable:',
        points: [
          `Precio de Compra: $${MF_PRICE.toLocaleString()} ($109,375 por unidad) | Costos de Cierre (2.0%): $${MF_CLOSING_COSTS.toLocaleString()}`,
          `Ingreso Potencial Bruto (GPI): $${MF_GPI.toLocaleString()}/año | Vacancia y Pérdida Crediticia (5.0%): -$${MF_VACANCY_LOSS.toLocaleString()} → Ingreso Bruto Efectivo (EGI): $${MF_EGI.toLocaleString()}`,
          `Gastos Operativos y Reservas de Reemplazo (incluye reserva anual de $12,000 / $375 por unidad): -$${MF_OPEX_AND_RESERVES.toLocaleString()} (40.19% del EGI)`,
          `Ingreso Operativo Neto (NOI): $${MF_NOI.toLocaleString()} → Cap Rate sin deuda = $${MF_NOI.toLocaleString()} ÷ $${MF_PRICE.toLocaleString()} = ${MF_CAP_RATE.toFixed(2)}%`,
          `Supuestos de Financiamiento: 65% LTV (préstamo de $${MF_LOAN_AMOUNT.toLocaleString()}, entrada de $${MF_DOWN_PAYMENT.toLocaleString()}, capital total invertido de $${MF_TOTAL_CASH.toLocaleString()}), tasa fija de ${MF_INTEREST_RATE.toFixed(2)}%, amortización constante a ${MF_AMORT_YEARS} años`,
          `Servicio Anual de la Deuda: $${MF_ADS.toLocaleString()}/año (constante anual de deuda = ${MF_DEBT_CONSTANT.toFixed(2)}%) → DSCR = ${MF_DSCR.toFixed(2)}x | Flujo de Caja Antes de Impuestos = $${MF_PRETAX_CF.toLocaleString()}/año`,
        ],
        analysis: `Conclusión del Análisis: Aunque la tasa de interés nominal (${MF_INTEREST_RATE.toFixed(2)}%) es menor que el Cap Rate (${MF_CAP_RATE.toFixed(2)}%), la constante anual del préstamo amortizable a ${MF_AMORT_YEARS} años es ${MF_DEBT_CONSTANT.toFixed(2)}% debido al pago de principal. Tras incluir la amortización de capital y el 2.0% de costos de cierre ($${MF_TOTAL_CASH.toLocaleString()} de efectivo total invertido), el retorno Cash-on-Cash del Año 1 es ${MF_COC.toFixed(2)}% con un DSCR de ${MF_DSCR.toFixed(2)}x.`,
      },
      pitfallsTitle: 'Errores Frecuentes al Evaluar el Cap Rate Multifamiliar',
      pitfalls: [
        {
          title: 'Omitir el Reavalúo de Impuestos sobre la Propiedad Tras la Compra',
          desc: 'En numerosos municipios, los impuestos prediales se recalculan sobre el nuevo precio de compraventa. Evaluar con la factura fiscal histórica del vendedor puede inflar artificialmente el Cap Rate entre 50 y 100 pb.',
        },
        {
          title: 'Confundir la Tasa de Interés Nominal con la Constante de Deuda',
          desc: 'Comparar el Cap Rate únicamente con la tasa de interés hipotecaria ignora los pagos de principal y los costos de cierre. Calcule siempre el Servicio Anual de Deuda completo.',
        },
        {
          title: 'Usar Rentas Pro-Forma sin Presupuesto de CapEx',
          desc: 'Si el vendedor calcula el Cap Rate con rentas futuras renovadas, asegúrese de sumar el costo de remodelación por unidad al desembolso total de capital.',
        },
      ],
      faqs: [
        {
          question: '¿Cuál es un rango ilustrativo de Cap Rate para propiedades multifamiliares?',
          answer:
            'En escenarios educativos de modelado financiero, los activos multifamiliares suelen simularse entre 4.75% y 6.75% según su categoría (Clase A, B o C), antigüedad y perfil del submercado. Verifique siempre transacciones comparables locales.',
        },
        {
          question: '¿Esta calculadora utiliza una fórmula diferente a la calculadora universal de Cap Rate?',
          answer:
            'No. Aplica exactamente la misma fórmula universal: Cap Rate = (NOI Anual ÷ Precio de Compra) × 100, con los valores del caso práctico de esta página ($3,500,000 y $218,750 de NOI) precargados.',
        },
        {
          question: '¿Deben deducirse las reservas de reemplazo al calcular el NOI multifamiliar?',
          answer:
            'Sí. Los bancos comerciales y analistas institucionales deducen habitualmente una reserva anual de reemplazo ($250 a $450 por unidad) para evaluar el flujo de caja sostenible y el DSCR.',
        },
      ],
    },
    'industrial-cap-rate': {
      slug: 'industrial-cap-rate',
      propertyTypeName: 'Industrial y Logística',
      metaTitle: 'Calculadora de Cap Rate Industrial y Bodegas | Evaluación CRE',
      metaDescription:
        'Calcule tasas de capitalización para naves industriales, centros de distribución y bodegas mediante escenarios ilustrativos y contratos NNN.',
      h1: 'Calculadora de Cap Rate Industrial y Guía de Modelado Financiero',
      subtitle:
        'Analice centros de distribución, bodegas logísticas y propiedades industriales flexibles utilizando la fórmula universal de Cap Rate y supuestos ilustrativos de arrendamiento NNN.',
      defaultPrice: 8000000,
      defaultNoi: 472000,
      benchmarkRange: '5.25% – 7.00% (Ilustrativo)',
      whatIsTitle: 'Cómo Funciona el Modelado de Cap Rate en Activos Industriales',
      whatIsContent:
        'Los bienes raíces industriales —que abarcan bodegas de última milla, almacenamiento en frío, manufactura ligera y espacios flex— utilizan frecuentemente contratos Triple Neto (NNN) o Bruto Modificado donde los inquilinos reembolsan impuestos prediales, seguros y mantenimiento de áreas comunes (CAM).\n\nEn modelos educativos de evaluación, los centros logísticos modernos de gran altura libre suelen modelarse con tasas de capitalización ilustrativas más ajustadas (ej. 5.25% a 6.00%), mientras que las naves industriales más antiguas o especializadas se modelan con rendimientos ilustrativos mayores (ej. 6.25% a 7.25%+) para reflejar obsolescencia funcional y tiempos de recolocación. Todos los rangos en esta página son supuestos educativos de modelado y no cotizaciones de mercado en vivo.',
      metricsExploration: {
        title: 'Factores Clave de Valoración Industrial',
        points: [
          {
            label: 'Altura Libre y Puertas deAndén (Dock Doors)',
            text: 'Los operadores logísticos modernos suelen requerir alturas libres de 32 a 40 pies, rociadores ESFR y amplios patios de maniobras. Las bodegas antiguas de baja altura requieren supuestos de rendimiento más conservadores.',
          },
          {
            label: 'Renovación de Rentas Bajo Mercado (Mark-to-Market)',
            text: 'Un Cap Rate inicial bajo en un activo industrial puede reflejar contratos antiguos firmados por debajo de la renta actual de mercado, lo que exige modelar cuidadosamente el vencimiento y el tiempo de vacancia.',
          },
          {
            label: 'Reservas Estructurales de Techo y Pavimento',
            text: 'Incluso bajo contratos NNN, el propietario suele ser responsable del reemplazo estructural del techo y la repavimentación de patios de carga pesada.',
          },
        ],
      },
      workedExample: {
        title: 'Caso Práctico Industrial (Bodega de Distribución de 60,000 Pies Cuadrados)',
        intro:
          'Considere el modelado ilustrativo de una nave industrial multiinquilino de 60,000 pies cuadrados bajo contratos NNN:',
        points: [
          'Precio de Compra: $8,000,000 ($133.33 por pie cuadrado)',
          'Renta Base Anual NNN: $504,000 ($8.40 / pie cuadrado NNN) + reembolsos de CAM e impuestos compensados',
          'Provisión por Vacancia y Pérdida de Cobro (4.0%): -$20,160',
          'Gastos del Propietario No Reembolsables (Reserva Estructural y Gestión): -$11,840',
          'Ingreso Operativo Neto (NOI) Estabilizado: $472,000 → Cap Rate sin deuda = $472,000 ÷ $8,000,000 = 5.90%',
        ],
        analysis:
          'Conclusión del Análisis: Con un Cap Rate inicial ilustrativo del 5.90% y escalamientos anuales contractuales del 3.0%, el rendimiento sobre el costo original alcanza el 6.64% en el Año 5, siempre que se presupuesten adecuadamente las reservas estructurales.',
      },
      pitfallsTitle: 'Errores Comunes en la Evaluación Industrial',
      pitfalls: [
        {
          title: 'Pasar por Alto Riesgos Ambientales (Fase I / Fase II)',
          desc: 'Usos históricos de manufactura, químicos o talleres automotrices pueden dejar pasivos ambientales en el suelo o aguas subterráneas que afectan el financiamiento.',
        },
        {
          title: 'Asumir Cero Gastos del Propietario en Contratos NNN Industriales',
          desc: 'Muchos contratos NNN industriales excluyen la estructura del techo, la cimentación y los honorarios de administración durante periodos de vacancia.',
        },
      ],
      faqs: [
        {
          question: '¿Cuál es un rango ilustrativo de Cap Rate para bodegas industriales?',
          answer:
            'En escenarios educativos de modelado, las propiedades industriales y logísticas suelen ubicarse entre 5.25% y 7.00% según las especificaciones técnicas de la nave, la solvencia del inquilino y el plazo restante del contrato.',
        },
        {
          question: '¿Cómo afectan los reembolsos NNN al cálculo del NOI industrial?',
          answer:
            'En un contrato NNN estándar, los impuestos, seguros y CAM reembolsados por el inquilino entran como ingreso y gasto compensado, por lo que la renta base (menos vacancia y reservas estructurales del propietario) define el NOI.',
        },
      ],
    },
    'self-storage-cap-rate': {
      slug: 'self-storage-cap-rate',
      propertyTypeName: 'Autoalmacenamiento (Self-Storage)',
      metaTitle: 'Calculadora de Cap Rate para Self-Storage | Evaluación Comercial',
      metaDescription:
        'Calcule tasas de capitalización para instalaciones de autoalmacenamiento (Self-Storage) evaluando ocupación económica vs. física y escenarios de NOI.',
      h1: 'Calculadora de Cap Rate para Self-Storage y Guía de Evaluación',
      subtitle:
        'Modele adquisiciones de instalaciones de autoalmacenamiento climatizadas y de acceso directo utilizando la fórmula universal de Cap Rate y supuestos de ocupación económica.',
      defaultPrice: 4200000,
      defaultNoi: 273000,
      benchmarkRange: '5.50% – 7.25% (Ilustrativo)',
      whatIsTitle: 'Cómo Funciona la Evaluación de Cap Rate en Self-Storage',
      whatIsContent:
        'Las instalaciones de autoalmacenamiento (Self-Storage) operan con contratos mensuales sin costos de acondicionamiento para inquilinos (TI) ni comisiones de corretaje al rotar unidades. Dado que las tarifas pueden ajustarse mes a mes, los ingresos responden rápidamente a la oferta y demanda local.\n\nEn modelos educativos de evaluación financiera, las instalaciones modernas climatizadas suelen modelarse con tasas de capitalización ilustrativas de 5.50% a 6.25%, mientras que las instalaciones secundarias de acceso vehicular directo se modelan entre 6.25% y 7.25%+. Estas cifras son supuestos ilustrativos con fines educativos y no cotizaciones en tiempo real.',
      metricsExploration: {
        title: 'Métricas Clave en el Análisis de Self-Storage',
        points: [
          {
            label: 'Ocupación Física vs. Ocupación Económica',
            text: 'Un inmueble puede tener 90% de ocupación física, pero si existen descuentos promocionales o morosidad, la ocupación económica (renta efectivamente cobrada ÷ renta potencial de lista) puede ser del 78%–82%.',
          },
          {
            label: 'Ratio Ilustrativo de Gastos Operativos (28% – 38% del EGI)',
            text: 'Las unidades no tienen plomería ni cocinas interiores, reduciendo el mantenimiento; los gastos principales son impuestos prediales, seguros, software de gestión, marketing digital y personal.',
          },
          {
            label: 'Oferta Nueva en un Radio de 3 a 5 Millas',
            text: 'La demanda de autoalmacenamiento es hiperlocal. Nuevos proyectos competidores dentro de un radio de 3 millas pueden presionar las tarifas promocionales y extender la absorción.',
          },
        ],
      },
      workedExample: {
        title: 'Caso Práctico de Self-Storage (55,000 Pies Cuadrados Rentables)',
        intro:
          'Considere una instalación híbrida ilustrativa de 450 unidades (acceso directo y climatizadas):',
        points: [
          'Precio de Compra: $4,200,000 ($76.36 por pie cuadrado neto rentable)',
          'Renta Potencial Bruta de Lista + Cargos Administrativos: $495,000/año',
          'Vacancia Física, Promociones de Entrada e Incobrables (16.0% de pérdida económica combinada): -$79,200 → Ingreso Bruto Efectivo (EGI): $415,800',
          'Gastos Operativos Anuales (Impuestos, Seguros, Gestión, Publicidad Digital): -$142,800 (34.3% del EGI)',
          'Ingreso Operativo Neto (NOI): $273,000 → Cap Rate sin deuda = $273,000 ÷ $4,200,000 = 6.50%',
        ],
        analysis:
          'Conclusión del Análisis: La instalación muestra un Cap Rate inicial ilustrativo del 6.50% sobre ingresos efectivamente recaudados. Verifique siempre los depósitos bancarios de los últimos 12 meses (T-12).',
      },
      pitfallsTitle: 'Trampas Comunes al Evaluar Self-Storage',
      pitfalls: [
        {
          title: 'Proyectar el 100% de las Tarifas Publicadas en Web',
          desc: 'Los clientes existentes suelen pagar tarifas distintas a las publicadas hoy y las promociones reducen el ingreso efectivo. Analice siempre el flujo real cobrado.',
        },
        {
          title: 'Omitir Honorarios de Administración y Presupuesto de Marketing',
          desc: 'Los propietarios individuales a menudo administran el sitio sin cobrar honorarios. Normalice siempre los gastos incluyendo un 5%–6% de administración profesional y marketing.',
        },
      ],
      faqs: [
        {
          question: '¿Cuál es un rango ilustrativo de Cap Rate para instalaciones de Self-Storage?',
          answer:
            'En modelos educativos de evaluación, las instalaciones de autoalmacenamiento suelen simularse entre 5.50% y 7.25% según la proporción de unidades climatizadas, la antigüedad y la competencia en un radio de 3 a 5 millas.',
        },
        {
          question: '¿Cuál es un ratio típico de gastos operativos en Self-Storage?',
          answer:
            'Las propiedades estabilizadas de autoalmacenamiento suelen modelarse con gastos operativos de entre el 28% y el 38% del Ingreso Bruto Efectivo (EGI), aunque el reavalúo de impuestos prediales tras la compra puede elevar este porcentaje.',
        },
      ],
    },
    'nnn-lease-cap-rate': {
      slug: 'nnn-lease-cap-rate',
      propertyTypeName: 'Arrendamiento Neto (NNN)',
      metaTitle: 'Calculadora de Cap Rate para Contratos NNN | Valoración Comercial',
      metaDescription:
        'Calcule tasas de capitalización para propiedades de inquilino único con contrato Triple Neto (NNN) y estime el precio máximo según la renta anual.',
      h1: 'Calculadora de Cap Rate NNN y Guía de Valoración de Inquilino Único',
      subtitle:
        'Valore propiedades comerciales, médicas e industriales de inquilino único bajo contratos Triple Neto (NNN) utilizando la fórmula universal de Cap Rate.',
      defaultPrice: 2800000,
      defaultNoi: 182000,
      benchmarkRange: '5.50% – 7.25% (Ilustrativo)',
      whatIsTitle: 'Cómo Funciona la Valoración de Cap Rate en Contratos NNN',
      whatIsContent:
        'En un contrato Triple Neto Absoluto (Absolute NNN), el inquilino corporativo o franquiciado paga directamente el 100% de los impuestos sobre la propiedad, seguros y mantenimiento, de modo que el Ingreso Operativo Neto (NOI) del propietario equivale prácticamente a la renta base anual contractual.\n\nDado que la volatilidad de los gastos operativos se transfiere al inquilino durante la vigencia del contrato base, la valoración NNN se comporta de forma similar a un bono corporativo: los rangos ilustrativos de Cap Rate dependen de la solvencia crediticia del garante, el plazo remanente del contrato y el valor residual del terreno. Todos los rangos en esta página son escenarios ilustrativos de modelado y no cotizaciones en vivo.',
      metricsExploration: {
        title: 'Tres Pilares en la Evaluación de Contratos NNN',
        points: [
          {
            label: 'Garantía Corporativa vs. Garantía de Franquiciado',
            text: 'Un contrato respaldado por una matriz corporativa con grado de inversión presenta menor riesgo de impago que uno garantizado únicamente por una entidad franquiciada local.',
          },
          {
            label: 'Plazo Primario Remanente del Contrato',
            text: 'Los inmuebles con 12 a 20 años de plazo fijo restante suelen modelarse con tasas de capitalización más bajas que aquellos con menos de 6 años restantes, donde aumenta el riesgo de refinanciamiento.',
          },
          {
            label: 'Relación Renta-Ventas (Rent-to-Sales Ratio)',
            text: 'Los analistas revisan las ventas brutas de la sucursal para confirmar que el costo de ocupación (generalmente 6%–9% de las ventas) sea sostenible para el giro comercial.',
          },
        ],
      },
      workedExample: {
        title: 'Caso Práctico NNN (Restaurante de Servicio Rápido con Drive-Thru)',
        intro:
          'Considere un restaurante de servicio rápido (QSR) de inquilino único bajo un contrato Absolute NNN de 15 años:',
        points: [
          'Precio de Compra: $2,800,000',
          'Renta Base Anual Contractual: $182,000 ($15,167 / mes)',
          'Impuestos Prediales, Seguros y Mantenimiento: 100% pagados directamente por el inquilino (Absolute NNN)',
          'Ingreso Operativo Neto (NOI): $182,000 → Cap Rate sin deuda = $182,000 ÷ $2,800,000 = 6.50%',
          'Incremento Contractual de Renta: 10% cada 5 años (en los Años 6–10 el NOI sube a $200,200 → 7.15% de rendimiento sobre el costo original)',
        ],
        analysis:
          'Conclusión del Análisis: Si el inmueble se vende cuando solo restan 4 años de contrato, el comprador de salida podría exigir un Cap Rate ilustrativo más amplio (ej. 7.25%) para compensar el riesgo de renovación cercana.',
      },
      pitfallsTitle: 'Riesgos Críticos en Inversiones NNN',
      pitfalls: [
        {
          title: 'Renta Sobre Mercado en Edificios Muy Especializados',
          desc: 'Las propiedades construidas a medida (Build-to-Suit) a veces tienen rentas iniciales altas ligadas al costo de construcción. Si el inquilino desocupa al vencer el plazo, reacondicionar el local puede requerir una reducción de renta del 30%–40%.',
        },
        {
          title: 'Contrato Doble Neto (NN) Confundido con Absolute NNN',
          desc: 'Revise siempre la matriz de responsabilidades del contrato. Si el propietario responde por el techo, estructura o reemplazo de climatización, deduzca una reserva anual de CapEx.',
        },
      ],
      faqs: [
        {
          question: '¿Cuál es un rango ilustrativo de Cap Rate para propiedades NNN?',
          answer:
            'En modelos educativos de evaluación financiera, las propiedades NNN de inquilino único suelen simularse entre 5.50% y 7.25% según la calificación crediticia del inquilino, los años restantes de contrato y los incrementos pactados.',
        },
        {
          question: '¿Por qué el plazo restante del contrato influye tanto en el Cap Rate NNN?',
          answer:
            'Porque los prestamistas comerciales y compradores evalúan la certeza del flujo de caja durante la vida del préstamo. Cuando restan menos de 7–8 años de contrato, las opciones de financiamiento se reducen.',
        },
      ],
    },
  },
  pt: {
    'multifamily-cap-rate': {
      slug: 'multifamily-cap-rate',
      propertyTypeName: 'Multifamiliar (5+ Unidades)',
      metaTitle: 'Calculadora de Cap Rate Multifamiliar | Cenários de Análise',
      metaDescription:
        'Calcule a taxa de capitalização para prédios residenciais de 5+ unidades com faixas ilustrativas de modelagem, despesas operacionais e exemplos de NOI.',
      h1: 'Calculadora de Cap Rate Multifamiliar e Cenários de Análise',
      subtitle:
        'Avalie aquisições de prédios residenciais de 5+ unidades aplicando a fórmula universal de Cap Rate (NOI ÷ Preço de Compra) e premissas educativas para ativos Classe A, B e C.',
      defaultPrice: MF_PRICE,
      defaultNoi: MF_NOI,
      benchmarkRange: '4.75% – 6.75% (Ilustrativo)',
      whatIsTitle: 'Como Funciona a Modelagem de Cap Rate em Imóveis Multifamiliares',
      whatIsContent:
        'No setor imobiliário comercial (CRE), Cap Rate = NOI Anual ÷ Preço de Compra; quando o NOI sustentável e a taxa de capitalização aplicável de mercado são conhecidos, pode-se utilizar NOI ÷ Cap Rate como referência de avaliação. Como os contratos residenciais costumam ser renovados a cada 12 meses, a receita acompanha as mudanças de aluguel e ocupação mais rapidamente do que contratos comerciais de longo prazo.\n\nEm modelos educativos de análise financeira, edifícios Classe A costumam ser simulados com taxas de capitalização ilustrativas menores (ex.: 4.75% a 5.50%) devido à menor necessidade imediata de reformas, enquanto imóveis Classe B e Classe C são modelados com rendimentos ilustrativos mais elevados (ex.: 5.50% a 6.75%+) para refletir rotatividade de inquilinos, reservas de manutenção e risco de modernização. Estas faixas são premissas ilustrativas de modelagem e não cotações de mercado em tempo real.',
      metricsExploration: {
        title: 'Fatores Essenciais na Análise Multifamiliar',
        points: [
          {
            label: 'Índice Ilustrativo de Despesas Operacionais (35% – 50% do EGI)',
            text: 'O proprietário arca com impostos prediais, seguros, contas de áreas comuns, administração e reforma entre locações. Assumir menos de 35% em prédios antigos geralmente superestima o NOI.',
          },
          {
            label: 'Constante Anual da Dívida vs. Cap Rate de Entrada',
            text: 'Uma taxa de juros nominal abaixo do Cap Rate não garante alavancagem positiva de fluxo de caixa. Como financiamentos amortizáveis de 25–30 anos incluem amortização de principal, deve-se comparar a constante anual da dívida com o Cap Rate.',
          },
          {
            label: 'Reservas de Reposição ($250–$450 / Unidade / Ano)',
            text: 'Uma análise prudente deduz reservas anuais de capital para ar-condicionado, telhado, eletrodomésticos e pisos antes de projetar o fluxo de caixa sustentável.',
          },
        ],
      },
      workedExample: {
        title: 'Exemplo Prático Multifamiliar (Edifício de 32 Unidades Classe B)',
        intro:
          'Considere um cenário ilustrativo de aquisição de um edifício multifamiliar de 32 unidades com premissas explícitas de receita, reservas e financiamento amortizável:',
        points: [
          `Preço de Compra: $${MF_PRICE.toLocaleString()} ($109,375 por unidade) | Custos de Fechamento (2.0%): $${MF_CLOSING_COSTS.toLocaleString()}`,
          `Receita Bruta Potencial (GPI): $${MF_GPI.toLocaleString()}/ano | Vacância e Inadimplência (5.0%): -$${MF_VACANCY_LOSS.toLocaleString()} → Receita Bruta Efetiva (EGI): $${MF_EGI.toLocaleString()}`,
          `Despesas Operacionais e Reservas de Reposição (inclui reserva anual de $12,000 / $375 por unidade): -$${MF_OPEX_AND_RESERVES.toLocaleString()} (40.19% do EGI)`,
          `Receita Operacional Líquida (NOI): $${MF_NOI.toLocaleString()} → Cap Rate desalavancado = $${MF_NOI.toLocaleString()} ÷ $${MF_PRICE.toLocaleString()} = ${MF_CAP_RATE.toFixed(2)}%`,
          `Premissas de Financiamento: 65% LTV (empréstimo de $${MF_LOAN_AMOUNT.toLocaleString()}, entrada de $${MF_DOWN_PAYMENT.toLocaleString()}, capital total investido de $${MF_TOTAL_CASH.toLocaleString()}), juros fixos de ${MF_INTEREST_RATE.toFixed(2)}%, amortização Price em ${MF_AMORT_YEARS} anos`,
          `Serviço Anual da Dívida: $${MF_ADS.toLocaleString()}/ano (constante anual da dívida = ${MF_DEBT_CONSTANT.toFixed(2)}%) → DSCR = ${MF_DSCR.toFixed(2)}x | Fluxo de Caixa Antes de Impostos = $${MF_PRETAX_CF.toLocaleString()}/ano`,
        ],
        analysis: `Conclusão da Análise: Embora a taxa de juros nominal (${MF_INTEREST_RATE.toFixed(2)}%) seja inferior ao Cap Rate (${MF_CAP_RATE.toFixed(2)}%), a constante anual do financiamento amortizável em ${MF_AMORT_YEARS} anos é de ${MF_DEBT_CONSTANT.toFixed(2)}% devido à amortização do principal. Após contabilizar a amortização de capital e 2.0% de custos de fechamento ($${MF_TOTAL_CASH.toLocaleString()} de capital total investido), o retorno Cash-on-Cash no Ano 1 é de ${MF_COC.toFixed(2)}% com DSCR de ${MF_DSCR.toFixed(2)}x.`,
      },
      pitfallsTitle: 'Erros Comuns ao Avaliar o Cap Rate Multifamiliar',
      pitfalls: [
        {
          title: 'Ignorar a Reavaliação do Imposto Predial Após a Compra',
          desc: 'Em muitos municípios, o imposto predial é recalculado com base no novo valor de compra. Utilizar o imposto histórico do vendedor pode inflar artificialmente o Cap Rate em 50 a 100 bps.',
        },
        {
          title: 'Confundir Taxa Nominal de Juros com Constante da Dívida',
          desc: 'Comparar o Cap Rate apenas com a taxa nominal de juros ignora a amortização mensal do principal e os custos de fechamento. Calcule sempre o Serviço Anual da Dívida completo.',
        },
        {
          title: 'Usar Aluguéis Pro-Forma sem Orçamento de CapEx',
          desc: 'Se o vendedor apresentar um Cap Rate baseado em aluguéis pós-reforma, inclua o orçamento de renovação das unidades no capital total investido.',
        },
      ],
      faqs: [
        {
          question: 'Qual é uma faixa ilustrativa de Cap Rate para imóveis multifamiliares?',
          answer:
            'Em cenários educativos de modelagem financeira, imóveis multifamiliares costumam ser simulados entre 4.75% e 6.75% conforme a classe do ativo (Classe A, B ou C), idade do prédio e perfil do submercado. Verifique sempre transações comparáveis locais.',
        },
        {
          question: 'Esta calculadora utiliza uma fórmula diferente da calculadora universal de Cap Rate?',
          answer:
            'Não. Ela aplica exatamente a mesma fórmula universal: Cap Rate = (NOI Anual ÷ Preço de Compra) × 100, pré-carregada com os valores do exemplo prático desta página ($3,500,000 e $218,750 de NOI).',
        },
        {
          question: 'As reservas de reposição devem ser deduzidas ao calcular o NOI multifamiliar?',
          answer:
            'Sim. Bancos comerciais e analistas institucionais costumam deduzir uma reserva anual de reposição ($250 a $450 por unidade) para avaliar o fluxo de caixa sustentável e o DSCR.',
        },
      ],
    },
    'industrial-cap-rate': {
      slug: 'industrial-cap-rate',
      propertyTypeName: 'Industrial e Galpões Logísticos',
      metaTitle: 'Calculadora de Cap Rate Industrial e Galpões | Análise CRE',
      metaDescription:
        'Calcule taxas de capitalização para galpões industriais, centros de distribuição e imóveis logísticos usando faixas ilustrativas e contratos NNN.',
      h1: 'Calculadora de Cap Rate Industrial e Guia de Modelagem Financeira',
      subtitle:
        'Analise centros de distribuição, galpões logísticos e imóveis industriais flexíveis utilizando a fórmula universal de Cap Rate e premissas ilustrativas de contratos NNN.',
      defaultPrice: 8000000,
      defaultNoi: 472000,
      benchmarkRange: '5.25% – 7.00% (Ilustrativo)',
      whatIsTitle: 'Como Funciona a Modelagem de Cap Rate em Ativos Industriais',
      whatIsContent:
        'Os imóveis industriais — incluindo galpões de última milha, armazenagem refrigerada, manufatura leve e espaços flex — utilizam frequentemente contratos Triple Net (NNN) ou Bruto Modificado, nos quais os inquilinos reembolsam impostos prediais, seguro patrimonial e manutenção de áreas comuns (CAM).\n\nEm modelos educativos de análise, centros logísticos modernos com pé-direito elevado costumam ser modelados com taxas de capitalização ilustrativas mais baixas (ex.: 5.25% a 6.00%), enquanto galpões mais antigos ou especializados são simulados com rendimentos ilustrativos maiores (ex.: 6.25% a 7.25%+) para refletir obsolescência funcional e tempo de recolocação. Todas as faixas nesta página são premissas educativas de modelagem e não cotações de mercado em tempo real.',
      metricsExploration: {
        title: 'Fatores Essenciais de Avaliação Industrial',
        points: [
          {
            label: 'Pé-Direito Livre e Docas de Carga (Dock Doors)',
            text: 'Operadores logísticos modernos costumam exigir pé-direito livre de 32 a 40 pés, sprinklers ESFR e amplos pátios de manobra. Galpões antigos exigem premissas de retorno mais conservadoras.',
          },
          {
            label: 'Renovação de Aluguéis Abaixo do Mercado (Mark-to-Market)',
            text: 'Um Cap Rate inicial baixo em um ativo industrial pode refletir contratos antigos firmados abaixo do valor atual de mercado, exigindo modelagem cuidadosa do vencimento e vacância.',
          },
          {
            label: 'Reservas Estruturais de Telhado e Pátio',
            text: 'Mesmo em contratos NNN, o proprietário geralmente permanece responsável pela substituição estrutural do telhado e recapeamento de pátios de caminhões pesados.',
          },
        ],
      },
      workedExample: {
        title: 'Exemplo Prático Industrial (Galpão de Distribuição de 60,000 Pés Quadrados)',
        intro:
          'Considere a modelagem ilustrativa de um galpão industrial multi-inquilino de 60,000 pés quadrados sob contratos NNN:',
        points: [
          'Preço de Compra: $8,000,000 ($133.33 por pé quadrado)',
          'Receita Base Anual de Aluguel NNN: $504,000 ($8.40 / pé quadrado NNN) + reembolsos de CAM e impostos compensados',
          'Provisão para Vacância e Inadimplência (4.0%): -$20,160',
          'Despesas do Proprietário Não Reembolsáveis (Reserva Estrutural e Gestão): -$11,840',
          'Receita Operacional Líquida (NOI) Estabilizada: $472,000 → Cap Rate desalavancado = $472,000 ÷ $8,000,000 = 5.90%',
        ],
        analysis:
          'Conclusão da Análise: Com um Cap Rate inicial ilustrativo de 5.90% e reajustes anuais contratuais de 3.0%, o retorno sobre o custo original atinge 6.64% no Ano 5, desde que as reservas estruturais sejam devidamente orçadas.',
      },
      pitfallsTitle: 'Armadilhas Comuns na Análise Industrial',
      pitfalls: [
        {
          title: 'Ignorar Riscos Ambientais (Fase I / Fase II)',
          desc: 'Usos históricos de manufatura, produtos químicos ou oficinas podem deixar contaminação no solo ou lençol freático, afetando o financiamento e a liquidez.',
        },
        {
          title: 'Assumir Despesa Zero do Proprietário em Contratos NNN Industriais',
          desc: 'Muitos contratos NNN industriais excluem a estrutura do telhado, fundação e taxas de gestão durante períodos de vacância.',
        },
      ],
      faqs: [
        {
          question: 'Qual é uma faixa ilustrativa de Cap Rate para galpões industriais?',
          answer:
            'Em cenários educativos de modelagem, imóveis industriais e logísticos costumam ser simulados entre 5.25% e 7.00% conforme as especificações construtivas, crédito do inquilino e prazo restante de locação.',
        },
        {
          question: 'Como os reembolsos NNN afetam o cálculo do NOI industrial?',
          answer:
            'Em um contrato NNN padrão, impostos, seguros e CAM reembolsados pelo inquilino entram como receita e despesa compensadas, de modo que o aluguel base (menos vacância e reservas estruturais do proprietário) define o NOI.',
        },
      ],
    },
    'self-storage-cap-rate': {
      slug: 'self-storage-cap-rate',
      propertyTypeName: 'Autoarmazenamento (Self-Storage)',
      metaTitle: 'Calculadora de Cap Rate para Self-Storage | Guia de Análise',
      metaDescription:
        'Calcule taxas de capitalização para unidades de autoarmazenamento (Self-Storage) avaliando ocupação econômica vs. física e cenários de NOI.',
      h1: 'Calculadora de Cap Rate para Self-Storage e Guia de Análise',
      subtitle:
        'Modele aquisições de instalações de autoarmazenamento climatizadas e drive-up utilizando a fórmula universal de Cap Rate e premissas de ocupação econômica.',
      defaultPrice: 4200000,
      defaultNoi: 273000,
      benchmarkRange: '5.50% – 7.25% (Ilustrativo)',
      whatIsTitle: 'Como Funciona a Análise de Cap Rate em Self-Storage',
      whatIsContent:
        'As instalações de autoarmazenamento (Self-Storage) operam com contratos mensais sem custos de reforma interna para inquilinos (TI) nem comissões de corretagem na troca de locatários. Como as tarifas podem ser ajustadas mensalmente, a receita responde rapidamente à oferta e demanda local.\n\nEm modelos educativos de análise financeira, instalações modernas climatizadas costumam ser simuladas com taxas de capitalização ilustrativas de 5.50% a 6.25%, enquanto instalações secundárias de acesso direto são modeladas entre 6.25% e 7.25%+. Estes números são premissas ilustrativas para fins educativos e não cotações em tempo real.',
      metricsExploration: {
        title: 'Métricas Essenciais na Análise de Self-Storage',
        points: [
          {
            label: 'Ocupação Física vs. Ocupação Econômica',
            text: 'Uma unidade pode ter 90% de ocupação física, mas se houver descontos promocionais de entrada ou inadimplência, a ocupação econômica (aluguel efetivamente recebido ÷ receita potencial de tabela) pode ser de 78%–82%.',
          },
          {
            label: 'Índice Ilustrativo de Despesas Operacionais (28% – 38% do EGI)',
            text: 'Os boxes não possuem encanamento ou cozinhas, reduzindo a manutenção; as principais despesas são impostos prediais, seguros, software de gestão, marketing digital e equipe.',
          },
          {
            label: 'Nova Oferta em um Raio de 3 a 5 Milhas',
            text: 'A demanda por autoarmazenamento é hiperlocal. Novos concorrentes num raio de 3 milhas podem pressionar as tarifas promocionais e prolongar a absorção.',
          },
        ],
      },
      workedExample: {
        title: 'Exemplo Prático de Self-Storage (55,000 Pés Quadrados Locáveis)',
        intro:
          'Considere uma instalação híbrida ilustrativa de 450 boxes (acesso direto e climatizados):',
        points: [
          'Preço de Compra: $4,200,000 ($76.36 por pé quadrado líquido locável)',
          'Receita Potencial Bruta de Tabela + Taxas Administrativas: $495,000/ano',
          'Vacância Física, Promoções de Entrada e Inadimplência (16.0% de perda econômica combinada): -$79,200 → Receita Bruta Efetiva (EGI): $415,800',
          'Despesas Operacionais Anuais (Impostos, Seguros, Gestão, Publicidade Digital): -$142,800 (34.3% do EGI)',
          'Receita Operacional Líquida (NOI): $273,000 → Cap Rate desalavancado = $273,000 ÷ $4,200,000 = 6.50%',
        ],
        analysis:
          'Conclusão da Análise: A instalação apresenta um Cap Rate inicial ilustrativo de 6.50% sobre a receita efetivamente arrecadada. Verifique sempre os extratos bancários dos últimos 12 meses (T-12).',
      },
      pitfallsTitle: 'Armadilhas Comuns ao Avaliar Self-Storage',
      pitfalls: [
        {
          title: 'Projetar 100% das Tarifas Anunciadas na Web',
          desc: 'Clientes antigos costumam pagar valores diferentes da tabela atual e promoções reduzem a receita efetiva. Analise sempre o caixa real recebido.',
        },
        {
          title: 'Omitir Taxas de Administração Profissional e Marketing',
          desc: 'Proprietários familiares muitas vezes gerenciam o imóvel sem contabilizar taxa de administração. Normalize sempre as despesas incluindo 5%–6% de gestão profissional e marketing.',
        },
      ],
      faqs: [
        {
          question: 'Qual é uma faixa ilustrativa de Cap Rate para instalações de Self-Storage?',
          answer:
            'Em modelos educativos de análise, instalações de autoarmazenamento costumam ser simuladas entre 5.50% e 7.25% conforme a proporção de unidades climatizadas, idade do imóvel e concorrência num raio de 3 a 5 milhas.',
        },
        {
          question: 'Qual é um índice típico de despesas operacionais em Self-Storage?',
          answer:
            'Propriedades estabilizadas de autoarmazenamento costumam ser modeladas com despesas operacionais entre 28% e 38% da Receita Bruta Efetiva (EGI), embora a reavaliação do imposto predial após a compra possa elevar esse percentual.',
        },
      ],
    },
    'nnn-lease-cap-rate': {
      slug: 'nnn-lease-cap-rate',
      propertyTypeName: 'Contrato Net Lease (NNN)',
      metaTitle: 'Calculadora de Cap Rate para Contratos NNN | Avaliação Comercial',
      metaDescription:
        'Calcule taxas de capitalização para imóveis de inquilino único com contrato Triple Net (NNN) e estime o preço máximo a partir do aluguel líquido anual.',
      h1: 'Calculadora de Cap Rate NNN e Guia de Avaliação de Inquilino Único',
      subtitle:
        'Avalie imóveis comerciais, médicos e industriais de inquilino único sob contratos Triple Net (NNN) utilizando a fórmula universal de Cap Rate.',
      defaultPrice: 2800000,
      defaultNoi: 182000,
      benchmarkRange: '5.50% – 7.25% (Ilustrativo)',
      whatIsTitle: 'Como Funciona a Avaliação de Cap Rate em Contratos NNN',
      whatIsContent:
        'Em um contrato Triple Net Absoluto (Absolute NNN), o inquilino corporativo ou franqueado paga diretamente 100% dos impostos prediais, seguros e manutenção, fazendo com que a Receita Operacional Líquida (NOI) do proprietário seja praticamente igual ao aluguel base anual contratual.\n\nComo a volatilidade das despesas operacionais é transferida ao locatário durante a vigência do contrato principal, a avaliação NNN comporta-se de maneira semelhante a um título de renda fixa corporativo: as faixas ilustrativas de Cap Rate variam conforme a qualidade de crédito do garantidor, o prazo remanescente do contrato e o valor residual do terreno. Todas as faixas nesta página são cenários ilustrativos de modelagem e não cotações em tempo real.',
      metricsExploration: {
        title: 'Três Pilares na Precificação de Contratos NNN',
        points: [
          {
            label: 'Garantia Corporativa vs. Garantia de Franqueado',
            text: 'Um contrato garantido por uma matriz corporativa com grau de investimento apresenta menor risco de inadimplência do que um garantido apenas por um operador franqueado local.',
          },
          {
            label: 'Prazo Primário Remanescente do Contrato',
            text: 'Imóveis com 12 a 20 anos de prazo firme restante costumam ser modelados com taxas de capitalização menores do que aqueles com menos de 6 anos restantes, onde cresce o risco de refinanciamento.',
          },
          {
            label: 'Índice Aluguel-Vendas (Rent-to-Sales Ratio)',
            text: 'Analistas avaliam o faturamento bruto da loja para confirmar se o custo de ocupação (geralmente 6%–9% das vendas) é sustentável para o segmento.',
          },
        ],
      },
      workedExample: {
        title: 'Exemplo Prático NNN (Restaurante Drive-Thru de Inquilino Único)',
        intro:
          'Considere um restaurante de serviço rápido (QSR) de inquilino único sob contrato Absolute NNN de 15 anos:',
        points: [
          'Preço de Compra: $2,800,000',
          'Aluguel Base Anual Contratual: $182,000 ($15,167 / mês)',
          'Impostos Prediais, Seguros e Manutenção: 100% pagos diretamente pelo inquilino (Absolute NNN)',
          'Receita Operacional Líquida (NOI): $182,000 → Cap Rate desalavancado = $182,000 ÷ $2,800,000 = 6.50%',
          'Reajuste Contratual de Aluguel: 10% a cada 5 anos (nos Anos 6–10 o NOI sobe para $200,200 → 7.15% de retorno sobre o custo original)',
        ],
        analysis:
          'Conclusão da Análise: Se o imóvel for vendido quando restarem apenas 4 anos de contrato, o comprador de saída poderá exigir um Cap Rate ilustrativo maior (ex.: 7.25%) para compensar o risco de renovação próxima.',
      },
      pitfallsTitle: 'Riscos Críticos em Investimentos NNN',
      pitfalls: [
        {
          title: 'Aluguel Acima do Mercado em Imóveis Muito Especializados',
          desc: 'Imóveis construídos sob medida (Build-to-Suit) às vezes possuem aluguéis iniciais elevados atrelados ao custo de obra. Se o inquilino sair no vencimento, adaptar o imóvel pode exigir redução de 30%–40% no aluguel.',
        },
        {
          title: 'Contrato Double Net (NN) Confundido com Absolute NNN',
          desc: 'Verifique sempre a matriz de responsabilidades do contrato. Se o proprietário responder por telhado, estrutura ou substituição de ar-condicionado central, deduza uma reserva anual de CapEx.',
        },
      ],
      faqs: [
        {
          question: 'Qual é uma faixa ilustrativa de Cap Rate para imóveis NNN?',
          answer:
            'Em modelos educativos de análise financeira, imóveis NNN de inquilino único costumam ser simulados entre 5.50% e 7.25% conforme a classificação de crédito do locatário, prazo restante de contrato e reajustes programados.',
        },
        {
          question: 'Por que o prazo restante de locação impacta tanto o Cap Rate NNN?',
          answer:
            'Porque financiadores comerciais e compradores avaliam a previsibilidade do fluxo de caixa durante o prazo do financiamento. Quando restam menos de 7–8 anos de contrato, as condições de crédito tornam-se mais restritas.',
        },
      ],
    },
  },
};

export function getPropertyCapRateContent(locale: string, slug: PropertyCapRateSlug): PropertyCapRateContent {
  const lang = locale === 'zh' || locale === 'es' || locale === 'pt' ? locale : 'en';
  return propertyCapRatesContent[lang][slug];
}
