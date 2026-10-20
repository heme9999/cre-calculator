'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Calculator, TrendingUp, AlertCircle, Info, ArrowRight, Share2, Check } from 'lucide-react';
import { CapRateVisualGauge } from './visuals/CapRateVisualGauge';
import { getUiTranslations } from '@/lib/translations';

interface Props {
  locale: string;
  defaultPrice?: number;
  defaultNoi?: number;
}

export function CapRateCalculator({ locale, defaultPrice, defaultNoi }: Props) {
  const t = getUiTranslations(locale);
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');

  const initialPrice = defaultPrice ?? 1500000;
  const initialNoi = defaultNoi ?? 112500;

  // Forward Mode state: Purchase Price + NOI -> Cap Rate
  const [purchasePrice, setPurchasePrice] = useState<number>(initialPrice);
  const [noi, setNoi] = useState<number>(initialNoi);

  // Reverse Mode state: NOI + Target Cap Rate -> Max Purchase Price
  const [targetCapRate, setTargetCapRate] = useState<number>(7.5);

  // Share link state
  const [copied, setCopied] = useState<boolean>(false);

  const loadExampleLabel = isZh
    ? `加载本页示例 (${formatCurrency(initialPrice)} / ${formatCurrency(initialNoi)} NOI)`
    : isEs
    ? `Cargar ejemplo de esta página (${formatCurrency(initialPrice)} / ${formatCurrency(initialNoi)} NOI)`
    : isPt
    ? `Carregar exemplo desta página (${formatCurrency(initialPrice)} / ${formatCurrency(initialNoi)} NOI)`
    : `Load Page Example (${formatCurrency(initialPrice)} / ${formatCurrency(initialNoi)} NOI)`;

  const universalFormulaNote = isZh
    ? '公式说明：本计算器采用通用 Cap Rate = 年 NOI ÷ 购买价格 公式，不内置特定资产类别的自动费用扣除模型。'
    : isEs
    ? 'Nota de fórmula: Esta calculadora aplica la fórmula universal Cap Rate = NOI Anual ÷ Precio de Compra; no aplica deducciones automáticas de gastos por tipo de activo.'
    : isPt
    ? 'Nota de fórmula: Esta calculadora aplica a fórmula universal Cap Rate = NOI Anual ÷ Preço de Compra; não aplica deduções automáticas de despesas por classe de ativo.'
    : 'Formula Note: This calculator applies the universal Cap Rate = Annual NOI ÷ Purchase Price formula and does not apply separate built-in asset expense models.';

  // Parse URL hash on mount if present
  useEffect(() => {
    const applyHashParams = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) return;
      const params = new URLSearchParams(hash);
      const p = params.get('price') || params.get('p');
      const n = params.get('noi') || params.get('n');
      const m = params.get('mode') || params.get('m');
      const tParam = params.get('target') || params.get('t');

      if (p && !isNaN(Number(p))) setPurchasePrice(Number(p));
      if (n && !isNaN(Number(n))) setNoi(Number(n));
      if (m === 'reverse' || m === 'forward') setMode(m);
      if (tParam && !isNaN(Number(tParam))) setTargetCapRate(Number(tParam));
    };

    const timer = setTimeout(applyHashParams, 0);
    window.addEventListener('hashchange', applyHashParams);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', applyHashParams);
    };
  }, []);

  const handleShareDeal = async () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (mode === 'forward') {
      params.set('p', purchasePrice.toString());
      params.set('noi', noi.toString());
    } else {
      params.set('mode', 'reverse');
      params.set('noi', noi.toString());
      params.set('t', targetCapRate.toString());
      if (purchasePrice > 0) params.set('p', purchasePrice.toString());
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}#${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  // Calculations
  const calculatedCapRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;
  const calculatedMaxPrice = targetCapRate > 0 ? (noi / (targetCapRate / 100)) : 0;
  const priceDifference = calculatedMaxPrice - purchasePrice;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header / Mode Switcher */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {t.capRateCalc.interactiveBadge}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {t.capRateCalc.title}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {t.capRateCalc.subtitle}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/80 self-start md:self-auto" role="group" aria-label={t.capRateCalc.modeGroupAria}>
          <button
            type="button"
            aria-pressed={mode === 'forward'}
            onClick={() => setMode('forward')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-[background-color,color,box-shadow,transform] duration-150 ease-out active-press ${
              mode === 'forward'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.capRateCalc.modeForward}
          </button>
          <button
            type="button"
            aria-pressed={mode === 'reverse'}
            onClick={() => setMode('reverse')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-[background-color,color,box-shadow,transform] duration-150 ease-out active-press ${
              mode === 'reverse'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.capRateCalc.modeReverse}
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
            <span className="text-xs text-slate-600">{universalFormulaNote}</span>
            <button
              type="button"
              data-testid="load-page-example-btn"
              onClick={() => {
                setMode('forward');
                setPurchasePrice(initialPrice);
                setNoi(initialNoi);
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors shrink-0"
            >
              {loadExampleLabel}
            </button>
          </div>
          {mode === 'forward' ? (
            <>
              {/* Purchase Price Input */}
              <div>
                <label htmlFor="caprate-price-input" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.capRateCalc.priceLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="caprate-price-input"
                    type="number"
                    value={purchasePrice || ''}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="2,400,000"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[1000000, 2400000, 5000000, 10000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPurchasePrice(val)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-md transition-[background-color,transform] duration-150 ease-out active-press tabular-nums"
                    >
                      {formatCurrency(val)}
                    </button>
                  ))}
                </div>
              </div>

              {/* NOI Input */}
              <div>
                <label htmlFor="caprate-noi-input" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.capRateCalc.noiLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="caprate-noi-input"
                    type="number"
                    aria-describedby="caprate-noi-help"
                    value={noi || ''}
                    onChange={(e) => setNoi(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="168,000"
                  />
                </div>
                <div
                  id="caprate-noi-help"
                  data-testid="caprate-noi-helper"
                  className="text-xs text-slate-600 mt-2 bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5"
                >
                  <p className="flex items-start gap-1.5 leading-relaxed">
                    <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {t.capRateCalc.noiHelp}
                    </span>
                  </p>
                  <p className="pl-5">
                    <Link
                      href={`/${locale}/calculators/noi/`}
                      className="text-emerald-700 hover:text-emerald-600 font-semibold underline underline-offset-2 inline-flex items-center gap-1"
                    >
                      <span>{t.capRateCalc.noiHelpLink} {/* How to calculate NOI 不知道如何计算 NOI？用 NOI 计算器分步算出 */}</span>
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* NOI Input */}
              <div>
                <label htmlFor="caprate-noi-reverse-input" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.capRateCalc.noiLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="caprate-noi-reverse-input"
                    type="number"
                    aria-describedby="caprate-noi-reverse-help"
                    value={noi || ''}
                    onChange={(e) => setNoi(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="168,000"
                  />
                </div>
                <div
                  id="caprate-noi-reverse-help"
                  className="text-xs text-slate-600 mt-2 bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5"
                >
                  <p className="flex items-start gap-1.5 leading-relaxed">
                    <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {t.capRateCalc.noiHelp}
                    </span>
                  </p>
                  <p className="pl-5">
                    <Link
                      href={`/${locale}/calculators/noi/`}
                      className="text-emerald-700 hover:text-emerald-600 font-semibold underline underline-offset-2 inline-flex items-center gap-1"
                    >
                      <span>{t.capRateCalc.noiHelpLink} {/* How to calculate NOI 不知道如何计算 NOI？用 NOI 计算器分步算出 */}</span>
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </p>
                </div>
              </div>

              {/* Target Cap Rate Input */}
              <div>
                <label htmlFor="caprate-target-input" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.capRateCalc.targetCapRateLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <input
                    id="caprate-target-input"
                    type="number"
                    step="0.1"
                    value={targetCapRate || ''}
                    onChange={(e) => setTargetCapRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-4 pr-8 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="7.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[5.0, 6.0, 7.0, 7.5, 8.5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTargetCapRate(val)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-md transition-[background-color,transform] duration-150 ease-out active-press tabular-nums"
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Current Listing Price for Comparison */}
              <div>
                <label htmlFor="caprate-listing-input" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.capRateCalc.listingPriceLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="caprate-listing-input"
                    type="number"
                    value={purchasePrice || ''}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="2,400,000"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.capRateCalc.summaryTitle}
              </h3>
              <button
                type="button"
                onClick={handleShareDeal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 active:scale-95 transition-all shadow-2xs"
                title={t.capRateCalc.copyTitle}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">{t.capRateCalc.copied}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.capRateCalc.shareDeal}</span>
                  </>
                )}
              </button>
            </div>

            {mode === 'forward' ? (
              <div className="space-y-6">
                <div aria-live="polite">
                  <span className="text-sm font-medium text-slate-600">
                    {t.capRateCalc.capRateResultLabel}
                  </span>
                  <div data-testid="cap-rate-result" className="text-4xl md:text-5xl font-black text-emerald-600 mt-1 tabular-nums">
                    {formatPercent(calculatedCapRate)}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.capRateCalc.purchasePriceRow}</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.capRateCalc.annualNoiRow}</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(noi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.capRateCalc.monthlyNoiRow}</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(noi / 12)}</span>
                  </div>
                </div>

                {/* Cap Rate Visual Range Gauge */}
                <CapRateVisualGauge
                  capRate={calculatedCapRate}
                  purchasePrice={purchasePrice}
                  noi={noi}
                  locale={locale}
                />

                {/* Benchmark Insight */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.capRateCalc.marketInsightTitle} </span>
                    {calculatedCapRate >= 7.5
                      ? t.capRateCalc.marketInsightHigh
                      : calculatedCapRate >= 5.5
                      ? t.capRateCalc.marketInsightCorePlus
                      : t.capRateCalc.marketInsightPrime}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div aria-live="polite">
                  <span className="text-sm font-medium text-slate-600">
                    {t.capRateCalc.maxPriceLabel}
                  </span>
                  <div className="text-3xl md:text-4xl font-black text-emerald-600 mt-1 tabular-nums">
                    {formatCurrency(calculatedMaxPrice)}
                  </div>
                </div>

                {purchasePrice > 0 && (
                  <div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.capRateCalc.listingPriceRow}</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.capRateCalc.differenceRow}</span>
                      <span className={`font-bold tabular-nums ${priceDifference < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {priceDifference < 0
                          ? `${t.capRateCalc.overpricedBy}${formatCurrency(Math.abs(priceDifference))}`
                          : `${t.capRateCalc.underpricedBy}${formatCurrency(priceDifference)}`}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    {t.capRateCalc.targetAlert(targetCapRate, formatCurrency(calculatedMaxPrice))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="text-slate-500">
              {t.capRateCalc.nextStepLabel}
            </span>
            <Link
              href={`/${locale}/tools/deal-analyzer/`}
              className="text-emerald-700 hover:text-emerald-600 font-bold underline underline-offset-2 inline-flex items-center gap-1 active-press"
            >
              <span>{t.capRateCalc.nextStepCta}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
