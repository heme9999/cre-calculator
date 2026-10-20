import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { calculateLoanDetails } from '@/lib/loanCalculations';
import { Sparkles } from 'lucide-react';

interface Props {
  locale: string;
}

export function LoanScenarioComparison({ locale }: Props) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const benchmarkInput = {
    loanAmount: 2100000,
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
      {/* Dynamic Intro Paragraph */}
      <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 rounded-r-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
        {isZh ? (
          <p>
            假设申请一笔 <strong>{formatCurrency(benchmarkInput.loanAmount)}</strong> 的商业地产贷款，利率 <strong>{benchmarkInput.interestRate}%</strong>，按 <strong>{benchmarkInput.amortizationYears} 年摊销</strong>，到期年限为 <strong>{benchmarkInput.balloonYears} 年</strong>（到期偿还气球尾款）：
          </p>
        ) : isEs ? (
          <p>
            Suponga que obtiene un préstamo comercial de <strong>{formatCurrency(benchmarkInput.loanAmount)}</strong> al <strong>{benchmarkInput.interestRate}%</strong> de interés con amortización a <strong>{benchmarkInput.amortizationYears} años</strong> y vencimiento balloon a <strong>{benchmarkInput.balloonYears} años</strong>:
          </p>
        ) : isPt ? (
          <p>
            Suponha que você contrate um financiamento comercial de <strong>{formatCurrency(benchmarkInput.loanAmount)}</strong> a <strong>{benchmarkInput.interestRate}%</strong> de juros com amortização em <strong>{benchmarkInput.amortizationYears} anos</strong> e vencimento balão em <strong>{benchmarkInput.balloonYears} anos</strong>:
          </p>
        ) : (
          <p>
            Suppose you obtain a <strong>{formatCurrency(benchmarkInput.loanAmount)}</strong> commercial loan at <strong>{benchmarkInput.interestRate}%</strong> interest on a <strong>{benchmarkInput.amortizationYears}-year amortization</strong> schedule with a <strong>{benchmarkInput.balloonYears}-year balloon maturity</strong>:
          </p>
        )}
      </div>

      {/* Dynamic Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Equal Installment Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                1. {isZh ? '等额本息 (Equal Installment)' : isEs ? 'Cuota Fija (Amortización Francesa)' : isPt ? 'Tabela Price (Parcela Fixa)' : 'Equal Installment (Fixed)'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isZh ? '每月月供固定不变' : isEs ? 'Pago mensual fijo constante' : isPt ? 'Pagamento mensal fixo e constante' : 'Fixed Monthly Payment'}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              {formatCurrency(Math.round(inst.monthlyPayment))} / {isZh ? '月' : isEs ? 'mes' : isPt ? 'mês' : 'mo'}
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex justify-between">
              <span className="text-slate-600">
                {isZh ? '10年累计支付利息:' : isEs ? 'Intereses pagados en 10 años:' : isPt ? 'Juros pagos em 10 anos:' : '10-Yr Interest Paid:'}
              </span>
              <span className="font-semibold text-slate-900">{formatCurrency(Math.round(inst.termInterest))}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">
                {isZh ? '第10年到期气球尾款:' : isEs ? 'Saldo balloon al año 10:' : isPt ? 'Saldo balão no 10º ano:' : 'Year 10 Balloon Payoff:'}
              </span>
              <span className="font-semibold text-slate-900">{formatCurrency(Math.round(inst.balloonBalance))}</span>
            </li>
            <li className="flex justify-between text-slate-500 text-[11px]">
              <span>
                {isZh ? '尾款占原本金比例:' : isEs ? '% de saldo balloon sobre principal:' : isPt ? '% de saldo balão sobre o principal:' : 'Balloon % of Principal:'}
              </span>
              <span className="font-medium">{inst.balloonPercentage.toFixed(1)}%</span>
            </li>
          </ul>
        </div>

        {/* Equal Principal Card */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-950 block flex items-center gap-1.5">
                2. {isZh ? '等额本金 (Equal Principal)' : isEs ? 'Capital Constante (Cuota Decreciente)' : isPt ? 'Sistema SAC (Amortização Constante)' : 'Equal Principal (Declining)'}
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              <span className="text-[11px] text-emerald-700">
                {isZh ? '月供逐月递减，快速削减本金' : isEs ? 'Cuota decreciente, amortización más rápida' : isPt ? 'Parcelas decrescentes, amortização rápida' : 'Declining Payment, Faster Amortization'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-900 bg-white px-2.5 py-1 rounded-md border border-emerald-300 block">
                {formatCurrency(Math.round(prin.equalPrincipalMonth1Payment))} / {isZh ? '首月' : isEs ? 'mes 1' : isPt ? 'mês 1' : 'mo 1'}
              </span>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex justify-between">
              <span className="text-slate-600">
                {isZh ? '第120个月末月月供:' : isEs ? 'Cuota final del mes 120:' : isPt ? 'Parcela final do mês 120:' : 'Month 120 Final Payment:'}
              </span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(Math.round(prin.equalPrincipalMonthEndPayment))} / {isZh ? '月' : isEs ? 'mes' : isPt ? 'mês' : 'mo'}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">
                {isZh ? '10年累计支付利息:' : isEs ? 'Intereses pagados en 10 años:' : isPt ? 'Juros pagos em 10 anos:' : '10-Yr Interest Paid:'}
              </span>
              <span className="font-semibold text-emerald-700">{formatCurrency(Math.round(prin.termInterest))}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">
                {isZh ? '第10年到期气球尾款:' : isEs ? 'Saldo balloon al año 10:' : isPt ? 'Saldo balão no 10º ano:' : 'Year 10 Balloon Payoff:'}
              </span>
              <span className="font-bold text-slate-900">{formatCurrency(Math.round(prin.balloonBalance))}</span>
            </li>
            <li className="flex justify-between text-emerald-800 text-[11px] font-medium pt-1 border-t border-emerald-200/60">
              <span>
                {isZh ? '比等额本息省利息:' : isEs ? 'Ahorro total en intereses:' : isPt ? 'Economia total em juros:' : 'Total Interest Savings:'}
              </span>
              <span className="font-bold text-emerald-700">{formatCurrency(Math.round(interestSaved))}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
