'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Calculator, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Exchange1031Timeline } from './visuals/Exchange1031Timeline';

interface Props {
  locale: string;
}

export function Exchange1031Calculator({ locale }: Props) {
  const isZh = locale === 'zh';

  // Inputs
  const [salePrice, setSalePrice] = useState<number>(2500000);
  const [originalCostBasis, setOriginalCostBasis] = useState<number>(1200000);
  const [sellingExpenses, setSellingExpenses] = useState<number>(150000);
  const [taxRate, setTaxRate] = useState<number>(25);

  // Calculations
  const netSaleProceeds = Math.max(0, salePrice - sellingExpenses);
  const realizedGain = Math.max(0, netSaleProceeds - originalCostBasis);
  const deferredTax = realizedGain * (taxRate / 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {isZh ? '资本利得延税计算' : 'Tax Deferral Analysis'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh ? '1031 Exchange 延税计算器' : '1031 Exchange Tax Deferral Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh
              ? '估算出售商业地产时通过 1031 置换可延迟缴纳的资本利得税金额与再投资门槛'
              : 'Estimate deferred capital gains tax and reinvestment targets for 1031 like-kind exchanges'}
          </p>
        </div>
      </div>

      {/* Prominent Tax Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 p-4 px-6 md:px-8 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isZh ? (
            <>
              <strong>重要免责声明：</strong>
              本计算器仅供初步财务估算与概念演示，不构成任何税务、法律或专业投资建议。实际递延税负受折旧追回税率 (Depreciation Recapture 25%)、联邦资本利得税 (15%-20%)、州税 (State Tax) 及净投资所得税 (NIIT 3.8%) 等多重因素影响。在进行 1031 Exchange 交易前，请务必咨询专业合规的合格中介人 (QI) 及执业注册会计师 (CPA)。
            </>
          ) : (
            <>
              <strong>Mandatory Tax Disclaimer:</strong> This calculator provides simplified estimations only and does not constitute legal or tax advice. Actual tax liability depends on depreciation recapture (25%), federal capital gains rates (15-20%), state taxes, and NIIT (3.8%). Always consult a Qualified Intermediary (QI) and a licensed CPA prior to executing a 1031 exchange.
            </>
          )}
        </p>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Sale Price */}
            <div>
              <label htmlFor="sale-price-input" className="block text-sm font-semibold text-slate-700 mb-2">
                {isZh ? '拟出售物业售价 (Sale Price)' : 'Property Sale Price ($)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  id="sale-price-input"
                  type="number"
                  min="0"
                  value={salePrice || ''}
                  onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                  placeholder="2,500,000"
                />
              </div>
            </div>

            {/* Cost Basis & Selling Expenses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cost-basis-input" className="block text-sm font-semibold text-slate-700 mb-2">
                  {isZh ? '原始成本基准 (Cost Basis)' : 'Original Cost Basis ($)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="cost-basis-input"
                    type="number"
                    min="0"
                    value={originalCostBasis || ''}
                    onChange={(e) => setOriginalCostBasis(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="1,200,000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="selling-expenses-input" className="block text-sm font-semibold text-slate-700 mb-2">
                  {isZh ? '交易经纪与过户费用' : 'Selling Expenses ($)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="selling-expenses-input"
                    type="number"
                    min="0"
                    value={sellingExpenses || ''}
                    onChange={(e) => setSellingExpenses(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="150,000"
                  />
                </div>
              </div>
            </div>

            {/* Combined Tax Rate */}
            <div>
              <label htmlFor="tax-rate-input" className="block text-sm font-semibold text-slate-700 mb-2">
                {isZh ? '预计综合税率 (%)' : 'Estimated Combined Tax Rate (%)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                <input
                  id="tax-rate-input"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={taxRate || ''}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full pl-4 pr-8 py-3 text-slate-900 font-semibold focus:outline-none"
                  placeholder="25"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isZh
                  ? '包含联邦资本利得税 (15%-20%)、州税 (0%-13.3%)、折旧追回税 (25%) 及 NIIT (3.8%) 的综合预估税率'
                  : 'Combined estimate of Federal Capital Gains, State Tax, Depreciation Recapture, and NIIT'}
              </p>
            </div>
          </div>

          {/* Results Panel */}
          <div aria-live="polite" className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                {isZh ? '延税估算总览' : 'Tax Deferral Summary'}
              </h3>

              {/* Major Output */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isZh ? '预计可延迟缴纳资本利得税' : 'Estimated Deferred Tax'}
                </span>
                <div className="text-3xl md:text-4xl font-black text-emerald-600 mt-1">
                  {formatCurrency(Math.round(deferredTax))}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isZh
                    ? `基于约 ${formatCurrency(Math.round(realizedGain))} 的资本利得收益及 ${taxRate}% 综合税率`
                    : `Based on ${formatCurrency(Math.round(realizedGain))} realized gain at ${taxRate}% combined tax rate`}
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
                <div className="flex justify-between text-slate-700">
                  <span>{isZh ? '出售扣除费用后净所得 (Net Proceeds):' : 'Net Sale Proceeds:'}</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(Math.round(netSaleProceeds))}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{isZh ? '变现资本利得 (Realized Gain):' : 'Realized Capital Gain:'}</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(Math.round(realizedGain))}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1 mt-3">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isZh ? '100% 全额延税再投资目标:' : '100% Tax Deferral Reinvestment Rule:'}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    {isZh
                      ? `新购买的目标物业售价需 ≥ ${formatCurrency(Math.round(netSaleProceeds))}，且出售净现金需全部重新投入新项目中。`
                      : `Replacement property purchase price must be ≥ ${formatCurrency(Math.round(netSaleProceeds))} with all net cash equity reinvested.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1031 Exchange Statutory Timeline Visual Component */}
        <Exchange1031Timeline locale={locale} />
      </div>
    </div>
  );
}
