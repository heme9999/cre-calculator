import { calculateLoanDetails } from '../lib/loanCalculations';

export interface CityCapRateBenchmark {
  type: string;
  classARange: string;
  classBRange: string;
  trend: string;
  notes: string;
}

export interface CityCapRateData {
  slug: string;
  cityName: string;
  state: string;
  marketTier: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  overview: string;
  economicDrivers: { title: string; desc: string }[];
  benchmarks: CityCapRateBenchmark[];
  underwritingExample: {
    title: string;
    scenario?: string;
    intro?: string;
    price?: string;
    noi?: string;
    capRate?: string;
    points: string[];
    analysis: string;
  };
  localRisks: string[];
  faqs: { question: string; answer: string }[];
}

export const CITY_SLUGS = [
  'austin-tx-cap-rates',
  'miami-fl-cap-rates',
  'dallas-tx-cap-rates',
  'phoenix-az-cap-rates',
] as const;

export type CitySlug = (typeof CITY_SLUGS)[number];

// Shared deterministic worked-example math for Austin (84-unit Class B Multifamily scenario)
const AUS_PRICE = 14200000;
const AUS_EGI = 1760000;
const AUS_OPEX = 879600; // Includes reassessed property taxes, insurance, management & $25,200 ($300/unit) reserve
const AUS_NOI = AUS_EGI - AUS_OPEX; // $880,400
const AUS_CAP_RATE = (AUS_NOI / AUS_PRICE) * 100; // 6.20%
const AUS_DOWN_PCT = 35;
const AUS_CLOSING_PCT = 2.0;
const AUS_DOWN_PAYMENT = AUS_PRICE * (AUS_DOWN_PCT / 100); // $4,970,000
const AUS_CLOSING_COSTS = AUS_PRICE * (AUS_CLOSING_PCT / 100); // $284,000
const AUS_TOTAL_CASH = AUS_DOWN_PAYMENT + AUS_CLOSING_COSTS; // $5,254,000
const AUS_LOAN_AMOUNT = AUS_PRICE - AUS_DOWN_PAYMENT; // $9,230,000
const AUS_RATE = 5.75;
const AUS_AMORT = 30;
const AUS_LOAN_RES = calculateLoanDetails({
  loanAmount: AUS_LOAN_AMOUNT,
  interestRate: AUS_RATE,
  amortizationYears: AUS_AMORT,
  balloonYears: AUS_AMORT,
  hasBalloon: false,
  paymentType: 'installment',
});
const AUS_ADS = Math.round(AUS_LOAN_RES.firstYearDebtService); // $646,365 (monthly ~$53,863.77)
const AUS_DEBT_CONSTANT = (AUS_LOAN_RES.firstYearDebtService / AUS_LOAN_AMOUNT) * 100; // 7.00%
const AUS_DSCR = AUS_NOI / AUS_LOAN_RES.firstYearDebtService; // 1.36x
const AUS_PRETAX_CF = Math.round(AUS_NOI - AUS_LOAN_RES.firstYearDebtService); // $234,035
const AUS_COC = ((AUS_NOI - AUS_LOAN_RES.firstYearDebtService) / AUS_TOTAL_CASH) * 100; // 4.45%

// Shared deterministic worked-example math for Dallas (150,000 RSF Industrial scenario)
const DAL_PRICE = 18500000;
const DAL_BASE_RENT = 1125000;
const DAL_VACANCY_AND_RESERVES = 52000; // 3% vacancy allowance + $18,250 structural reserve
const DAL_NOI = DAL_BASE_RENT - DAL_VACANCY_AND_RESERVES; // $1,073,000
const DAL_CAP_RATE = (DAL_NOI / DAL_PRICE) * 100; // 5.80%
const DAL_DOWN_PCT = 35;
const DAL_CLOSING_PCT = 2.0;
const DAL_DOWN_PAYMENT = DAL_PRICE * (DAL_DOWN_PCT / 100); // $6,475,000
const DAL_CLOSING_COSTS = DAL_PRICE * (DAL_CLOSING_PCT / 100); // $370,000
const DAL_TOTAL_CASH = DAL_DOWN_PAYMENT + DAL_CLOSING_COSTS; // $6,845,000
const DAL_LOAN_AMOUNT = DAL_PRICE - DAL_DOWN_PAYMENT; // $12,025,000
const DAL_RATE = 5.60;
const DAL_AMORT = 30;
const DAL_LOAN_RES = calculateLoanDetails({
  loanAmount: DAL_LOAN_AMOUNT,
  interestRate: DAL_RATE,
  amortizationYears: DAL_AMORT,
  balloonYears: DAL_AMORT,
  hasBalloon: false,
  paymentType: 'installment',
});
const DAL_ADS = Math.round(DAL_LOAN_RES.firstYearDebtService); // $828,396 (monthly ~$69,033.00)
const DAL_DEBT_CONSTANT = (DAL_LOAN_RES.firstYearDebtService / DAL_LOAN_AMOUNT) * 100; // 6.89%
const DAL_DSCR = DAL_NOI / DAL_LOAN_RES.firstYearDebtService; // 1.30x
const DAL_PRETAX_CF = Math.round(DAL_NOI - DAL_LOAN_RES.firstYearDebtService); // $244,604
const DAL_COC = ((DAL_NOI - DAL_LOAN_RES.firstYearDebtService) / DAL_TOTAL_CASH) * 100; // 3.57%

