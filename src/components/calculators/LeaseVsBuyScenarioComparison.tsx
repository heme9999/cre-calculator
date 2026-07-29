'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { calculateLoanDetails } from '@/lib/loanCalculations';

interface Props {
  locale: string;
}

export function LeaseVsBuyScenarioComparison({ locale }: Props) {
  const isZh = locale === 'zh';

  // Benchmark fixed parameters
  const purchasePrice = 1800000;
  const downPaymentPercent = 25;
  const interestRate = 6.5;
  const amortizationYears = 25;
  const holdingYears = 10;
  const annualAppreciation = 3.0;
  const sellingCostPercent = 5.0;
  const monthlyRent = 10000;
  const annualRentEscalation = 3.0;

  // Computations
  let totalLeaseCost = 0;
  let currentYearRent = monthlyRent * 12;
  for (let y = 1; y <= holdingYears; y++) {
    totalLeaseCost += currentYearRent;
    currentYearRent *= (1 + annualRentEscalation / 100);
  }

  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;
  const loanDetails = calculateLoanDetails({
    loanAmount,
    interestRate,
    amortizationYears,
    balloonYears: holdingYears,
    hasBalloon: true,
    paymentType: 'installment',
  });

  const cumulativeDebtService = loanDetails.totalPaidInTerm;
  const remainingLoanBalance = loanDetails.balloonBalance;
  const futurePropertyValue = purchasePrice * Math.pow(1 + annualAppreciation / 100, holdingYears);
  const sellingExpensesAtExit = futurePropertyValue * (sellingCostPercent / 100);
  const netProceedsAtExit = futurePropertyValue - sellingExpensesAtExit - remainingLoanBalance;
  const netBuyCost = downPayment + cumulativeDebtService - netProceedsAtExit;
  const savings = totalLeaseCost - netBuyCost;

  return (
    <div className="bg-slate-50 border-l-4 border-emerald-500 p-5 rounded-r-xl text-slate-800 space-y-4 text-xs sm:text-sm leading-relaxed">
      <p className="font-medium">
        {isZh
          ? `假设一家商业企业计划使用一处办公空间 10 年（基准场景：买价 $1,800,000，首付 25%，贷款 $1,350,000，利率 6.5%，25 年摊销；租金 $10,000/月，年递增 3%；年均升值 3%，卖出成本 5%）：`
          : `Suppose a company requires an office space for 10 years (Benchmark Scenario: $1.8M Purchase Price, 25% Down, $1.35M Loan at 6.5% Rate & 25-Yr Amortization; $10k/mo Initial Rent with 3% Escalation; 3% Appreciation & 5% Exit Selling Costs):`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Lease Option Breakdown */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="font-bold text-amber-700 border-b border-slate-100 pb-1.5 flex justify-between items-center">
            <span>{isZh ? '方案 A：租赁 10 年' : 'Option A: Lease 10 Years'}</span>
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold">
              {isZh ? '纯开支开销' : 'Pure Expense'}
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{isZh ? '首年月租金:' : 'Initial Monthly Rent:'}</span>
              <span className="font-semibold text-slate-900">{formatCurrency(monthlyRent)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{isZh ? '年租金递增率:' : 'Annual Escalation:'}</span>
              <span className="font-semibold text-slate-900">{annualRentEscalation}%</span>
            </div>
            <div className="flex justify-between text-amber-900 font-bold border-t border-slate-100 pt-2 text-sm">
              <span>{isZh ? '10年累计租金开支:' : '10-Yr Total Rent Outlay:'}</span>
              <span>{formatCurrency(Math.round(totalLeaseCost))}</span>
            </div>
          </div>
        </div>

        {/* Buy Option Breakdown */}
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs space-y-2">
          <div className="font-bold text-emerald-800 border-b border-slate-100 pb-1.5 flex justify-between items-center">
            <span>{isZh ? '方案 B：购买自用 10 年' : 'Option B: Buy 10 Years'}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
              {isZh ? '资产权益积累' : 'Equity Building'}
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{isZh ? '首付款 (25%):' : 'Down Payment (25%):'}</span>
              <span className="font-semibold text-slate-900">{formatCurrency(Math.round(downPayment))}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{isZh ? '10年累计还贷本息:' : '10-Yr Total Mortgage Paid:'}</span>
              <span className="font-semibold text-slate-900">{formatCurrency(Math.round(cumulativeDebtService))}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{isZh ? '10年后物业市场估值:' : '10-Yr Future Market Value:'}</span>
              <span className="font-semibold text-slate-900">{formatCurrency(Math.round(futurePropertyValue))}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{isZh ? '10年后卖出净变现所得:' : 'Net Sale Proceeds at Sale:'}</span>
              <span className="font-semibold text-emerald-700">{formatCurrency(Math.round(netProceedsAtExit))}</span>
            </div>
            <div className="flex justify-between text-emerald-900 font-bold border-t border-slate-100 pt-2 text-sm">
              <span>{isZh ? '10年购买实际净成本:' : '10-Yr Net Buy Cost:'}</span>
              <span>{formatCurrency(Math.round(netBuyCost))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>
          {isZh
            ? `【对比结论】：在 10 年持有期内，购买自用方案相比租赁方案可节省净财务成本约：`
            : `【Conclusion】: Over the 10-year holding period, buying saves net financial outlay compared to leasing by:`}
        </span>
        <span className="text-base font-black text-emerald-700 sm:text-right">
          {formatCurrency(Math.round(savings))}
        </span>
      </div>
    </div>
  );
}
