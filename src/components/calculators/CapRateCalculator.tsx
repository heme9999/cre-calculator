'use client';

import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Calculator, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { CapRateVisualGauge } from './visuals/CapRateVisualGauge';

interface Props {
  locale: string;
}

export function CapRateCalculator({ locale }: Props) {
  const isZh = locale === 'zh';
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');

  // Forward Mode state: Purchase Price + NOI -> Cap Rate
  const [purchasePrice, setPurchasePrice] = useState<number>(2400000);
  const [noi, setNoi] = useState<number>(168000);

  // Reverse Mode state: NOI + Target Cap Rate -> Max Purchase Price
  const [targetCapRate, setTargetCapRate] = useState<number>(7.5);

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
            {isZh ? '实时交互工具' : 'Interactive Tool'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh ? 'Cap Rate 实时计算器' : 'Cap Rate Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh ? '选择计算方向，输入数字实时出结果' : 'Select mode and enter values for instant results'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 self-start md:self-auto">
          <button
            onClick={() => setMode('forward')}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${
              mode === 'forward'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isZh ? '正算 Cap Rate' : 'Calculate Cap Rate'}
          </button>
          <button
            onClick={() => setMode('reverse')}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${
              mode === 'reverse'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isZh ? '反算购买价' : 'Reverse Purchase Price'}
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {mode === 'forward' ? (
            <>
              {/* Purchase Price Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {isZh ? '物业购买价格 (Purchase Price)' : 'Property Purchase Price ($)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={purchasePrice || ''}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="2,400,000"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[1000000, 2400000, 5000000, 10000000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setPurchasePrice(val)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-md transition"
                    >
                      {formatCurrency(val)}
                    </button>
                  ))}
                </div>
              </div>

              {/* NOI Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {isZh ? '年净营业收入 (Annual NOI)' : 'Annual Net Operating Income (NOI)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={noi || ''}
                    onChange={(e) => setNoi(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="168,000"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  {isZh ? '扣除运营支出后，还贷及缴税前的净收入' : 'Income after operating expenses, before debt & tax'}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* NOI Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {isZh ? '年净营业收入 (Annual NOI)' : 'Annual Net Operating Income (NOI)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={noi || ''}
                    onChange={(e) => setNoi(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="168,000"
                  />
                </div>
              </div>

              {/* Target Cap Rate Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {isZh ? '目标 Cap Rate (%)' : 'Target Cap Rate (%)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <input
                    type="number"
                    step="0.1"
                    value={targetCapRate || ''}
                    onChange={(e) => setTargetCapRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-4 pr-8 py-3 text-slate-900 font-semibold focus:outline-none"
                    placeholder="7.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {[5.0, 6.0, 7.0, 7.5, 8.5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTargetCapRate(val)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-md transition"
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Current Listing Price for Comparison */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {isZh ? '对比：卖方挂牌价格（选填）' : 'Listing Price for Comparison (Optional)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
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
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              {isZh ? '计算结果分析' : 'Calculation Summary'}
            </h3>

            {mode === 'forward' ? (
              <div className="space-y-6">
                <div aria-live="polite">
                  <span className="text-sm font-medium text-slate-600">
                    {isZh ? '资本化率 (Cap Rate)' : 'Capitalization Rate'}
                  </span>
                  <div className="text-4xl md:text-5xl font-black text-emerald-600 mt-1">
                    {formatPercent(calculatedCapRate)}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isZh ? '购买价格:' : 'Purchase Price:'}</span>
                    <span className="font-semibold">{formatCurrency(purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isZh ? '年 NOI:' : 'Annual NOI:'}</span>
                    <span className="font-semibold">{formatCurrency(noi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isZh ? '月平均 NOI:' : 'Monthly NOI:'}</span>
                    <span className="font-semibold">{formatCurrency(noi / 12)}</span>
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
                    <span className="font-bold">{isZh ? '市场快评：' : 'Market Insight: '}</span>
                    {calculatedCapRate >= 7.5
                      ? (isZh ? '高收益率区间（通常对应次级市场或高风险/更高现金流资产）。' : 'High yield tier (typically secondary markets or higher-risk profile assets).')
                      : calculatedCapRate >= 5.5
                      ? (isZh ? '稳健主流商业地产区间（核心与次核心城市常见交割水平）。' : 'Standard core-plus commercial range for primary/secondary markets.')
                      : (isZh ? '核心低收益率区间（核心城市Prime location，注重资产保值）。' : 'Prime core tier with lower immediate yield, focusing on stability & appreciation.')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div aria-live="polite">
                  <span className="text-sm font-medium text-slate-600">
                    {isZh ? '最高可接受购买价格' : 'Max Acceptable Purchase Price'}
                  </span>
                  <div className="text-3xl md:text-4xl font-black text-emerald-600 mt-1">
                    {formatCurrency(calculatedMaxPrice)}
                  </div>
                </div>

                {purchasePrice > 0 && (
                  <div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isZh ? '卖方挂牌价格:' : 'Listing Price:'}</span>
                      <span className="font-semibold">{formatCurrency(purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isZh ? '价格额度差距:' : 'Price Difference:'}</span>
                      <span className={`font-bold ${priceDifference < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {priceDifference < 0
                          ? `${isZh ? '高出 ' : 'Overpriced by '}${formatCurrency(Math.abs(priceDifference))}`
                          : `${isZh ? '低于 ' : 'Underpriced by '}${formatCurrency(priceDifference)}`}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    {isZh
                      ? `若要达到 ${targetCapRate}% 的目标Cap Rate，最高出价不应超过 ${formatCurrency(calculatedMaxPrice)}。`
                      : `To achieve a ${targetCapRate}% cap rate, your maximum purchase price should not exceed ${formatCurrency(calculatedMaxPrice)}.`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
