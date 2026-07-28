'use client';

import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Calculator, DollarSign, Zap, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  locale: string;
}

export function CashOnCashCalculator({ locale }: Props) {
  const isZh = locale === 'zh';

  // Inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(1200000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [closingCosts, setClosingCosts] = useState<number>(15000);
  const [upfrontCapex, setUpfrontCapex] = useState<number>(15000);
  
  const [annualNoi, setAnnualNoi] = useState<number>(84000);
  const [annualDebtService, setAnnualDebtService] = useState<number>(54000);

  // Derived Values
  const downPaymentAmount = (purchasePrice * downPaymentPercent) / 100;
  const totalCashInvested = downPaymentAmount + closingCosts + upfrontCapex;
  const annualCashFlow = annualNoi - annualDebtService;
  
  const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
  const capRate = purchasePrice > 0 ? (annualNoi / purchasePrice) * 100 : 0;
  
  const isPositiveLeverage = cashOnCashReturn > capRate;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {isZh ? '现金回报率计算' : 'Cash-on-Cash Return Tool'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh ? 'Cash-on-Cash Return (现金回报率) 计算器' : 'Cash-on-Cash Return Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh ? '基于实际投入现金与贷款后的净现金流，计算加杠杆后的资金效率' : 'Measure real pre-tax yield on total invested cash after financing'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Acquisition & Invested Cash */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              {isZh ? '1. 购买价格与实际投入现金' : '1. Acquisition & Total Cash Invested'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '物业购买价格 ($)' : 'Purchase Price ($)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={purchasePrice || ''}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                    placeholder="1,200,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '首付比例 (%)' : 'Down Payment (%)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    type="number"
                    value={downPaymentPercent || ''}
                    onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                    placeholder="25"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isZh ? `首付金额: ${formatCurrency(downPaymentAmount)}` : `Down Payment: ${formatCurrency(downPaymentAmount)}`}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '过户与贷款手续费 ($)' : 'Closing & Financing Costs ($)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={closingCosts || ''}
                    onChange={(e) => setClosingCosts(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 text-sm font-medium focus:outline-none"
                    placeholder="15,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '前期即时维修/改造 ($)' : 'Upfront Repairs & Capex ($)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={upfrontCapex || ''}
                    onChange={(e) => setUpfrontCapex(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 text-sm font-medium focus:outline-none"
                    placeholder="15,000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Income & Financing */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              {isZh ? '2. 年收益与贷款还款 (NOI & Debt Service)' : '2. Income & Debt Service'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '年净营业收入 (Annual NOI)' : 'Annual NOI ($)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={annualNoi || ''}
                    onChange={(e) => setAnnualNoi(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                    placeholder="84,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '年度贷款还款总额 (Annual Debt Service)' : 'Annual Debt Service (P&I) ($)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={annualDebtService || ''}
                    onChange={(e) => setAnnualDebtService(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                    placeholder="54,000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              {isZh ? '现金回报率分析' : 'Cash-on-Cash Analysis'}
            </h3>

            {/* Major Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isZh ? 'Cash-on-Cash Return (年化现金回报率)' : 'Cash-on-Cash Return'}
              </span>
              <div className="text-4xl md:text-5xl font-black text-emerald-600 mt-1">
                {formatPercent(cashOnCashReturn)}
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                {isPositiveLeverage ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span>
                  {isPositiveLeverage
                    ? (isZh ? `正向杠杆：回报率高于 Cap Rate (${formatPercent(capRate)})` : `Positive Leverage: Return exceeds Cap Rate (${formatPercent(capRate)})`)
                    : (isZh ? `负向杠杆：贷款成本偏高，低于 Cap Rate (${formatPercent(capRate)})` : `Negative Leverage: Return below Cap Rate (${formatPercent(capRate)})`)}
                </span>
              </p>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-600">{isZh ? '实际投入现金总额:' : 'Total Cash Invested:'}</span>
                <span className="font-semibold">{formatCurrency(totalCashInvested)}</span>
              </div>
              <div className="text-xs text-slate-500 pl-3 space-y-1">
                <div className="flex justify-between">
                  <span>└ {isZh ? '首付款 (Down Payment):' : 'Down Payment:'}</span>
                  <span>{formatCurrency(downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>└ {isZh ? '过户/手续费:' : 'Closing Costs:'}</span>
                  <span>{formatCurrency(closingCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span>└ {isZh ? '前期维修:' : 'Repairs/Capex:'}</span>
                  <span>{formatCurrency(upfrontCapex)}</span>
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                <span className="text-slate-800">{isZh ? '年税前净现金流:' : 'Annual Pre-Tax Cash Flow:'}</span>
                <span className="text-slate-900">{formatCurrency(annualCashFlow)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{isZh ? '无杠杆 Cap Rate 基准:' : 'Unleveraged Cap Rate:'}</span>
                <span className="font-semibold">{formatPercent(capRate)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 mt-6 flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              {isZh
                ? '衡量关键：Cash-on-Cash Return 仅看你钱包里实际付出的现金。杠杆加得越好，资金利用效率越高。'
                : 'Key take-away: Cash-on-cash return evaluates efficiency specifically on out-of-pocket equity invested.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
