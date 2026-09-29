'use client';

import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DEFAULT_DEAL_INPUT } from '@/lib/dealAnalyzerCalculations';

interface Props {
  locale: string;
}

export function BreakEvenRatioCalculator({ locale }: Props) {
  const isZh = locale === 'zh';

  // Inputs
  const [operatingExpenses, setOperatingExpenses] = useState<number>(DEFAULT_DEAL_INPUT.operatingExpenses);
  const [annualDebtService, setAnnualDebtService] = useState<number>(170152); // Approximate ADS for default loan
  const [grossPotentialIncome, setGrossPotentialIncome] = useState<number>(DEFAULT_DEAL_INPUT.grossPotentialIncome);
  const [vacancyRate, setVacancyRate] = useState<number>(DEFAULT_DEAL_INPUT.vacancyRate);

  // Computations
  const vacancyLoss = grossPotentialIncome * (vacancyRate / 100);
  const effectiveGrossIncome = Math.max(0, grossPotentialIncome - vacancyLoss);

  const totalOutlay = operatingExpenses + annualDebtService;

  const breakEvenOccupancy = grossPotentialIncome > 0 ? (totalOutlay / grossPotentialIncome) * 100 : 0;
  const breakEvenRatio = effectiveGrossIncome > 0 ? (totalOutlay / effectiveGrossIncome) * 100 : 0;

  // Status Tiers (Based on Break-Even Ratio)
  let tierStyle = 'bg-emerald-50 text-emerald-900 border-emerald-200';
  let statusTitle = isZh ? '健康收支平衡边际' : 'Healthy Break-Even Cushion';
  let statusDesc = isZh
    ? `当前收支平衡比率 (BER) 为 ${formatPercent(breakEvenRatio)}。运营费用和债务偿付相对于有效总收入的负担比例较低，收入缓冲较大。`
    : `Break-even ratio is ${formatPercent(breakEvenRatio)}. The burden of operating expenses and debt service on effective gross income is low, leaving a healthy cushion.`;

  if (breakEvenRatio > 90) {
    tierStyle = 'bg-rose-50 text-rose-950 border-rose-200';
    statusTitle = isZh ? '警示：高风险 (高于 90% 警戒线)' : 'Warning: High Risk (Above 90%)';
    statusDesc = isZh
      ? `收支平衡比率高达 ${formatPercent(breakEvenRatio)}。极小的租金下滑或意外支出都可能导致现金流为负，需要谨慎评估。`
      : `Break-even ratio is ${formatPercent(breakEvenRatio)}. Minor rent concessions or unexpected expenses will cause negative cash flow. Consider higher down payment to lower debt service.`;
  } else if (breakEvenRatio > 85) {
    tierStyle = 'bg-amber-50 text-amber-950 border-amber-200';
    statusTitle = isZh ? '接近贷款机构风控上限 (85% - 90%)' : 'Near Lender Risk Limit (85% - 90%)';
    statusDesc = isZh
      ? `收支平衡比率达 ${formatPercent(breakEvenRatio)}，处于多数商业银行风控上游边界。抗风险安全垫偏薄。`
      : `Break-even ratio is ${formatPercent(breakEvenRatio)}, approaching standard commercial lender maximum limits. Cushion is tight.`;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {isZh ? '风险与盈亏分析' : 'Break-Even Analysis'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh ? '收支平衡点 (Break-Even) 计算器' : 'Break-Even Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh
              ? '计算商业地产的盈亏平衡比率 (BER) 和盈亏平衡入住率 (Occupancy)'
              : 'Determine Break-Even Ratio (BER) and Break-Even Occupancy for your commercial property'}
          </p>
        </div>
      </div>

      {/* Body Grid */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {isZh ? '年潜在总收入 ($/年 - GPI)' : 'Gross Potential Income ($/yr)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  type="number"
                  value={grossPotentialIncome || ''}
                  onChange={(e) => setGrossPotentialIncome(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                  placeholder="336,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {isZh ? '预期空置与损失率 (%)' : 'Vacancy & Credit Loss (%)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                <input
                  type="number"
                  value={vacancyRate || ''}
                  onChange={(e) => setVacancyRate(parseFloat(e.target.value) || 0)}
                  className="w-full pl-4 pr-8 py-3 text-slate-900 font-semibold focus:outline-none"
                  placeholder="5.0"
                  step="0.1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {isZh ? '年度运营支出 ($/年 - OpEx)' : 'Operating Expenses ($/yr)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  type="number"
                  value={operatingExpenses || ''}
                  onChange={(e) => setOperatingExpenses(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                  placeholder="92,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {isZh ? '年度还贷总额 ($/年 - ADS)' : 'Annual Debt Service ($/yr)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  type="number"
                  value={annualDebtService || ''}
                  onChange={(e) => setAnnualDebtService(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                  placeholder="170,152"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">{isZh ? '有效总收入 (Effective Gross Income):' : 'Effective Gross Income (EGI):'}</span>
              <span className="font-bold text-slate-900">{formatCurrency(effectiveGrossIncome)}</span>
            </div>
          </div>
        </div>

        {/* Output Results Column */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isZh ? '收支平衡分析结果' : 'Break-Even Analysis'}
            </h3>

            {/* Primary KPI Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isZh ? '收支平衡比率 (Break-Even Ratio)' : 'Break-Even Ratio'}
                </span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {formatPercent(breakEvenRatio)}
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  {isZh
                    ? `(运营支出 + 债务偿还) / 有效总收入`
                    : `(Operating Expenses + Debt Service) / EGI`}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isZh ? '盈亏平衡入住率 (Break-Even Occupancy)' : 'Break-Even Occupancy'}
                </span>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {formatPercent(breakEvenOccupancy)}
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  {isZh
                    ? `达到保本所需的最低实际入住率`
                    : `Simplified estimate of occupancy required to break even`}
                </p>
              </div>
            </div>

            {/* Status Alert Box */}
            <div className={`p-4 rounded-xl border space-y-1.5 ${tierStyle}`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {breakEvenRatio > 85 ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{statusTitle}</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{statusDesc}</p>
            </div>

            <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-700">
                <span>{isZh ? '刚性保本固定支出总额:' : 'Total Annual Debt & Ops Cost:'}</span>
                <span className="font-semibold text-slate-900">{formatCurrency(Math.round(totalOutlay))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
