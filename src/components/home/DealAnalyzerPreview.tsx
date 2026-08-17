'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { calculateDealAnalysis, DealAnalyzerInput } from '@/lib/dealAnalyzerCalculations';
import { Building2, ArrowRight, ShieldCheck, Zap, AlertTriangle, Sparkles } from 'lucide-react';

interface Props {
  locale: string;
}

export function DealAnalyzerPreview({ locale }: Props) {
  const isZh = locale === 'zh';
  const [activeScenario, setActiveScenario] = useState<'base' | 'stress'>('base');

  // Baseline sample deal: 24-Unit Multifamily
  const sampleInput: DealAnalyzerInput = {
    purchasePrice: 2800000,
    closingCostsPercent: 2.0,
    grossPotentialIncome: 336000,
    vacancyRate: 5.0,
    operatingExpenses: 92000,
    downPaymentPercent: 25.0,
    interestRate: 6.5,
    amortizationYears: 30,
    paymentType: 'installment',
    hasBalloon: false,
    balloonYears: 5,
  };

  // Derive dynamic metrics from the unified calculation engine
  const { base, stress } = calculateDealAnalysis(sampleInput, locale);
  const current = activeScenario === 'base' ? base : stress;

  return (
    <figure className="relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xl transition-all duration-300 text-left overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold" aria-hidden="true">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{isZh ? 'Deal Analyzer 预览' : 'Deal Analyzer Preview'}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                Sample
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isZh ? '示例资产：24 单元多户公寓' : 'Sample: 24-Unit Multifamily'}
            </p>
          </div>
        </div>

        {/* Scenario Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-semibold" role="group" aria-label={isZh ? '情景切换' : 'Scenario switcher'}>
          <button
            type="button"
            aria-pressed={activeScenario === 'base'}
            onClick={() => setActiveScenario('base')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none min-h-[28px] ${
              activeScenario === 'base'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {isZh ? '基准情景' : 'Base Case'}
          </button>
          <button
            type="button"
            aria-pressed={activeScenario === 'stress'}
            onClick={() => setActiveScenario('stress')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none min-h-[28px] ${
              activeScenario === 'stress'
                ? 'bg-amber-500 text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3 h-3" aria-hidden="true" />
            <span>{isZh ? '压力情景' : 'Stress Case'}</span>
          </button>
        </div>
      </div>

      {/* Stress testing assumption note */}
      <div className="mb-3 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/70">
        <span className="font-semibold text-slate-700">
          {activeScenario === 'base'
            ? (isZh ? '基准假设：' : 'Base Case: ')
            : (isZh ? '压力情景：' : 'Stress Case: ')}
        </span>
        {activeScenario === 'base'
          ? (isZh ? '当前挂牌价、在租收益与约定贷款利率 (6.50% 利率 / 5.0% 空置率)' : 'Current in-place rents and term quote (6.50% Rate / 5.0% Vacancy)')
          : (isZh ? '空置率增加5个百分点，利率增加100个基点 (7.50% 利率 / 10.0% 空置率)' : '+5 percentage points vacancy and +100 bps interest rate (7.50% Rate / 10.0% Vacancy)')}
      </div>

      {/* Health Evaluation Banner */}
      <div
        className={`p-3.5 rounded-2xl border transition-all mb-4 ${
          current.healthStatus === 'green'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : current.healthStatus === 'yellow'
            ? 'bg-amber-50/90 border-amber-200 text-amber-950'
            : 'bg-rose-50/90 border-rose-200 text-rose-950'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            {isZh ? '综合诊断' : 'Underwriting Evaluation'}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              current.healthStatus === 'green'
                ? 'bg-emerald-600 text-white'
                : current.healthStatus === 'yellow'
                ? 'bg-amber-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {current.healthStatus === 'green' ? (
              <ShieldCheck className="w-3 h-3" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-3 h-3" aria-hidden="true" />
            )}
            <span>{current.healthTitle}</span>
          </span>
        </div>
        <p className="text-[11px] leading-relaxed opacity-90">{current.healthDesc}</p>
      </div>

      {/* 2x3 Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {isZh ? '购买价格' : 'Purchase Price'}
          </span>
          <span className="text-sm font-black text-slate-900">{formatCurrency(sampleInput.purchasePrice)}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {isZh ? '净营业收入 NOI' : 'Annual NOI'}
          </span>
          <span className="text-sm font-black text-slate-900">{formatCurrency(current.noi)}</span>
        </div>

        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 space-y-0.5">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            Cap Rate
          </span>
          <span className="text-sm font-black text-emerald-700">{formatPercent(current.capRate)}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Cash-on-Cash
          </span>
          <span className="text-sm font-black text-slate-900">{formatPercent(current.cashOnCashReturn)}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            DSCR
          </span>
          <span
            className={`text-sm font-black ${
              current.dscr >= 1.25 ? 'text-emerald-600' : current.dscr >= 1.0 ? 'text-amber-600' : 'text-rose-600'
            }`}
          >
            {current.dscr.toFixed(2)}x
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {isZh ? '保本出租率' : 'Break-Even'}
          </span>
          <span className="text-sm font-black text-slate-900">{formatPercent(current.breakEvenRatio)}</span>
        </div>
      </div>

      {/* Direct, Accessible CTA Link Button */}
      <Link
        href={`/${locale}/tools/deal-analyzer/`}
        aria-label={isZh ? '打开完整 Deal Analyzer 工具' : 'Launch Full Deal Analyzer Suite'}
        className="w-full min-h-[44px] inline-flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none group/btn cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:text-white" aria-hidden="true" />
          <span>{isZh ? '进入 Deal Analyzer 完整实测' : 'Launch Full Deal Analyzer'}</span>
        </span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
      </Link>

      <figcaption className="sr-only">
        {isZh
          ? 'Deal Analyzer 商业地产综合尽调工具预览：通过统一计算核心呈现基准情景与压力情景对比（压力情景：空置率增加5个百分点，利率增加100个基点）。'
          : 'Deal Analyzer preview displaying unified base and stress case scenario modeling with +5 percentage points vacancy and +100 bps interest rate.'}
      </figcaption>
    </figure>
  );
}
