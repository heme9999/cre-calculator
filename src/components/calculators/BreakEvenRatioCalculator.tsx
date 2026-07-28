'use client';

import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Calculator, AlertTriangle, CheckCircle2, DollarSign, ShieldCheck, Info } from 'lucide-react';

interface Props {
  locale: string;
}

export function BreakEvenRatioCalculator({ locale }: Props) {
  const isZh = locale === 'zh';

  // Inputs
  const [operatingExpenses, setOperatingExpenses] = useState<number>(70000);
  const [annualDebtService, setAnnualDebtService] = useState<number>(121536);
  const [effectiveGrossIncome, setEffectiveGrossIncome] = useState<number>(220000);

  // Computations
  const totalOutlay = operatingExpenses + annualDebtService;
  const breakEvenRatio = effectiveGrossIncome > 0 ? (totalOutlay / effectiveGrossIncome) * 100 : 0;
  const maxAllowableVacancy = Math.max(0, 100 - breakEvenRatio);

  // Status Tiers
  let tierStyle = 'bg-emerald-50 text-emerald-900 border-emerald-200';
  let badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let statusTitle = isZh ? '健康收支平衡边际' : 'Healthy Break-Even Cushion';
  let statusDesc = isZh
    ? `收支平衡点为 ${formatPercent(breakEvenRatio)}，物业即使遭遇高达 ${formatPercent(maxAllowableVacancy)} 的空置率，产生的收入仍足以完全覆盖运营开支与房贷本息。`
    : `Break-even ratio is ${formatPercent(breakEvenRatio)}. The property can withstand up to ${formatPercent(maxAllowableVacancy)} vacancy while fully covering operational costs and debt service.`;

  if (breakEvenRatio > 85) {
    tierStyle = 'bg-rose-50 text-rose-950 border-rose-200';
    badgeStyle = 'bg-rose-100 text-rose-800 border-rose-300';
    statusTitle = isZh ? '警示：高空置风险 (高于 85% 警戒线)' : 'Warning: High Vacancy Risk (Above 85%)';
    statusDesc = isZh
      ? `收支平衡比率高达 ${formatPercent(breakEvenRatio)}。物业只要出现哪怕极小的空置或租金下滑，就将直接导致现金流倒挂。建议增加首付以降低债务支出。`
      : `Break-even ratio is ${formatPercent(breakEvenRatio)}. Minor vacancy or rent concessions will cause negative cash flow. Consider higher down payment to lower debt service.`;
  } else if (breakEvenRatio > 80) {
    tierStyle = 'bg-amber-50 text-amber-950 border-amber-200';
    badgeStyle = 'bg-amber-100 text-amber-800 border-amber-300';
    statusTitle = isZh ? '接近贷款机构风控上限 (80% - 85%)' : 'Near Lender Risk Limit (80% - 85%)';
    statusDesc = isZh
      ? `收支平衡点为 ${formatPercent(breakEvenRatio)}，处于多数商业银行风控上游边界。抗风险安全垫偏薄，需要密切关注租客续租率。`
      : `Break-even ratio is ${formatPercent(breakEvenRatio)}, approaching standard commercial lender maximum limits. Cushion against tenant turnover is tight.`;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {isZh ? '空置风险评估' : 'Occupancy Risk Evaluation'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh ? '收支平衡比率 (Break-Even Ratio) 计算器' : 'Break-Even Ratio Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh
              ? '计算商业地产物业满足运营支出与还贷债务所需的最低出租率与抗空置安全垫'
              : 'Determine the minimum occupancy rate required to cover operating expenses and mortgage debt service'}
          </p>
        </div>
      </div>

      {/* Body Grid */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Operating Expenses */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isZh ? '年度运营支出 ($/年)' : 'Annual Operating Expenses ($/yr)'}
            </label>
            <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
              <input
                type="number"
                value={operatingExpenses || ''}
                onChange={(e) => setOperatingExpenses(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                placeholder="70,000"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isZh ? '包含房产税、保险、物业管理费、维修保养费及公用事业费' : 'Property taxes, insurance, management, maintenance, and utilities'}
            </p>
          </div>

          {/* Annual Debt Service */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isZh ? '年度还贷总额 ($/年 - 本金+利息)' : 'Annual Debt Service ($/yr - Principal + Interest)'}
            </label>
            <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
              <input
                type="number"
                value={annualDebtService || ''}
                onChange={(e) => setAnnualDebtService(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                placeholder="121,536"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isZh ? '物业按揭贷款全年的本息还款总额 (12 × 月供)' : 'Total annual mortgage debt service (12 × Monthly Payment)'}
            </p>
          </div>

          {/* Effective Gross Income */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isZh ? '年有效毛收入 ($/年 - EGI)' : 'Effective Gross Income ($/yr - EGI)'}
            </label>
            <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
              <input
                type="number"
                value={effectiveGrossIncome || ''}
                onChange={(e) => setEffectiveGrossIncome(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                placeholder="220,000"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isZh ? '潜在租金总收入扣除预期空置损失后的实际毛收入' : 'Gross potential rent minus estimated vacancy and credit loss'}
            </p>
          </div>
        </div>

        {/* Output Results Column */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isZh ? '收支平衡分析结果' : 'Break-Even Analysis'}
            </h3>

            {/* Primary KPI Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isZh ? '收支平衡比率 (Break-Even Ratio)' : 'Break-Even Ratio'}
              </span>
              <div className="text-4xl font-black text-slate-900">
                {formatPercent(breakEvenRatio)}
              </div>
              <p className="text-xs text-slate-500 pt-1">
                {isZh
                  ? `物业至少需要达到 ${formatPercent(breakEvenRatio)} 的出租率才能保证零亏损`
                  : `Minimum ${formatPercent(breakEvenRatio)} occupancy required to avoid operating deficit`}
              </p>
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

            {/* Secondary Breakdown */}
            <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-700">
                <span>{isZh ? '最高可承受空置率:' : 'Max Allowable Vacancy:'}</span>
                <span className="font-bold text-slate-900">{formatPercent(maxAllowableVacancy)}</span>
              </div>
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
