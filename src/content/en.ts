import { LocaleContent } from './types';

export const enContent: LocaleContent = {
  nav: {
    brandName: 'CRE Calculators',
    calculators: 'Calculators',
    guides: 'Guides & Benchmarks',
    about: 'About',
    switchLangLabel: '中文',
    switchLangTarget: 'zh',
    switchLangCode: 'zh',
  },
  home: {
    metaTitle: 'Commercial Real Estate Investment Calculators | CRE Tools',
    metaDescription: 'Free, professional commercial real estate investment calculators for cap rate, NOI, cash-on-cash return, DSCR, and deal analysis. Made for investors and brokers.',
    heroH1: 'Commercial Real Estate Investment Decision Tools',
    heroSubtitle: 'Instant, precise financial calculators backed by clear formulas, real-world examples, and industry benchmarks.',
    featuredTitle: 'Essential CRE Calculators',
    featuredDesc: 'Evaluate property yield, cash flow, and debt coverage with our instant client-side tools.',
    calculators: [
      {
        slug: 'cap-rate',
        title: 'Cap Rate Calculator',
        description: 'Find the capitalization rate for any property or work backward to calculate your max purchase price.',
        badge: 'High Priority',
      },
      {
        slug: 'noi',
        title: 'NOI (Net Operating Income) Calculator',
        description: 'Calculate net operating income after vacancy and operating expenses—the foundation of all CRE metrics.',
        badge: 'Essential',
      },
      {
        slug: 'cash-on-cash',
        title: 'Cash-on-Cash Return Calculator',
        description: 'Measure your real annual return on cash invested after loan payments and upfront closing costs.',
        badge: 'Leverage',
      },
      {
        slug: 'dscr',
        title: 'DSCR (Debt Service Coverage Ratio) Calculator',
        description: 'Determine whether a property generates enough NOI to cover mortgage payments against lender guidelines.',
        badge: 'Bank Underwriting',
      },
      {
        slug: 'loan-payment',
        title: 'Commercial Loan Payment Calculator',
        description: 'Calculate monthly principal & interest payments, total interest, balloon payoff balances, and amortization.',
        badge: 'Financing',
      },
    ],
    whyUsTitle: 'Built for Serious CRE Investors & Brokers',
    whyUsItems: [
      {
        title: 'Instant & Client-Side',
        desc: 'All calculations run in real time right in your browser. No registration or server delays.',
      },
      {
        title: 'Transparent Formulas & Examples',
        desc: 'Every tool includes step-by-step formula breakdowns and real scenarios so you understand the numbers.',
      },
      {
        title: 'Dual US & Global Perspective',
        desc: 'Tailored for US commercial property standards, underwriting practices, and investor requirements.',
      },
    ],
  },
  capRate: {
    metaTitle: 'Cap Rate Calculator — Commercial Real Estate Cap Rate Tool',
    metaDescription: 'Calculate capitalization rate for any commercial property in seconds. Enter purchase price and NOI to find your cap rate, or work backward from a target cap rate to find max purchase price.',
    h1: 'Cap Rate Calculator',
    subtitle: 'Find the capitalization rate for any commercial property — or work backward to find your maximum purchase price.',
    whatIsTitle: 'What Is Cap Rate and Why It Matters',
    whatIsContent: "Cap rate (capitalization rate) is the most common shorthand investors use to compare commercial properties at a glance. It tells you the annual return a property would generate if you bought it in all cash, based purely on its net operating income relative to the purchase price. It's not a complete picture of your actual return — it ignores financing, taxes, and future appreciation — but it's the fastest way to compare two properties or sanity-check a listing price against the market.",
    formulaTitle: 'The Formula',
    formulaCode: 'Cap Rate = Net Operating Income (NOI) / Purchase Price × 100%',
    formulaVariables: [
      { label: 'NOI', desc: 'Annual income after operating expenses, before debt service and taxes' },
      { label: 'Purchase Price', desc: "The property's acquisition price (or current market value, if you're evaluating a property you already own)" },
    ],
    exampleTitle: 'A Real Example',
    exampleContent: 'Say you\'re looking at a small retail strip center listed at $2,400,000, with an NOI of $168,000/year.\n\nCap Rate = $168,000 / $2,400,000 = 7.0%\n\nIf you know your target cap rate is 7.5% and the NOI is fixed at $168,000, you can work backward: Max Purchase Price = $168,000 / 0.075 = $2,240,000 — meaning the listing is priced above what a 7.5% target would justify.',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        question: "What's a good cap rate for commercial real estate?",
        answer: 'It depends heavily on asset class and location. Multifamily in a strong metro might trade at 4-5%, while a single-tenant net-lease property in a secondary market might trade at 7-9%. Lower cap rates generally signal lower perceived risk (and lower yield); higher cap rates signal higher risk or yield.',
      },
      {
        question: "What's the difference between cap rate and cash-on-cash return?",
        answer: 'Cap rate assumes an all-cash purchase and ignores your financing. Cash-on-cash return accounts for your actual cash invested (after a loan), so it reflects your real leveraged return.',
      },
      {
        question: 'Does cap rate account for financing?',
        answer: "No. Cap rate is calculated independent of how the deal is financed, which is exactly why it's useful for comparing properties apples-to-apples — regardless of each buyer's loan terms.",
      },
      {
        question: 'Can I use cap rate to value a property I already own?',
        answer: "Yes — plug in your property's current NOI and an estimated market value (or ask a broker for comparable sales) to see roughly where your cap rate sits relative to the market.",
      },
    ],
    relatedTitle: 'Related Calculators',
    relatedCalculators: [
      { title: 'NOI Calculator', slug: 'noi' },
      { title: 'Cash-on-Cash Return Calculator', slug: 'cash-on-cash' },
      { title: 'DSCR Calculator', slug: 'dscr' },
    ],
  },
  noi: {
    metaTitle: 'NOI Calculator — Net Operating Income for Commercial Property',
    metaDescription: 'Calculate net operating income (NOI) for any commercial property. Enter gross income, vacancy loss, and operating expenses to get your annual and monthly NOI.',
    h1: 'NOI Calculator (Net Operating Income)',
    subtitle: "Find your property's net operating income — the number every other CRE metric is built on.",
    whatIsTitle: 'What Is NOI and Why It Matters',
    whatIsContent: 'NOI is the foundation metric in commercial real estate. Almost every other calculation — cap rate, DSCR, cash-on-cash return — starts with NOI. It represents how much income a property actually generates from operations, before you factor in your mortgage payment or income taxes. Lenders, appraisers, and buyers all look at NOI first because it isolates the property\'s performance from how any particular owner chose to finance it.',
    formulaTitle: 'The Formula',
    formulaCode: 'NOI = Effective Gross Income (EGI) − Operating Expenses\nEGI = Gross Income − Vacancy & Credit Loss',
    formulaVariables: [
      { label: 'Effective Gross Income (EGI)', desc: 'Gross potential rental income minus expected vacancy and unpaid rent' },
      { label: 'Operating Expenses', desc: 'Property taxes, insurance, repairs/maintenance, management fees, landlord utilities. Excludes debt service, capital improvements, and income taxes.' },
    ],
    exampleTitle: 'A Real Example',
    exampleContent: 'A 12-unit apartment building generates $312,000/year in gross rental income. You estimate 5% vacancy loss ($15,600), and operating expenses run $94,000/year (taxes, insurance, maintenance, management fee).\n\nEGI = $312,000 − $15,600 = $296,400\nNOI = $296,400 − $94,000 = $202,400/year (about $16,867/month)',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'Does NOI include mortgage payments?',
        answer: 'No. NOI is calculated before debt service. Your loan payment is subtracted later, when you calculate cash flow — not NOI.',
      },
      {
        question: 'What counts as an operating expense?',
        answer: 'Property taxes, insurance, repairs and maintenance, property management fees, utilities the landlord pays, and reserves for replacement. Capital improvements (like a new roof) and mortgage payments are excluded.',
      },
      {
        question: 'Why do lenders care so much about NOI?',
        answer: 'Lenders use NOI to calculate DSCR (debt service coverage ratio) — essentially, whether the property generates enough income to comfortably cover the loan payment. Low or shrinking NOI is a red flag in underwriting.',
      },
      {
        question: 'How is NOI different from cash flow?',
        answer: 'NOI is before debt service; cash flow is after. Cash flow = NOI − annual debt service (and sometimes − capital reserves).',
      },
    ],
    relatedTitle: 'Related Calculators',
    relatedCalculators: [
      { title: 'Cap Rate Calculator', slug: 'cap-rate' },
      { title: 'DSCR Calculator', slug: 'dscr' },
      { title: 'Cash-on-Cash Return Calculator', slug: 'cash-on-cash' },
    ],
  },
  cashOnCash: {
    metaTitle: 'Cash-on-Cash Return Calculator — Real Estate Investment Tool',
    metaDescription: 'Calculate your cash-on-cash return on a leveraged commercial real estate deal. Enter annual cash flow and total cash invested to find your real return on invested capital.',
    h1: 'Cash-on-Cash Return Calculator',
    subtitle: 'Find your real return on the actual cash you put into a deal — after financing.',
    whatIsTitle: 'What Is Cash-on-Cash Return and Why It Matters',
    whatIsContent: 'Cash-on-cash return measures the annual pre-tax cash flow you actually receive, relative to the actual cash you put into the deal — your down payment, closing costs, and any upfront capital improvements. Unlike cap rate, it accounts for leverage, which means it\'s the number that tells you how hard your invested dollars are working, not how the property performs in the abstract.',
    formulaTitle: 'The Formula',
    formulaCode: 'Cash-on-Cash Return = Annual Pre-Tax Cash Flow / Total Cash Invested × 100%',
    formulaVariables: [
      { label: 'Annual Cash Flow', desc: 'NOI minus annual debt service (loan payments)' },
      { label: 'Total Cash Invested', desc: 'Down payment + closing costs + any immediate capital expenditures — not the full purchase price' },
    ],
    exampleTitle: 'A Real Example',
    exampleContent: 'You buy a $1,200,000 property with a 25% down payment ($300,000) plus $30,000 in closing costs and immediate repairs — total cash invested is $330,000. Annual NOI is $84,000, and your annual loan payment (debt service) is $54,000.\n\nAnnual Cash Flow = $84,000 − $54,000 = $30,000\nCash-on-Cash Return = $30,000 / $330,000 = 9.1%\n\nCompare that to the property\'s cap rate ($84,000 / $1,200,000 = 7.0%) — the leverage here is boosting your cash return above the unleveraged cap rate, because the cost of debt is lower than the property\'s yield.',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'Why is cash-on-cash return usually different from cap rate?',
        answer: 'Cap rate assumes no financing. Cash-on-cash return reflects leverage. If your loan\'s interest rate is lower than the property\'s cap rate, leverage typically boosts your cash-on-cash return above the cap rate (positive leverage). If the interest rate is higher, it works against you (negative leverage).',
      },
      {
        question: 'What counts as "cash invested"?',
        answer: 'Down payment, closing costs, loan origination fees, and any immediate repairs or upgrades needed before the property is rent-ready. It does not include the financed portion of the purchase price.',
      },
      {
        question: 'Is a higher cash-on-cash return always better?',
        answer: 'Not necessarily — a very high cash-on-cash return can also signal high leverage and higher risk (a bigger loan relative to a smaller down payment). Look at it alongside DSCR to understand your risk cushion.',
      },
    ],
    relatedTitle: 'Related Calculators',
    relatedCalculators: [
      { title: 'Cap Rate Calculator', slug: 'cap-rate' },
      { title: 'NOI Calculator', slug: 'noi' },
      { title: 'DSCR Calculator', slug: 'dscr' },
    ],
  },
  dscr: {
    metaTitle: 'DSCR Calculator — Debt Service Coverage Ratio for Commercial Loans',
    metaDescription: 'Calculate your debt service coverage ratio (DSCR) for commercial real estate financing. Enter annual NOI and debt service to test bank approval benchmarks.',
    h1: 'DSCR Calculator (Debt Service Coverage Ratio)',
    subtitle: 'Determine whether your commercial property generates enough income to cover loan payments — and check against lender underwriting requirements.',
    whatIsTitle: 'What Is DSCR and Why It Matters',
    whatIsContent: 'DSCR (Debt Service Coverage Ratio) measures a commercial property\'s ability to cover its annual mortgage payments with its net operating income (NOI). Unlike residential lending, which focuses on a borrower\'s personal debt-to-income ratio, commercial lenders underwrite the property itself. DSCR is the single most critical ratio lenders use to determine maximum loan size, interest rates, and approval eligibility. A ratio of 1.0x means net income exactly covers loan payments, while lenders typically require 1.20x to 1.35x as a safety cushion for market fluctuations.',
    formulaTitle: 'The Formula',
    formulaCode: 'DSCR = Net Operating Income (NOI) / Annual Debt Service',
    formulaVariables: [
      { label: 'NOI', desc: 'Annual Net Operating Income before debt service and income taxes' },
      { label: 'Annual Debt Service', desc: 'Total annual principal and interest loan payments' },
    ],
    exampleTitle: 'A Real Example',
    exampleContent: 'Suppose an office building generates an annual NOI of $250,000. Your proposed commercial mortgage requires monthly payments of $15,625 ($187,500 per year).\n\nDSCR = $250,000 / $187,500 = 1.33x\n\nBecause 1.33x exceeds the bank\'s standard 1.25x requirement, the deal has a healthy safety cushion ($62,500/year above debt service), making it an attractive candidate for commercial loan approval.',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'What is a good DSCR ratio for commercial real estate?',
        answer: 'Most commercial banks and lenders look for a minimum DSCR of 1.20x to 1.25x. Highly stable assets (like long-term net lease properties) may qualify at 1.15x - 1.20x, while riskier assets (such as hotels or unanchored retail) often require 1.35x to 1.50x.',
      },
      {
        question: 'What happens if DSCR falls below 1.0x?',
        answer: 'A DSCR below 1.0x indicates negative cash flow — meaning the property does not generate enough income from operations to pay its mortgage. Unless the owner injects personal capital, the deal risks loan default.',
      },
      {
        question: 'How can I improve a deal\'s DSCR?',
        answer: 'You can improve DSCR by increasing NOI (raising rents, adding ancillary revenue, or cutting operating expenses) or by lowering annual debt service (increasing your down payment, negotiating a lower interest rate, or extending the amortization term).',
      },
      {
        question: 'Is DSCR based on gross income or NOI?',
        answer: 'DSCR is always calculated using Net Operating Income (NOI), after deducting all property operating expenses and vacancy loss. Gross income is never used for DSCR calculation.',
      },
    ],
    relatedTitle: 'Related Calculators',
    relatedCalculators: [
      { title: 'NOI Calculator', slug: 'noi' },
      { title: 'Commercial Loan Payment Calculator', slug: 'loan-payment' },
      { title: 'Cash-on-Cash Return Calculator', slug: 'cash-on-cash' },
    ],
  },
  loanPayment: {
    metaTitle: 'Commercial Loan Payment Calculator — Amortization & Balloon Payoff',
    metaDescription: 'Calculate commercial real estate loan payments, total interest, balloon payoff balances, and view 12-month amortization schedules.',
    h1: 'Commercial Real Estate Loan Payment Calculator',
    subtitle: 'Calculate monthly principal and interest payments, total interest costs, and balloon payoff amounts for commercial property loans.',
    whatIsTitle: 'What Is Commercial Loan Amortization and Why It Matters',
    whatIsContent: 'Commercial real estate mortgages differ significantly from residential loans. While residential loans often feature 30-year fixed terms, commercial loans typically feature shorter loan maturity terms (such as 5, 7, or 10 years) paired with a longer amortization schedule (such as 25 or 30 years). At maturity, the remaining principal balance must be paid off or refinanced via a "balloon payment." Calculating your monthly debt service and balloon payoff is essential for projecting cash flow and refinancing risk.',
    formulaTitle: 'The Formula',
    formulaCode: 'M = P × [ r(1 + r)^n ] / [ (1 + r)^n − 1 ]',
    formulaVariables: [
      { label: 'M', desc: 'Monthly Principal & Interest Payment' },
      { label: 'P', desc: 'Principal Loan Amount ($)' },
      { label: 'r', desc: 'Monthly Interest Rate (Annual Rate / 12)' },
      { label: 'n', desc: 'Total Amortization Payments (Amortization Years × 12)' },
    ],
    exampleTitle: 'A Real Example',
    exampleContent: 'You secure a $2,000,000 commercial mortgage at 6.5% interest, structured on a 25-year amortization schedule with a 10-year balloon maturity.\n\nYour monthly payment is $13,496 ($161,952/year). Over the first 10 years, you pay $1,619,520 total ($1,152,192 in interest, $467,328 in principal). At year 10, your remaining balloon balance due is $1,532,672.',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'What is a balloon payment in commercial real estate?',
        answer: 'A balloon payment is a lump-sum principal balance due at the end of a loan term when the loan\'s maturity period (e.g. 10 years) is shorter than its amortization schedule (e.g. 25 years). Investors typically refinance or sell the property before the balloon date.',
      },
      {
        question: 'What amortization period is standard for commercial mortgages?',
        answer: 'Most commercial real estate loans use a 25-year amortization schedule. Primary, institutional assets may qualify for 30-year amortization, while older or special-purpose properties may be restricted to 20 years.',
      },
      {
        question: 'How does interest rate impact commercial debt service?',
        answer: 'Because commercial loan amounts are large, even a 0.5% interest rate change significantly shifts annual debt service, directly impacting your DSCR and Cash-on-Cash returns.',
      },
      {
        question: 'Are commercial loan interest rates fixed or variable?',
        answer: 'Commercial loans can feature fixed rates for 5 to 10 years, or variable/floating rates tied to SOFR or Prime. Hybrid loans often fix the rate for the initial 5 or 7 years before resetting.',
      },
    ],
    relatedTitle: 'Related Calculators',
    relatedCalculators: [
      { title: 'DSCR Calculator', slug: 'dscr' },
      { title: 'Cash-on-Cash Return Calculator', slug: 'cash-on-cash' },
      { title: 'Cap Rate Calculator', slug: 'cap-rate' },
    ],
  },
};
