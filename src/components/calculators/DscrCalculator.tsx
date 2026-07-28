'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Calculator, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

interface Props {
  locale: string;
}

export function DscrCalculator({ locale }: Props) {
  const isZh = locale === 'zh';

  // Inputs
  const [noi, setNoi] = useState<number>(250000);
  const [annualDebtService, setAnnualDebtService] = useState<number>(187500);
  const [isMonthlyInput, setIsMonthlyInput] = useState<boolean>(false);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(15625);

  // Derived calculations
  const effectiveDebtService = isMonthlyInput ? monthlyPayment * 12 : annualDebtService;
  const dscr = effectiveDebtService > 0 ? noi / effectiveDebtService : 0;
  const cashCushion = noi - effectiveDebtService;
  const maxDebtForTarget = noi / 1.25;

  // Status Tier based on user specification
  let statusColor = 'text-emerald-600';
  let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let statusText = isZh
    ? '较为健康的安全边际 (符合绝大多数商业地产贷款机构标准)'
    : 'Healthy Safety Margin (Meets or exceeds commercial lender standards)';
  let StatusIcon = CheckCircle2;

  if (dscr < 1.0) {
    statusColor = 'text-rose-600';
    badgeBg = 'bg-rose-50 text-rose-900 border-rose-300 font-bold';
    statusText = isZh
      ? '警示：净营业收入不足以覆盖贷款还款 (现金流倒挂)'
      : 'Warning: Net Operating Income Insufficient to Cover Debt Service';
    StatusIcon = ShieldAlert;
  } else if (dscr < 1.25) {
    statusColor = 'text-amber-600';
    badgeBg = 'bg-amber-50 text-amber-900 border-amber-300 font-semibold';
    statusText = isZh
      ? '处于多数贷款机构最低门槛附近 (1.20 - 1.25x)，需谨慎评估'
      : 'Near Lender Minimum Threshold (1.20 - 1.25x), Requires Cautious Evaluation';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {isZh ? '偿债覆盖率计算' : 'DSCR Underwriting Tool'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh ? 'DSCR (偿债覆盖率) 实时计算器' : 'Debt Service Coverage Ratio (DSCR) Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh ? '对照商业银行审核标准，评估物业净收入对债务本息的覆盖安全度' : 'Evaluate net operating income against annual loan payments'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Annual NOI */}
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
                placeholder="250,000"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[100000, 250000, 500000, 1000000].map((val) => (
                <button
                  key={val}
                  onClick={() => setNoi(val)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-md transition"
                >
                  {formatCurrency(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Debt Service Input Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                {isZh
                  ? isMonthlyInput ? '月度贷款还款额 (Monthly Debt Service)' : '年度还贷总额 (Annual Debt Service)'
                  : isMonthlyInput ? 'Monthly Debt Service (P&I)' : 'Annual Debt Service (P&I)'}
              </label>
              <button
                type="button"
                onClick={() => {
                  if (isMonthlyInput) {
                    setAnnualDebtService(monthlyPayment * 12);
                  } else {
                    setMonthlyPayment(annualDebtService / 12);
                  }
                  setIsMonthlyInput(!isMonthlyInput);
                }}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                {isZh
                  ? isMonthlyInput ? '切换为按年输入' : '切换为按月输入'
                  : isMonthlyInput ? 'Switch to Annual' : 'Switch to Monthly'}
              </button>
            </div>

            <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
              <input
                type="number"
                value={isMonthlyInput ? (monthlyPayment || '') : (annualDebtService || '')}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  if (isMonthlyInput) {
                    setMonthlyPayment(val);
                    setAnnualDebtService(val * 12);
                  } else {
                    setAnnualDebtService(val);
                    setMonthlyPayment(val / 12);
                  }
                }}
                className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                placeholder={isMonthlyInput ? "15,625" : "187,500"}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isZh
                ? `年度总还款额: ${formatCurrency(effectiveDebtService)} / 年 (${formatCurrency(effectiveDebtService / 12)} / 月)`
                : `Total Annual Debt Service: ${formatCurrency(effectiveDebtService)}/yr (${formatCurrency(effectiveDebtService / 12)}/mo)`}
            </p>
          </div>

          {/* Underwriting Threshold Info Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-500" />
              {isZh ? '商业银行通用审核标准 (Lender Benchmarks)' : 'Standard Commercial Bank Underwriting Tiers:'}
            </span>
            <ul className="space-y-1 text-slate-600 pl-5 list-disc">
              <li><strong>≥ 1.25x</strong>: {isZh ? '常规商业银行标准批准线' : 'Standard Commercial Bank Minimum Threshold'}</li>
              <li><strong>1.15x - 1.20x</strong>: {isZh ? '优质长期单租户 (NNN) 或政府租户特别批准' : 'Acceptable for prime Long-term Net Lease/Government tenants'}</li>
              <li><strong>&lt; 1.00x</strong>: {isZh ? '入不敷出 (无法通过常规审核)' : 'Distressed / Negative Cash Flow'}</li>
            </ul>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              {isZh ? '偿债能力分析' : 'Underwriting Analysis'}
            </h3>

            {/* Major Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isZh ? 'DSCR 偿债覆盖率' : 'Debt Service Coverage Ratio (DSCR)'}
              </span>
              <div className={`text-4xl md:text-5xl font-black mt-1 ${statusColor}`}>
                {dscr.toFixed(2)}x
              </div>
              <div className={`mt-3 inline-flex items-center gap-1.5 p-2 rounded-lg border text-xs font-medium ${badgeBg}`}>
                <StatusIcon className="w-4 h-4 shrink-0" />
                <span>{statusText}</span>
              </div>
            </div>

            {/* Financial Cushion Breakdown */}
            <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-600">{isZh ? '年 NOI:' : 'Annual NOI:'}</span>
                <span className="font-semibold">{formatCurrency(noi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{isZh ? '年度还贷总额:' : 'Annual Debt Service:'}</span>
                <span className="font-semibold text-slate-900">{formatCurrency(effectiveDebtService)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-slate-200 pt-2">
                <span className="text-slate-800">{isZh ? '年税前现金缓冲 (Cash Cushion):' : 'Annual Pre-Tax Cushion:'}</span>
                <span className={cashCushion >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                  {formatCurrency(cashCushion)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{isZh ? '按 1.25x 标准推算最高允许年还贷:' : 'Max Allowable Debt for 1.25x:'}</span>
                <span className="font-semibold">{formatCurrency(maxDebtForTarget)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 mt-6 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              {isZh
                ? '提示：DSCR 越高，表明物业抵御租客空置和利息上升的能力越强，银行给予的利率优惠也通常更大。'
                : 'Tip: Higher DSCR reflects a larger income cushion against tenant vacancy or rate increases.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