export const cityCapRatesContent: Record<string, Record<CitySlug, CityCapRateData>> = {
  en: {
    'austin-tx-cap-rates': {
      slug: 'austin-tx-cap-rates',
      cityName: 'Austin',
      state: 'TX',
      marketTier: 'Tier-2 Tech Metro (Illustrative Underwriting Case)',
      metaTitle: 'Austin, TX Cap Rate Underwriting Scenarios | CRE Modeling Guide',
      metaDescription:
        'Explore illustrative commercial real estate cap rate scenarios for Austin, Texas across multifamily, industrial, retail, and office underwriting models.',
      h1: 'Austin, TX Commercial Real Estate Cap Rate Underwriting Scenarios',
      subtitle:
        'Illustrative capitalization rate ranges, regional underwriting drivers, and step-by-step financial modeling examples for the Greater Austin metropolitan area.',
      overview:
        'Austin, Texas is widely studied as a high-growth Sunbelt commercial real estate market where corporate relocations and demographic growth interact with periodic construction delivery waves and high property tax assessments. All cap rate ranges below are illustrative underwriting assumptions for educational financial modeling—not live brokerage quotes or verified transaction feeds.',
      economicDrivers: [
        { title: 'Tech & Corporate Employment Base', desc: 'Enterprise technology and manufacturing employers across Southwest Austin, North Austin, and the SH-130 corridor influence local housing and warehouse absorption.' },
        { title: 'No State Income Tax Structure', desc: 'Texas relies on local property taxes rather than state income taxes, making post-sale property tax reassessment a primary underwriting variable.' },
        { title: 'Suburban Corridor Expansion', desc: 'Population growth in Williamson and Hays counties drives neighborhood retail and shallow-bay logistics demand.' },
      ],
      benchmarks: [
        { type: 'Multifamily (Apartments)', classARange: '5.25% - 5.75% (Illust.)', classBRange: '6.00% - 6.65% (Illust.)', trend: 'Supply-Sensitive', notes: 'Model lease-up concessions and post-sale TCAD tax reassessments.' },
        { type: 'Industrial / Logistics', classARange: '5.50% - 6.10% (Illust.)', classBRange: '6.25% - 6.85% (Illust.)', trend: 'NNN Lease Focus', notes: 'Compare clear heights and dock ratios along I-35 and SH-130.' },
        { type: 'Retail (Neighborhood & NNN)', classARange: '5.65% - 6.25% (Illust.)', classBRange: '6.50% - 7.20% (Illust.)', trend: 'Suburban Demand', notes: 'Underwrite tenant rent-to-sales sustainability and CAM caps.' },
        { type: 'Suburban Office', classARange: '7.50% - 8.50% (Illust.)', classBRange: '8.75% - 10.00%+ (Illust.)', trend: 'High TI Reserves', notes: 'Include conservative re-leasing downtime and tenant improvement reserves.' },
      ],
      underwritingExample: {
        title: 'Worked Example: North Austin Class B Multifamily Scenario (84 Units)',
        scenario: 'Underwriting an illustrative 84-unit garden apartment complex in North Austin with explicit operating expense, reserve, and amortizing debt assumptions:',
        price: `$${AUS_PRICE.toLocaleString()}`,
        noi: `$${AUS_NOI.toLocaleString()}`,
        capRate: `${AUS_CAP_RATE.toFixed(2)}%`,
        points: [
          `Purchase Price: $${AUS_PRICE.toLocaleString()} ($169,048 / unit) | Closing Costs (2.0%): $${AUS_CLOSING_COSTS.toLocaleString()}`,
          `Effective Gross Income (EGI after vacancy & concessions): $${AUS_EGI.toLocaleString()} / year`,
          `Operating Expenses & Replacement Reserves (reassessed taxes, insurance, management, and $25,200 / $300 per unit annual reserve): -$${AUS_OPEX.toLocaleString()} (49.98% of EGI)`,
          `Net Operating Income (NOI): $${AUS_NOI.toLocaleString()} → Unleveraged Cap Rate = $${AUS_NOI.toLocaleString()} ÷ $${AUS_PRICE.toLocaleString()} = ${AUS_CAP_RATE.toFixed(2)}%`,
          `Financing Assumptions: 65% LTV ($${AUS_LOAN_AMOUNT.toLocaleString()} loan, $${AUS_DOWN_PAYMENT.toLocaleString()} down payment, $${AUS_TOTAL_CASH.toLocaleString()} total cash invested), ${AUS_RATE.toFixed(2)}% fixed interest, ${AUS_AMORT}-year equal P&I amortization`,
          `Annual Debt Service: $${AUS_ADS.toLocaleString()}/year (annual loan constant = ${AUS_DEBT_CONSTANT.toFixed(2)}%) → DSCR = ${AUS_DSCR.toFixed(2)}x | Pre-Tax Cash Flow = $${AUS_PRETAX_CF.toLocaleString()}/year`,
        ],
        analysis: `Underwriting Takeaway: Even though the ${AUS_RATE.toFixed(2)}% nominal interest rate is below the ${AUS_CAP_RATE.toFixed(2)}% Cap Rate, the ${AUS_AMORT}-year amortizing debt constant is ${AUS_DEBT_CONSTANT.toFixed(2)}% because monthly payments include principal amortization. On $${AUS_TOTAL_CASH.toLocaleString()} of total cash invested (down payment plus 2.0% closing costs), Year-1 Cash-on-Cash Return is ${AUS_COC.toFixed(2)}% with a ${AUS_DSCR.toFixed(2)}x DSCR.`,
      },
      localRisks: [
        'Travis and Williamson County property tax reassessments can substantially increase operating expenses after acquisition.',
        'Submarkets with heavy new apartment deliveries require conservative vacancy and rent-concession assumptions.',
      ],
      faqs: [
        {
          question: 'Are the Austin cap rate ranges on this page live market quotes?',
          answer:
            'No. All cap rate ranges and worked examples on this page are illustrative underwriting assumptions for educational financial modeling. Always verify local comparable sales and county appraisal district records.',
        },
        {
          question: 'How do Texas property taxes affect Austin commercial cap rates?',
          answer:
            'Texas has no state income tax and relies heavily on local property taxes (often 2.0% to 2.5% of assessed value). Buyers must model post-sale property tax reassessment rather than relying on the seller’s historical tax bill.',
        },
        {
          question: 'Why does a 5.75% amortizing loan on a 6.20% Cap Rate property result in a 4.45% Cash-on-Cash return?',
          answer:
            'Because a 30-year amortizing loan requires both interest and principal payments, producing an annual loan constant of 7.00% (> 6.20% Cap Rate). Combined with 2.0% closing costs, Year-1 pre-tax Cash-on-Cash Return is 4.45%.',
        },
      ],
    },
    'miami-fl-cap-rates': {
      slug: 'miami-fl-cap-rates',
      cityName: 'Miami',
      state: 'FL',
      marketTier: 'Coastal Gateway Metro (Illustrative Underwriting Case)',
      metaTitle: 'Miami, FL Cap Rate Underwriting Scenarios | South Florida CRE Guide',
      metaDescription:
        'Explore illustrative commercial real estate cap rate scenarios for Miami and South Florida across multifamily, retail, industrial, and office underwriting models.',
      h1: 'Miami, FL Commercial Real Estate Cap Rate Underwriting Scenarios',
      subtitle:
        'Illustrative capitalization rate ranges, coastal insurance and tax reassessment checks, and underwriting examples for Miami-Dade and Broward counties.',
      overview:
        'Bounded by the Atlantic Ocean and the Everglades, South Florida combines geographic land constraints with elevated coastal windstorm insurance and post-sale property tax reassessment dynamics. All cap rate ranges below are illustrative underwriting assumptions for educational modeling—not live market brokerage quotes.',
      economicDrivers: [
        { title: 'Geographic Land Constraints', desc: 'Natural ocean and wetland boundaries limit greenfield development across Miami-Dade and Broward counties.' },
        { title: 'International Trade & Port Logistics', desc: 'Miami International Airport and PortMiami anchor cold-storage and infill warehouse demand in Doral and Medley.' },
        { title: 'Coastal Insurance & Tax Reset Sensitivity', desc: 'Windstorm insurance premiums and removal of the 10% non-homestead assessment cap upon sale heavily influence net operating income.' },
      ],
      benchmarks: [
        { type: 'Multifamily (Apartments)', classARange: '5.00% - 5.50% (Illust.)', classBRange: '5.75% - 6.40% (Illust.)', trend: 'Insurance-Sensitive', notes: 'Underwrite bound windstorm insurance quotes and tax reassessment.' },
        { type: 'Infill Industrial & Logistics', classARange: '5.25% - 5.80% (Illust.)', classBRange: '6.00% - 6.60% (Illust.)', trend: 'Land-Constrained', notes: 'High land basis in Doral, Medley, and Hialeah industrial submarkets.' },
        { type: 'Neighborhood & NNN Retail', classARange: '5.40% - 6.00% (Illust.)', classBRange: '6.20% - 6.90% (Illust.)', trend: 'Dense Trade Areas', notes: 'Check tenant occupancy-cost ratios after NNN tax/insurance pass-throughs.' },
        { type: 'Urban & Suburban Office', classARange: '6.75% - 7.60% (Illust.)', classBRange: '8.00% - 9.25% (Illust.)', trend: 'TI & CapEx Focus', notes: 'Account for tenant improvement allowances and 40-year recertification.' },
      ],
      underwritingExample: {
        title: 'Worked Example: Miami-Dade NNN Neighborhood Retail Scenario',
        scenario: 'Underwriting an illustrative 22,000 RSF neighborhood retail strip center in West Miami on NNN leases:',
        price: '$9,600,000',
        noi: '$576,000',
        capRate: '6.00%',
        points: [
          'Purchase Price: $9,600,000 ($436.36 / RSF)',
          'Base NNN Rental Revenue: $630,000 / year (tenants reimburse property tax, insurance, and CAM)',
          'Vacancy & Credit Loss Allowance (5.0%): -$31,500 / year',
          'Unreimbursed Landlord Structural & Management Reserves: -$22,500 / year',
          'Stabilized Net Operating Income (NOI): $576,000 → Unleveraged Cap Rate = $576,000 ÷ $9,600,000 = 6.00%',
        ],
        analysis:
          'Underwriting Takeaway: Even when tenants reimburse taxes and insurance under NNN leases, a post-sale jump in property taxes and windstorm insurance increases tenants’ total occupancy cost per square foot, which must be stress-tested against store sales.',
      },
      localRisks: [
        'Named windstorm and flood insurance renewals can compress net operating income if not locked during due diligence.',
        'Buildings approaching 30 or 40 years of age in Miami-Dade/Broward require mandatory structural recertification reserves.',
      ],
      faqs: [
        {
          question: 'Are the Miami cap rate ranges on this page live market quotes?',
          answer:
            'No. All cap rate ranges and worked examples on this page are illustrative underwriting assumptions for educational financial modeling. Always verify local comparable sales and actual insurance quotes.',
        },
        {
          question: 'How does Florida property tax reassessment affect Miami commercial real estate?',
          answer:
            'While existing commercial owners benefit from a 10% annual cap on non-homestead assessment increases, a sale resets the assessed value toward the acquisition price, often increasing property taxes significantly.',
        },
        {
          question: 'Why must NNN landlords still care about insurance and property tax increases?',
          answer:
            'Because tenants pay base rent plus NNN pass-throughs out of the same business revenue. If NNN expenses spike, tenants have less capacity to absorb base rent increases at lease renewal.',
        },
      ],
    },
    'dallas-tx-cap-rates': {
      slug: 'dallas-tx-cap-rates',
      cityName: 'Dallas - Fort Worth',
      state: 'TX',
      marketTier: 'Inland Logistics & Corporate Hub (Illustrative Case)',
      metaTitle: 'Dallas-Fort Worth Cap Rate Underwriting Scenarios | DFW CRE Guide',
      metaDescription:
        'Explore illustrative commercial real estate cap rate scenarios and worked underwriting examples for Dallas-Fort Worth (DFW) industrial, multifamily, and retail.',
      h1: 'Dallas-Fort Worth (DFW) Commercial Real Estate Cap Rate Scenarios',
      subtitle:
        'Illustrative capitalization rate ranges, county tax reassessment checks, and step-by-step underwriting examples for the DFW Metroplex.',
      overview:
        'The Dallas-Fort Worth Metroplex serves as a central North American distribution, transportation, and corporate operations hub. Because DFW spans multiple counties with substantial developable land on outer highway loops, underwriting models must balance tenant demand against new supply and annual county tax reassessments. All ranges below are illustrative modeling assumptions—not live market quotes.',
      economicDrivers: [
        { title: 'Central Inland Logistics Network', desc: 'Interstate highway and rail convergence around DFW International Airport supports regional and national distribution centers.' },
        { title: 'Diversified Corporate Employment', desc: 'Financial services, telecommunications, defense, and healthcare employers anchor suburban growth in Collin, Denton, and Tarrant counties.' },
        { title: 'Active County Appraisal Districts', desc: 'Dallas (DCAD), Tarrant (TAD), and Collin (CCAD) appraisal districts regularly update commercial assessments toward market value.' },
      ],
      benchmarks: [
        { type: 'Industrial / Distribution', classARange: '5.40% - 5.95% (Illust.)', classBRange: '6.15% - 6.75% (Illust.)', trend: 'Core Logistics', notes: 'Model tenant rollover and roof/paving reserves across I-20 and DFW Airport corridors.' },
        { type: 'Multifamily (Apartments)', classARange: '5.25% - 5.80% (Illust.)', classBRange: '6.00% - 6.70% (Illust.)', trend: 'Submarket Spread', notes: 'Account for hail/wind insurance deductibles and county tax resets.' },
        { type: 'Grocery & Strip Retail', classARange: '5.60% - 6.20% (Illust.)', classBRange: '6.40% - 7.15% (Illust.)', trend: 'Suburban Growth', notes: 'Neighborhood service retail in Frisco, McKinney, and Fort Worth.' },
        { type: 'Suburban & Uptown Office', classARange: '7.25% - 8.25% (Illust.)', classBRange: '8.50% - 10.00%+ (Illust.)', trend: 'Flight to Quality', notes: 'Older suburban office assets require substantial TI and leasing commission reserves.' },
      ],
      underwritingExample: {
        title: 'Worked Example: DFW Airport Shallow-Bay Industrial Scenario (150,000 RSF)',
        scenario: 'Underwriting an illustrative 150,000 RSF multi-tenant industrial building near DFW Airport with explicit reserve and amortizing debt assumptions:',
        price: `$${DAL_PRICE.toLocaleString()}`,
        noi: `$${DAL_NOI.toLocaleString()}`,
        capRate: `${DAL_CAP_RATE.toFixed(2)}%`,
        points: [
          `Purchase Price: $${DAL_PRICE.toLocaleString()} ($123.33 / RSF) | Closing Costs (2.0%): $${DAL_CLOSING_COSTS.toLocaleString()}`,
          `Contractual Base NNN Rent: $${DAL_BASE_RENT.toLocaleString()} / year ($7.50 / RSF NNN; taxes/insurance/CAM reimbursed)`,
          `Vacancy Allowance & Structural Roof/Paving Reserve: -$${DAL_VACANCY_AND_RESERVES.toLocaleString()} / year`,
          `Net Operating Income (NOI): $${DAL_NOI.toLocaleString()} → Unleveraged Cap Rate = $${DAL_NOI.toLocaleString()} ÷ $${DAL_PRICE.toLocaleString()} = ${DAL_CAP_RATE.toFixed(2)}%`,
          `Financing Assumptions: 65% LTV ($${DAL_LOAN_AMOUNT.toLocaleString()} loan, $${DAL_DOWN_PAYMENT.toLocaleString()} down payment, $${DAL_TOTAL_CASH.toLocaleString()} total cash invested), ${DAL_RATE.toFixed(2)}% fixed interest, ${DAL_AMORT}-year equal P&I amortization`,
          `Annual Debt Service: $${DAL_ADS.toLocaleString()}/year (annual loan constant = ${DAL_DEBT_CONSTANT.toFixed(2)}%) → DSCR = ${DAL_DSCR.toFixed(2)}x | Pre-Tax Cash Flow = $${DAL_PRETAX_CF.toLocaleString()}/year`,
        ],
        analysis: `Underwriting Takeaway: Because the ${DAL_AMORT}-year amortizing debt constant (${DAL_DEBT_CONSTANT.toFixed(2)}%) exceeds the ${DAL_CAP_RATE.toFixed(2)}% Going-In Cap Rate, Year-1 Cash-on-Cash Return on $${DAL_TOTAL_CASH.toLocaleString()} total cash invested is ${DAL_COC.toFixed(2)}% (DSCR ${DAL_DSCR.toFixed(2)}x). Return expansion in this scenario depends on contractual 3.5% annual rent escalations and mark-to-market lease renewals rather than initial positive leverage.`,
      },
      localRisks: [
        'North Texas hail and convective storm exposure has increased commercial property insurance premiums and roof deductibles.',
        'Outer-ring industrial submarkets with abundant land can experience rapid speculative construction supply.',
      ],
      faqs: [
        {
          question: 'Are the DFW cap rate ranges on this page live market quotes?',
          answer:
            'No. All cap rate ranges and worked examples on this page are illustrative underwriting assumptions for educational financial modeling. Always verify local comparable sales and county tax records.',
        },
        {
          question: 'Why does a 5.60% mortgage on a 5.80% Cap Rate property produce a 3.57% Year-1 Cash-on-Cash Return?',
          answer:
            'Because a 30-year amortizing loan includes principal paydown, making the annual debt constant 6.89% (> 5.80% Cap Rate). After deducting full principal-and-interest debt service and including 2.0% closing costs, Year-1 Cash-on-Cash Return is 3.57%.',
        },
        {
          question: 'How should DFW property taxes be modeled upon acquisition?',
          answer:
            'Dallas, Tarrant, and Collin county appraisal districts actively reassess commercial properties. Prudent underwriters model property taxes at 85% to 95% of the acquisition price multiplied by the local millage rate.',
        },
      ],
    },
    'phoenix-az-cap-rates': {
      slug: 'phoenix-az-cap-rates',
      cityName: 'Phoenix',
      state: 'AZ',
      marketTier: 'Southwest Manufacturing & Growth Metro (Illustrative Case)',
      metaTitle: 'Phoenix, AZ Cap Rate Underwriting Scenarios | Valley CRE Modeling Guide',
      metaDescription:
        'Explore illustrative commercial real estate cap rate scenarios for Phoenix, Arizona across industrial, multifamily, self-storage, and retail underwriting models.',
      h1: 'Phoenix, AZ Commercial Real Estate Cap Rate Underwriting Scenarios',
      subtitle:
        'Illustrative capitalization rate ranges, Maricopa County underwriting factors, and worked financial modeling examples for Greater Phoenix.',
      overview:
        'Greater Phoenix (the Valley of the Sun) is a major Southwest logistics, advanced manufacturing, and residential growth corridor connected by I-10, Loop 303, and Loop 202. All cap rate ranges below are illustrative underwriting assumptions for educational modeling—not live brokerage quotes or verified transaction indices.',
      economicDrivers: [
        { title: 'Advanced Manufacturing & Logistics Corridors', desc: 'Semiconductor and supplier facilities along Loop 303 and in the East Valley influence warehouse and workforce housing demand.' },
        { title: 'Southern California Freight Connectivity', desc: 'Interstate 10 links West Valley distribution centers directly to the Ports of Los Angeles and Long Beach.' },
        { title: 'Demographic & Household Growth', desc: 'Long-term population inflow supports neighborhood grocery retail, medical office, and climate-controlled self-storage.' },
      ],
      benchmarks: [
        { type: 'Industrial / Logistics', classARange: '5.50% - 6.15% (Illust.)', classBRange: '6.30% - 7.00% (Illust.)', trend: 'Supply & Absorption', notes: 'Evaluate power capacity, clear height, and Loop 303 spec supply.' },
        { type: 'Multifamily (Apartments)', classARange: '5.35% - 5.85% (Illust.)', classBRange: '6.15% - 6.85% (Illust.)', trend: 'Concession Modeling', notes: 'Factor in summer HVAC utility loads and new delivery absorption.' },
        { type: 'Self-Storage Facilities', classARange: '5.85% - 6.50% (Illust.)', classBRange: '6.65% - 7.35% (Illust.)', trend: 'Economic Occupancy', notes: 'Compare street rates against actual collected economic occupancy.' },
        { type: 'Suburban Strip & Grocery Retail', classARange: '5.75% - 6.40% (Illust.)', classBRange: '6.60% - 7.35% (Illust.)', trend: 'Suburban Corridors', notes: 'Scottsdale, Chandler, and Gilbert trade-area demographics.' },
      ],
      underwritingExample: {
        title: 'Worked Example: West Valley Logistics Warehouse Scenario (110,000 RSF)',
        scenario: 'Evaluating an illustrative 110,000 RSF distribution warehouse in the Glendale / Loop 303 corridor on an NNN lease:',
        price: '$15,400,000',
        noi: '$924,000',
        capRate: '6.00%',
        points: [
          'Purchase Price: $15,400,000 ($140.00 / RSF)',
          'Contractual Base Rent: $8.75 / RSF NNN = $962,500 / year',
          'Vacancy Allowance & Structural Roof/HVAC Reserves: -$38,500 / year',
          'Stabilized Net Operating Income (NOI): $924,000 → Unleveraged Cap Rate = $924,000 ÷ $15,400,000 = 6.00%',
        ],
        analysis:
          'Underwriting Takeaway: At an illustrative 6.00% Unleveraged Cap Rate, underwriters still verify tenant creditworthiness, electrical load specifications, and replacement reserves for rooftop package cooling units exposed to extreme summer heat.',
      },
      localRisks: [
        'Water allocation rules and electrical utility capacity require site-specific verification for industrial developments.',
        'Extreme summer temperatures shorten rooftop HVAC lifespans and increase common-area electricity expenses.',
      ],
      faqs: [
        {
          question: 'Are the Phoenix cap rate ranges on this page live market quotes?',
          answer:
            'No. All cap rate ranges and worked examples on this page are illustrative underwriting assumptions for educational financial modeling. Always verify local comparable sales in Maricopa County.',
        },
        {
          question: 'What special CapEx reserves should be modeled for Phoenix commercial properties?',
          answer:
            'Because summer temperatures regularly exceed 110°F, rooftop HVAC units and Elastomeric roof coatings experience accelerated wear, requiring conservative annual capital replacement reserves.',
        },
        {
          question: 'How does Arizona property tax assessment work for commercial real estate?',
          answer:
            'Arizona uses a dual-value system (Full Cash Value and Limited Property Value, with statutory assessment ratios by property class). Always verify Maricopa County Assessor classifications during due diligence.',
        },
      ],
    },
  },
  zh: {
    'austin-tx-cap-rates': {
      slug: 'austin-tx-cap-rates',
      cityName: '奥斯汀 (Austin)',
      state: 'TX',
      marketTier: 'Tier-2 科技创新都市圈 (教学承销案例)',
      metaTitle: '德州奥斯汀 (Austin) Cap Rate 承销指南 | 商业地产建模算例',
      metaDescription:
        '查看德州奥斯汀（Austin）多户住宅、工业物流、零售及办公物业的教学示例 Cap Rate 承销区间、房产税重估逻辑与摊销贷款现金流算例。',
      h1: '德州奥斯汀 (Austin, TX) 商业地产 Cap Rate 承销案例与建模指南',
      subtitle:
        '针对大奥斯汀都市圈多户住宅、工业仓储、商业零售及办公资产的教学承销假设区间、区域基本面变量与完整财务测算算例。',
      overview:
        '德克萨斯州奥斯汀常被作为阳光地带（Sunbelt）高成长都市圈的研究样本：科技与制造业就业增长同阶段性新建公寓集中交付、德州高比例地方房产税并存。本页所列各业态 Cap Rate 区间均为教学承销建模假设，不代表实时市场成交报价或机构指数。',
      economicDrivers: [
        { title: '科技与先进制造就业集群', desc: '西南奥斯汀、北奥斯汀 Domain 及 SH-130 走廊的科技与制造企业支撑长期租住与仓储物流需求。' },
        { title: '无州所得税与地方房产税结构', desc: '德州无州个人或企业所得税，公共财政高度依赖地方房产税，过户后的税基重估是承销的核心变量。' },
        { title: '卫星城走廊人口扩展', desc: '威廉姆森县（Williamson）与海斯县（Hays）的人口增长带动社区商业与轻工业仓储需求。' },
      ],
      benchmarks: [
        { type: 'Multifamily 多户住宅公寓', classARange: '5.25% - 5.75% (示例)', classBRange: '6.00% - 6.65% (示例)', trend: '受新增供给影响', notes: '需在模型中计入免租期折让及过户后 TCAD 房产税重估。' },
        { type: 'Industrial 工业与仓储物流', classARange: '5.50% - 6.10% (示例)', classBRange: '6.25% - 6.85% (示例)', trend: 'NNN 租约为主', notes: '重点核查 I-35 与 SH-130 沿线仓库净层高与卸货门配置。' },
        { type: 'Retail 社区零售与 NNN 商业', classARange: '5.65% - 6.25% (示例)', classBRange: '6.50% - 7.20% (示例)', trend: '社区刚需支撑', notes: '评估租户租售比健康度及 CAM 费用分摊上限条款。' },
        { type: 'Suburban Office 郊区办公楼', classARange: '7.50% - 8.50% (示例)', classBRange: '8.75% - 10.00%+ (示例)', trend: '高装修改造储备', notes: '需预留充足的转租空置期与租户装修补贴 (TI) 储备金。' },
      ],
      underwritingExample: {
        title: '实操测算案例：北奥斯汀 Class B 多户住宅公寓（84 单元）',
        scenario: '假设您正在对北奥斯汀 Domain 就业区附近一处 84 单元花园式公寓进行完整承销建模（含明确房产税重估、资本储备金与摊销贷款假设）：',
        price: `$${AUS_PRICE.toLocaleString()}`,
        noi: `$${AUS_NOI.toLocaleString()}`,
        capRate: `${AUS_CAP_RATE.toFixed(2)}%`,
        points: [
          `购买价格: $${AUS_PRICE.toLocaleString()}（折合每单元 $169,048）| 过户交割成本 (2.0%): $${AUS_CLOSING_COSTS.toLocaleString()}`,
          `有效毛收入 (EGI，扣除空置与免租期折让后): $${AUS_EGI.toLocaleString()} / 年`,
          `年运营费用与大修储备金（含重估房产税、保险、管理费及 $25,200 即 $300/单元年度资本储备）: -$${AUS_OPEX.toLocaleString()}（占 EGI 的 49.98%）`,
          `净营业收入 (NOI): $${AUS_NOI.toLocaleString()} → 无杠杆 Cap Rate = $${AUS_NOI.toLocaleString()} ÷ $${AUS_PRICE.toLocaleString()} = ${AUS_CAP_RATE.toFixed(2)}%`,
          `融资假设: 65% LTV（贷款额 $${AUS_LOAN_AMOUNT.toLocaleString()}，首付 $${AUS_DOWN_PAYMENT.toLocaleString()}，含过户费总投入现金 $${AUS_TOTAL_CASH.toLocaleString()}），固定年利率 ${AUS_RATE.toFixed(2)}%，${AUS_AMORT} 年等额本息摊销`,
          `年还贷总额 (Annual Debt Service): $${AUS_ADS.toLocaleString()}/年（年度贷款常数 = ${AUS_DEBT_CONSTANT.toFixed(2)}%）→ DSCR = ${AUS_DSCR.toFixed(2)}x | 税前净现金流 = $${AUS_PRETAX_CF.toLocaleString()}/年`,
        ],
        analysis: `承销结论：尽管名义利率（${AUS_RATE.toFixed(2)}%）低于无杠杆 Cap Rate（${AUS_CAP_RATE.toFixed(2)}%），但由于 ${AUS_AMORT} 年等额本息包含本金偿还，年度贷款常数为 ${AUS_DEBT_CONSTANT.toFixed(2)}%（高于 6.20%）。按含 2.0% 过户费的总投入现金（$${AUS_TOTAL_CASH.toLocaleString()}）计算，首年现金回报率（Cash-on-Cash Return）为 ${AUS_COC.toFixed(2)}%，偿债覆盖率（DSCR）为 ${AUS_DSCR.toFixed(2)}x。`,
      },
      localRisks: [
        '特拉维斯县（TCAD）与威廉姆森县（WCAD）过户后的房产税重估可能显著推高年度运营费用。',
        '新建公寓集中交付的子市场需采用审慎的空置率与免租期（Concessions）消化假设。',
      ],
      faqs: [
        {
          question: '本页所列的奥斯汀 Cap Rate 区间是实时市场行情吗？',
          answer:
            '不是。本页所有 Cap Rate 区间与算例均为用于财务建模教学的示例假设，不代表实时交易报价。实际项目请核查最新可比交易与县评估区（TCAD）记录。',
        },
        {
          question: '德州房产税如何影响奥斯汀商业地产的 Cap Rate 测算？',
          answer:
            '德州无州个人所得税，市政服务高度依赖房产税（通常占评估价值的 2.0% 至 2.5%）。买方必须按收购后的预期重估价值测算房产税，不可直接沿用卖方历史税单。',
        },
        {
          question: '为什么 6.20% Cap Rate 配合 5.75% 利率贷款，首年现金回报率是 4.45% 而不是正杠杆？',
          answer:
            '因为 30 年等额本息还款同时包含利息与本金偿还，其年度贷款常数为 7.00%（高于 6.20% 的 Cap Rate）。扣除全额本息并计入 2.0% 过户成本后，首年税前 Cash-on-Cash 回报率为 4.45%。',
        },
      ],
    },
    'miami-fl-cap-rates': {
      slug: 'miami-fl-cap-rates',
      cityName: '迈阿密 (Miami)',
      state: 'FL',
      marketTier: '海岸门户都市圈 (教学承销案例)',
      metaTitle: '佛州迈阿密 (Miami) Cap Rate 承销指南 | 南佛州商业地产建模算例',
      metaDescription:
        '查看佛罗里达州迈阿密（Miami）与南佛州多户住宅、工业、零售及办公物业的教学示例 Cap Rate 承销区间及飓风保险、房产税重估建模要点。',
      h1: '佛州迈阿密 (Miami, FL) 商业地产 Cap Rate 承销案例与建模指南',
      subtitle:
        '针对迈阿密-戴德县与布劳沃德县商业物业的教学承销假设区间、沿海风灾保险与税基重置测算框架。',
      overview:
        '南佛罗里达走廊东临大西洋、西接大沼泽地，土地供给受天然地理边界限制；同时沿海飓风保险保费与过户后的非自住（Non-Homestead）房产税重估对真实 NOI 影响极大。本页所有 Cap Rate 区间均为教学建模假设，不代表实时市场成交报价。',
      economicDrivers: [
        { title: '天然地理边界与土地稀缺', desc: '海洋与湿地保护区限制了新增建设用地，支撑核心城区与存量物业长期租住需求。' },
        { title: '国际贸易与海空双港物流', desc: '迈阿密国际机场与迈阿密港带动 Doral、Medley 等工业走廊的冷链与高周转仓储需求。' },
        { title: '沿海保险与过户税基重估敏感度', desc: '商业风灾/洪水保险报价及过户解除 10% 年度评估涨幅上限是决定净现金流的核心因素。' },
      ],
      benchmarks: [
        { type: 'Multifamily 多户住宅公寓', classARange: '5.00% - 5.50% (示例)', classBRange: '5.75% - 6.40% (示例)', trend: '保险成本敏感', notes: '尽调期需获取可承保的风灾险正式报价并重算过户房产税。' },
        { type: 'Industrial 核心城区工业与冷链', classARange: '5.25% - 5.80% (示例)', classBRange: '6.00% - 6.60% (示例)', trend: '工业用地稀缺', notes: 'Doral、Medley 与 Hialeah 工业区土地成本占比高。' },
        { type: 'Retail 社区零售与 NNN 街区商业', classARange: '5.40% - 6.00% (示例)', classBRange: '6.20% - 6.90% (示例)', trend: '高密度社区消费', notes: '需核查 NNN 税保费转嫁后租户的总占用成本负担。' },
        { type: 'Office 商务与郊区办公楼', classARange: '6.75% - 7.60% (示例)', classBRange: '8.00% - 9.25% (示例)', trend: '关注楼宇复检储备', notes: '需计入租户装修补贴 (TI) 及 30/40 年楼宇安全强制复检储备。' },
      ],
      underwritingExample: {
        title: '实操测算案例：迈阿密-戴德县 NNN 社区商业中心（22,000 平方英尺）',
        scenario: '假设您正在评估一处位于西迈阿密的 22,000 可租平方英尺 NNN 街区商业中心：',
        price: '$9,600,000',
        noi: '$576,000',
        capRate: '6.00%',
        points: [
          '购买价格: $9,600,000（折合每平方英尺 $436.36）',
          '合同基础 NNN 年租金: $630,000 / 年（房产税、保险与 CAM 由租户按约报销）',
          '空置与坏账准备金 (5.0%): -$31,500 / 年',
          '业主不可转嫁结构维护储备与管理费: -$22,500 / 年',
          '稳定期净营业收入 (NOI): $576,000 → 无杠杆 Cap Rate = $576,000 ÷ $9,600,000 = 6.00%',
        ],
        analysis:
          '承销结论：即便在 NNN 租约下房产税与风灾保险由租户报销，过户后税费与保险的大幅跳升仍会推高租户每平方英尺的总占用成本（Occupancy Cost），需结合租户营业额检验其长期承租能力。',
      },
      localRisks: [
        '命名飓风（Named Windstorm）与洪水保险续保保费波动大，尽调期必须获取真实承保报价。',
        '迈阿密-戴德县与布劳沃德县满 30/40 年楼龄建筑需完成强制结构与电气安全复检。',
      ],
      faqs: [
        {
          question: '本页所列的迈阿密 Cap Rate 区间是实时市场数据吗？',
          answer:
            '不是。本页所有区间与算例均为商业地产财务建模教学假设。实际收购前请核实本地可比交易、保险正式报价及县评估官税率。',
        },
        {
          question: '佛州房产税重估如何影响迈阿密商业地产的真实收益率？',
          answer:
            '持续持有的非自住商业物业享有每年 10% 的评估涨幅上限，但买卖过户会解除该上限并按新成交价重新核定税基，往往导致年度房产税大幅增加。',
        },
        {
          question: '为什么 NNN 房东仍需高度关注迈阿密的保险和房产税涨幅？',
          answer:
            '因为租户用同一笔门店营业收入支付基础租金与 NNN 报销费用。若税保费暴涨挤占租户利润，租约到期续签时基础租金的提价空间就会受限。',
        },
      ],
    },
    'dallas-tx-cap-rates': {
      slug: 'dallas-tx-cap-rates',
      cityName: '达拉斯 - 沃斯堡 (DFW)',
      state: 'TX',
      marketTier: '内陆物流与企业总部枢纽 (教学承销案例)',
      metaTitle: '达拉斯-沃斯堡 (DFW) Cap Rate 承销指南 | 商业地产建模算例',
      metaDescription:
        '查看德州达拉斯-沃斯堡（DFW）工业物流、多户住宅、零售及办公物业的教学示例 Cap Rate 承销区间与摊销贷款现金流算例。',
      h1: '达拉斯-沃斯堡 (DFW) 商业地产 Cap Rate 承销案例与建模指南',
      subtitle:
        '针对达拉斯-沃斯堡都会区工业物流、多户住宅、零售商业及办公资产的教学承销假设区间、多县税基重估及完整财务测算算例。',
      overview:
        '达拉斯-沃斯堡（DFW Metroplex）是北美重要的内陆交通物流枢纽与企业运营中心。由于都会区横跨多个县且外环高速沿线可开发土地充裕，承销模型需同时考量租户需求、新增建设供给与各县年度房产税重估。本页所有区间均为教学建模假设，不代表实时市场成交报价。',
      economicDrivers: [
        { title: '北美内陆核心物流网络', desc: '围绕 DFW 国际机场与多条州际公路、货运铁路交汇点，支撑区域与全国级物流配送中心。' },
        { title: '多元化企业总部就业基础', desc: '金融服务、通信、国防工业与医疗健康产业带动科林县（Collin）、丹顿县（Denton）及塔兰特县人口增长。' },
        { title: '高频房产税评估重估机制', desc: '达拉斯县（DCAD）、塔兰特县（TAD）与科林县（CCAD）评估机构定期将商业物业估值向市场成交价对齐。' },
      ],
      benchmarks: [
        { type: 'Industrial 工业与仓储物流', classARange: '5.40% - 5.95% (示例)', classBRange: '6.15% - 6.75% (示例)', trend: '核心物流枢纽', notes: '重点测算租约到期重签及屋顶/重卡停车场结构储备金。' },
        { type: 'Multifamily 多户住宅公寓', classARange: '5.25% - 5.80% (示例)', classBRange: '6.00% - 6.70% (示例)', trend: '南北子市场分化', notes: '需计入冰雹/强风财产险免赔额及过户房产税重置。' },
        { type: 'Retail 社区生鲜与街区商业', classARange: '5.60% - 6.20% (示例)', classBRange: '6.40% - 7.15% (示例)', trend: '郊区家庭增长', notes: 'Frisco、McKinney 与沃斯堡郊区社区服务型零售稳定。' },
        { type: 'Office 商务与郊区办公楼', classARange: '7.25% - 8.25% (示例)', classBRange: '8.50% - 10.00%+ (示例)', trend: '品质分化显著', notes: '老旧郊区办公楼需预留较高装修改造补贴与招租佣金。' },
      ],
      underwritingExample: {
        title: '实操测算案例：DFW 机场周边多租户工业仓（150,000 平方英尺）',
        scenario: '假设您正在对 DFW 国际机场物流走廊一处 150,000 可租平方英尺多租户工业配送中心进行承销建模（含明确储备金与摊销贷款假设）：',
        price: `$${DAL_PRICE.toLocaleString()}`,
        noi: `$${DAL_NOI.toLocaleString()}`,
        capRate: `${DAL_CAP_RATE.toFixed(2)}%`,
        points: [
          `购买价格: $${DAL_PRICE.toLocaleString()}（折合每平方英尺 $123.33）| 过户交割成本 (2.0%): $${DAL_CLOSING_COSTS.toLocaleString()}`,
          `合同基础 NNN 年租金: $${DAL_BASE_RENT.toLocaleString()} / 年（$7.50 / 平方英尺 NNN；房产税、保险与 CAM 由租户报销）`,
          `空置准备金与屋顶/场地结构储备金: -$${DAL_VACANCY_AND_RESERVES.toLocaleString()} / 年`,
          `净营业收入 (NOI): $${DAL_NOI.toLocaleString()} → 无杠杆 Cap Rate = $${DAL_NOI.toLocaleString()} ÷ $${DAL_PRICE.toLocaleString()} = ${DAL_CAP_RATE.toFixed(2)}%`,
          `融资假设: 65% LTV（贷款额 $${DAL_LOAN_AMOUNT.toLocaleString()}，首付 $${DAL_DOWN_PAYMENT.toLocaleString()}，含过户费总投入现金 $${DAL_TOTAL_CASH.toLocaleString()}），固定年利率 ${DAL_RATE.toFixed(2)}%，${DAL_AMORT} 年等额本息摊销`,
          `年还贷总额 (Annual Debt Service): $${DAL_ADS.toLocaleString()}/年（年度贷款常数 = ${DAL_DEBT_CONSTANT.toFixed(2)}%）→ DSCR = ${DAL_DSCR.toFixed(2)}x | 税前净现金流 = $${DAL_PRETAX_CF.toLocaleString()}/年`,
        ],
        analysis: `承销结论：由于 ${DAL_AMORT} 年等额本息的年度贷款常数（${DAL_DEBT_CONSTANT.toFixed(2)}%）高于 ${DAL_CAP_RATE.toFixed(2)}% 的初始 Cap Rate，按含过户费的总投入现金（$${DAL_TOTAL_CASH.toLocaleString()}）计算，首年现金回报率（Cash-on-Cash Return）为 ${DAL_COC.toFixed(2)}%（DSCR 为 ${DAL_DSCR.toFixed(2)}x）。该案例的长期收益增长依赖合同每年 3.5% 的租金递增及到期重签至市场价，而非首年正杠杆。`,
      },
      localRisks: [
        '北德州春季冰雹与强风暴频发，推高了商业物业保险保费及屋顶损坏免赔额。',
        '外环高速沿线土地充裕的工业子市场需警惕阶段性投机性新建仓库集中入市。',
      ],
      faqs: [
        {
          question: '本页所列的达拉斯 (DFW) Cap Rate 区间是实时行情吗？',
          answer:
            '不是。本页所有 Cap Rate 区间与算例均为用于商业地产财务建模教学的示例假设。投资决策前请核实标的所在子市场的近期可比成交与各县税率。',
        },
        {
          question: '为什么 5.80% Cap Rate 物业使用 5.60% 利率贷款，首年现金回报率是 3.57%？',
          answer:
            '因为 30 年等额本息还款包含本金摊销，年度贷款常数为 6.89%（高于 5.80% Cap Rate）。扣除全额本息还款并计入 2.0% 过户成本后，首年税前 Cash-on-Cash 回报率为 3.57%。',
        },
        {
          question: '收购达拉斯商业地产时应如何测算房产税？',
          answer:
            '达拉斯、塔兰特与科林县评估区会定期重估商业资产价值，审慎的承销模型通常按购买价格的 85%–95% 乘以当地综合税率来测算过户后的房产税。',
        },
      ],
    },
    'phoenix-az-cap-rates': {
      slug: 'phoenix-az-cap-rates',
      cityName: '凤凰城 (Phoenix)',
      state: 'AZ',
      marketTier: '美西南先进制造与物流枢纽 (教学承销案例)',
      metaTitle: '亚利桑那州凤凰城 (Phoenix) Cap Rate 承销指南 | 商业地产建模算例',
      metaDescription:
        '查看亚利桑那州凤凰城（Phoenix）工业物流、多户住宅、自助仓储及零售物业的教学示例 Cap Rate 承销区间与马里科帕县尽调要点。',
      h1: '亚利桑那州凤凰城 (Phoenix, AZ) 商业地产 Cap Rate 承销案例与指南',
      subtitle:
        '针对大凤凰城都会区（Valley of the Sun）工业仓储、多户住宅、自助仓储及零售商业的教学承销假设区间与财务建模算例。',
      overview:
        '大凤凰城都会区依托 I-10 州际公路、Loop 303 与 Loop 202 环线，成为美国西南地区重要的物流分拨、先进制造与人口流入走廊。本页所列各业态 Cap Rate 区间均为教学承销建模假设，不代表实时市场成交报价或机构指数。',
      economicDrivers: [
        { title: '先进制造与供应链走廊', desc: '北凤凰城与东谷（East Valley）的半导体及配套供应链设厂带动工业厂房与员工租住需求。' },
        { title: '南加州港口内陆分拨通道', desc: '通过 I-10 高速直接连接洛杉矶港与长滩港，西谷（West Valley）成为区域大型物流仓聚集区。' },
        { title: '人口流入与社区商业消费', desc: '持续的家庭与退休人口迁入支撑社区生鲜零售、医疗办公楼及温控自助仓储需求。' },
      ],
      benchmarks: [
        { type: 'Industrial 工业与高标物流仓', classARange: '5.50% - 6.15% (示例)', classBRange: '6.30% - 7.00% (示例)', trend: '关注供电与新增供给', notes: '需核查工业配电容量、净层高及 Loop 303 沿线新建供给消化。' },
        { type: 'Multifamily 多户住宅公寓', classARange: '5.35% - 5.85% (示例)', classBRange: '6.15% - 6.85% (示例)', trend: '关注免租期与能耗', notes: '需计入夏季高温空调公共能耗与新建公寓去化周期。' },
        { type: 'Self-Storage 自助仓储设施', classARange: '5.85% - 6.50% (示例)', classBRange: '6.65% - 7.35% (示例)', trend: '区分经济入住率', notes: '重点对比网站挂牌租金与实际实收经济入住率。' },
        { type: 'Retail 社区与生鲜零售中心', classARange: '5.75% - 6.40% (示例)', classBRange: '6.60% - 7.35% (示例)', trend: '成熟社区稳健', notes: 'Scottsdale、Chandler 与 Gilbert 社区消费能力较强。' },
      ],
      underwritingExample: {
        title: '实操测算案例：西谷（West Valley）现代化物流仓（110,000 平方英尺）',
        scenario: '假设您正在评估一处位于 Glendale / Loop 303 工业走廊的 110,000 可租平方英尺单租户 NNN 物流仓库：',
        price: '$15,400,000',
        noi: '$924,000',
        capRate: '6.00%',
        points: [
          '购买价格: $15,400,000（折合每平方英尺 $140.00）',
          '合同基础 NNN 年租金: $8.75 / 平方英尺 NNN = $962,500 / 年',
          '空置准备金与屋顶/大型空调设备结构储备金: -$38,500 / 年',
          '稳定期净营业收入 (NOI): $924,000 → 无杠杆 Cap Rate = $924,000 ÷ $15,400,000 = 6.00%',
        ],
        analysis:
          '承销结论：在 6.00% 的无杠杆 Cap Rate 示例下，尽调仍需重点核查租户财务报表、厂房电力负荷规格，并为长期暴露在极端夏季高温下的屋顶空调机组与防水涂层预留充足的更换储备金。',
      },
      localRisks: [
        '重工业与制造项目需针对具体地块核查长期水权配额（Water Rights）与高负荷电力接入能力。',
        '夏季极端高温会缩短屋顶空调（HVAC）与屋面涂层寿命，并推高公共区域电力开支。',
      ],
      faqs: [
        {
          question: '本页所列的凤凰城 Cap Rate 区间是实时市场数据吗？',
          answer:
            '不是。本页所有 Cap Rate 区间与算例均为用于财务建模教学的示例假设。实际交易请核查马里科帕县（Maricopa County）近期真实可比成交。',
        },
        {
          question: '评估凤凰城商业地产时应重点预留哪些资本性支出（CapEx）储备？',
          answer:
            '由于夏季气温常超过 110°F（43°C），屋顶空调机组（HVAC）和屋面反光防水涂层的折旧速度明显快于温和气候区，承销时需提高年度设备更换储备标准。',
        },
        {
          question: '亚利桑那州商业地产的房产税评估机制有什么特点？',
          answer:
            '亚利桑那州采用全现金价值（Full Cash Value）与受限物业价值（Limited Property Value）双轨制，并按物业法定分类适用不同评估比例。尽调时请向马里科帕县评估官办公室核实具体税单。',
        },
      ],
    },
  },
  es: {
    'austin-tx-cap-rates': {
      slug: 'austin-tx-cap-rates',
      cityName: 'Austin',
      state: 'TX',
      marketTier: 'Metrópoli Tecnológica Tier-2 (Caso Ilustrativo)',
      metaTitle: 'Escenarios de Cap Rate en Austin, TX | Guía de Evaluación CRE',
      metaDescription:
        'Explore escenarios ilustrativos de Cap Rate para bienes raíces comerciales en Austin, Texas: modelos multifamiliares, industriales, comerciales y de oficinas.',
      h1: 'Escenarios de Evaluación de Cap Rate Comercial en Austin, TX',
      subtitle:
        'Rangos ilustrativos de tasas de capitalización, factores económicos regionales y ejemplos paso a paso de modelado financiero para el área metropolitana de Austin.',
      overview:
        'Austin, Texas se analiza frecuentemente como un mercado de alto crecimiento en el Sunbelt donde las reubicaciones corporativas y la expansión demográfica conviven con ciclos de nueva construcción y altos impuestos sobre la propiedad. Todos los rangos de Cap Rate a continuación son supuestos ilustrativos de evaluación para educación financiera y no cotizaciones de corretaje en vivo.',
      economicDrivers: [
        { title: 'Base de Empleo Tecnológico y Corporativo', desc: 'Los empleadores tecnológicos y manufactureros en el suroeste y norte de Austin y el corredor SH-130 impulsan la absorción residencial e industrial.' },
        { title: 'Estructura Fiscal sin Impuesto Estatal sobre la Renta', desc: 'Texas financia los servicios locales mediante impuestos prediales, convirtiendo el reavalúo fiscal post-venta en una variable crítica de evaluación.' },
        { title: 'Expansión de Corredores Suburbanos', desc: 'El crecimiento poblacional en los condados de Williamson y Hays sostiene la demanda de comercio vecinal y bodegas logísticas.' },
      ],
      benchmarks: [
        { type: 'Multifamiliar (Apartamentos)', classARange: '5.25% - 5.75% (Ilust.)', classBRange: '6.00% - 6.65% (Ilust.)', trend: 'Sensible a Oferta', notes: 'Modele concesiones de renta y reavalúos fiscales de TCAD tras la compra.' },
        { type: 'Industrial y Logística', classARange: '5.50% - 6.10% (Ilust.)', classBRange: '6.25% - 6.85% (Ilust.)', trend: 'Enfoque en NNN', notes: 'Evalúe altura libre y puertas de carga en los corredores I-35 y SH-130.' },
        { type: 'Retail (Vecinal y NNN)', classARange: '5.65% - 6.25% (Ilust.)', classBRange: '6.50% - 7.20% (Ilust.)', trend: 'Demanda Suburbana', notes: 'Verifique la relación renta-ventas del inquilino y límites de CAM.' },
        { type: 'Oficinas Suburbanas', classARange: '7.50% - 8.50% (Ilust.)', classBRange: '8.75% - 10.00%+ (Ilust.)', trend: 'Altas Reservas TI', notes: 'Incluya reservas conservadoras para vacancia y mejoras para inquilinos (TI).' },
      ],
      underwritingExample: {
        title: 'Caso Práctico: Multifamiliar Clase B en el Norte de Austin (84 Unidades)',
        scenario: 'Evaluación ilustrativa de un complejo de apartamentos de 84 unidades en el norte de Austin con supuestos explícitos de gastos, reservas y deuda amortizable:',
        price: `$${AUS_PRICE.toLocaleString()}`,
        noi: `$${AUS_NOI.toLocaleString()}`,
        capRate: `${AUS_CAP_RATE.toFixed(2)}%`,
        points: [
          `Precio de Compra: $${AUS_PRICE.toLocaleString()} ($169,048 / unidad) | Costos de Cierre (2.0%): $${AUS_CLOSING_COSTS.toLocaleString()}`,
          `Ingreso Bruto Efectivo (EGI tras vacancia y concesiones): $${AUS_EGI.toLocaleString()} / año`,
          `Gastos Operativos y Reservas de Reemplazo (impuestos reevaluados, seguros, gestión y reserva anual de $25,200 / $300 por unidad): -$${AUS_OPEX.toLocaleString()} (49.98% del EGI)`,
          `Ingreso Operativo Neto (NOI): $${AUS_NOI.toLocaleString()} → Cap Rate sin deuda = $${AUS_NOI.toLocaleString()} ÷ $${AUS_PRICE.toLocaleString()} = ${AUS_CAP_RATE.toFixed(2)}%`,
          `Supuestos de Financiamiento: 65% LTV (préstamo de $${AUS_LOAN_AMOUNT.toLocaleString()}, entrada de $${AUS_DOWN_PAYMENT.toLocaleString()}, capital total invertido de $${AUS_TOTAL_CASH.toLocaleString()}), interés fijo de ${AUS_RATE.toFixed(2)}%, amortización constante a ${AUS_AMORT} años`,
          `Servicio Anual de la Deuda: $${AUS_ADS.toLocaleString()}/año (constante anual de deuda = ${AUS_DEBT_CONSTANT.toFixed(2)}%) → DSCR = ${AUS_DSCR.toFixed(2)}x | Flujo de Caja Antes de Impuestos = $${AUS_PRETAX_CF.toLocaleString()}/año`,
        ],
        analysis: `Conclusión del Análisis: Aunque la tasa de interés nominal (${AUS_RATE.toFixed(2)}%) es menor que el Cap Rate (${AUS_CAP_RATE.toFixed(2)}%), la constante anual de la deuda amortizable a ${AUS_AMORT} años es ${AUS_DEBT_CONSTANT.toFixed(2)}% debido al pago mensual de principal. Sobre $${AUS_TOTAL_CASH.toLocaleString()} de capital total invertido (entrada más 2.0% de cierre), el retorno Cash-on-Cash del Año 1 es ${AUS_COC.toFixed(2)}% con un DSCR de ${AUS_DSCR.toFixed(2)}x.`,
      },
      localRisks: [
        'Los reavalúos de impuestos prediales en los condados de Travis y Williamson pueden incrementar sustancialmente los gastos operativos tras la adquisición.',
        'Los submercados con alta entrega de apartamentos nuevos requieren supuestos conservadores de vacancia y concesiones.',
      ],
      faqs: [
        {
          question: '¿Los rangos de Cap Rate de Austin en esta página son cotizaciones de mercado en vivo?',
          answer:
            'No. Todos los rangos y ejemplos numéricos en esta página son supuestos ilustrativos de evaluación para educación financiera. Verifique siempre las ventas comparables locales y los registros fiscales del condado.',
        },
        {
          question: '¿Cómo afectan los impuestos prediales de Texas a los Cap Rates en Austin?',
          answer:
            'Texas no tiene impuesto estatal sobre la renta y depende en gran medida de los impuestos locales sobre la propiedad (a menudo 2.0% a 2.5% del valor tasado). Los compradores deben modelar el reavalúo posterior a la compraventa.',
        },
        {
          question: '¿Por qué un préstamo al 5.75% en una propiedad con Cap Rate del 6.20% produce un Cash-on-Cash del 4.45%?',
          answer:
            'Porque un préstamo amortizable a 30 años exige pagos de intereses y principal, generando una constante anual de deuda del 7.00% (> 6.20% de Cap Rate). Sumando el 2.0% de costos de cierre, el retorno Cash-on-Cash del Año 1 es 4.45%.',
        },
      ],
    },
    'miami-fl-cap-rates': {
      slug: 'miami-fl-cap-rates',
      cityName: 'Miami',
      state: 'FL',
      marketTier: 'Metrópoli Costera Internacional (Caso Ilustrativo)',
      metaTitle: 'Escenarios de Cap Rate en Miami, FL | Guía CRE del Sur de Florida',
      metaDescription:
        'Explore escenarios ilustrativos de Cap Rate para bienes raíces comerciales en Miami y el Sur de Florida: multifamiliar, retail, industrial y oficinas.',
      h1: 'Escenarios de Evaluación de Cap Rate Comercial en Miami, FL',
      subtitle:
        'Rangos ilustrativos de tasas de capitalización, análisis de seguros costeros y reavalúos fiscales, y ejemplos prácticos para los condados de Miami-Dade y Broward.',
      overview:
        'Delimitado por el Océano Atlántico y los Everglades, el Sur de Florida combina restricciones geográficas de terreno con altos costos de seguros contra tormentas de viento y reavalúos de impuestos prediales tras la venta. Todos los rangos a continuación son supuestos ilustrativos de evaluación con fines educativos y no cotizaciones de mercado en vivo.',
      economicDrivers: [
        { title: 'Restricciones Geográficas de Suelo', desc: 'Los límites naturales del océano y los humedales restringen el desarrollo de suelo nuevo en Miami-Dade y Broward.' },
        { title: 'Comercio Internacional y Logística Portuaria', desc: 'El Aeropuerto Internacional de Miami y PortMiami sostienen la demanda de bodegas y almacenamiento en frío en Doral y Medley.' },
        { title: 'Sensibilidad a Seguros Costeros y Reajuste Fiscal', desc: 'Las primas de seguro contra viento y la eliminación del tope anual del 10% en el avalúo fiscal al vender impactan directamente el NOI.' },
      ],
      benchmarks: [
        { type: 'Multifamiliar (Apartamentos)', classARange: '5.00% - 5.50% (Ilust.)', classBRange: '5.75% - 6.40% (Ilust.)', trend: 'Sensible a Seguros', notes: 'Evalúe cotizaciones vinculantes de seguro contra huracanes y reavalúo fiscal.' },
        { type: 'Industrial Urbano y Logística', classARange: '5.25% - 5.80% (Ilust.)', classBRange: '6.00% - 6.60% (Ilust.)', trend: 'Escasez de Suelo', notes: 'Alto valor del terreno industrial en los submercados de Doral, Medley y Hialeah.' },
        { type: 'Retail Vecinal y NNN', classARange: '5.40% - 6.00% (Ilust.)', classBRange: '6.20% - 6.90% (Ilust.)', trend: 'Zonas Densas', notes: 'Verifique el costo total de ocupación del inquilino tras reembolsos NNN.' },
        { type: 'Oficinas Urbanas y Suburbanas', classARange: '6.75% - 7.60% (Ilust.)', classBRange: '8.00% - 9.25% (Ilust.)', trend: 'Enfoque en TI y CapEx', notes: 'Contemple reservas para mejoras de inquilinos y recertificación de 40 años.' },
      ],
      underwritingExample: {
        title: 'Caso Práctico: Centro Comercial Vecinal NNN en Miami-Dade (22,000 Pies Cuadrados)',
        scenario: 'Evaluación ilustrativa de un centro comercial vecinal de 22,000 pies cuadrados rentables en West Miami bajo contratos NNN:',
        price: '$9,600,000',
        noi: '$576,000',
        capRate: '6.00%',
        points: [
          'Precio de Compra: $9,600,000 ($436.36 / pie cuadrado)',
          'Renta Base Anual NNN: $630,000 / año (inquilinos reembolsan impuestos, seguros y CAM)',
          'Provisión por Vacancia y Pérdida Crediticia (5.0%): -$31,500 / año',
          'Reservas Estructurales y de Administración No Reembolsables: -$22,500 / año',
          'Ingreso Operativo Neto (NOI) Estabilizado: $576,000 → Cap Rate sin deuda = $576,000 ÷ $9,600,000 = 6.00%',
        ],
        analysis:
          'Conclusión del Análisis: Aunque los inquilinos reembolsen impuestos y seguros bajo contratos NNN, un aumento fuerte de impuestos prediales y seguros tras la compraventa eleva el costo total de ocupación por pie cuadrado del inquilino, lo que debe contrastarse con sus ventas.',
      },
      localRisks: [
        'Las renovaciones de pólizas contra tormentas con nombre e inundaciones pueden comprimir el NOI si no se cotizan durante la debida diligencia.',
        'Los edificios que cumplen 30 o 40 años en Miami-Dade y Broward requieren reservas obligatorias de recertificación estructural.',
      ],
      faqs: [
        {
          question: '¿Los rangos de Cap Rate de Miami en esta página son cotizaciones de mercado en vivo?',
          answer:
            'No. Todos los rangos y ejemplos en esta página son supuestos ilustrativos de evaluación para modelado financiero educativo. Verifique siempre ventas comparables locales y cotizaciones reales de seguros.',
        },
        {
          question: '¿Cómo afecta el reavalúo de impuestos sobre la propiedad en Florida a los inmuebles comerciales en Miami?',
          answer:
            'Mientras el propietario actual se beneficia de un tope anual del 10% en el aumento del valor evaluado no residencial, una compraventa reajusta el avalúo hacia el nuevo precio de compra, elevando significativamente los impuestos.',
        },
        {
          question: '¿Por qué un propietario NNN debe preocuparse por los aumentos de seguros e impuestos prediales?',
          answer:
            'Porque los inquilinos pagan tanto la renta base como los cargos NNN con los ingresos de su negocio. Si los cargos NNN se disparan, los inquilinos tienen menor margen para absorber aumentos de renta base al renovar.',
        },
      ],
    },
    'dallas-tx-cap-rates': {
      slug: 'dallas-tx-cap-rates',
      cityName: 'Dallas - Fort Worth',
      state: 'TX',
      marketTier: 'Centro Logístico y Corporativo Interior (Caso Ilustrativo)',
      metaTitle: 'Escenarios de Cap Rate en Dallas-Fort Worth | Guía CRE de DFW',
      metaDescription:
        'Explore escenarios ilustrativos de Cap Rate y ejemplos prácticos de evaluación financiera para activos industriales, multifamiliares y comerciales en Dallas-Fort Worth (DFW).',
      h1: 'Escenarios de Evaluación de Cap Rate Comercial en Dallas-Fort Worth (DFW)',
      subtitle:
        'Rangos ilustrativos de tasas de capitalización, verificaciones de reavalúos fiscales por condado y ejemplos paso a paso para el Metroplex de DFW.',
      overview:
        'El Metroplex de Dallas-Fort Worth funciona como un centro neurálgico de distribución, transporte y operaciones corporativas en Norteamérica. Dado que abarca múltiples condados con abundante terreno desarrollable en anillos periféricos, los modelos financieros deben equilibrar la demanda de inquilinos frente a la nueva oferta y los reavalúos fiscales anuales. Todos los rangos a continuación son supuestos ilustrativos de modelado y no cotizaciones en vivo.',
      economicDrivers: [
        { title: 'Red Logística Interior Central', desc: 'La convergencia de autopistas interestatales y ferrocarriles de carga alrededor del Aeropuerto DFW respalda centros de distribución regionales y nacionales.' },
        { title: 'Base Corporativa Diversificada', desc: 'Empleadores de servicios financieros, telecomunicaciones, defensa y salud impulsan el crecimiento en los condados de Collin, Denton y Tarrant.' },
        { title: 'Distritos de Tasación Activos por Condado', desc: 'Los distritos de tasación de Dallas (DCAD), Tarrant (TAD) y Collin (CCAD) actualizan periódicamente los valores fiscales comerciales.' },
      ],
      benchmarks: [
        { type: 'Industrial y Distribución', classARange: '5.40% - 5.95% (Ilust.)', classBRange: '6.15% - 6.75% (Ilust.)', trend: 'Eje Logístico', notes: 'Modele renovación de contratos y reservas de techo/pavimento en corredores I-20 y DFW.' },
        { type: 'Multifamiliar (Apartamentos)', classARange: '5.25% - 5.80% (Ilust.)', classBRange: '6.00% - 6.70% (Ilust.)', trend: 'Diferencial por Zona', notes: 'Contemple deducibles de seguro por granizo/viento y reajustes fiscales.' },
        { type: 'Retail de Supermercados y Vecinal', classARange: '5.60% - 6.20% (Ilust.)', classBRange: '6.40% - 7.15% (Ilust.)', trend: 'Expansión Suburbana', notes: 'Comercio de servicios vecinales en Frisco, McKinney y Fort Worth.' },
        { type: 'Oficinas (Uptown y Suburbios)', classARange: '7.25% - 8.25% (Ilust.)', classBRange: '8.50% - 10.00%+ (Ilust.)', trend: 'Vuelo a la Calidad', notes: 'Los edificios suburbanos antiguos requieren altas reservas de TI y comisiones.' },
      ],
      underwritingExample: {
        title: 'Caso Práctico: Nave Industrial cerca del Aeropuerto DFW (150,000 Pies Cuadrados)',
        scenario: 'Evaluación ilustrativa de un edificio industrial multiinquilino de 150,000 pies cuadrados cerca del Aeropuerto DFW con supuestos explícitos de reservas y deuda amortizable:',
        price: `$${DAL_PRICE.toLocaleString()}`,
        noi: `$${DAL_NOI.toLocaleString()}`,
        capRate: `${DAL_CAP_RATE.toFixed(2)}%`,
        points: [
          `Precio de Compra: $${DAL_PRICE.toLocaleString()} ($123.33 / pie cuadrado) | Costos de Cierre (2.0%): $${DAL_CLOSING_COSTS.toLocaleString()}`,
          `Renta Base Anual Contractual NNN: $${DAL_BASE_RENT.toLocaleString()} / año ($7.50 / pie cuadrado NNN; impuestos, seguros y CAM reembolsados)`,
          `Provisión por Vacancia y Reserva Estructural de Techo/Pavimento: -$${DAL_VACANCY_AND_RESERVES.toLocaleString()} / año`,
          `Ingreso Operativo Neto (NOI): $${DAL_NOI.toLocaleString()} → Cap Rate sin deuda = $${DAL_NOI.toLocaleString()} ÷ $${DAL_PRICE.toLocaleString()} = ${DAL_CAP_RATE.toFixed(2)}%`,
          `Supuestos de Financiamiento: 65% LTV (préstamo de $${DAL_LOAN_AMOUNT.toLocaleString()}, entrada de $${DAL_DOWN_PAYMENT.toLocaleString()}, capital total invertido de $${DAL_TOTAL_CASH.toLocaleString()}), interés fijo de ${DAL_RATE.toFixed(2)}%, amortización constante a ${DAL_AMORT} años`,
          `Servicio Anual de la Deuda: $${DAL_ADS.toLocaleString()}/año (constante anual de deuda = ${DAL_DEBT_CONSTANT.toFixed(2)}%) → DSCR = ${DAL_DSCR.toFixed(2)}x | Flujo de Caja Antes de Impuestos = $${DAL_PRETAX_CF.toLocaleString()}/año`,
        ],
        analysis: `Conclusión del Análisis: Dado que la constante anual de la deuda amortizable a ${DAL_AMORT} años (${DAL_DEBT_CONSTANT.toFixed(2)}%) supera el Cap Rate inicial del ${DAL_CAP_RATE.toFixed(2)}%, el retorno Cash-on-Cash del Año 1 sobre $${DAL_TOTAL_CASH.toLocaleString()} de capital total invertido es ${DAL_COC.toFixed(2)}% (DSCR ${DAL_DSCR.toFixed(2)}x). La expansión del retorno en este escenario depende de los escalamientos anuales del 3.5% y la renovación de contratos a precios de mercado, no de un apalancamiento positivo inicial.`,
      },
      localRisks: [
        'La exposición a tormentas severas y granizo en el norte de Texas ha elevado las primas de seguro comercial y los deducibles de techo.',
        'Los submercados industriales periféricos con abundante suelo pueden experimentar olas rápidas de construcción especulativa.',
      ],
      faqs: [
        {
          question: '¿Los rangos de Cap Rate de DFW en esta página son cotizaciones de mercado en vivo?',
          answer:
            'No. Todos los rangos y ejemplos numéricos en esta página son supuestos ilustrativos de evaluación para modelado financiero educativo. Verifique siempre ventas comparables locales y registros fiscales.',
        },
        {
          question: '¿Por qué una hipoteca al 5.60% en una propiedad con Cap Rate del 5.80% genera un Cash-on-Cash del 3.57% en el Año 1?',
          answer:
            'Porque un préstamo amortizable a 30 años incluye pago de principal, lo que sitúa la constante anual de deuda en 6.89% (> 5.80% de Cap Rate). Tras descontar el servicio total de deuda e incluir el 2.0% de costos de cierre, el Cash-on-Cash del Año 1 es 3.57%.',
        },
        {
          question: '¿Cómo deben modelarse los impuestos prediales en DFW al adquirir una propiedad?',
          answer:
            'Los distritos de tasación de los condados de Dallas, Tarrant y Collin reevalúan activamente los inmuebles comerciales. Los analistas prudentes proyectan los impuestos entre el 85% y el 95% del precio de compra multiplicado por la tasa impositiva local.',
        },
      ],
    },
    'phoenix-az-cap-rates': {
      slug: 'phoenix-az-cap-rates',
      cityName: 'Phoenix',
      state: 'AZ',
      marketTier: 'Metrópoli de Manufactura y Logística del Suroeste (Caso Ilustrativo)',
      metaTitle: 'Escenarios de Cap Rate en Phoenix, AZ | Guía de Modelado CRE',
      metaDescription:
        'Explore escenarios ilustrativos de Cap Rate para bienes raíces comerciales en Phoenix, Arizona: modelos industriales, multifamiliares, self-storage y retail.',
      h1: 'Escenarios de Evaluación de Cap Rate Comercial en Phoenix, AZ',
      subtitle:
        'Rangos ilustrativos de tasas de capitalización, factores de evaluación en el Condado de Maricopa y ejemplos de modelado financiero para el Gran Phoenix.',
      overview:
        'El área metropolitana de Phoenix (Valley of the Sun) es un corredor clave de logística, manufactura avanzada y crecimiento residencial en el suroeste de EE. UU., conectado por la I-10, Loop 303 y Loop 202. Todos los rangos de Cap Rate a continuación son supuestos ilustrativos de evaluación con fines educativos y no cotizaciones de corretaje en vivo.',
      economicDrivers: [
        { title: 'Corredores de Manufactura Avanzada y Logística', desc: 'Las plantas de semiconductores y proveedores a lo largo de Loop 303 y en el East Valley impulsan la demanda industrial y residencial.' },
        { title: 'Conectividad de Carga con el Sur de California', desc: 'La autopista I-10 conecta directamente los centros de distribución del West Valley con los puertos de Los Ángeles y Long Beach.' },
        { title: 'Crecimiento Demográfico y de Hogares', desc: 'El flujo poblacional sostiene centros comerciales con supermercados, consultorios médicos e instalaciones de autoalmacenamiento climatizado.' },
      ],
      benchmarks: [
        { type: 'Industrial y Logística', classARange: '5.50% - 6.15% (Ilust.)', classBRange: '6.30% - 7.00% (Ilust.)', trend: 'Oferta y Absorción', notes: 'Evalúe capacidad eléctrica, altura libre y oferta nueva en Loop 303.' },
        { type: 'Multifamiliar (Apartamentos)', classARange: '5.35% - 5.85% (Ilust.)', classBRange: '6.15% - 6.85% (Ilust.)', trend: 'Modelado de Concesiones', notes: 'Contemple costos eléctricos de climatización en verano y absorción de nuevas entregas.' },
        { type: 'Autoalmacenamiento (Self-Storage)', classARange: '5.85% - 6.50% (Ilust.)', classBRange: '6.65% - 7.35% (Ilust.)', trend: 'Ocupación Económica', notes: 'Compare tarifas web publicadas frente a la ocupación económica efectivamente cobrada.' },
        { type: 'Retail Suburbano y Supermercados', classARange: '5.75% - 6.40% (Ilust.)', classBRange: '6.60% - 7.35% (Ilust.)', trend: 'Corredores Suburbanos', notes: 'Sólidos indicadores demográficos en áreas comerciales de Scottsdale, Chandler y Gilbert.' },
      ],
      underwritingExample: {
        title: 'Caso Práctico: Bodega Logística en West Valley (110,000 Pies Cuadrados)',
        scenario: 'Evaluación de una nave de distribución ilustrativa de 110,000 pies cuadrados en el corredor Glendale / Loop 303 bajo contrato NNN:',
        price: '$15,400,000',
        noi: '$924,000',
        capRate: '6.00%',
        points: [
          'Precio de Compra: $15,400,000 ($140.00 / pie cuadrado)',
          'Renta Base Anual Contractual: $8.75 / pie cuadrado NNN = $962,500 / año',
          'Provisión por Vacancia y Reservas Estructurales de Techo/Climatización: -$38,500 / año',
          'Ingreso Operativo Neto (NOI) Estabilizado: $924,000 → Cap Rate sin deuda = $924,000 ÷ $15,400,000 = 6.00%',
        ],
        analysis:
          'Conclusión del Análisis: Con un Cap Rate sin deuda ilustrativo del 6.00%, los analistas verifican además la solvencia del inquilino, la capacidad eléctrica del inmueble y las reservas de reemplazo para equipos de aire acondicionado expuestos al calor extremo del verano.',
      },
      localRisks: [
        'Las normativas de asignación hídrica y la capacidad eléctrica requieren verificación específica por lote en proyectos industriales.',
        'Las temperaturas extremas de verano acortan la vida útil de los equipos HVAC de techo y elevan los gastos eléctricos de áreas comunes.',
      ],
      faqs: [
        {
          question: '¿Los rangos de Cap Rate de Phoenix en esta página son cotizaciones de mercado en vivo?',
          answer:
            'No. Todos los rangos y ejemplos en esta página son supuestos ilustrativos de evaluación para modelado financiero educativo. Verifique siempre las ventas comparables locales en el Condado de Maricopa.',
        },
        {
          question: '¿Qué reservas especiales de CapEx deben modelarse en propiedades comerciales de Phoenix?',
          answer:
            'Dado que las temperaturas de verano superan regularmente los 110°F (43°C), las unidades HVAC de techo y los recubrimientos impermeables sufren desgaste acelerado, exigiendo reservas anuales de reemplazo más conservadoras.',
        },
        {
          question: '¿Cómo funciona la tasación de impuestos prediales comerciales en Arizona?',
          answer:
            'Arizona utiliza un sistema de doble valor (Full Cash Value y Limited Property Value, con porcentajes de evaluación legales según la clase de propiedad). Verifique siempre la clasificación fiscal ante el Tasador del Condado de Maricopa.',
        },
      ],
    },
  },
  pt: {
    'austin-tx-cap-rates': {
      slug: 'austin-tx-cap-rates',
      cityName: 'Austin',
      state: 'TX',
      marketTier: 'Metrópole Tecnológica Tier-2 (Caso Ilustrativo)',
      metaTitle: 'Cenários de Cap Rate em Austin, TX | Guia de Análise CRE',
      metaDescription:
        'Explore cenários ilustrativos de Cap Rate para imóveis comerciais em Austin, Texas: modelos multifamiliares, industriais, de varejo e escritórios.',
      h1: 'Cenários de Análise de Cap Rate Comercial em Austin, TX',
      subtitle:
        'Faixas ilustrativas de taxas de capitalização, vetores econômicos regionais e exemplos passo a passo de modelagem financeira para a região metropolitana de Austin.',
      overview:
        'Austin, Texas é amplamente estudada como um mercado de alto crescimento no Sunbelt norte-americano, onde realocações corporativas e expansão demográfica coexistem com ciclos de entrega de novas obras e elevados impostos prediais. Todas as faixas de Cap Rate abaixo são premissas ilustrativas de análise para educação financeira e não cotações de corretagem em tempo real.',
      economicDrivers: [
        { title: 'Base de Emprego Tecnológico e Corporativo', desc: 'Empregadores de tecnologia e manufatura no sudoeste e norte de Austin e no corredor SH-130 impulsionam a absorção residencial e logística.' },
        { title: 'Estrutura Tributária sem Imposto de Renda Estadual', desc: 'O Texas financia serviços locais por meio de impostos prediais, tornando a reavaliação fiscal pós-venda uma variável essencial na análise.' },
        { title: 'Expansão de Corredores Suburbanos', desc: 'O crescimento populacional nos condados de Williamson e Hays sustenta a demanda por varejo de vizinhança e galpões logísticos.' },
      ],
      benchmarks: [
        { type: 'Multifamiliar (Apartamentos)', classARange: '5.25% - 5.75% (Ilust.)', classBRange: '6.00% - 6.65% (Ilust.)', trend: 'Sensível à Oferta', notes: 'Modele concessões de aluguel e reavaliações fiscais do TCAD após a compra.' },
        { type: 'Industrial e Logística', classARange: '5.50% - 6.10% (Ilust.)', classBRange: '6.25% - 6.85% (Ilust.)', trend: 'Foco em NNN', notes: 'Avalie pé-direito livre e docas nos corredores I-35 e SH-130.' },
        { type: 'Varejo (Vizinhança e NNN)', classARange: '5.65% - 6.25% (Ilust.)', classBRange: '6.50% - 7.20% (Ilust.)', trend: 'Demanda Suburbana', notes: 'Verifique a relação aluguel-vendas do inquilino e tetos de CAM.' },
        { type: 'Escritórios Suburbanos', classARange: '7.50% - 8.50% (Ilust.)', classBRange: '8.75% - 10.00%+ (Ilust.)', trend: 'Altas Reservas TI', notes: 'Inclua reservas conservadoras para vacância e melhorias para inquilinos (TI).' },
      ],
      underwritingExample: {
        title: 'Exemplo Prático: Multifamiliar Classe B no Norte de Austin (84 Unidades)',
        scenario: 'Análise ilustrativa de um condomínio de apartamentos de 84 unidades no norte de Austin com premissas explícitas de despesas, reservas e financiamento amortizável:',
        price: `$${AUS_PRICE.toLocaleString()}`,
        noi: `$${AUS_NOI.toLocaleString()}`,
        capRate: `${AUS_CAP_RATE.toFixed(2)}%`,
        points: [
          `Preço de Compra: $${AUS_PRICE.toLocaleString()} ($169,048 / unidade) | Custos de Fechamento (2.0%): $${AUS_CLOSING_COSTS.toLocaleString()}`,
          `Receita Bruta Efetiva (EGI após vacância e concessões): $${AUS_EGI.toLocaleString()} / ano`,
          `Despesas Operacionais e Reservas de Reposição (impostos reavaliados, seguros, gestão e reserva anual de $25,200 / $300 por unidade): -$${AUS_OPEX.toLocaleString()} (49.98% do EGI)`,
          `Receita Operacional Líquida (NOI): $${AUS_NOI.toLocaleString()} → Cap Rate desalavancado = $${AUS_NOI.toLocaleString()} ÷ $${AUS_PRICE.toLocaleString()} = ${AUS_CAP_RATE.toFixed(2)}%`,
          `Premissas de Financiamento: 65% LTV (empréstimo de $${AUS_LOAN_AMOUNT.toLocaleString()}, entrada de $${AUS_DOWN_PAYMENT.toLocaleString()}, capital total investido de $${AUS_TOTAL_CASH.toLocaleString()}), juros fixos de ${AUS_RATE.toFixed(2)}%, amortização Price em ${AUS_AMORT} anos`,
          `Serviço Anual da Dívida: $${AUS_ADS.toLocaleString()}/ano (constante anual da dívida = ${AUS_DEBT_CONSTANT.toFixed(2)}%) → DSCR = ${AUS_DSCR.toFixed(2)}x | Fluxo de Caixa Antes de Impostos = $${AUS_PRETAX_CF.toLocaleString()}/ano`,
        ],
        analysis: `Conclusão da Análise: Embora a taxa nominal de juros (${AUS_RATE.toFixed(2)}%) seja menor que o Cap Rate (${AUS_CAP_RATE.toFixed(2)}%), a constante anual da dívida amortizável em ${AUS_AMORT} anos é de ${AUS_DEBT_CONSTANT.toFixed(2)}% devido à amortização mensal do principal. Sobre $${AUS_TOTAL_CASH.toLocaleString()} de capital total investido (entrada mais 2.0% de fechamento), o retorno Cash-on-Cash no Ano 1 é de ${AUS_COC.toFixed(2)}% com DSCR de ${AUS_DSCR.toFixed(2)}x.`,
      },
      localRisks: [
        'As reavaliações de impostos prediais nos condados de Travis e Williamson podem elevar substancialmente as despesas operacionais após a aquisição.',
        'Submercados com grande entrega de novos apartamentos exigem premissas conservadoras de vacância e concessões.',
      ],
      faqs: [
        {
          question: 'As faixas de Cap Rate de Austin nesta página são cotações de mercado em tempo real?',
          answer:
            'Não. Todas as faixas e exemplos numéricos nesta página são premissas ilustrativas de análise para educação financeira. Verifique sempre as vendas comparáveis locais e os registros fiscais do condado.',
        },
        {
          question: 'Como os impostos prediais do Texas afetam os Cap Rates em Austin?',
          answer:
            'O Texas não possui imposto de renda estadual e depende fortemente de impostos prediais locais (geralmente 2.0% a 2.5% do valor venal). Os compradores devem modelar a reavaliação pós-venda em vez de usar a guia histórica do vendedor.',
        },
        {
          question: 'Por que um empréstimo a 5.75% em um imóvel com Cap Rate de 6.20% resulta em Cash-on-Cash de 4.45%?',
          answer:
            'Porque um financiamento amortizável em 30 anos exige pagamento de juros e principal, gerando uma constante anual da dívida de 7.00% (> 6.20% de Cap Rate). Somando os 2.0% de custos de fechamento, o retorno Cash-on-Cash no Ano 1 é de 4.45%.',
        },
      ],
    },
    'miami-fl-cap-rates': {
      slug: 'miami-fl-cap-rates',
      cityName: 'Miami',
      state: 'FL',
      marketTier: 'Metrópole Costeira Internacional (Caso Ilustrativo)',
      metaTitle: 'Cenários de Cap Rate em Miami, FL | Guia CRE do Sul da Flórida',
      metaDescription:
        'Explore cenários ilustrativos de Cap Rate para imóveis comerciais em Miami e no Sul da Flórida: multifamiliar, varejo, industrial e escritórios.',
      h1: 'Cenários de Análise de Cap Rate Comercial em Miami, FL',
      subtitle:
        'Faixas ilustrativas de taxas de capitalização, verificação de seguros costeiros e reavaliação fiscal, e exemplos práticos para os condados de Miami-Dade e Broward.',
      overview:
        'Delimitado pelo Oceano Atlântico e pelos Everglades, o Sul da Flórida combina restrições geográficas de terrenos com elevados custos de seguro contra tempestades de vento e reavaliações de impostos prediais após a venda. Todas as faixas abaixo são premissas ilustrativas de análise para fins educativos e não cotações de mercado em tempo real.',
      economicDrivers: [
        { title: 'Restrições Geográficas de Terrenos', desc: 'Limites naturais do oceano e áreas de preservação restringem novos loteamentos em Miami-Dade e Broward.' },
        { title: 'Comércio Internacional e Logística Portuária', desc: 'O Aeroporto Internacional de Miami e o PortMiami sustentam a demanda por galpões e armazenagem refrigerada em Doral e Medley.' },
        { title: 'Sensibilidade a Seguros Costeiros e Reajuste Fiscal', desc: 'Prêmios de seguro contra vento e a remoção do teto anual de 10% na avaliação fiscal pós-venda impactam diretamente o NOI.' },
      ],
      benchmarks: [
        { type: 'Multifamiliar (Apartamentos)', classARange: '5.00% - 5.50% (Ilust.)', classBRange: '5.75% - 6.40% (Ilust.)', trend: 'Sensível a Seguros', notes: 'Avalie cotações firmes de seguro contra furacões e reavaliação fiscal.' },
        { type: 'Industrial Urbano e Logística', classARange: '5.25% - 5.80% (Ilust.)', classBRange: '6.00% - 6.60% (Ilust.)', trend: 'Escassez de Terrenos', notes: 'Alto custo de terreno industrial nos submercados de Doral, Medley e Hialeah.' },
        { type: 'Varejo de Vizinhança e NNN', classARange: '5.40% - 6.00% (Ilust.)', classBRange: '6.20% - 6.90% (Ilust.)', trend: 'Áreas Densas', notes: 'Verifique o custo total de ocupação do inquilino após repasses NNN.' },
        { type: 'Escritórios Urbanos e Suburbanos', classARange: '6.75% - 7.60% (Ilust.)', classBRange: '8.00% - 9.25% (Ilust.)', trend: 'Foco em TI e CapEx', notes: 'Contemple reservas para melhorias de inquilinos e recertificação de 40 anos.' },
      ],
      underwritingExample: {
        title: 'Exemplo Prático: Centro Comercial de Vizinhança NNN em Miami-Dade (22,000 Pés Quadrados)',
        scenario: 'Análise ilustrativa de um centro comercial de vizinhança de 22,000 pés quadrados locáveis em West Miami sob contratos NNN:',
        price: '$9,600,000',
        noi: '$576,000',
        capRate: '6.00%',
        points: [
          'Preço de Compra: $9,600,000 ($436.36 / pé quadrado)',
          'Receita Base Anual de Aluguel NNN: $630,000 / ano (inquilinos reembolsam impostos, seguros e CAM)',
          'Provisão para Vacância e Inadimplência (5.0%): -$31,500 / ano',
          'Reservas Estruturais e de Administração Não Reembolsáveis: -$22,500 / ano',
          'Receita Operacional Líquida (NOI) Estabilizada: $576,000 → Cap Rate desalavancado = $576,000 ÷ $9,600,000 = 6.00%',
        ],
        analysis:
          'Conclusão da Análise: Mesmo quando os inquilinos reembolsam impostos e seguros sob contratos NNN, um aumento expressivo de impostos prediais e seguros após a compra eleva o custo total de ocupação por pé quadrado do inquilino, o que deve ser confrontado com o faturamento das lojas.',
      },
      localRisks: [
        'Renovações de apólices contra tempestades nomeadas e inundações podem comprimir o NOI se não forem cotadas durante a diligência prévia.',
        'Edifícios que completam 30 ou 40 anos em Miami-Dade e Broward exigem reservas obrigatórias de recertificação estrutural.',
      ],
      faqs: [
        {
          question: 'As faixas de Cap Rate de Miami nesta página são cotações de mercado em tempo real?',
          answer:
            'Não. Todas as faixas e exemplos nesta página são premissas ilustrativas de análise para modelagem financeira educativa. Verifique sempre vendas comparáveis locais e cotações reais de seguros.',
        },
        {
          question: 'Como a reavaliação de impostos prediais na Flórida afeta os imóveis comerciais em Miami?',
          answer:
            'Enquanto o proprietário atual se beneficia de um limite anual de 10% no aumento da avaliação fiscal não residencial, uma venda reajusta o valor venal para perto do novo preço de compra, elevando significativamente os impostos.',
        },
        {
          question: 'Por que um proprietário NNN deve se preocupar com aumentos de seguros e impostos prediais?',
          answer:
            'Porque os inquilinos pagam tanto o aluguel base quanto os encargos NNN com o faturamento do negócio. Se os encargos NNN dispararem, os locatários terão menor margem para absorver reajustes de aluguel base na renovação.',
        },
      ],
    },
    'dallas-tx-cap-rates': {
      slug: 'dallas-tx-cap-rates',
      cityName: 'Dallas - Fort Worth',
      state: 'TX',
      marketTier: 'Polo Logístico e Corporativo Continental (Caso Ilustrativo)',
      metaTitle: 'Cenários de Cap Rate em Dallas-Fort Worth | Guia CRE de DFW',
      metaDescription:
        'Explore cenários ilustrativos de Cap Rate e exemplos práticos de análise financeira para ativos industriais, multifamiliares e de varejo em Dallas-Fort Worth (DFW).',
      h1: 'Cenários de Análise de Cap Rate Comercial em Dallas-Fort Worth (DFW)',
      subtitle:
        'Faixas ilustrativas de taxas de capitalização, verificações de reavaliação fiscal por condado e exemplos passo a passo para o Metroplex de DFW.',
      overview:
        'O Metroplex de Dallas-Fort Worth funciona como um polo central de distribuição, transporte e operações corporativas na América do Norte. Como abrange múltiplos condados com ampla oferta de terrenos nos anéis rodoviários externos, os modelos financeiros devem equilibrar a demanda de inquilinos frente à nova oferta e às reavaliações fiscais anuais. Todas as faixas abaixo são premissas ilustrativas de modelagem e não cotações em tempo real.',
      economicDrivers: [
        { title: 'Rede Logística Continental Central', desc: 'A convergência de rodovias interestaduais e ferrovias de carga ao redor do Aeroporto DFW sustenta centros de distribuição regionais e nacionais.' },
        { title: 'Base Corporativa Diversificada', desc: 'Empregadores de serviços financeiros, telecomunicações, defesa e saúde impulsionam o crescimento nos condados de Collin, Denton e Tarrant.' },
        { title: 'Distritos de Avaliação Fiscal Ativos', desc: 'Os distritos de avaliação de Dallas (DCAD), Tarrant (TAD) e Collin (CCAD) atualizam periodicamente os valores venais comerciais.' },
      ],
      benchmarks: [
        { type: 'Industrial e Distribuição', classARange: '5.40% - 5.95% (Ilust.)', classBRange: '6.15% - 6.75% (Ilust.)', trend: 'Polo Logístico', notes: 'Modele renovação de contratos e reservas de telhado/pátio nos corredores I-20 e DFW.' },
        { type: 'Multifamiliar (Apartamentos)', classARange: '5.25% - 5.80% (Ilust.)', classBRange: '6.00% - 6.70% (Ilust.)', trend: 'Diferencial Regional', notes: 'Contemple franquias de seguro para granizo/vento e reajustes fiscais.' },
        { type: 'Varejo de Supermercados e Vizinhança', classARange: '5.60% - 6.20% (Ilust.)', classBRange: '6.40% - 7.15% (Ilust.)', trend: 'Expansão Suburbana', notes: 'Varejo de serviços essenciais em Frisco, McKinney e Fort Worth.' },
        { type: 'Escritórios (Uptown e Subúrbios)', classARange: '7.25% - 8.25% (Ilust.)', classBRange: '8.50% - 10.00%+ (Ilust.)', trend: 'Busca por Qualidade', notes: 'Edifícios suburbanos antigos exigem altas reservas de TI e comissões.' },
      ],
      underwritingExample: {
        title: 'Exemplo Prático: Galpão Industrial próximo ao Aeroporto DFW (150,000 Pés Quadrados)',
        scenario: 'Análise ilustrativa de um galpão industrial multi-inquilino de 150,000 pés quadrados próximo ao Aeroporto DFW com premissas explícitas de reservas e dívida amortizável:',
        price: `$${DAL_PRICE.toLocaleString()}`,
        noi: `$${DAL_NOI.toLocaleString()}`,
        capRate: `${DAL_CAP_RATE.toFixed(2)}%`,
        points: [
          `Preço de Compra: $${DAL_PRICE.toLocaleString()} ($123.33 / pé quadrado) | Custos de Fechamento (2.0%): $${DAL_CLOSING_COSTS.toLocaleString()}`,
          `Aluguel Base Anual Contratual NNN: $${DAL_BASE_RENT.toLocaleString()} / ano ($7.50 / pé quadrado NNN; impostos, seguros e CAM reembolsados)`,
          `Provisão para Vacância e Reserva Estrutural de Telhado/Pátio: -$${DAL_VACANCY_AND_RESERVES.toLocaleString()} / ano`,
          `Receita Operacional Líquida (NOI): $${DAL_NOI.toLocaleString()} → Cap Rate desalavancado = $${DAL_NOI.toLocaleString()} ÷ $${DAL_PRICE.toLocaleString()} = ${DAL_CAP_RATE.toFixed(2)}%`,
          `Premissas de Financiamento: 65% LTV (empréstimo de $${DAL_LOAN_AMOUNT.toLocaleString()}, entrada de $${DAL_DOWN_PAYMENT.toLocaleString()}, capital total investido de $${DAL_TOTAL_CASH.toLocaleString()}), juros fixos de ${DAL_RATE.toFixed(2)}%, amortização Price em ${DAL_AMORT} anos`,
          `Serviço Anual da Dívida: $${DAL_ADS.toLocaleString()}/ano (constante anual da dívida = ${DAL_DEBT_CONSTANT.toFixed(2)}%) → DSCR = ${DAL_DSCR.toFixed(2)}x | Fluxo de Caixa Antes de Impostos = $${DAL_PRETAX_CF.toLocaleString()}/ano`,
        ],
        analysis: `Conclusão da Análise: Como a constante anual da dívida amortizável em ${DAL_AMORT} anos (${DAL_DEBT_CONSTANT.toFixed(2)}%) supera o Cap Rate inicial de ${DAL_CAP_RATE.toFixed(2)}%, o retorno Cash-on-Cash no Ano 1 sobre $${DAL_TOTAL_CASH.toLocaleString()} de capital total investido é de ${DAL_COC.toFixed(2)}% (DSCR ${DAL_DSCR.toFixed(2)}x). A expansão do retorno neste cenário depende dos reajustes anuais de 3.5% e da renovação dos contratos a preços de mercado, e não de alavancagem positiva inicial.`,
      },
      localRisks: [
        'A exposição a tempestades severas e granizo no norte do Texas elevou os prêmios de seguro comercial e as franquias de telhado.',
        'Submercados industriais periféricos com grande oferta de terrenos podem enfrentar ondas rápidas de construção especulativa.',
      ],
      faqs: [
        {
          question: 'As faixas de Cap Rate de DFW nesta página são cotações de mercado em tempo real?',
          answer:
            'Não. Todas as faixas e exemplos numéricos nesta página são premissas ilustrativas de análise para modelagem financeira educativa. Verifique sempre vendas comparáveis locais e registros fiscais.',
        },
        {
          question: 'Por que um financiamento a 5.60% em um imóvel com Cap Rate de 5.80% gera Cash-on-Cash de 3.57% no Ano 1?',
          answer:
            'Porque um financiamento amortizável em 30 anos inclui pagamento de principal, situando a constante anual da dívida em 6.89% (> 5.80% de Cap Rate). Após descontar o serviço total da dívida e incluir 2.0% de custos de fechamento, o Cash-on-Cash no Ano 1 é de 3.57%.',
        },
        {
          question: 'Como os impostos prediais em DFW devem ser modelados na aquisição de um imóvel?',
          answer:
            'Os distritos de avaliação dos condados de Dallas, Tarrant e Collin reavaliam ativamente os imóveis comerciais. Analistas prudentes projetam os impostos entre 85% e 95% do preço de aquisição multiplicado pela alíquota local.',
        },
      ],
    },
    'phoenix-az-cap-rates': {
      slug: 'phoenix-az-cap-rates',
      cityName: 'Phoenix',
      state: 'AZ',
      marketTier: 'Metrópole de Manufatura e Logística do Sudoeste (Caso Ilustrativo)',
      metaTitle: 'Cenários de Cap Rate em Phoenix, AZ | Guia de Modelagem CRE',
      metaDescription:
        'Explore cenários ilustrativos de Cap Rate para imóveis comerciais em Phoenix, Arizona: modelos industriais, multifamiliares, self-storage e varejo.',
      h1: 'Cenários de Análise de Cap Rate Comercial em Phoenix, AZ',
      subtitle:
        'Faixas ilustrativas de taxas de capitalização, fatores de análise no Condado de Maricopa e exemplos de modelagem financeira para a Grande Phoenix.',
      overview:
        'A região metropolitana de Phoenix (Valley of the Sun) é um corredor estratégico de logística, manufatura avançada e crescimento residencial no sudoeste dos EUA, conectado pelas rodovias I-10, Loop 303 e Loop 202. Todas as faixas de Cap Rate abaixo são premissas ilustrativas de análise para fins educativos e não cotações de corretagem em tempo real.',
      economicDrivers: [
        { title: 'Corredores de Manufatura Avançada e Logística', desc: 'Fábricas de semicondutores e fornecedores ao longo do Loop 303 e no East Valley impulsionam a demanda industrial e residencial.' },
        { title: 'Conectividade de Carga com o Sul da Califórnia', desc: 'A rodovia I-10 conecta diretamente os centros de distribuição do West Valley aos portos de Los Angeles e Long Beach.' },
        { title: 'Crescimento Demográfico e Residencial', desc: 'O fluxo populacional sustenta centros comerciais com supermercados, consultórios médicos e unidades de autoarmazenamento climatizado.' },
      ],
      benchmarks: [
        { type: 'Industrial e Logística', classARange: '5.50% - 6.15% (Ilust.)', classBRange: '6.30% - 7.00% (Ilust.)', trend: 'Oferta e Absorção', notes: 'Avalie capacidade elétrica, pé-direito livre e nova oferta no Loop 303.' },
        { type: 'Multifamiliar (Apartamentos)', classARange: '5.35% - 5.85% (Ilust.)', classBRange: '6.15% - 6.85% (Ilust.)', trend: 'Modelagem de Concessões', notes: 'Contemple custos elétricos de climatização no verão e absorção de novas entregas.' },
        { type: 'Autoarmazenamento (Self-Storage)', classARange: '5.85% - 6.50% (Ilust.)', classBRange: '6.65% - 7.35% (Ilust.)', trend: 'Ocupação Econômica', notes: 'Compare tarifas web anunciadas frente à ocupação econômica efetivamente arrecadada.' },
        { type: 'Varejo Suburbano e Supermercados', classARange: '5.75% - 6.40% (Ilust.)', classBRange: '6.60% - 7.35% (Ilust.)', trend: 'Corredores Suburbanos', notes: 'Sólidos indicadores demográficos nas áreas comerciais de Scottsdale, Chandler e Gilbert.' },
      ],
      underwritingExample: {
        title: 'Exemplo Prático: Galpão Logístico no West Valley (110,000 Pés Quadrados)',
        scenario: 'Avaliação de um galpão de distribuição ilustrativo de 110,000 pés quadrados no corredor Glendale / Loop 303 sob contrato NNN:',
        price: '$15,400,000',
        noi: '$924,000',
        capRate: '6.00%',
        points: [
          'Preço de Compra: $15,400,000 ($140.00 / pé quadrado)',
          'Aluguel Base Anual Contratual: $8.75 / pé quadrado NNN = $962,500 / ano',
          'Provisão para Vacância e Reservas Estruturais de Telhado/Climatização: -$38,500 / ano',
          'Receita Operacional Líquida (NOI) Estabilizada: $924,000 → Cap Rate desalavancado = $924,000 ÷ $15,400,000 = 6.00%',
        ],
        analysis:
          'Conclusão da Análise: Com um Cap Rate desalavancado ilustrativo de 6.00%, os analistas verificam também o crédito do inquilino, a capacidade elétrica do imóvel e as reservas de reposição para sistemas de ar-condicionado expostos ao calor intenso do verão.',
      },
      localRisks: [
        'Regras de alocação hídrica e capacidade elétrica exigem verificação específica por terreno em projetos industriais.',
        'Temperaturas extremas no verão reduzem a vida útil dos equipamentos HVAC de telhado e elevam as despesas elétricas de áreas comuns.',
      ],
      faqs: [
        {
          question: 'As faixas de Cap Rate de Phoenix nesta página são cotações de mercado em tempo real?',
          answer:
            'Não. Todas as faixas e exemplos nesta página são premissas ilustrativas de análise para modelagem financeira educativa. Verifique sempre as vendas comparáveis locais no Condado de Maricopa.',
        },
        {
          question: 'Quais reservas especiais de CapEx devem ser modeladas em imóveis comerciais de Phoenix?',
          answer:
            'Como as temperaturas de verão frequentemente superam 110°F (43°C), os equipamentos HVAC de telhado e revestimentos impermeáveis sofrem desgaste acelerado, exigindo reservas anuais de reposição mais conservadoras.',
        },
        {
          question: 'Como funciona a avaliação de impostos prediais comerciais no Arizona?',
          answer:
            'O Arizona utiliza um sistema de duplo valor (Full Cash Value e Limited Property Value, com percentuais legais de avaliação conforme a classe do imóvel). Verifique sempre a classificação fiscal junto ao Avaliador do Condado de Maricopa.',
        },
      ],
    },
  },
};
