'use client';

import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Calculator, Calendar, DollarSign, PieChart, Table as TableIcon, Info } from 'lucide-react';

interface Props {
  locale: string;
}

export function LoanPaymentCalculator({ locale }: Props) {
  const isZh = locale === 'zh';

  // Inputs
  const [loanAmount, setLoanAmount] = useState<number>(2000000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [amortizationYears, setAmortizationYears] = useState<number>(25);
  const [balloonYears, setBalloonYears] = useState<number>(10);
  const [hasBalloon, setHasBalloon] = useState<boolean>(true);

  // Calculations
  const r = interestRate / 100 / 12; // Monthly rate
  const n = amortizationYears * 12; // Total months

  // Monthly Payment M
  const monthlyPayment = (r > 0 && n > 0)
    ? (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
    : 0;

  const annualDebtService = monthlyPayment * 12;

  // Balloon Balance after balloonYears
  const k = (hasBalloon ? balloonYears : amortizationYears) * 12;
  const balloonBalance = (r > 0 && n > 0 && k < n)
    ? loanAmount * (Math.pow(1 + r, n) - Math.pow(1 + r, k)) / (Math.pow(1 + r, n) - 1)
    : 0;

  // Cumulative Payments up to Balloon / Maturity
  const effectiveTermMonths = Math.min(k, n);
  const totalPaidInTerm = monthlyPayment * effectiveTermMonths;

  // Compute 12-Month Schedule
  const schedule = [];
  let currentBalance = loanAmount;

  for (let month = 1; month <= 12; month++) {
    const interestMonth = currentBalance * r;
    const principalMonth = monthlyPayment - interestMonth;
    const endingBalance = Math.max(0, currentBalance - principalMonth);

    schedule.push({
      month,
      startBalance: currentBalance,
      payment: monthlyPayment,
      principal: principalMonth,
      interest: interestMonth,
      endBalance: endingBalance,
    });

    currentBalance = endingBalance;
  }

  // Calculate 10-year / term cumulative interest
  let termInterest = 0;
  let termPrincipal = 0;
  let balanceTracker = loanAmount;

  for (let m = 1; m <= effectiveTermMonths; m++) {
    const iMonth = balanceTracker * r;
    const pMonth = monthlyPayment - iMonth;
    termInterest += iMonth;
    termPrincipal += pMonth;
    balanceTracker -= pMonth;
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
            {isZh ? '商业地产贷款月供与摊销计算器' : 'Commercial Real Estate Loan Payment Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh ? '计算每月本息还款、总利息支出、气球贷款到期尾款及前12个月还款摊销表' : 'Calculate monthly payments, interest costs, balloon payoff, and amortization'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Forms */}
        <div className="lg:col-span-7 space-y-6">
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
                placeholder="2,000,000"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[1000000, 2000000, 5000000, 10000000].map((val) => (
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

          {/* Interest Rate & Amortization */}
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
                {isZh ? '摊销年限 (Amortization Years)' : 'Amortization Period (Years)'}
              </label>
              <select
                value={amortizationYears}
                onChange={(e) => setAmortizationYears(parseInt(e.target.value) || 25)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus-ring text-slate-900 font-semibold bg-white focus:outline-none"
              >
                <option value={15}>15 {isZh ? '年摊销' : 'Years'}</option>
                <option value={20}>20 {isZh ? '年摊销' : 'Years'}</option>
                <option value={25}>25 {isZh ? '年摊销 (商业主流)' : 'Years (Standard)'}</option>
                <option value={30}>30 {isZh ? '年摊销' : 'Years'}</option>
              </select>
            </div>
          </div>

          {/* Balloon Option */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {isZh ? '包含气球贷款到期条款 (Balloon Payment)' : 'Include Balloon Maturity Term'}
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
                  {isZh ? '到期还款年限 (Maturity Term)' : 'Loan Maturity Term (Years)'}
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
                {isZh ? '每月本息还款额 (Monthly P&I)' : 'Monthly Payment (P&I)'}
              </span>
              <div className="text-3xl md:text-4xl font-black text-emerald-600 mt-1">
                {formatCurrency(monthlyPayment)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isZh ? `年度还贷总额: ${formatCurrency(annualDebtService)} / 年` : `Annual Debt Service: ${formatCurrency(annualDebtService)} / yr`}
              </p>
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
              {hasBalloon && balloonYears < amortizationYears && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-emerald-950">
                    <span>{isZh ? `第 ${balloonYears} 年到期气球尾款:` : `Year ${balloonYears} Balloon Payoff:`}</span>
                    <span className="text-emerald-700 font-extrabold">{formatCurrency(balloonBalance)}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    {isZh ? '需在到期日前办理再融资 (Refinance) 或出售结清' : 'Must be refinanced or paid off at loan maturity'}
                  </p>
                </div>
              )}

              <div className="flex justify-between text-slate-700">
                <span>{isZh ? `前 ${effectiveTermMonths / 12} 年累计利息支出:` : `Total Interest (${effectiveTermMonths / 12} yrs):`}</span>
                <span className="font-semibold text-red-600">{formatCurrency(termInterest)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>{isZh ? `前 ${effectiveTermMonths / 12} 年偿还本金:` : `Total Principal Paid (${effectiveTermMonths / 12} yrs):`}</span>
                <span className="font-semibold text-slate-900">{formatCurrency(termPrincipal)}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-semibold border-t border-slate-200 pt-2">
                <span>{isZh ? '累计支付总额:' : 'Total Cumulative Payments:'}</span>
                <span className="text-slate-900">{formatCurrency(totalPaidInTerm)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table Section */}
      <div className="border-t border-slate-200 p-6 md:p-8 bg-slate-50/50">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-emerald-600" />
          {isZh ? '首年还款明细表 (前 12 个月摊销)' : 'First Year Amortization Schedule (First 12 Months)'}
        </h3>

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
