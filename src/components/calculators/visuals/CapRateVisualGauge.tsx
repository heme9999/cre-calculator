'use client';

import React from 'react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Info, HelpCircle } from 'lucide-react';

interface Props {
  capRate: number;
  purchasePrice: number;
  noi: number;
  locale: string;
}

export function CapRateVisualGauge({ capRate, purchasePrice, noi, locale }: Props) {
  const isZh = locale === 'zh';

  // Validation
  const isValid = purchasePrice > 0 && isFinite(capRate) && !isNaN(capRate);

  // Position calculation (0% to 12% scale)
  const isNegative = capRate < 0;
  const isAboveScale = capRate > 12;
  const clampedCapRate = Math.min(Math.max(capRate, 0), 12);
  const positionPercent = (clampedCapRate / 12) * 100;

  // Neutral indicative labels
  const getIndicativeTier = (val: number) => {
    if (val < 0) return isZh ? '净营业收入为负' : 'Negative NOI';
    if (val < 4.5) return isZh ? '较低参考收益率' : 'Lower Indicative Yield (<4.5%)';
    if (val <= 7.0) return isZh ? '中等参考收益率' : 'Mid-Range Indicative Yield (4.5–7%)';
    if (val <= 9.5) return isZh ? '较高参考收益率' : 'Higher Indicative Yield (7–9.5%)';
    return isZh ? '很高参考收益率' : 'Very High Indicative Yield (>9.5%)';
  };

  const getPointerLabel = () => {
    if (!isValid) return '';
    if (isNegative) return `${formatPercent(capRate)} — ${isZh ? '净收益为负' : 'negative NOI'}`;
    if (isAboveScale) return `${formatPercent(capRate)} — ${isZh ? '超出示意区间' : 'above illustrated range'}`;
    return formatPercent(capRate);
  };

  return (
    <figure className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4 text-left my-4">
      {/* Header & Numeric Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isZh ? '资本化率参考标尺' : 'Cap Rate Benchmark Scale'}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className={`text-2xl font-black ${!isValid ? 'text-slate-400' : isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isValid ? formatPercent(capRate) : '—'}
            </span>
            <span className="text-xs font-bold text-slate-700">
              • {isValid ? getIndicativeTier(capRate) : (isZh ? '等待有效输入' : 'Awaiting valid inputs')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{isZh ? '价格' : 'Price'}</span>
            <span className="font-bold text-slate-900">{purchasePrice > 0 ? formatCurrency(purchasePrice) : '—'}</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">NOI</span>
            <span className="font-bold text-slate-900">{isValid ? formatCurrency(noi) : '—'}</span>
          </div>
        </div>
      </div>

      {/* Visual Scale or Neutral Placeholder */}
      {isValid ? (
        <div className="space-y-2 pt-2" aria-hidden="true">
          {/* Neutral 0-12% Multi-segment Bar */}
          <div className="relative h-6 w-full bg-slate-200 rounded-full overflow-hidden flex text-[10px] font-bold text-slate-700 select-none">
            {/* Tier 1: 0 to 4.5% (37.5% width) - Lower Indicative Yield */}
            <div
              style={{ width: '37.5%' }}
              className="bg-blue-100 border-r border-blue-300 flex items-center justify-center text-blue-900 px-1 text-center font-semibold"
              title="< 4.5% Lower Indicative Yield"
            >
              <span className="truncate">&lt; 4.5%</span>
            </div>

            {/* Tier 2: 4.5 to 7.0% (20.83% width) - Mid-Range Indicative Yield */}
            <div
              style={{ width: '20.83%' }}
              className="bg-emerald-100 border-r border-emerald-300 flex items-center justify-center text-emerald-900 px-1 text-center font-semibold"
              title="4.5% - 7.0% Mid-Range Indicative Yield"
            >
              <span className="truncate">4.5–7%</span>
            </div>

            {/* Tier 3: 7.0 to 9.5% (20.83% width) - Higher Indicative Yield */}
            <div
              style={{ width: '20.83%' }}
              className="bg-amber-100 border-r border-amber-300 flex items-center justify-center text-amber-900 px-1 text-center font-semibold"
              title="7.0% - 9.5% Higher Indicative Yield"
            >
              <span className="truncate">7–9.5%</span>
            </div>

            {/* Tier 4: 9.5 to 12.0% (20.84% width) - Very High Indicative Yield */}
            <div
              style={{ width: '20.84%' }}
              className="bg-purple-100 flex items-center justify-center text-purple-900 px-1 text-center font-semibold"
              title="> 9.5% Very High Indicative Yield"
            >
              <span className="truncate">&gt; 9.5%</span>
            </div>
          </div>

          {/* Dynamic Pointer Marker */}
          <div className="relative w-full h-6">
            <div
              style={{ left: `${positionPercent}%` }}
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center motion-reduce:transition-none transition-all duration-150"
            >
              <div
                className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] ${
                  isNegative ? 'border-b-rose-700' : 'border-b-slate-900'
                }`}
              />
              <span
                className={`text-[10px] font-bold font-mono text-white px-2 py-0.5 rounded shadow-xs mt-0.5 whitespace-nowrap ${
                  isNegative ? 'bg-rose-700' : 'bg-slate-900'
                }`}
              >
                {getPointerLabel()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 border border-slate-200/80 rounded-xl p-3.5 text-xs text-slate-500 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span>{isZh ? '请输入有效的购买价格与年净营业收入以查看参考标尺。' : 'Enter valid purchase price and NOI to view the illustrative scale.'}</span>
        </div>
      )}

      {/* Required Neutral Disclaimer in Figcaption */}
      <figcaption className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5 pt-1">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          {isZh
            ? '以上区间仅用于示意。资本化率会因物业类型、位置、租约结构、物业状况、交易质量及市场日期而显著不同，不构成统一的投资分类或投资建议。'
            : 'Illustrative context only. Cap rates vary materially by property type, location, lease structure, condition, transaction quality and market date. These ranges are not universal investment classifications or investment advice.'}
        </span>
      </figcaption>
    </figure>
  );
}
