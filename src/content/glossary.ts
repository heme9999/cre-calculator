export interface GlossaryTerm {
  slug: string;
  term: string;
  fullName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  shortDefinition: string;
  fullDefinition: string;
  whyItMatters: string;
  formula: string;
  variables: { name: string; desc: string }[];
  example: {
    title: string;
    scenario: string;
    calculation: string;
    interpretation: string;
  };
  benchmarks: string[];
  calculatorCta: {
    title: string;
    desc: string;
    url: string;
    anchorText: string;
  };
  faqs: { question: string; answer: string }[];
}

export const GLOSSARY_SLUGS = [
  'noi',
  'cap-rate',
  'dscr',
  'ber',
  'beo',
  'irr',
  'grm',
] as const;

export type GlossarySlug = (typeof GLOSSARY_SLUGS)[number];

export const glossaryContent: Record<string, Record<GlossarySlug, GlossaryTerm>> = {
  en: {
    'noi': {
      slug: 'noi',
      term: 'NOI',
      fullName: 'Net Operating Income',
      metaTitle: 'What is NOI in Commercial Real Estate? Formula & Definition',
      metaDescription: 'Learn what Net Operating Income (NOI) is in commercial real estate underwriting. Clear formula, illustrative calculation example, and direct link to the free NOI calculator.',
      h1: 'Net Operating Income (NOI): Definition, Formula & Underwriting Guide',
      shortDefinition: 'Net Operating Income (NOI) is the fundamental measure of a commercial property’s profitability, calculated as total operating revenue minus operating expenses, before debt service and taxes.',
      fullDefinition: `Net Operating Income (NOI) reflects the true operational earning power of a commercial real estate property. It includes all revenue generated on-site (gross rental income, utility reimbursements, storage fees, parking fees, laundry income) and subtracts all normal, routine property operating expenses (property taxes, insurance, property management fees, utilities, routine maintenance, repairs, and landscaping).\n\nCrucially, NOI is calculated before deducting debt service (mortgage principal and interest payments), capital expenditures (CapEx), depreciation, and income taxes. This makes NOI an unleveraged, property-level metric that allows investors and appraisers to compare the fundamental earning power of assets regardless of individual owner financing structures.`,
      whyItMatters: 'NOI serves as the critical numerator in calculating Capitalization Rates (Cap Rate = NOI / Price) and the critical numerator in determining Debt Service Coverage Ratio (DSCR = NOI / Annual Debt Service). Commercial lenders and appraisers base asset valuations directly on audited historical trailing 12-month (T12) NOI.',
      formula: 'NOI = Effective Gross Income (EGI) - Total Operating Expenses (OpEx)',
      variables: [
        { name: 'Effective Gross Income (EGI)', desc: 'Gross Potential Rent + Ancillary Income minus Vacancy & Credit Losses.' },
        { name: 'Operating Expenses (OpEx)', desc: 'Property taxes, hazard insurance, third-party management, recurring maintenance, utilities, and administrative expenses.' },
      ],
      example: {
        title: 'Worked Commercial Example',
        scenario: 'A 20-unit apartment building produces $300,000 in Gross Potential Rent with a 5% vacancy loss ($15,000) and $10,000 in parking income, giving an EGI of $295,000. Annual property taxes are $42,000, insurance is $14,000, management is $20,000, and repairs/utilities total $39,000 (total OpEx = $115,000).',
        calculation: 'NOI = $295,000 (EGI) - $115,000 (OpEx) = $180,000 / year.',
        interpretation: 'The property produces $180,000 in annual net operating cash before paying any mortgage debt or investor distributions.',
      },
      benchmarks: [
        'Operating Expense Ratios (OpEx / EGI) typically range between 40% to 52% for multifamily.',
        'Institutional NNN retail assets often have OpEx ratios under 10% due to expense pass-throughs.',
        'High-rise urban office buildings often see OpEx ratios exceeding 55%.',
      ],
      calculatorCta: {
        title: 'Ready to Calculate NOI for Your Deal?',
        desc: 'Model gross rent, vacancy allowances, expense categories, and replacement reserves with our free interactive tool.',
        url: 'calculators/noi',
        anchorText: 'Launch Free NOI Calculator',
      },
      faqs: [
        { question: 'Does NOI include mortgage payments?', answer: 'No. Mortgage principal and interest payments are classified as Debt Service and are deducted below NOI to arrive at Cash Flow Before Taxes (CFBT).' },
        { question: 'Is CapEx included in operating expenses for NOI?', answer: 'No. Major capital improvements (like a new roof or HVAC replacement) are capitalized and depreciated over time, rather than expensed directly in operational NOI.' },
        { question: 'What is the difference between GPI and EGI in NOI calculations?', answer: 'Gross Potential Income (GPI) is theoretical 100% full-capacity rent. Effective Gross Income (EGI) adjusts for real-world tenant vacancy and bad debt, plus adds ancillary fee revenues.' },
      ],
    },
    'cap-rate': {
      slug: 'cap-rate',
      term: 'Cap Rate',
      fullName: 'Capitalization Rate',
      metaTitle: 'What is Cap Rate in Commercial Real Estate? Formula & Definition',
      metaDescription: 'Complete guide to Capitalization Rate (Cap Rate) in commercial real estate. Mathematical formula, rule-of-thumb benchmarks by market tier, and link to the free Cap Rate calculator.',
      h1: 'Capitalization Rate (Cap Rate): Definition, Formula & Market Benchmarks',
      shortDefinition: 'Capitalization Rate (Cap Rate) measures the unleveraged rate of return expected on a commercial real estate property, expressed as Net Operating Income (NOI) divided by current market value or purchase price.',
      fullDefinition: `Capitalization Rate, commonly called Cap Rate, is the most universally referenced return and valuation metric in commercial real estate. It reflects the percentage yield an investor would receive in Year 1 if they acquired the property with 100% cash, without any mortgage debt.\n\nCap rates move inversely to property values: when cap rates compress (decline), property valuations rise. When cap rates expand (increase), valuations fall. Cap rates also reflect perceived investment risk—core institutional assets in gateway cities trade at lower cap rates, while older value-add assets in secondary or tertiary markets demand higher cap rates to compensate for higher operational and economic risk.`,
      whyItMatters: 'Cap rates allow direct apples-to-apples comparisons between different properties regardless of size, tenant counts, or unique financing structures. Brokers and appraisers use market cap rates to perform reverse valuations (Value = NOI / Market Cap Rate).',
      formula: 'Cap Rate (%) = [ Net Operating Income (NOI) / Purchase Price or Market Value ] × 100',
      variables: [
        { name: 'Net Operating Income (NOI)', desc: 'Stabilized annual property income after operating expenses, before debt service.' },
        { name: 'Purchase Price / Market Value', desc: 'The contract acquisition price or verified independent appraised value.' },
      ],
      example: {
        title: 'Worked Commercial Example',
        scenario: 'An industrial distribution warehouse generates $360,000 in stabilized Net Operating Income (NOI). The asking acquisition price is $5,500,000.',
        calculation: 'Cap Rate = ($360,000 / $5,500,000) × 100 = 6.55%.',
        interpretation: 'If acquired for all cash, the property yields a 6.55% annual return on invested capital.',
      },
      benchmarks: [
        'Tier-1 Gateway Markets (NYC, LA, SF): 4.75% - 5.50% core cap rates.',
        'Tier-2 Secondary Growth Markets (Austin, Dallas, Miami): 5.50% - 6.75% cap rates.',
        'Tier-3 Tertiary & Rural Markets: 6.75% - 8.25%+ cap rates reflecting higher liquidity premiums.',
      ],
      calculatorCta: {
        title: 'Underwrite Deal Yields with Our Cap Rate Calculator',
        desc: 'Calculate forward cap rate or reverse-engineer your maximum allowable purchase price for any target yield.',
        url: 'calculators/cap-rate',
        anchorText: 'Open Cap Rate Calculator',
      },
      faqs: [
        { question: 'What is a good cap rate for commercial real estate?', answer: 'A "good" cap rate depends entirely on property risk profile and market interest rates. Investors generally seek cap rates at least 100 to 150 basis points above the cost of borrowing (positive leverage).' },
        { question: 'What is the difference between Cap Rate and Cash-on-Cash Return?', answer: 'Cap Rate measures unleveraged return on total property value. Cash-on-Cash Return measures the leveraged cash flow return solely on the actual equity down payment invested.' },
        { question: 'Why do cap rates vary across property types?', answer: 'Different asset classes carry distinct risk profiles. Multifamily and industrial typically command lower cap rates due to liquidity and stability, while older office buildings carry higher cap rates due to leasing uncertainty.' },
      ],
    },
    'dscr': {
      slug: 'dscr',
      term: 'DSCR',
      fullName: 'Debt Service Coverage Ratio',
      metaTitle: 'What is DSCR in Real Estate? Formula, Benchmarks & Guide',
      metaDescription: 'Learn what Debt Service Coverage Ratio (DSCR) is in commercial lending. Standard bank underwriting thresholds, calculation formulas, and free DSCR calculator link.',
      h1: 'Debt Service Coverage Ratio (DSCR): Definition, Formula & Bank Standards',
      shortDefinition: 'Debt Service Coverage Ratio (DSCR) measures the ability of a commercial property’s Net Operating Income (NOI) to comfortably cover its required annual mortgage debt service.',
      fullDefinition: `Debt Service Coverage Ratio (DSCR) is the paramount risk metric utilized by commercial mortgage lenders, regional banks, life insurance companies, and CMBS underwriters. It evaluates whether a property generates sufficient net operating income to pay its annual principal and interest mortgage obligations with a safe financial cushion.\n\nA DSCR of exactly 1.00x means the property’s NOI exactly equals its mortgage payments—leaving zero dollars in free cash flow for unexpected repairs, tenant turnover, or investor distributions. Commercial lenders mandate a safety cushion, requiring minimum ratios typically between 1.20x and 1.35x before approving loan underwriting.`,
      whyItMatters: 'DSCR dictates the maximum loan amount a lender will approve for a commercial deal. Even if an investor offers a 40% down payment, if the property’s historical T12 NOI fails to meet the lender’s minimum DSCR threshold, the loan amount will be sized down.',
      formula: 'DSCR = Net Operating Income (NOI) / Annual Debt Service',
      variables: [
        { name: 'Net Operating Income (NOI)', desc: 'Total effective property revenues minus standard operational expenses.' },
        { name: 'Annual Debt Service', desc: 'Total 12-month principal and interest mortgage payments required by the lender.' },
      ],
      example: {
        title: 'Worked Commercial Example',
        scenario: 'A retail shopping strip generates $250,000 in annual NOI. The proposed commercial loan requires monthly principal and interest payments of $15,000 ($180,000 per year).',
        calculation: 'DSCR = $250,000 (NOI) / $180,000 (Debt Service) = 1.39x.',
        interpretation: 'The property produces $1.39 of income for every $1.00 of required mortgage debt service, providing a healthy 39% safety buffer ($70,000 cash cushion) that easily exceeds standard commercial bank requirements.',
      },
      benchmarks: [
        '≥ 1.25x: Standard minimum threshold for conventional commercial bank underwriting.',
        '1.15x - 1.20x: Acceptable for investment-grade credit NNN leases or agency multifamily.',
        '< 1.00x: Insolvent / negative cash flow debt coverage that fails commercial underwriting.',
      ],
      calculatorCta: {
        title: 'Check Your Loan Approval Thresholds',
        desc: 'Calculate debt coverage ratio, annual cash cushions, and maximum allowable debt service with our dedicated tool.',
        url: 'calculators/dscr',
        anchorText: 'Use Free DSCR Calculator',
      },
      faqs: [
        { question: 'What is the minimum DSCR required by commercial banks?', answer: 'Most commercial banks and credit unions require a minimum 1.20x to 1.25x DSCR based on in-place trailing 12-month operating statements.' },
        { question: 'What happens if a property’s DSCR falls below 1.0x?', answer: 'If DSCR is below 1.0x, the property is in cash deficit—the owner must bring external capital to cover mortgage payments. In loan agreements, this can trigger loan covenant default or cash management lockboxes.' },
        { question: 'Does DSCR use gross rent or net operating income?', answer: 'Always Net Operating Income (NOI). Lenders never use gross rent because operating expenses must be paid first to prevent tax liens or property deterioration.' },
      ],
    },
    'ber': {
      slug: 'ber',
      term: 'BER',
      fullName: 'Break-Even Ratio',
      metaTitle: 'What is Break-Even Ratio (BER) in Commercial Real Estate?',
      metaDescription: 'Understand Break-Even Ratio (BER) in commercial real estate. How lenders assess revenue vulnerability, mathematical formula, and link to the free BER calculator.',
      h1: 'Break-Even Ratio (BER): Definition, Formula & Underwriting Guide',
      shortDefinition: 'Break-Even Ratio (BER) measures the percentage of Gross Potential Income (GPI) required to pay all operating expenses and debt service, revealing property financial vulnerability.',
      fullDefinition: `The Break-Even Ratio (BER) is an essential stress-testing metric in commercial real estate debt underwriting. It demonstrates the exact proportion of gross potential revenue that is committed to fixed non-negotiable outflows—specifically property operating expenses and mandatory loan payments.\n\nThe difference between 100% and the Break-Even Ratio represents the property’s financial buffer against vacancy or market rent drops. For example, a property with a 75% BER can tolerate up to a 25% vacancy rate before failing to cover operating costs and mortgage commitments.`,
      whyItMatters: 'Commercial underwriters and portfolio risk officers examine BER to identify over-leveraged assets. A deal with an 88% BER is exceptionally vulnerable to minor tenant departures or regional economic downturns.',
      formula: 'BER (%) = [ ( Operating Expenses + Annual Debt Service ) / Gross Potential Income (GPI) ] × 100',
      variables: [
        { name: 'Operating Expenses', desc: 'Annual property taxes, insurance, management, and essential maintenance.' },
        { name: 'Annual Debt Service', desc: 'Total mandatory 12-month principal and interest mortgage obligations.' },
        { name: 'Gross Potential Income (GPI)', desc: 'Maximum contractual gross revenue if the property operated at 100% occupancy.' },
      ],
      example: {
        title: 'Worked Commercial Example',
        scenario: 'A mixed-use commercial property has a Gross Potential Income (GPI) of $400,000. Annual operating expenses are $130,000, and annual debt service is $170,000.',
        calculation: 'BER = [ ($130,000 + $170,000) / $400,000 ] × 100 = [ $300,000 / $400,000 ] × 100 = 75.0%.',
        interpretation: 'The property breaks even at 75% of full potential collections. Occupancy can drop to 75% (a 25% vacancy allowance) before the property requires out-of-pocket cash injections.',
      },
      benchmarks: [
        '≤ 80%: Strong institutional safety profile favored by conservative commercial lenders.',
        '80% - 85%: Standard acceptable commercial underwriting threshold.',
        '> 85%: High-risk profile with minimal tolerance for lease rollovers or economic shocks.',
      ],
      calculatorCta: {
        title: 'Test Deal Vulnerability with Our Break-Even Calculator',
        desc: 'Calculate both Break-Even Ratio (BER) and Break-Even Occupancy (BEO) to identify true downside thresholds.',
        url: 'calculators/break-even-ratio',
        anchorText: 'Launch Break-Even Calculator',
      },
      faqs: [
        { question: 'What is considered a safe Break-Even Ratio in commercial real estate?', answer: 'Conservative lenders and institutional investors generally target a Break-Even Ratio below 80% to 85%, ensuring at least a 15% to 20% vacancy cushion.' },
        { question: 'How does Break-Even Ratio differ from Break-Even Occupancy?', answer: 'BER divides mandatory costs by Gross Potential Income (GPI). Break-Even Occupancy (BEO) divides the exact same costs by Effective Gross Income (EGI) or adjusts for variable concessions.' },
        { question: 'How can an owner lower an uncomfortably high BER?', answer: 'An owner can lower BER by negotiating lower mortgage debt service (longer amortization or lower loan-to-value), disputing property tax assessments, or boosting ancillary revenues.' },
      ],
    },
    'beo': {
      slug: 'beo',
      term: 'BEO',
      fullName: 'Break-Even Occupancy',
      metaTitle: 'What is Break-Even Occupancy (BEO) in Real Estate?',
      metaDescription: 'Learn what Break-Even Occupancy (BEO) is in commercial property underwriting. How to calculate the minimum physical and economic occupancy needed to cover all costs.',
      h1: 'Break-Even Occupancy (BEO): Definition, Calculation & Analysis',
      shortDefinition: 'Break-Even Occupancy (BEO) is the minimum occupancy rate a commercial real estate property must maintain in order to generate sufficient revenue to pay all operating expenses and debt service.',
      fullDefinition: `Break-Even Occupancy (BEO) translates financial expense obligations into a practical leasing metric: how full must the building be so it does not lose money? It reveals the occupancy tipping point between cash flow solvency and out-of-pocket financial distress.\n\nWhile traditional financial models focus on profitability at full stabilization, BEO specifically models defensive resilience. If a commercial building has a Break-Even Occupancy of 78%, the asset manager knows that leasing must never dip below 78% of total rentable square feet or unit counts.`,
      whyItMatters: 'During acquisitions, analyzing BEO helps investors understand whether a value-add renovation or repositioning strategy carries dangerous debt-default risk during transitional lease rollovers.',
      formula: 'BEO (%) = [ ( Operating Expenses + Annual Debt Service ) / Gross Potential Rent ] × 100',
      variables: [
        { name: 'Operating Expenses', desc: 'All non-reimbursable building maintenance, property taxes, management, and insurance costs.' },
        { name: 'Annual Debt Service', desc: 'Total mandatory annual principal and interest loan commitments.' },
        { name: 'Gross Potential Rent', desc: 'Maximum total rental revenue achievable if all units or square footage were 100% occupied.' },
      ],
      example: {
        title: 'Worked Commercial Example',
        scenario: 'A 50-unit apartment building charges an average rent of $1,200/month, resulting in $720,000 in Gross Potential Rent. Total operating expenses are $290,000 and annual debt service is $286,000.',
        calculation: 'BEO = [ ($290,000 + $286,000) / $720,000 ] × 100 = [ $576,000 / $720,000 ] × 100 = 80.0%.',
        interpretation: 'The property needs exactly 80% occupancy (40 out of 50 units leased at market rate) to break even. Any occupancy above 80% generates positive cash flow for investors.',
      },
      benchmarks: [
        'Multifamily assets typically aim for BEO below 75% to 80%.',
        'Hospitality (hotels) typically experience volatile BEOs between 55% to 65% RevPAR.',
        'Office assets with long-term credit leases often maintain BEOs near 70% to 75%.',
      ],
      calculatorCta: {
        title: 'Calculate Break-Even Thresholds for Your Property',
        desc: 'Model your property’s exact financial cushion against tenant turnover and debt payments.',
        url: 'calculators/break-even-ratio',
        anchorText: 'Open Break-Even Ratio & Occupancy Tool',
      },
      faqs: [
        { question: 'Why do lenders care about Break-Even Occupancy?', answer: 'Lenders check BEO to ensure that historical market vacancy in the submarket is well below the property’s break-even point, minimizing the probability of loan default.' },
        { question: 'Can a property have a positive NOI but fail its Break-Even Occupancy?', answer: 'Yes. If a property has $100,000 in NOI but debt service is $120,000, the property has positive operational income but insufficient collections to meet total obligations.' },
        { question: 'How does debt leverage affect Break-Even Occupancy?', answer: 'Higher debt leverage directly inflates annual debt service, which raises the Break-Even Occupancy required to keep the property solvent.' },
      ],
    },
    'irr': {
      slug: 'irr',
      term: 'IRR',
      fullName: 'Internal Rate of Return',
      metaTitle: 'What is IRR in Commercial Real Estate? Complete Guide',
      metaDescription: 'Understand Internal Rate of Return (IRR) in commercial real estate. How multi-year cash flows and residual sale proceeds combine to determine true annualized returns.',
      h1: 'Internal Rate of Return (IRR): Definition, Underwriting & Formula',
      shortDefinition: 'Internal Rate of Return (IRR) is the annualized rate of return earned on each dollar invested in a commercial real estate property over an entire multi-year holding period, accounting for the time value of money.',
      fullDefinition: `Internal Rate of Return (IRR) is the gold-standard metric used by private equity syndicators, real estate funds, and institutional investors to evaluate investment performance across an entire holding cycle (typically 3 to 10 years).\n\nUnlike static single-year metrics like Cap Rate or Cash-on-Cash Return, IRR accounts for the timing and magnitude of all cash inflows and outflows—including initial acquisition equity, ongoing annual operating distributions, capital calls, and the final net profit from property refinancing or ultimate disposition.`,
      whyItMatters: 'IRR incorporates the time value of money: a dollar returned in Year 1 contributes far more to IRR than a dollar returned in Year 7. Private equity waterfall fee structures and sponsor promote hurdles are universally pegged to IRR tiers.',
      formula: '0 = NPV = Σ [ CFt / (1 + IRR)^t ] (Discount rate where Net Present Value of all cash flows equals zero)',
      variables: [
        { name: 'CF0', desc: 'Initial equity investment outflow (negative value at Year 0).' },
        { name: 'CFt', desc: 'Net annual operational cash flow distributed to equity partners in Year t.' },
        { name: 'CFn', desc: 'Final year operational cash flow plus net terminal sale proceeds after paying off mortgage debt.' },
      ],
      example: {
        title: 'Worked Commercial Example',
        scenario: 'An investor commits $500,000 in equity to acquire a commercial asset. Over a 5-year hold, the property distributes $35,000 in Year 1, $40,000 in Year 2, $45,000 in Year 3, $50,000 in Year 4, and $55,000 in Year 5. In Year 5, the property is sold for net proceeds of $750,000 (total Year 5 cash flow = $805,000).',
        calculation: 'Discounting CF0 (-$500k) against CF1-CF5 yields an annualized IRR of 17.4%.',
        interpretation: 'The investor earned a compounded annualized yield of 17.4% on their capital throughout the 5-year holding period.',
      },
      benchmarks: [
        'Core Institutional Assets: 7.0% - 9.5% target IRR.',
        'Value-Add Renovation Strategies: 12.0% - 16.0% target IRR.',
        'Opportunistic & Ground-Up Development: 17.0% - 22.0%+ target IRR.',
      ],
      calculatorCta: {
        title: 'Model Full Multi-Year Underwriting in Deal Analyzer',
        desc: 'Combine Cap Rate, DSCR, Cash-on-Cash, and full deal stress testing in our comprehensive underwriting suite.',
        url: 'tools/deal-analyzer',
        anchorText: 'Launch Deal Analyzer Suite',
      },
      faqs: [
        { question: 'What is the main limitation of IRR in real estate?', answer: 'IRR mathematically assumes that interim cash flow distributions are immediately reinvested at the same high internal rate of return, which may be unrealistic in ordinary financial markets.' },
        { question: 'Why do investors compare IRR with Equity Multiple?', answer: 'IRR measures speed and efficiency of return, while Equity Multiple measures the total absolute dollar wealth generated. Investors evaluate both together to prevent distortion from short-term holds.' },
        { question: 'How does disposition cap rate affect terminal IRR?', answer: 'Exit (terminal) cap rate assumptions have a tremendous impact on IRR. An expansion of just 50 basis points on exit cap rate can reduce a 5-year project IRR by 200 to 400 basis points.' },
      ],
    },
    'grm': {
      slug: 'grm',
      term: 'GRM',
      fullName: 'Gross Rent Multiplier',
      metaTitle: 'What is Gross Rent Multiplier (GRM) in Real Estate?',
      metaDescription: 'Learn how Gross Rent Multiplier (GRM) is used for rapid property screening. Formula, calculation example, and when to use GRM vs. Cap Rate.',
      h1: 'Gross Rent Multiplier (GRM): Definition, Formula & Quick Screening',
      shortDefinition: 'Gross Rent Multiplier (GRM) is a rapid screening ratio that compares property purchase price to its annual gross potential rental income, calculated as Price divided by Gross Annual Rent.',
      fullDefinition: `Gross Rent Multiplier (GRM) is one of the simplest and fastest screening metrics in real estate valuation. It tells an investor how many years it would take for a property to pay for itself in gross rent collections, assuming zero expenses, zero vacancies, and zero mortgage costs.\n\nWhile GRM is too basic for deep underwriting because it ignores property taxes, utilities, and insurance variations, it is widely utilized by brokers and multifamily investors as an initial preliminary screen to quickly filter out overpriced listings before committing time to detailed financial due diligence.`,
      whyItMatters: 'GRM allows investors to rapidly scan 50 commercial listings in a submarket in minutes. If typical apartments in a neighborhood trade at a 9.5x GRM, a listing asking a 15.0x GRM can be instantly identified as overpriced relative to in-place rent.',
      formula: 'GRM = Purchase Price / Annual Gross Potential Rent',
      variables: [
        { name: 'Purchase Price', desc: 'Asking price or contract acquisition price of the property.' },
        { name: 'Annual Gross Potential Rent', desc: 'Total contractual scheduled annual rental income before deducting expenses or vacancies.' },
      ],
      example: {
        title: 'Worked Commercial Example',
        scenario: 'An 8-unit apartment building is offered for sale at $1,200,000. The units produce a total combined monthly gross rent of $10,000 ($120,000 per year).',
        calculation: 'GRM = $1,200,000 / $120,000 = 10.0x.',
        interpretation: 'The property is priced at 10 times its gross annual rent collections.',
      },
      benchmarks: [
        '6.0x - 8.5x: Common in secondary cash-flow markets and tertiary areas.',
        '9.0x - 12.5x: Typical for stabilized residential multifamily in balanced metro markets.',
        '14.0x+: Found in high-appreciation gateway metros (e.g. coastal California, NYC).',
      ],
      calculatorCta: {
        title: 'Move Beyond GRM to Real Net Yields',
        desc: 'Calculate true net operating income and capitalization rates accounting for all operating expenses.',
        url: 'calculators/cap-rate',
        anchorText: 'Analyze Net Yield in Cap Rate Calculator',
      },
      faqs: [
        { question: 'What is the main drawback of Gross Rent Multiplier (GRM)?', answer: 'GRM completely ignores operating expenses. Two properties with identical 8x GRMs could have wildly different real returns if one property pays triple the property taxes and utilities of the other.' },
        { question: 'What is a good Gross Rent Multiplier?', answer: 'Lower GRM generally indicates better value relative to gross income. Investors often seek GRMs between 6.5x and 9.5x depending on local property tax rates and market quality.' },
        { question: 'When should I use GRM instead of Cap Rate?', answer: 'Use GRM only for initial 60-second property triage. Once a deal passes initial screening, always perform full underwriting with Cap Rate, NOI, and DSCR.' },
      ],
    },
  },
  zh: {
    'noi': {
      slug: 'noi',
      term: 'NOI',
      fullName: 'Net Operating Income (净营业收入)',
      metaTitle: '什么是商业地产 NOI (净营业收入)？定义、公式与测算指南',
      metaDescription: '全面解析美国商业地产核心指标 NOI (净营业收入)。提供精确计算公式、实战测算案例，并一键跳转免费 NOI 实时计算器。',
      h1: 'NOI (净营业收入)：定义、计算公式与商业地产尽调指南',
      shortDefinition: '净营业收入（NOI）是衡量商业地产资产自身经营盈利能力的最核心指标，等于有效运营总收入减去全部日常运营支出，未扣除贷款本息与所得税。',
      fullDefinition: `净营业收入（Net Operating Income，简称 NOI）反映了商业物业在扣除日常营运支出后的真实赚钱能力。它包括物业产生的所有收入（有效租金、水电公摊回收、储物柜租金、固定停车位、洗衣机收益等），并扣除维持物业运转所必需的常规运营开支（房产税、商业保险、第三方物业管理费、日常维修、公用事业水电费、草坪养护等）。\n\n核心在于：NOI 的计算完全不包含贷款本息还款（Debt Service）、资本性支出（CapEx）以及折旧和所得税。这使得 NOI 成为一个纯粹的“无杠杆资产级指标”，让不同投资者无论采用全款现金还是高杠杆贷款，都能在同一水平线上横向对比资产的运营质量。`,
      whyItMatters: 'NOI 是计算资本化率的分子（Cap Rate = NOI / 购买价格），也是商业银行审批贷款额度的核心依据（DSCR = NOI / 年度还贷）。商业估值与银行风控完全基于经审计的历史真实 T12（Trailing 12-Month）NOI。',
      formula: 'NOI = 有效毛收入 (EGI) - 总运营支出 (OpEx)',
      variables: [
        { name: '有效毛收入 (EGI)', desc: '潜在毛租金收入扣除空置与坏账损失后，加上杂项增值收入。' },
        { name: '运营支出 (OpEx)', desc: '地税、保险、管理费、维保等日常必须开支，不含贷款本息。' },
      ],
      example: {
        title: '商业地产实操测算案例',
        scenario: '一栋 20 单元公寓，年潜在租金总额为 $300,000，按 5% 计入空置损失 (-$15,000)，车位杂费增收 $10,000，得出有效毛收入 $295,000。地税 $42,000、保险 $14,000、物业管理 $20,000、维护水电 $39,000，运营总开支为 $115,000。',
        calculation: 'NOI = $295,000 (EGI) - $115,000 (OpEx) = $180,000 / 年。',
        interpretation: '该物业在未支付任何贷款月供或向投资人分红前，每年产生的经营性净现金流入为 $180,000。',
      },
      benchmarks: [
        '多户住宅的花园公寓运营费用率 (OpEx / EGI) 通常在 40% 至 52% 之间。',
        '三净零售 (NNN) 商业因租户承担主要费用，房东端费用率通常低于 10%。',
        '高层办公楼因能耗与电梯维护费用高昂，费用率往往超过 55%。',
      ],
      calculatorCta: {
        title: '立即测算您标的物业的真实 NOI',
        desc: '输入潜在租金、空置率与各类开支细项，一键算出精确 NOI 与营运开支占比。',
        url: 'calculators/noi',
        anchorText: '进入免费 NOI 实时计算器',
      },
      faqs: [
        { question: 'NOI 包含每月的房贷月供吗？', answer: '不包含。贷款本金与利息属于债务支出（Debt Service），在 NOI 之后扣除，扣除后为税前现金流（Cash Flow Before Taxes）。' },
        { question: '资本性改造 (CapEx) 应该算进 NOI 吗？', answer: '不应该。更换整楼屋顶或重新铺设沥青路面属于资本性支出，计入资产负债表逐年折旧，不计入日常运营 NOI。' },
        { question: '为什么卖方的挂牌 NOI 常常不可信？', answer: '卖方经纪人挂牌时往往使用乐观的“预测数据（Pro-forma）”，少算地税重估、漏算物业管理费或按 0% 空置率测算。买家必须索取过去的 T-12 财报独立核算。' },
      ],
    },
    'cap-rate': {
      slug: 'cap-rate',
      term: 'Cap Rate',
      fullName: 'Capitalization Rate (资本化率)',
      metaTitle: '什么是商业地产 Cap Rate (资本化率)？公式与定价指南',
      metaDescription: '全面解析美国商业地产定价基石 Cap Rate。公式推导、全美都市圈基准区间、与贷款利率利差分析，并提供免费实时计算器。',
      h1: 'Cap Rate (资本化率)：定义、计算公式与全美基准指南',
      shortDefinition: '资本化率（Cap Rate）衡量商业地产在全款无贷款购买状态下的年化无杠杆净回报率，等于年净营业收入 (NOI) 除以物业总购买价格或公允估值。',
      fullDefinition: `资本化率（Capitalization Rate，简称 Cap Rate）是全球商业地产投资中最核心的估值与定价指标。它反映了投资人如果以 100% 全款现金购买该资产时，第一年所能获得的年化现金净回报率。\n\nCap Rate 与资产价格呈反比关系：Cap Rate 压缩（下降），代表资产升值昂贵；Cap Rate 扩张（上升），代表资产估值回调。同时，Cap Rate 也是风险定价的温度计：纽约、旧金山等核心城市因抗风险能力强，Cap Rate 较低；次级或偏远小镇的资产因流动性弱、招商难度大，要求更高的 Cap Rate 补偿风险。`,
      whyItMatters: 'Cap Rate 消除了不同买家融资结构（首付成数、贷款利率）的干扰，使得不同规模、不同城市的商业物业能够在同一基准下横向比价，也是做反向估值（估值 = NOI / 市场Cap Rate）的基础。',
      formula: 'Cap Rate (%) = [ 净营业收入 (NOI) / 物业购买价格或估值 ] × 100',
      variables: [
        { name: '年净营业收入 (NOI)', desc: '扣除全部营运开支后、扣除贷款月供前的年度净利润。' },
        { name: '购买价格 / 市场估值', desc: '物业的实际成交金额或持牌评估师给出的独立估值。' },
      ],
      example: {
        title: '商业地产实操测算案例',
        scenario: '一处现代化物流分拨中心年稳定净营业收入（NOI）为 $360,000，卖方要价为 $5,500,000。',
        calculation: 'Cap Rate = ($360,000 / $5,500,000) × 100 = 6.55%。',
        interpretation: '若全款全现金买入该物流仓库，买家第一年的全款净现金回报率为 6.55%。',
      },
      benchmarks: [
        '全美一线核心都市圈 (Tier-1): 4.75% - 5.50%（注重资产保值与抗跌性）。',
        '全美二线高增长都市圈 (Tier-2 如奥斯汀、迈阿密、达拉斯): 5.50% - 6.75%。',
        '三线及乡村次级市场 (Tier-3): 6.75% - 8.25%+（流动性折价补偿）。',
      ],
      calculatorCta: {
        title: '使用 Cap Rate 实时计算器核算标的',
        desc: '支持正算资本化率与反算最高可接受出价，并附带全美市场区间对标仪表盘。',
        url: 'calculators/cap-rate',
        anchorText: '进入 Cap Rate 实时计算器',
      },
      faqs: [
        { question: 'Cap Rate 和 Cash-on-Cash Return 现金回报率有什么区别？', answer: 'Cap Rate 是全款无杠杆指标，衡量总资产回报；Cash-on-Cash 是加了贷款后的杠杆指标，衡量实际掏出的首付现金带来的年化分红率。' },
        { question: '为什么商业地产的 Cap Rate 会低于房贷利率？', answer: '当出现“负杠杆（Negative Leverage）”时，Cap Rate 低于贷款利率。通常发生在核心地段稀缺资产，买家看好未来的大幅租金上涨或土地再开发价值。' },
        { question: '在做购买决策时，Cap Rate 越高越好吗？', answer: '不一定。高达 9% - 10% 的 Cap Rate 通常伴随着老旧建筑、高租客违约率或人口流出型城市；低 Cap Rate 虽收益薄但资产安全性高。' },
      ],
    },
    'dscr': {
      slug: 'dscr',
      term: 'DSCR',
      fullName: 'Debt Service Coverage Ratio (偿债覆盖率)',
      metaTitle: '什么是 DSCR (偿债覆盖率)？商业地产贷款门槛与公式',
      metaDescription: '解析商业银行贷款风控核心指标 DSCR (偿债覆盖率)。行业准入线标准、测算公式与安全缓冲，包含免费 DSCR 计算器。',
      h1: 'DSCR (偿债覆盖率)：定义、计算公式与商业银行准入标准',
      shortDefinition: '偿债覆盖率（DSCR）衡量商业物业产生的净营业收入（NOI）对年度贷款本息还贷总额的覆盖倍数，是商业银行决定是否放贷的首要风控指标。',
      fullDefinition: `偿债覆盖率（Debt Service Coverage Ratio，简称 DSCR）是商业银行、人寿保险资管机构和 CMBS 机构贷款中最核心的风险衡量指标。它用于审核标的物业的自身净收入是否能轻松偿还每年的房贷本息，并留出足够的安全缓冲。\n\n如果 DSCR 恰好等于 1.00x，意味着物业收上来的净利润刚好一分不剩地全交给银行还贷，没有任何抵御租客退租或突发维修的能力。因此，常规商业银行均要求 DSCR 至少达到 1.20x 到 1.35x 以上才允许批准放贷。`,
      whyItMatters: 'DSCR 直接决定了商业贷款的最大放款金额。即便买家愿意支付高达 40% 的首付，只要物业历史财报测算出的 DSCR 达不到银行底线，贷款额度就会被强制缩减。',
      formula: 'DSCR = 净营业收入 (NOI) / 全年还贷总额 (Annual Debt Service)',
      variables: [
        { name: '年净营业收入 (NOI)', desc: '物业扣除日常营运支出后的真实净营业收益。' },
        { name: '全年还贷总额 (Debt Service)', desc: '借款人每年必须向银行支付的贷款本金加利息总和。' },
      ],
      example: {
        title: '商业地产实操测算案例',
        scenario: '一处街角零售商业年 NOI 为 $250,000。按申请的商业贷款计算，每月本息还款额为 $15,000（全年还贷总额 $180,000）。',
        calculation: 'DSCR = $250,000 (NOI) / $180,000 (还贷) = 1.39x。',
        interpretation: '每需还款 $1.00，物业可产生 $1.39 的净收入，留有高达 39% 的安全边际（每年 $70,000 现金缓冲），能轻松通过商业银行的信贷审核。',
      },
      benchmarks: [
        '≥ 1.25x: 传统商业银行贷款的标准准入底线。',
        '1.15x - 1.20x: 仅适用于高信用评级 NNN 租客或两房机构优质多户公寓。',
        '< 1.00x: 收入不足以支付月供（严重现金流倒挂），常规银行坚决拒贷。',
      ],
      calculatorCta: {
        title: '立即测算您交易的 DSCR 覆盖安全线',
        desc: '支持年还款与月还款双模式，一键输出银行审核等级与最高允许贷款额。',
        url: 'calculators/dscr',
        anchorText: '进入 DSCR 偿债覆盖率计算器',
      },
      faqs: [
        { question: '商业银行通常要求的最低 DSCR 是多少？', answer: '全美绝大多数商业银行要求过去 12 个月（T12）历史数据的 DSCR 不低于 1.20x - 1.25x。' },
        { question: 'DSCR 如果跌破 1.0x 会发生什么？', answer: '若 DSCR 跌破 1.0x，物业陷入经营亏损，房东必须用个人资金贴钱补齐月供；在商业贷款合同中可能触发违约条款或银行资金监管（Lockbox）。' },
        { question: '计算 DSCR 时是用毛租金还是净收入？', answer: '必须使用扣除全部运营支出后的净营业收入（NOI）。银行不会使用毛租金，因为地税和物业维护不付会导致抵押品受损或被政府查封。' },
      ],
    },
    'ber': {
      slug: 'ber',
      term: 'BER',
      fullName: 'Break-Even Ratio (收支平衡比率)',
      metaTitle: '什么是商业地产 BER (收支平衡比率)？公式与风控解析',
      metaDescription: '深入解析商业地产压力测试指标 BER (Break-Even Ratio)。了解银行如何评估空置抗跌能力，含公式推导与免费计算工具。',
      h1: 'Break-Even Ratio (BER)：定义、测算公式与商业贷款压力测试',
      shortDefinition: '收支平衡比率（BER）衡量商业地产的必须支出（运营成本加贷款还贷）占总潜在收入（GPI）的百分比，揭示物业抗空置风险的财务脆弱度。',
      fullDefinition: `收支平衡比率（Break-Even Ratio，简称 BER）是商业地产信贷承销与压力测试中极其敏锐的指标。它反映了一处物业的总潜在收入中有多少比例已经被刚性、不可避免的现金流出（必须支付的营运开支加上必须偿还的房贷月供）牢牢锁定。\n\n100% 减去 BER 所得出的差值，就是物业所拥有的“最大抗空置容忍度”。例如，一处 BER 为 75% 的物业，即使市场突发低迷导致 25% 的房间空置，所收取的租金仍然足以打平全部开销与房贷，不会发生财务违约。`,
      whyItMatters: '商业银行信贷经理在做资产审查时重点关注 BER，以此排查杠杆过高、经不起任何租客流失的脆弱资产。BER 超过 85% 的交易通常被视为高风险标的。',
      formula: 'BER (%) = [ ( 运营支出 + 全年还贷总额 ) / 总潜在收入 (GPI) ] × 100',
      variables: [
        { name: '运营支出 (OpEx)', desc: '地税、保险、管理维保等维持日常运作的必要开支。' },
        { name: '全年还贷总额', desc: '向商业银行支付的全年本金与利息总和。' },
        { name: '总潜在收入 (GPI)', desc: '物业在 100% 满租且无欠租状态下的理论总租金收入。' },
      ],
      example: {
        title: '商业地产实操测算案例',
        scenario: '一处商住综合体年总潜在收入（GPI）为 $400,000。年运营支出为 $130,000，商业贷款年还贷总额为 $170,000。',
        calculation: 'BER = [ ($130,000 + $170,000) / $400,000 ] × 100 = [ $300,000 / $400,000 ] × 100 = 75.0%。',
        interpretation: '该物业在租金收缴率达到 75% 时即可实现盈亏平衡。物业可承受高达 25% 的空置损失而不会发生账面资金断裂。',
      },
      benchmarks: [
        '≤ 80%: 稳健安全的优质区间，深受保守商业放贷机构青睐。',
        '80% - 85%: 商业银行普遍接受的标准临界区间。',
        '> 85%: 杠杆过重或运营开销过大，稍有租客退租即面临现金流断裂风险。',
      ],
      calculatorCta: {
        title: '进行压力测试：测算您交易的 BER 与 BEO',
        desc: '一键计算收支平衡比率与盈亏平衡出租率，看清物业能承受多大的市场跌幅。',
        url: 'calculators/break-even-ratio',
        anchorText: '进入 Break-Even 计算器',
      },
      faqs: [
        { question: '为什么很多投资人容易混淆 BER 和 BEO？', answer: 'BER 的分母使用的是总潜在收入（GPI），衡量的是总盘子的刚性锁定比例；BEO 分母使用的是实际有效收入（EGI），衡量的是物理出租率底线。' },
        { question: '商业地产健康安全的 BER 应该是多少？', answer: '大部分保守的商业贷款机构和资深投资人希望看到 BER 在 80% 至 85% 以下，留出至少 15% - 20% 的抗空置安全缓冲区。' },
        { question: '房东可以通过哪些方式改善过高的 BER？', answer: '可以通过延长贷款摊销年限降低月供、申请地税申诉降低 OpEx，或者增加辅助收入来做大收入分母。' },
      ],
    },
    'beo': {
      slug: 'beo',
      term: 'BEO',
      fullName: 'Break-Even Occupancy (盈亏平衡入住率)',
      metaTitle: '什么是 BEO (盈亏平衡入住率)？商业地产出租底线测算',
      metaDescription: '掌握商业地产出租率底线 BEO。如何算出至少租出多少单元或面积才能覆盖日常开销与银行月供，避免资金垫资。',
      h1: 'Break-Even Occupancy (BEO)：定义、计算方法与实战分析',
      shortDefinition: '盈亏平衡入住率（BEO）是指一处商业物业为维持现金流打平、覆盖全部运营成本和还贷支出，所必须达到的最低物理或经济出租率水平。',
      fullDefinition: `盈亏平衡入住率（Break-Even Occupancy，简称 BEO）将抽象的财务数据具象化为实际的招商指标：这栋楼到底要租掉多少间、出租率达到几成，才能保本不亏钱？\n\n大多数商业尽调过度聚焦于满租时的繁荣回报，而 BEO 则从防守视角出发，测量在资产翻新改建或市场租约集中到期时，物业能容忍的租客流失底线。如果一栋公寓的 BEO 为 78%，资产经理就清楚知道出租率绝对不能掉到 78% 以下，否则就必须自掏腰包补齐差额。`,
      whyItMatters: '在增值型（Value-Add）物业收购中，BEO 帮助投资人清晰界定在施工腾房期是否存在因租约暂时断档而发生债务违约的风险。',
      formula: 'BEO (%) = [ ( 运营支出 + 全年还贷总额 ) / 潜在毛租金收入 ] × 100',
      variables: [
        { name: '运营支出 (OpEx)', desc: '除贷款外的全部必要营运成本。' },
        { name: '全年还贷总额', desc: '向商业银行支付的全年本息还款。' },
        { name: '潜在毛租金收入', desc: '全部单元按当前市价租满时的年租金总额。' },
      ],
      example: {
        title: '商业地产实操测算案例',
        scenario: '一栋 50 单元的公寓楼，平均月租金 $1,200/套，满租年租金为 $720,000。年运营支出为 $290,000，年还款总额为 $286,000。',
        calculation: 'BEO = [ ($290,000 + $286,000) / $720,000 ] × 100 = [ $576,000 / $720,000 ] × 100 = 80.0%。',
        interpretation: '该公寓需要至少租出 40 套（50套 × 80%）才能收支打平。超出 40 套以外租客所缴纳的租金，才是投资者的纯正向净利润。',
      },
      benchmarks: [
        '公寓物业通常将 BEO 控制在 75% 至 80% 以下。',
        '酒店业因日租波动性强，BEO 对应 RevPAR 往往在 55% 至 65% 之间。',
        '带长期优质租约的写字楼或工业厂房，BEO 通常在 70% 至 75% 附近。',
      ],
      calculatorCta: {
        title: '测算您物业的盈亏平衡出租率',
        desc: '使用我们专门的 Break-Even 计算器，输入支出与债务，实时掌握最低招商安全线。',
        url: 'calculators/break-even-ratio',
        anchorText: '打开 Break-Even 测算工具',
      },
      faqs: [
        { question: '商业银行在审贷时为什么会看 BEO？', answer: '银行需要核对当地该类型物业的历史平均空置率。若当地平均空置率为 10%（即入住率 90%），而标的物业 BEO 仅需 78%，则放贷安全性极高。' },
        { question: 'NOI 为正数的物业，BEO 是否也一定安全？', answer: '不一定。如果贷款额度过高（杠杆拉满导致月供巨大），即使经营有盈利，也有可能因为还贷负担沉重而导致 BEO 飙升至 90% 以上。' },
        { question: '降低 BEO 最有效的方式是什么？', answer: '在承销谈判中压低买价进而减少贷款额度、向银行申请 30 年长摊销或只还利息期（IO），能显著降低 BEO。' },
      ],
    },
    'irr': {
      slug: 'irr',
      term: 'IRR',
      fullName: 'Internal Rate of Return (内部收益率)',
      metaTitle: '什么是商业地产 IRR (内部收益率)？多周期收益计算指南',
      metaDescription: '透彻理解商业地产基金与私募首选指标 IRR。考虑资金时间价值与最终出售退出收益，评估全生命周期真实年化回报率。',
      h1: 'Internal Rate of Return (IRR)：定义、计算原理与生命周期分析',
      shortDefinition: '内部收益率（IRR）衡量在商业地产多年度持有全周期内，每一块钱投资资本所产生的复合年化收益率，深度结合了资金的时间价值。',
      fullDefinition: `内部收益率（Internal Rate of Return，简称 IRR）是商业地产私募股权基金（PE）、机构资管与辛迪加合伙人评估全周期投资回报的黄金指标（通常针对 3 至 10 年的投资期）。\n\n与 Cap Rate 或 Cash-on-Cash 仅反映第一年单一年份的静态切片指标不同，IRR 统筹计算了整个投资持有期间所有的资金流入与流出——包括最初投入的首付资本、每年的营运分红、中间的装修改造追缴资本，以及在第 N 年物业加杠杆再融资或最终出售交割时的巨大资本利得。`,
      whyItMatters: 'IRR 遵循“时间价值原理”：第 1 年拿到的分红在 IRR 权重中远高于第 7 年才收到的相同金额分红。美国商业地产私募的超额业绩提成（Promote / Waterfall）均严格锚定 IRR 门槛值。',
      formula: '0 = 净现值 (NPV) = Σ [ 现金流 CFt / (1 + IRR)^t ] （使全周期净现金流折现后等于零的折现率）',
      variables: [
        { name: 'CF0', desc: '投资初期的实际股本本金净流出（负数值）。' },
        { name: 'CFt', desc: '持有期内各年度实际分配给股权投资人的净经营性现金流。' },
        { name: 'CFn', desc: '最终退出年份的经营分红加上还清剩余贷款后的净售楼款总和。' },
      ],
      example: {
        title: '商业地产实操测算案例',
        scenario: '投资人出资 $500,000 投资一处增值商业资产。5 年持有期内，每年分红分别为 $35,000、$40,000、$45,000、$50,000、$55,000。第 5 年底将物业成功出售，扣除贷款本金后返还本息净售楼款 $750,000（第5年总回款 $805,000）。',
        calculation: '将初始 -$500,000 与后续 5 年现金流进行折现对冲，得出年化 IRR 为 17.4%。',
        interpretation: '投资人在该项目的 5 年持有期内，每一块钱资金都实现了 17.4% 的复合年化复利增长。',
      },
      benchmarks: [
        '核心型机构级资产 (Core): 目标 IRR 约在 7.0% 至 9.5% 之间。',
        '增值型装修改造项目 (Value-Add): 目标 IRR 普遍在 12.0% 至 16.0% 之间。',
        '机会型与新建开发项目 (Opportunistic / Ground-Up): 目标 IRR 通常在 17.0% 至 22.0%+。',
      ],
      calculatorCta: {
        title: '体验完整全流程商业地产测算',
        desc: '在 Deal Analyzer 综合工具中集成 Cap Rate、NOI、DSCR、现金回报率与压力测试。',
        url: 'tools/deal-analyzer',
        anchorText: '进入 Deal Analyzer 综合尽调套件',
      },
      faqs: [
        { question: 'IRR 在商业地产测算中有哪些局限性？', answer: 'IRR 在数学公式上假设中间各年份分得的现金流能立刻以同样高昂的 IRR 利率进行再投资，这在现实再投资市场中往往难以持续兑现。' },
        { question: '为什么投资人看 IRR 的同时还要看股权倍数（Equity Multiple）？', answer: 'IRR 衡量赚钱的速度，而股权倍数衡量最终赚到的绝对美元体量。如果一个项目 3 个月就转手可能测出高达 40% 的 IRR，但实际赚取的利润总额很薄。' },
        { question: '退出 Cap Rate (Exit Cap Rate) 对最终 IRR 影响有多大？', answer: '影响极大。如果在模型中仅仅保守地将退出 Cap Rate 调高 50 个基点（例如从 6.0% 调为 6.5%），往往会导致 5 年周期的 IRR 直接蒸发 2 到 4 个百分点。' },
      ],
    },
    'grm': {
      slug: 'grm',
      term: 'GRM',
      fullName: 'Gross Rent Multiplier (总租金乘数)',
      metaTitle: '什么是 GRM (总租金乘数)？商业地产 60秒粗筛公式',
      metaDescription: '了解商业地产粗筛工具 GRM (总租金乘数)。如何用购买价格除以年总租金快速判断挂牌价是否虚高，并理解其与 Cap Rate 的本质区别。',
      h1: 'Gross Rent Multiplier (GRM)：定义、速算公式与粗筛指南',
      shortDefinition: '总租金乘数（GRM）是商业地产投资中用于 60 秒快速筛选物业的初级比率，等于购买价格除以物业的全年潜在毛租金总额。',
      fullDefinition: `总租金乘数（Gross Rent Multiplier，简称 GRM）是商业地产与多户公寓投资中最简单直观的粗筛估值倍数。它告诉买家：在完全不考虑日常运营开支、不考虑空置损失、也不考虑贷款的情况下，单凭物业账面的毛租金总额，需要多少年才能收回房子的总购买成本。\n\n虽然 GRM 因为完全忽略了地税、老旧建筑维修成本与水电费差异而不能作为深度承销的最终依据，但它被全美经纪人与活跃投资者广泛用于在海量房源中进行初筛，几秒钟内就能识别出那些明显严重溢价的虚高挂牌。`,
      whyItMatters: 'GRM 让投资人在几分钟内浏览几十套挂牌房源。如果当地同一个社区的类似多户公寓普遍以 9.0x 的 GRM 成交，而某处挂牌按要价折算出的 GRM 高达 15.0x，买家就能立刻判定其售价过高。',
      formula: 'GRM = 物业购买价格 / 全年潜在毛租金收入 (Gross Annual Rent)',
      variables: [
        { name: '物业购买价格', desc: '挂牌售价或合同成交总价。' },
        { name: '全年潜在毛租金', desc: '所有单元在满租状态下的年化合同租金总和，未扣除任何开支。' },
      ],
      example: {
        title: '商业地产实操测算案例',
        scenario: '一处 8 单元小型公寓楼挂牌要价为 $1,200,000。全部单元每月共收取租金 $10,000（全年毛租金 $120,000）。',
        calculation: 'GRM = $1,200,000 / $120,000 = 10.0x。',
        interpretation: '该物业当前的标价为年毛租金总额的 10 倍。',
      },
      benchmarks: [
        '6.0x - 8.5x: 常见于二三线现金流型城市或次级蓝领社区。',
        '9.0x - 12.5x: 全美主流平稳增长型都市圈的标准多户住宅水平。',
        '14.0x+: 常见于加州沿海或纽约等极高升值预期的一线核心地段。',
      ],
      calculatorCta: {
        title: '从粗筛进阶到真实净收益测算',
        desc: '扣除真实地税、保险与维护开支，使用 Cap Rate 计算器测算真实的净利润回报率。',
        url: 'calculators/cap-rate',
        anchorText: '进入 Cap Rate 净收益率计算器',
      },
      faqs: [
        { question: 'GRM 最大的缺陷是什么？', answer: 'GRM 完全不看运营开支（OpEx）。两栋同样是 8 倍 GRM 的公寓，如果其中一栋地税比另一栋高出三倍，两者的实际净收益会天差地别。' },
        { question: '商业地产中，GRM 是越高越好还是越低越好？', answer: '对买家来说，GRM 越低代表用更少的购买价换取了更多的毛租金收入，通常意味着更便宜；对卖家来说则希望以更高的 GRM 倍数卖出。' },
        { question: '什么时候应该用 GRM，什么时候用 Cap Rate？', answer: '在初次看房、快速浏览房源列表时使用 GRM 做 1 分钟粗筛；一旦进入深入尽调与意向出价环节，必须严格使用 NOI 与 Cap Rate。' },
      ],
    },
  },
};
