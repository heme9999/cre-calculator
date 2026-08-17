'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { ShieldAlert, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface Props {
  dscr: number;
  noi: number;
  debtService: number;
  locale: string;
}

export function DscrCoverageTierVisualizer({ dscr, noi, debtService, locale }: Props) {
  const isZh = locale === 'zh';

  // Pointer position clamped between 0x and 2.0x for visual bar
  const clampedDscr = Math.min(Math.max(dscr, 0), 2.0);
  const positionPercent = (clampedDscr / 2.0) * 100;

  // Visual Tiers:
  // Tier 1: 0 to 1.00x (50% bar width) -> Insufficient coverage (<1.00x)
  // Tier 2: 1.00x to 1.25x (12.5% bar width) -> Tight / Limited cushion (1.00 - 1.24x)
  // Tier 3: 1.25x to 2.00x (37.5% bar width) -> Healthy Commercial Benchmark (>=1.25x)

  return (
    <figure className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4 text-left my-4">
      {/* Header with numeric summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isZh ? 'DSCR 承销覆盖率层级' : 'DSCR Underwriting Benchmark Tier'}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className={`text-2xl font-black ${
                dscr < 1.0 ? 'text-rose-600' : dscr < 1.25 ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {dscr.toFixed(2)}x
            </span>
            <span className="text-xs font-bold text-slate-700">
              •{' '}
              {dscr < 1.0
                ? isZh
                  ? '覆盖不足 / 现金流缺口'
                  : 'Insufficient Coverage'
                : dscr < 1.25
                ? isZh
                  ? '安全垫较窄 / 临界门槛'
                  : 'Limited Cushion (1.00–1.24x)'
                : isZh
                ? '达标 / 满足主流审贷标准'
                : 'Meets Common Lender Threshold (≥1.25x)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">NOI</span>
            <span className="font-bold text-slate-900">{formatCurrency(noi)}</span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{isZh ? '还本付息' : 'Debt Service'}</span>
            <span className="font-bold text-slate-900">{formatCurrency(debtService)}</span>
          </div>
        </div>
      </div>

      {/* Visual DSCR Scale (0.0x to 2.0x) */}
      <div className="space-y-2 pt-2">
        <div className="relative h-6 w-full bg-slate-200 rounded-full overflow-hidden flex text-[10px] font-bold select-none">
          {/* Tier 1: 0.0 to 1.00x (50% width) */}
          <div
            style={{ width: '50%' }}
            className="bg-rose-100 border-r border-rose-300 flex items-center justify-center text-rose-900 px-1 text-center font-bold"
            title="< 1.00x Insufficient Coverage"
          >
            <span className="truncate">&lt; 1.00x {isZh ? '收入不抵还款' : 'Deficit'}</span>
          </div>

          {/* Tier 2: 1.00 to 1.25x (12.5% width) */}
          <div
            style={{ width: '12.5%' }}
            className="bg-amber-100 border-r border-amber-300 flex items-center justify-center text-amber-900 px-1 text-center font-bold"
            title="1.00x - 1.24x Limited Cushion"
          >
            <span className="truncate">1.0–1.24x</span>
          </div>

          {/* Tier 3: 1.25 to 2.00x (37.5% width) */}
          <div
            style={{ width: '37.5%' }}
            className="bg-emerald-100 flex items-center justify-center text-emerald-900 px-1 text-center font-bold"
            title=">= 1.25x Common Lender Threshold"
          >
            <span className="truncate">≥ 1.25x {isZh ? '银行主流标准' : 'Standard'}</span>
          </div>
        </div>

        {/* Dynamic Pointer Marker */}
        <div className="relative w-full h-5">
          <div
            style={{ left: `${positionPercent}%` }}
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-150"
          >
            <div
              className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] ${
                dscr < 1.0
                  ? 'border-b-rose-700'
                  : dscr < 1.25
                  ? 'border-b-amber-700'
                  : 'border-b-slate-900'
              }`}
            />
            <span
              className={`text-[10px] font-black font-mono text-white px-1.5 py-0.5 rounded shadow-xs mt-0.5 whitespace-nowrap ${
                dscr < 1.0 ? 'bg-rose-700' : dscr < 1.25 ? 'bg-amber-700' : 'bg-slate-900'
              }`}
            >
              {dscr.toFixed(2)}x
            </span>
          </div>
        </div>
      </div>

      {/* 3 Tier Key Callout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>&lt; 1.00x</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            {isZh ? '净收入不足以覆盖还本付息，存在偿债风险' : 'Income fails to cover debt payments (cash deficit)'}
          </p>
        </div>

        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>1.00x – 1.24x</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            {isZh ? '虽有微盈但安全垫较窄，多数商业银行要求补充担保' : 'Tight cushion; most conventional lenders require 1.20x+'}
          </p>
        </div>

        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>≥ 1.25x</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            {isZh ? 'Fannie/Freddie 与商业银行常规审核标准' : 'Standard institutional lender target for agency/CRE loans'}
          </p>
        </div>
      </div>

      {/* Figcaption */}
      <figcaption className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5 pt-1">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>
          {isZh
            ? '重要提示：实际审贷标准因贷款机构类型、物业业态（如多户公寓通常要求 1.20–1.25x，办公或酒店可能要求 1.30–1.40x）及借款人资质而异。'
            : 'Important: Lender DSCR requirements vary by property type (multifamily typically 1.20–1.25x vs. hospitality/office at 1.30–1.40x), loan program, and borrower credit.'}
        </span>
      </figcaption>
    </figure>
  );
}
