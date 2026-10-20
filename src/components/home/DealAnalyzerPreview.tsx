'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { calculateDealAnalysis, DEFAULT_DEAL_INPUT } from '@/lib/dealAnalyzerCalculations';
import { Building2, ArrowRight, ShieldCheck, Zap, AlertTriangle, Sparkles } from 'lucide-react';
import { getUiTranslations } from '@/lib/translations';

interface Props {
  locale: string;
}

export function DealAnalyzerPreview({ locale }: Props) {
  const t = getUiTranslations(locale);
  const [activeScenario, setActiveScenario] = useState<'base' | 'stress'>('base');

  // Baseline sample deal: 24-Unit Multifamily
  const sampleInput = DEFAULT_DEAL_INPUT;

  // Derive dynamic metrics from the unified calculation engine
  const { base, stress } = calculateDealAnalysis(sampleInput, locale);
  const current = activeScenario === 'base' ? base : stress;

  return (
    <figure className="relative bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 text-left overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shadow-[inset_0_1px_1px_rgba(16,185,129,0.2)]" aria-hidden="true">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{t.preview.title}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                {t.preview.sampleBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {t.preview.sampleSubtitle}
            </p>
          </div>
        </div>

        {/* Scenario Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-semibold" role="group" aria-label={t.preview.scenarioAria}>
          <button
            type="button"
            aria-pressed={activeScenario === 'base'}
            onClick={() => setActiveScenario('base')}
            className={`active-press px-2.5 py-1 rounded-lg transition-[background-color,color,box-shadow,transform] duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none min-h-[28px] ${
              activeScenario === 'base'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.preview.baseCaseBtn}
          </button>
          <button
            type="button"
            aria-pressed={activeScenario === 'stress'}
            onClick={() => setActiveScenario('stress')}
            className={`active-press px-2.5 py-1 rounded-lg transition-[background-color,color,box-shadow,transform] duration-150 flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none min-h-[28px] ${
              activeScenario === 'stress'
                ? 'bg-amber-500 text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3 h-3" aria-hidden="true" />
            <span>{t.preview.stressCaseBtn}</span>
          </button>
        </div>
      </div>

      {/* Stress testing assumption note */}
      <div className="mb-3 text-[11px] text-slate-600 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-200/60 leading-relaxed">
        <span className="font-semibold text-slate-800">
          {activeScenario === 'base' ? `${t.preview.baseCaseBtn}: ` : `${t.preview.stressCaseBtn}: `}
        </span>
        {activeScenario === 'base' ? t.preview.baseAssumption : t.preview.stressAssumption}
      </div>

      {/* Health Evaluation Banner */}
      <div
        className={`p-3.5 rounded-2xl border transition-[background-color,border-color,color] duration-180 mb-4 ${
          current.healthStatus === 'green'
            ? 'bg-emerald-50/80 border-emerald-200/80 text-emerald-950 shadow-[0_1px_2px_rgba(16,185,129,0.05)]'
            : current.healthStatus === 'yellow'
            ? 'bg-amber-50/90 border-amber-200/80 text-amber-950 shadow-[0_1px_2px_rgba(245,158,11,0.05)]'
            : 'bg-rose-50/90 border-rose-200/80 text-rose-950 shadow-[0_1px_2px_rgba(244,63,94,0.05)]'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            {t.preview.diagnosticLabel}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${
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
        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {t.preview.purchasePrice}
          </span>
          <span className="tabular-nums text-sm font-black text-slate-900">{formatCurrency(sampleInput.purchasePrice)}</span>
        </div>

        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {t.preview.annualNoi}
          </span>
          <span className="tabular-nums text-sm font-black text-slate-900"><span data-testid="base-noi">{formatCurrency(current.noi)}</span></span>
        </div>

        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/90 space-y-0.5 shadow-[inset_0_1px_1px_rgba(16,185,129,0.05)]">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            Cap Rate
          </span>
          <span className="tabular-nums text-sm font-black text-emerald-700"><span data-testid="base-cap-rate">{formatPercent(current.capRate)}</span></span>
        </div>

        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Cash-on-Cash
          </span>
          <span className="tabular-nums text-sm font-black text-slate-900"><span data-testid="base-cash-on-cash">{formatPercent(current.cashOnCashReturn)}</span></span>
        </div>

        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {t.preview.dscrLabel}
          </span>
          <span
            className={`tabular-nums text-sm font-black ${
              current.dscr >= 1.25 ? 'text-emerald-600' : current.dscr >= 1.0 ? 'text-amber-600' : 'text-rose-600'
            }`}
          >
            <span data-testid="base-dscr">{current.dscr.toFixed(2)}x</span>
          </span>
          <span className="text-[10px] text-slate-500 block leading-tight">
            {t.preview.dscrFormula} {/* NOI ÷ Annual Debt */}
          </span>
        </div>

        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 space-y-0.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.preview.berLabel} {/* Break-Even Ratio (BER) */}
            </span>
            <span className="tabular-nums text-sm font-black text-slate-900"><span data-testid="base-ber">{formatPercent(current.breakEvenRatio)}</span></span>
          </div>
          <div className="flex justify-between items-center border-t border-slate-200/50 mt-1 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.preview.beoLabel}
            </span>
            <span className="tabular-nums text-xs font-bold text-emerald-700"><span data-testid="base-beo">{formatPercent(current.breakEvenOccupancy)}</span></span>
          </div>
        </div>
      </div>

      {/* Direct, Accessible CTA Link Button */}
      <Link
        href={`/${locale}/tools/deal-analyzer/`}
        aria-label={t.preview.ctaAria}
        className="active-press w-full min-h-[44px] inline-flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-[background-color,transform] duration-150 shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none group/btn cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:text-white" aria-hidden="true" />
          <span>{t.preview.ctaText}</span>
        </span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
      </Link>

      <figcaption className="sr-only">
        {t.preview.figcaption}
      </figcaption>
    </figure>
  );
}
