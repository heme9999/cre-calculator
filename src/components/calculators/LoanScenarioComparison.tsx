import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { calculateLoanDetails } from '@/lib/loanCalculations';
import { Check, Sparkles, Scale } from 'lucide-react';

interface Props {
  locale: string;
}

export function LoanScenarioComparison({ locale }: Props) {
  const isZh = locale === 'zh';

  const benchmarkInput = {
    loanAmount: 1300000,
    interestRate: 6.5,
    amortizationYears: 25,
    balloonYears: 10,
    hasBalloon: true,
  };

  const inst = calculateLoanDetails({ ...benchmarkInput, paymentType: 'installment' });
  const prin = calculateLoanDetails({ ...benchmarkInput, paymentType: 'principal' });

  const interestSaved = inst.termInterest - prin.termInterest;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-600" />
          {isZh
            ? `真实场景对比 ($130万贷款, 6.5%利率, 25年摊销, 10年到期)`
            : `Real Scenario Comparison ($1.3M Loan, 6.5% Rate, 25-Yr Amort, 10-Yr Balloon)`}
        </h3>
        <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          {isZh ? '公式算法实时同步' : 'Live Formula Output'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Equal Installment Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                1. {isZh ? '等额本息 (Equal Installment)' : 'Equal Installment (Fixed)'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isZh ? '月供总额固定不变' : 'Fixed Monthly Payment'}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              {formatCurrency(Math.round(inst.monthlyPayment))} / {isZh ? '月' : 'mo'}
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex justify-between">
              <span className="text-slate-600">{isZh ? '10年累计支付利息:' : '10-Yr Interest Paid:'}</span>
              <span className="font-semibold text-slate-900">{formatCurrency(Math.round(inst.termInterest))}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">{isZh ? '第10年到期气球尾款:' : 'Year 10 Balloon Payoff:'}</span>
              <span className="font-semibold text-slate-900">{formatCurrency(Math.round(inst.balloonBalance))}</span>
            </li>
            <li className="flex justify-between text-slate-500 text-[11px]">
              <span>{isZh ? '尾款占原本金比例:' : 'Balloon % of Principal:'}</span>
              <span className="font-medium">{inst.balloonPercentage.toFixed(1)}%</span>
            </li>
          </ul>
        </div>

        {/* Equal Principal Card */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-950 block flex items-center gap-1.5">
                2. {isZh ? '等额本金 (Equal Principal)' : 'Equal Principal (Declining)'}
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              <span className="text-[11px] text-emerald-700">
                {isZh ? '月供逐月递减，快速削减本金' : 'Declining Payment, Faster Amortization'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-900 bg-white px-2.5 py-1 rounded-md border border-emerald-300 block">
                {formatCurrency(Math.round(prin.equalPrincipalMonth1Payment))} / {isZh ? '首月' : 'mo 1'}
              </span>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex justify-between">
              <span className="text-slate-600">{isZh ? '第120个月末月月供:' : 'Month 120 Final Payment:'}</span>
              <span className="font-semibold text-slate-900">{formatCurrency(Math.round(prin.equalPrincipalMonthEndPayment))} / {isZh ? '月' : 'mo'}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">{isZh ? '10年累计支付利息:' : '10-Yr Interest Paid:'}</span>
              <span className="font-semibold text-emerald-700">{formatCurrency(Math.round(prin.termInterest))}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">{isZh ? '第10年到期气球尾款:' : 'Year 10 Balloon Payoff:'}</span>
              <span className="font-bold text-slate-900">{formatCurrency(Math.round(prin.balloonBalance))}</span>
            </li>
            <li className="flex justify-between text-emerald-800 text-[11px] font-medium pt-1 border-t border-emerald-200/60">
              <span>{isZh ? '比等额本息省利息:' : 'Total Interest Savings:'}</span>
              <span className="font-bold text-emerald-700">{formatCurrency(Math.round(interestSaved))}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
