import { calculateLoanDetails, PaymentType } from './loanCalculations';

export interface DealAnalyzerInput {
  purchasePrice: number;
  closingCostsPercent: number; // e.g. 2%
  grossPotentialIncome: number;
  vacancyRate: number; // e.g. 5%
  operatingExpenses: number;
  downPaymentPercent: number; // e.g. 25%
  interestRate: number; // e.g. 6.5%
  amortizationYears: number; // e.g. 25
  paymentType: PaymentType; // 'installment' | 'principal'
  hasBalloon: boolean;
  balloonYears: number;
}

export const DEFAULT_DEAL_INPUT: DealAnalyzerInput = {
  purchasePrice: 2800000,
  closingCostsPercent: 2.0,
  grossPotentialIncome: 336000,
  vacancyRate: 5.0,
  operatingExpenses: 92000,
  downPaymentPercent: 25.0,
  interestRate: 6.5,
  amortizationYears: 25,
  paymentType: 'installment',
  hasBalloon: false,
  balloonYears: 5,
};

export type HealthStatus = 'green' | 'yellow' | 'red';

export interface SingleScenarioResult {
  purchasePrice: number;
  closingCosts: number;
  grossPotentialIncome: number;
  vacancyLoss: number;
  egi: number;
  operatingExpenses: number;
  noi: number;
  capRate: number;
  downPayment: number;
  totalCashInvested: number;
  loanAmount: number;
  monthlyPayment: number;
  annualDebtService: number;
  cashOnCashReturn: number;
  dscr: number;
  breakEvenRatio: number;
  breakEvenOccupancy: number;
  balloonBalance: number;
  balloonPercentage: number;
  healthStatus: HealthStatus;
  healthTitle: string;
  healthDesc: string;
}

export interface DealAnalyzerFullResult {
  base: SingleScenarioResult;
  stress: SingleScenarioResult;
}

export function calculateSingleScenario(input: DealAnalyzerInput, locale: string): SingleScenarioResult {
  const isZh = locale === 'zh';
  const purchasePrice = Math.max(0, input.purchasePrice);
  const closingCosts = purchasePrice * (Math.max(0, input.closingCostsPercent) / 100);
  const grossPotentialIncome = Math.max(0, input.grossPotentialIncome);
  const vacancyRate = Math.max(0, input.vacancyRate);
  const vacancyLoss = grossPotentialIncome * (vacancyRate / 100);
  const egi = Math.max(0, grossPotentialIncome - vacancyLoss);
  const operatingExpenses = Math.max(0, input.operatingExpenses);
  const noi = egi - operatingExpenses;

  const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;

  const downPaymentPercent = Math.max(0, input.downPaymentPercent);
  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const totalCashInvested = downPayment + closingCosts;

  const loanAmount = Math.max(0, purchasePrice - downPayment);

  // Reuse calculateLoanDetails from loanCalculations.ts
  const loanRes = calculateLoanDetails({
    loanAmount,
    interestRate: input.interestRate,
    amortizationYears: input.amortizationYears,
    balloonYears: input.balloonYears,
    hasBalloon: input.hasBalloon,
    paymentType: input.paymentType,
  });

  const monthlyPayment = loanRes.monthlyPayment;
  const annualDebtService = loanRes.firstYearDebtService;

  const netCashFlow = noi - annualDebtService;
  const cashOnCashReturn = totalCashInvested > 0 ? (netCashFlow / totalCashInvested) * 100 : 0;

  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
  // Break-Even Ratio is calculated against Effective Gross Income (EGI)
  const breakEvenRatio = egi > 0 ? ((operatingExpenses + annualDebtService) / egi) * 100 : 0;
  // Break-Even Occupancy is calculated against Gross Potential Income (GPI)
  const breakEvenOccupancy = grossPotentialIncome > 0 ? ((operatingExpenses + annualDebtService) / grossPotentialIncome) * 100 : 0;

  // Determine Health Status (Illustrative heuristic benchmark, not universal lender criteria)
  let healthStatus: HealthStatus = 'green';
  let healthTitle = isZh ? '示例评估：稳健区间' : 'Illustrative Rule: Stable Cushion';
  let healthDesc = isZh
    ? '符合本站示例风险规则（测算假定 DSCR ≥ 1.25x 且 Break-Even Ratio ≤ 85%）。实际贷款审批门槛因贷方机构、贷款产品、增信担保及物业类型而异。'
    : 'Meets this tool\'s illustrative risk rule (modeled benchmark: DSCR ≥ 1.25x & BER ≤ 85%). Actual lender underwriting criteria vary widely by institution, loan program, and asset profile.';

  if (dscr < 1.0 || breakEvenRatio > 90) {
    healthStatus = 'red';
    healthTitle = isZh ? '示例评估：风险预警' : 'Illustrative Rule: Warning Signs';
    healthDesc = isZh
      ? '触碰本站示例风险红线：DSCR < 1.0x（经营现金流不足以偿债）或收支平衡比率 > 90%（抗空置缓冲极薄）。实际贷款门槛与违约判定需结合具体借贷合同约定。'
      : 'Triggers illustrative risk criteria: DSCR < 1.0x (cash flow shortfall) or Break-Even Ratio > 90% (thin cushion against vacancy). Actual underwriting and default terms depend on specific loan contracts.';
  } else if (dscr < 1.25 || breakEvenRatio > 85) {
    healthStatus = 'yellow';
    healthTitle = isZh ? '示例评估：临界警戒' : 'Illustrative Rule: Near Thresholds';
    healthDesc = isZh
      ? '接近本站示例警戒区间（DSCR 1.0-1.25x 或 Break-Even Ratio 85%-90%）。实际是否需要追加首付或设立偿债储备金取决于具体贷方与承销方案。'
      : 'Approaches illustrative caution range (DSCR 1.0-1.25x or BER 85%-90%). Whether additional equity or debt service reserves are required depends on specific lender guidelines.';
  }

  return {
    purchasePrice,
    closingCosts,
    grossPotentialIncome,
    vacancyLoss,
    egi,
    operatingExpenses,
    noi,
    capRate,
    downPayment,
    totalCashInvested,
    loanAmount,
    monthlyPayment,
    annualDebtService,
    cashOnCashReturn,
    dscr,
    breakEvenRatio,
    breakEvenOccupancy,
    balloonBalance: loanRes.balloonBalance,
    balloonPercentage: loanRes.balloonPercentage,
    healthStatus,
    healthTitle,
    healthDesc,
  };
}

export function calculateDealAnalysis(input: DealAnalyzerInput, locale: string): DealAnalyzerFullResult {
  const base = calculateSingleScenario(input, locale);

  const stressInput: DealAnalyzerInput = {
    ...input,
    vacancyRate: input.vacancyRate + 5, // +5 percentage points
    interestRate: input.interestRate + 1.0, // +100 bps (1%)
  };

  const stress = calculateSingleScenario(stressInput, locale);

  return { base, stress };
}
