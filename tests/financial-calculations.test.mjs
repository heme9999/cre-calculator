import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateLoanDetails } from '../src/lib/loanCalculations.ts';

test('zero-interest installment loan amortizes principal instead of returning zero', () => {
  const result = calculateLoanDetails({
    loanAmount: 120_000,
    interestRate: 0,
    amortizationYears: 10,
    balloonYears: 10,
    hasBalloon: false,
    paymentType: 'installment',
  });

  assert.equal(result.monthlyPayment, 1_000);
  assert.equal(result.firstYearDebtService, 12_000);
  assert.equal(result.termPrincipal, 120_000);
  assert.equal(result.totalPaidInTerm, 120_000);
});

test('zero-interest balloon loan reports the remaining principal', () => {
  const result = calculateLoanDetails({
    loanAmount: 120_000,
    interestRate: 0,
    amortizationYears: 10,
    balloonYears: 5,
    hasBalloon: true,
    paymentType: 'installment',
  });

  assert.equal(result.balloonBalance, 60_000);
  assert.equal(result.balloonPercentage, 50);
});

test('equal-principal first-year debt service sums declining monthly payments', () => {
  const result = calculateLoanDetails({
    loanAmount: 1_200_000,
    interestRate: 6,
    amortizationYears: 20,
    balloonYears: 20,
    hasBalloon: false,
    paymentType: 'principal',
  });

  const monthlyPrincipal = 1_200_000 / 240;
  const expectedFirstYearInterest = Array.from(
    { length: 12 },
    (_, month) => (1_200_000 - month * monthlyPrincipal) * 0.06 / 12,
  ).reduce((sum, value) => sum + value, 0);

  assert.ok(Math.abs(result.firstYearDebtService - (monthlyPrincipal * 12 + expectedFirstYearInterest)) < 0.01);
  assert.notEqual(result.firstYearDebtService, result.monthlyPayment * 12);
});

test('standard installment payment remains stable', () => {
  const result = calculateLoanDetails({
    loanAmount: 2_100_000,
    interestRate: 6.5,
    amortizationYears: 25,
    balloonYears: 25,
    hasBalloon: false,
    paymentType: 'installment',
  });

  assert.ok(Math.abs(result.monthlyPayment - 14_179.35) < 0.01);
  assert.ok(Math.abs(result.firstYearDebtService - result.monthlyPayment * 12) < 0.01);
});
