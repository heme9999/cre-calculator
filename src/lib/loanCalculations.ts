export type PaymentType = 'installment' | 'principal';

export interface LoanCalculationInput {
  loanAmount: number;
  interestRate: number;
  amortizationYears: number;
  balloonYears: number;
  hasBalloon: boolean;
  paymentType: PaymentType;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  firstYearDebtService: number;
  equalInstallmentMonthly: number;
  equalPrincipalMonth1Payment: number;
  equalPrincipalMonthEndPayment: number;
  termInterest: number;
  termPrincipal: number;
  balloonBalance: number;
  balloonPercentage: number;
  totalPaidInTerm: number;
}

export function calculateLoanDetails(input: LoanCalculationInput): LoanCalculationResult {
  const { loanAmount, interestRate, amortizationYears, balloonYears, hasBalloon, paymentType } = input;

  const r = interestRate / 100 / 12; // Monthly rate
  const n = amortizationYears * 12; // Total amortization months
  const k = (hasBalloon ? balloonYears : amortizationYears) * 12; // Effective term months
  const effectiveTermMonths = Math.min(k, n);

  // Equal Installment (等额本息) Monthly Payment M
  const equalInstallmentMonthly = n > 0
    ? r > 0
      ? (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
      : loanAmount / n
    : 0;

  // Equal Principal (等额本金) Monthly Fixed Principal P_fixed
  const equalPrincipalFixed = n > 0 ? loanAmount / n : 0;
  const equalPrincipalMonth1Payment = equalPrincipalFixed + loanAmount * r;
  const equalPrincipalMonthEndPayment = equalPrincipalFixed + Math.max(0, loanAmount - (effectiveTermMonths - 1) * equalPrincipalFixed) * r;

  let termInterest = 0;
  let termPrincipal = 0;
  let firstYearDebtService = 0;
  let currentBal = loanAmount;

  if (paymentType === 'installment') {
    for (let m = 1; m <= effectiveTermMonths; m++) {
      const iMonth = currentBal * r;
      const pMonth = equalInstallmentMonthly - iMonth;
      termInterest += iMonth;
      termPrincipal += pMonth;
      if (m <= 12) firstYearDebtService += equalInstallmentMonthly;
      currentBal = Math.max(0, currentBal - pMonth);
    }
  } else {
    for (let m = 1; m <= effectiveTermMonths; m++) {
      const iMonth = currentBal * r;
      const pMonth = equalPrincipalFixed;
      termInterest += iMonth;
      termPrincipal += pMonth;
      if (m <= 12) firstYearDebtService += pMonth + iMonth;
      currentBal = Math.max(0, currentBal - pMonth);
    }
  }

  let balloonBalance = 0;
  if (hasBalloon && balloonYears < amortizationYears) {
    if (paymentType === 'installment') {
      balloonBalance = n > 0 && k < n
        ? r > 0
          ? loanAmount * (Math.pow(1 + r, n) - Math.pow(1 + r, k)) / (Math.pow(1 + r, n) - 1)
          : Math.max(0, loanAmount - k * (loanAmount / n))
        : 0;
    } else {
      balloonBalance = Math.max(0, loanAmount - k * equalPrincipalFixed);
    }
  }

  return {
    monthlyPayment: paymentType === 'installment' ? equalInstallmentMonthly : equalPrincipalMonth1Payment,
    firstYearDebtService,
    equalInstallmentMonthly,
    equalPrincipalMonth1Payment,
    equalPrincipalMonthEndPayment,
    termInterest,
    termPrincipal,
    balloonBalance,
    balloonPercentage: loanAmount > 0 ? (balloonBalance / loanAmount) * 100 : 0,
    totalPaidInTerm: termInterest + termPrincipal,
  };
}
