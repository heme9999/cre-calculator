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
  const annualDebtService = monthlyPayment * 12;

  const netCashFlow = noi - annualDebtService;
  const cashOnCashReturn = totalCashInvested > 0 ? (netCashFlow / totalCashInvested) * 100 : 0;

  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
  const breakEvenRatio = egi > 0 ? ((operatingExpenses + annualDebtService) / egi) * 100 : 0;

  // Determine Health Status
  let healthStatus: HealthStatus = 'green';
  let healthTitle = isZh ? '交易健康' : 'Healthy Deal';
  let healthDesc = isZh
    ? '这笔交易在关键杠杆指标上处于健康区间（DSCR ≥ 1.25x 且 Break-Even Ratio ≤ 85%）。'
    : 'Key leverage metrics sit comfortably within standard lender thresholds (DSCR ≥ 1.25x & BER ≤ 85%).';

  if (dscr < 1.0 || breakEvenRatio > 90) {
    healthStatus = 'red';
    healthTitle = isZh ? '风险警示' : 'Warning Signs';
    healthDesc = isZh
      ? '存在明显风险信号：DSCR < 1.0x（现金流倒挂）或收支平衡比率 > 90%（抗空置能力极薄）。'
      : 'Significant risk detected: DSCR < 1.0x (negative cash flow) or Break-Even Ratio > 90% (vulnerable to vacancy).';
  } else if (dscr < 1.25 || breakEvenRatio > 85) {
    healthStatus = 'yellow';
    healthTitle = isZh ? '临界警戒' : 'Near Thresholds';
    healthDesc = isZh
      ? '指标接近门槛（DSCR 1.0-1.25x 或 Break-Even Ratio 85%-90%），建议进一步评估或增加首付比率。'
      : 'Near lender minimums (DSCR 1.0-1.25x or BER 85%-90%). Consider cautious underwriting or higher down payment.';
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
