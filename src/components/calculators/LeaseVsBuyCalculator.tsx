'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { calculateLoanDetails } from '@/lib/loanCalculations';
import { Calculator, ArrowRightLeft, Building, Key, TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react';

interface Props {
  locale: string;
}

export function LeaseVsBuyCalculator({ locale }: Props) {
  const isZh = locale === 'zh';

  // Lease Inputs
  const [monthlyRent, setMonthlyRent] = useState<number>(10000);
  const [annualRentEscalation, setAnnualRentEscalation] = useState<number>(3.0);

  // Buy Inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(1800000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [amortizationYears, setAmortizationYears] = useState<number>(25);
  const [holdingYears, setHoldingYears] = useState<number>(10);
  const [annualAppreciation, setAnnualAppreciation] = useState<number>(3.0);
  const [sellingCostPercent, setSellingCostPercent] = useState<number>(5.0);

  // --- Calculations ---
  // 1. Lease Total Cost
  let totalLeaseCost = 0;
  const leaseSchedule: number[] = [];
  let currentYearRent = monthlyRent * 12;

  for (let y = 1; y <= holdingYears; y++) {
    leaseSchedule.push(totalLeaseCost + currentYearRent);
    totalLeaseCost += currentYearRent;
    currentYearRent *= (1 + annualRentEscalation / 100);
  }

  // 2. Buy Total Cost & Equity at Exit
  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;

  // Calculate loan paydown over holdingPeriod using calculateLoanDetails
  const loanDetails = calculateLoanDetails({
    loanAmount,
    interestRate,
    amortizationYears,
    balloonYears: holdingYears,
    hasBalloon: true,
    paymentType: 'installment',
  });

  const cumulativeDebtService = loanDetails.totalPaidInTerm; // Principal + Interest paid over holdingYears
  const remainingLoanBalance = loanDetails.balloonBalance; // Unpaid principal at holdingYears

  // Future Market Value at Exit
  const futurePropertyValue = purchasePrice * Math.pow(1 + annualAppreciation / 100, holdingYears);
  const sellingExpensesAtExit = futurePropertyValue * (sellingCostPercent / 100);
  const netProceedsAtExit = futurePropertyValue - sellingExpensesAtExit - remainingLoanBalance;

  // Net Buy Cost = Down Payment + Total Debt Service Paid - Net Proceeds Realized at Exit
  const netBuyCost = downPayment + cumulativeDebtService - netProceedsAtExit;

  const costDifference = totalLeaseCost - netBuyCost;
  const buyIsCheaper = costDifference > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {isZh ? '商业地产决策分析' : 'Occupier Decision Analysis'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh ? 'Lease vs Buy (租买对比) 计算器' : 'Lease vs Buy Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh
              ? '对比商业企业与投资者在持有周期内的总租赁成本与总自购净成本（扣除资产升值变现）'
              : 'Compare total financial outlay between leasing and buying commercial property over your holding period'}
          </p>
        </div>
      </div>

      {/* Body Inputs Grid */}
      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lease Option Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
              <Key className="w-5 h-5 text-amber-600" />
              <span>{isZh ? '租赁方案参数 (Lease Option)' : 'Lease Scenario Inputs'}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isZh ? '首年起始月租金 ($)' : 'Initial Monthly Rent ($)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  type="number"
                  value={monthlyRent || ''}
                  onChange={(e) => setMonthlyRent(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 text-slate-900 font-semibold focus:outline-none text-sm"
                  placeholder="10,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isZh ? '年租金递增率 (%)' : 'Annual Rent Escalation (%)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    type="number"
                    step="0.5"
                    value={annualRentEscalation || ''}
                    onChange={(e) => setAnnualRentEscalation(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2.5 text-slate-900 font-semibold focus:outline-none text-sm"
                    placeholder="3.0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isZh ? '对比评估年限 (Holding Yrs)' : 'Holding Horizon (Years)'}
                </label>
                <select
                  value={holdingYears}
                  onChange={(e) => setHoldingYears(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus-ring text-slate-900 text-sm font-semibold bg-white"
                >
                  <option value={5}>5 {isZh ? '年' : 'Years'}</option>
                  <option value={7}>7 {isZh ? '年' : 'Years'}</option>
                  <option value={10}>10 {isZh ? '年 (标准分析)' : 'Years'}</option>
                  <option value={15}>15 {isZh ? '年' : 'Years'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Buy Option Form */}
          <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-emerald-200/80 pb-3">
              <Building className="w-5 h-5 text-emerald-600" />
              <span>{isZh ? '购买方案参数 (Buy Option)' : 'Purchase Scenario Inputs'}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isZh ? '物业购买总价 ($)' : 'Purchase Price ($)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  type="number"
                  value={purchasePrice || ''}
                  onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 text-slate-900 font-semibold focus:outline-none text-sm"
                  placeholder="1,800,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isZh ? '首付比例 (%)' : 'Down Payment (%)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    type="number"
                    value={downPaymentPercent || ''}
                    onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2.5 text-slate-900 font-semibold focus:outline-none text-sm"
                    placeholder="25"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isZh ? '贷款利率 (%)' : 'Loan Rate (%)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    type="number"
                    step="0.125"
                    value={interestRate || ''}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2.5 text-slate-900 font-semibold focus:outline-none text-sm"
                    placeholder="6.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isZh ? '预计年增值率 (%)' : 'Annual Appreciation (%)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    type="number"
                    step="0.5"
                    value={annualAppreciation || ''}
                    onChange={(e) => setAnnualAppreciation(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2.5 text-slate-900 font-semibold focus:outline-none text-sm"
                    placeholder="3.0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isZh ? '退出卖出成本 (%)' : 'Selling Costs at Exit (%)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    type="number"
                    step="0.5"
                    value={sellingCostPercent || ''}
                    onChange={(e) => setSellingCostPercent(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2.5 text-slate-900 font-semibold focus:outline-none text-sm"
                    placeholder="5.0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Output Table */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
                {isZh ? `${holdingYears} 年持有期财务对比总览` : `${holdingYears}-Year Financial Outlay Comparison`}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isZh
                  ? '对比总租金开支与自购净成本（购买首付+按揭还款减去退出卖出净变现）'
                  : 'Total lease payments vs net purchase cost (down payment + mortgage paid minus net equity at sale)'}
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 px-4 text-right">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                {isZh ? '更加划算的方案' : 'Financially Advantageous Option'}
              </span>
              <span className="text-base font-black text-emerald-400">
                {buyIsCheaper
                  ? (isZh ? `自购更优 (节省 ${formatCurrency(Math.round(costDifference))})` : `Buying Saves ${formatCurrency(Math.round(costDifference))}`)
                  : (isZh ? `租赁更优 (节省 ${formatCurrency(Math.round(-costDifference))})` : `Leasing Saves ${formatCurrency(Math.round(-costDifference))}`)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lease Option Card */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="text-sm font-bold text-amber-300">1. {isZh ? '租赁方案总支出 (Lease)' : 'Leasing Total Outlay'}</span>
                <span className="text-xs text-slate-400">{holdingYears} {isZh ? '年租金纯支出' : 'Years Pure Expense'}</span>
              </div>
              <div className="text-3xl font-black text-amber-400">
                {formatCurrency(Math.round(totalLeaseCost))}
              </div>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                <li className="flex justify-between">
                  <span className="text-slate-400">{isZh ? '首年年租金:' : 'Year 1 Annual Rent:'}</span>
                  <span>{formatCurrency(Math.round(monthlyRent * 12))}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">{isZh ? `第 ${holdingYears} 年末年租金:` : `Year ${holdingYears} Annual Rent:`}</span>
                  <span>{formatCurrency(Math.round(currentYearRent / (1 + annualRentEscalation / 100)))}</span>
                </li>
                <li className="flex justify-between text-amber-300 font-medium">
                  <span>{isZh ? '期末积累资产价值:' : 'Equity Accumulated at End:'}</span>
                  <span>$0</span>
                </li>
              </ul>
            </div>

            {/* Buy Option Card */}
            <div className="bg-emerald-950/40 border border-emerald-800 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-emerald-800/80 pb-3">
                <span className="text-sm font-bold text-emerald-300">2. {isZh ? '购买方案净成本 (Buy)' : 'Buying Net Outlay'}</span>
                <span className="text-xs text-emerald-400/80">{holdingYears} {isZh ? '年后已扣除资产净值' : 'Years Net Cost After Equity'}</span>
              </div>
              <div className="text-3xl font-black text-emerald-400">
                {formatCurrency(Math.round(netBuyCost))}
              </div>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-emerald-800/60">
                <li className="flex justify-between">
                  <span className="text-slate-400">{isZh ? '首付 + 累计还贷总支出:' : 'Down Payment + Debt Paid:'}</span>
                  <span>{formatCurrency(Math.round(downPayment + cumulativeDebtService))}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">{isZh ? `第 ${holdingYears} 年退出卖出净变现:` : `Year ${holdingYears} Net Proceeds at Sale:`}</span>
                  <span className="text-emerald-400 font-semibold">{formatCurrency(Math.round(netProceedsAtExit))}</span>
                </li>
                <li className="flex justify-between text-emerald-300 font-medium">
                  <span>{isZh ? `第 ${holdingYears} 年预估物业市场总值:` : `Year ${holdingYears} Future Market Value:`}</span>
                  <span>{formatCurrency(Math.round(futurePropertyValue))}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
