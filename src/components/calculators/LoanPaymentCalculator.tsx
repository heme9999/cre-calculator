'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { calculateLoanDetails, PaymentType } from '@/lib/loanCalculations';
import { Calculator, Calendar, DollarSign, Table as TableIcon, Layers, Info } from 'lucide-react';

interface Props {
  locale: string;
}

export function LoanPaymentCalculator({ locale }: Props) {
  const isZh = locale === 'zh';

  // Inputs - Default set to 1.3M loan, 6.5% interest, 25yr amort, 10yr balloon
  const [paymentType, setPaymentType] = useState<PaymentType>('installment');
  const [loanAmount, setLoanAmount] = useState<number>(1300000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [amortizationYears, setAmortizationYears] = useState<number>(25);
  const [balloonYears, setBalloonYears] = useState<number>(10);
  const [hasBalloon, setHasBalloon] = useState<boolean>(true);

  // Use unified loan calculation function
  const calcResult = calculateLoanDetails({
    loanAmount,
    interestRate,
    amortizationYears,
    balloonYears,
    hasBalloon,
    paymentType,
  });

  const {
    monthlyPayment,
    equalInstallmentMonthly,
    equalPrincipalMonth1Payment,
    equalPrincipalMonthEndPayment,
    termInterest,
    termPrincipal,
    balloonBalance,
    balloonPercentage,
    totalPaidInTerm,
  } = calcResult;

  // Compute 12-Month Schedule Table
  const r = interestRate / 100 / 12;
  const n = amortizationYears * 12;
  const equalPrincipalFixed = n > 0 ? loanAmount / n : 0;

  const schedule = [];
  let scheduleBal = loanAmount;

  for (let month = 1; month <= 12; month++) {
    let pMonth = 0;
    let iMonth = scheduleBal * r;
    let payMonth = 0;

    if (paymentType === 'installment') {
      payMonth = equalInstallmentMonthly;
      pMonth = payMonth - iMonth;
    } else {
      pMonth = equalPrincipalFixed;
      payMonth = pMonth + iMonth;
    }

    const endBal = Math.max(0, scheduleBal - pMonth);

    schedule.push({
      month,
      startBalance: scheduleBal,
      payment: payMonth,
      principal: pMonth,
      interest: iMonth,
      endBalance: endBal,
    });

    scheduleBal = endBal;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {isZh ? '商业贷款还款计算' : 'Commercial Debt Calculation'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh ? '商业地产贷款月供与气球尾款计算器' : 'Commercial Real Estate Loan Payment & Balloon Payoff Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh ? '支持【等额本息】与【等额本金】两种还款模式对比，精确推算月供、利息开支及到期气球尾款' : 'Compare Equal Installment (fixed) vs Equal Principal (declining) loan repayment methods'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Repayment Method Switcher */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              {isZh ? '还款方式选择 (Repayment Method)' : 'Repayment Method'}
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setPaymentType('installment')}
                className={`py-3 px-4 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  paymentType === 'installment'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{isZh ? '等额本息 (Equal Installment)' : 'Equal Installment (Fixed)'}</span>
                <span className={`text-[10px] font-normal ${paymentType === 'installment' ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isZh ? '每月月供固定不变 (标准模式)' : 'Fixed monthly P&I payment (Standard)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('principal')}
                className={`py-3 px-4 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  paymentType === 'principal'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{isZh ? '等额本金 (Equal Principal)' : 'Equal Principal (Declining)'}</span>
                <span className={`text-[10px] font-normal ${paymentType === 'principal' ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isZh ? '每月还款本金固定，月供逐月递减' : 'Fixed principal, declining total payment'}
                </span>
              </button>
            </div>
          </div>

          {/* Loan Principal */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isZh ? '贷款本金总额 (Loan Amount)' : 'Principal Loan Amount ($)'}
            </label>
            <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
              <input
                type="number"
                value={loanAmount || ''}
                onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                placeholder="1,300,000"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[1000000, 1300000, 2000000, 5000000].map((val) => (
                <button
                  key={val}
                  onClick={() => setLoanAmount(val)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-md transition"
                >
                  {formatCurrency(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate & Amortization Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {isZh ? '年利率 (%)' : 'Annual Interest Rate (%)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                <input
                  type="number"
                  step="0.125"
                  value={interestRate || ''}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full pl-4 pr-8 py-3 text-slate-900 font-semibold focus:outline-none"
                  placeholder="6.5"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {isZh ? '摊销年限 (Amortization Term)' : 'Amortization Term (Years)'}
              </label>
              <select
                value={amortizationYears}
                onChange={(e) => setAmortizationYears(parseInt(e.target.value) || 25)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus-ring text-slate-900 font-semibold bg-white focus:outline-none"
              >
                <option value={15}>15 {isZh ? '年摊销' : 'Years'}</option>
                <option value={20}>20 {isZh ? '年摊销' : 'Years'}</option>
                <option value={25}>25 {isZh ? '年摊销 (商业主流标准)' : 'Years (Standard)'}</option>
                <option value={30}>30 {isZh ? '年摊销' : 'Years'}</option>
              </select>
            </div>
          </div>

          {/* Maturity Term & Balloon Payoff Option */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {isZh ? '设定到期年限与气球尾款 (Maturity Term & Balloon Payoff)' : 'Set Loan Maturity Term (Balloon Payoff)'}
              </label>
              <input
                type="checkbox"
                checked={hasBalloon}
                onChange={(e) => setHasBalloon(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
              />
            </div>

            {hasBalloon && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '贷款到期年限 (Maturity Term)' : 'Loan Maturity Term (Years)'}
                </label>
                <select
                  value={balloonYears}
                  onChange={(e) => setBalloonYears(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus-ring text-slate-900 text-sm font-medium bg-white"
                >
                  <option value={3}>3 {isZh ? '年到期' : 'Years'}</option>
                  <option value={5}>5 {isZh ? '年到期' : 'Years'}</option>
                  <option value={7}>7 {isZh ? '年到期' : 'Years'}</option>
                  <option value={10}>10 {isZh ? '年到期 (最常见)' : 'Years (Most Common)'}</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              {isZh ? '还款结果总览' : 'Loan Summary'}
            </h3>

            {/* Major Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {paymentType === 'installment'
                  ? (isZh ? '每月本息还款额 (Monthly P&I)' : 'Monthly Payment (Fixed P&I)')
                  : (isZh ? '首月还款额 (Initial Monthly Payment)' : 'Initial Monthly Payment')}
              </span>

              <div className="text-3xl md:text-4xl font-black text-emerald-600 mt-1">
                {formatCurrency(Math.round(monthlyPayment))}
              </div>

              {paymentType === 'installment' ? (
                <p className="text-xs text-slate-500 mt-1">
                  {isZh
                    ? `每月固定供款: ${formatCurrency(Math.round(equalInstallmentMonthly))} (每年 ${formatCurrency(Math.round(equalInstallmentMonthly * 12))})`
                    : `Fixed Monthly Debt Service: ${formatCurrency(Math.round(equalInstallmentMonthly))}/mo`}
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">
                  {isZh
                    ? `月供按月递减：首月 ${formatCurrency(Math.round(equalPrincipalMonth1Payment))}，末月 ${formatCurrency(Math.round(equalPrincipalMonthEndPayment))}`
                    : `Declining payment: Initial ${formatCurrency(Math.round(equalPrincipalMonth1Payment))}, final ${formatCurrency(Math.round(equalPrincipalMonthEndPayment))}`}
                </p>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
              {hasBalloon && balloonYears < amortizationYears && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-emerald-950">
                    <span>{isZh ? `第 ${balloonYears} 年到期气球尾款:` : `Year ${balloonYears} Balloon Payoff:`}</span>
                    <span className="text-emerald-700 font-extrabold">{formatCurrency(Math.round(balloonBalance))}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    {paymentType === 'principal'
                      ? (isZh ? `等额本金加快本金偿还，尾款降至原本金的 ${balloonPercentage.toFixed(1)}%` : `Principal balance drops faster to ${balloonPercentage.toFixed(1)}% of original`)
                      : (isZh ? '需在到期日前办理再融资 (Refinance) 或出售物业结清' : 'Must be refinanced or paid off at loan maturity')}
                  </p>
                </div>
              )}

              {(() => {
                const isBalloonActive = hasBalloon && balloonYears < amortizationYears;
                const displayYears = isBalloonActive ? balloonYears : amortizationYears;
                const interestLabel = isZh
                  ? (isBalloonActive ? `前 ${displayYears} 年累计利息支出:` : `全周期累计利息支出 (${displayYears} 年):`)
                  : `Total Interest (${displayYears} yrs):`;
                const principalLabel = isZh
                  ? (isBalloonActive ? `前 ${displayYears} 年偿还本金:` : `全周期偿还本金 (${displayYears} 年):`)
                  : `Total Principal Paid (${displayYears} yrs):`;

                return (
                  <>
                    <div className="flex justify-between text-slate-700">
                      <span>{interestLabel}</span>
                      <span className="font-semibold text-red-600">{formatCurrency(Math.round(termInterest))}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>{principalLabel}</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(Math.round(termPrincipal))}</span>
                    </div>
                  </>
                );
              })()}
              <div className="flex justify-between text-slate-700 font-semibold border-t border-slate-200 pt-2">
                <span>{isZh ? '累计支付总额:' : 'Total Cumulative Payments:'}</span>
                <span className="text-slate-900">{formatCurrency(Math.round(totalPaidInTerm))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table Section */}
      <div className="border-t border-slate-200 p-6 md:p-8 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-emerald-600" />
            {isZh
              ? `首年还款明细表 (前 12 个月${paymentType === 'installment' ? '等额本息' : '等额本金'}摊销)`
              : `First Year Amortization Schedule (${paymentType === 'installment' ? 'Equal Installment' : 'Equal Principal'})`}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {paymentType === 'principal' && (isZh ? '注：等额本金模式下每月固定偿还本金' : 'Note: Fixed principal paid each month')}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">{isZh ? '期数 (月)' : 'Month'}</th>
                <th className="px-4 py-3">{isZh ? '月初余额' : 'Start Balance'}</th>
                <th className="px-4 py-3">{isZh ? '月供总额' : 'Payment'}</th>
                <th className="px-4 py-3 text-emerald-600">{isZh ? '偿还本金' : 'Principal'}</th>
                <th className="px-4 py-3 text-red-500">{isZh ? '支付利息' : 'Interest'}</th>
                <th className="px-4 py-3">{isZh ? '月末余额' : 'End Balance'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-bold text-slate-900">{row.month}</td>
                  <td className="px-4 py-2.5">{formatCurrency(row.startBalance)}</td>
                  <td className="px-4 py-2.5 font-medium">{formatCurrency(row.payment)}</td>
                  <td className="px-4 py-2.5 font-medium text-emerald-700">{formatCurrency(row.principal)}</td>
                  <td className="px-4 py-2.5 font-medium text-red-600">{formatCurrency(row.interest)}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{formatCurrency(row.endBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
