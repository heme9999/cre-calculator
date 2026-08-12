'use client';

import React, { useState, useRef } from 'react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { PaymentType } from '@/lib/loanCalculations';
import {
  calculateDealAnalysis,
  DealAnalyzerInput,
} from '@/lib/dealAnalyzerCalculations';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Zap,
  FileDown,
  Sparkles,
} from 'lucide-react';

interface Props {
  locale: string;
}

export function DealAnalyzerTool({ locale }: Props) {
  const isZh = locale === 'zh';

  // Default Inputs set to real example: $2.8M purchase price, 2% closing, 336k GPI, 5% vacancy, 92k OpEx, 25% down, 6.5% interest, 25yr amort
  const [purchasePrice, setPurchasePrice] = useState<number>(2800000);
  const [closingCostsPercent, setClosingCostsPercent] = useState<number>(2.0);
  const [grossPotentialIncome, setGrossPotentialIncome] = useState<number>(336000);
  const [vacancyRate, setVacancyRate] = useState<number>(5.0);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(92000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25.0);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [amortizationYears, setAmortizationYears] = useState<number>(25);
  const [paymentType, setPaymentType] = useState<PaymentType>('installment');
  const [hasBalloon, setHasBalloon] = useState<boolean>(false);
  const [balloonYears, setBalloonYears] = useState<number>(10);

  // UI state
  const [showStressTest, setShowStressTest] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  const input: DealAnalyzerInput = {
    purchasePrice,
    closingCostsPercent,
    grossPotentialIncome,
    vacancyRate,
    operatingExpenses,
    downPaymentPercent,
    interestRate,
    amortizationYears,
    paymentType,
    hasBalloon,
    balloonYears,
  };

  const { base, stress } = calculateDealAnalysis(input, locale);

  // DOM Screenshot PDF Export Handler using html2canvas-pro + jsPDF
  const handleExportPdf = async () => {
    if (!pdfTemplateRef.current) return;
    try {
      setIsExportingPdf(true);
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');

      const element = pdfTemplateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution DPI
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(isZh ? 'deal-analyzer-underwriting-summary-zh.pdf' : 'deal-analyzer-underwriting-summary-en.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Status Icon & Styling Helper
  const getHealthBadge = (status: 'green' | 'yellow' | 'red') => {
    if (status === 'green') {
      return {
        bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
        badge: 'bg-emerald-600 text-white',
        Icon: CheckCircle2,
        label: isZh ? '健康 (Healthy)' : 'Healthy',
      };
    }
    if (status === 'yellow') {
      return {
        bg: 'bg-amber-50 border-amber-300 text-amber-950',
        badge: 'bg-amber-600 text-white',
        Icon: AlertTriangle,
        label: isZh ? '临界 (Caution)' : 'Caution',
      };
    }
    return {
      bg: 'bg-rose-50 border-rose-300 text-rose-950',
      badge: 'bg-rose-600 text-white',
      Icon: ShieldAlert,
      label: isZh ? '警示 (Warning)' : 'Warning',
    };
  };

  const baseBadge = getHealthBadge(base.healthStatus);
  const BaseIcon = baseBadge.Icon;

  const stressBadge = getHealthBadge(stress.healthStatus);
  const StressIcon = stressBadge.Icon;

  return (
    <div className="space-y-8 mb-12">
      {/* Tool Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Building2 className="w-3.5 h-3.5" />
              {isZh ? '全流程商业地产尽调与测算' : 'Full Commercial CRE Underwriting Suite'}
            </div>
            <h2 className="text-xl md:text-2xl font-bold">
              {isZh ? 'Deal Analyzer 综合尽调工具' : 'Deal Analyzer: Comprehensive CRE Underwriting'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {isZh
                ? '一次输入全部指标，进行压力测试并导出一页纸PDF尽调摘要'
                : 'One input set for Cap Rate, NOI, Cash-on-Cash, DSCR, and Break-Even Ratio.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowStressTest(!showStressTest)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
                showStressTest
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{showStressTest ? (isZh ? '隐藏压力测试' : 'Hide Stress Test') : (isZh ? '压力测试 (Stress Test)' : 'Stress Test Deal')}</span>
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExportingPdf ? (isZh ? '导出中...' : 'Generating...') : (isZh ? '导出 PDF 摘要' : 'Export as PDF')}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Property & Purchase */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                {isZh ? '1. 物业与购买信息 (Property & Acquisition)' : '1. Property & Acquisition Info'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="purchase-price-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {isZh ? '购买价格 (Purchase Price, $)' : 'Purchase Price ($)'}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      id="purchase-price-input"
                      type="number"
                      value={purchasePrice || ''}
                      onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="2,800,000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="closing-costs-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {isZh ? '过户成本 (Closing Costs, %)' : 'Closing Costs (%)'}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <input
                      id="closing-costs-input"
                      type="number"
                      step="0.25"
                      value={closingCostsPercent || ''}
                      onChange={(e) => setClosingCostsPercent(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-7 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="2.0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {isZh ? `过户支出: ${formatCurrency(base.closingCosts)}` : `Est: ${formatCurrency(base.closingCosts)}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Income & Expenses */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                {isZh ? '2. 收入与支出 (Income & Expenses)' : '2. Annual Income & Expenses'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="gpi-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {isZh ? '总潜在年收入 (GPI, $)' : 'Gross Potential Income ($)'}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      id="gpi-input"
                      type="number"
                      value={grossPotentialIncome || ''}
                      onChange={(e) => setGrossPotentialIncome(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="336,000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="vacancy-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {isZh ? '空置及坏账损失 (%)' : 'Vacancy & Credit Loss (%)'}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <input
                      id="vacancy-input"
                      type="number"
                      step="0.5"
                      value={vacancyRate || ''}
                      onChange={(e) => setVacancyRate(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-7 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="5.0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="opex-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {isZh ? '年运营支出 (OpEx, $)' : 'Annual Operating Expenses ($)'}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      id="opex-input"
                      type="number"
                      value={operatingExpenses || ''}
                      onChange={(e) => setOperatingExpenses(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="92,000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-950 font-medium gap-2">
                <span>{isZh ? `有效毛收入 EGI: ${formatCurrency(base.egi)}` : `EGI: ${formatCurrency(base.egi)}`}</span>
                <span className="font-bold text-emerald-700">{isZh ? `净营业收入 NOI: ${formatCurrency(base.noi)}` : `NOI: ${formatCurrency(base.noi)}`}</span>
              </div>
            </div>

            {/* Section 3: Financing Terms */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {isZh ? '3. 融资条件 (Financing Terms)' : '3. Debt & Financing Terms'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="downpayment-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {isZh ? '首付比例 (Down Payment, %)' : 'Down Payment (%)'}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <input
                      id="downpayment-input"
                      type="number"
                      step="1"
                      value={downPaymentPercent || ''}
                      onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-7 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="25"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="rate-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {isZh ? '年利率 (%)' : 'Interest Rate (%)'}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <input
                      id="rate-input"
                      type="number"
                      step="0.125"
                      value={interestRate || ''}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-7 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="6.5"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="amort-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {isZh ? '摊销年限 (Amortization)' : 'Amortization Term (Yrs)'}
                  </label>
                  <select
                    id="amort-input"
                    value={amortizationYears}
                    onChange={(e) => setAmortizationYears(parseInt(e.target.value) || 25)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus-ring text-slate-900 text-sm font-semibold bg-white"
                  >
                    <option value={15}>15 {isZh ? '年' : 'Years'}</option>
                    <option value={20}>20 {isZh ? '年' : 'Years'}</option>
                    <option value={25}>25 {isZh ? '年 (主流)' : 'Years (Std)'}</option>
                    <option value={30}>30 {isZh ? '年' : 'Years'}</option>
                  </select>
                </div>
              </div>

              {/* Repayment method switch */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-700">{isZh ? '还款模式:' : 'Repayment Method:'}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('installment')}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                      paymentType === 'installment'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isZh ? '等额本息 (Equal P&I)' : 'Equal Installment (Fixed)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('principal')}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                      paymentType === 'principal'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isZh ? '等额本金 (Equal Principal)' : 'Equal Principal (Declining)'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Core Results Panel */}
          <div className="lg:col-span-5 space-y-6">
            {/* Deal Health Banner */}
            <div className={`p-5 rounded-2xl border ${baseBadge.bg} space-y-2 transition-all`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isZh ? '交易综合健康度诊断' : 'Deal Health Evaluation'}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${baseBadge.badge}`}>
                  <BaseIcon className="w-3.5 h-3.5" />
                  {baseBadge.label}
                </span>
              </div>
              <h4 className="text-base font-bold">{base.healthTitle}</h4>
              <p className="text-xs leading-relaxed opacity-90">{base.healthDesc}</p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{isZh ? '净营业收入 NOI' : 'Annual NOI'}</span>
                <div className="text-xl font-black text-slate-900">{formatCurrency(base.noi)}</div>
                <span className="text-[10px] text-slate-500 block">{isZh ? `EGI: ${formatCurrency(base.egi)}` : `EGI: ${formatCurrency(base.egi)}`}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{isZh ? '资本化率 Cap Rate' : 'Cap Rate'}</span>
                <div className="text-xl font-black text-emerald-600">{formatPercent(base.capRate)}</div>
                <span className="text-[10px] text-slate-500 block">{isZh ? '全款无杠杆静态收益' : 'Unleveraged Yield'}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{isZh ? '现金回报率 CoC' : 'Cash-on-Cash'}</span>
                <div className="text-xl font-black text-emerald-600">{formatPercent(base.cashOnCashReturn)}</div>
                <span className="text-[10px] text-slate-500 block">{isZh ? `投入现金: ${formatCurrency(base.totalCashInvested)}` : `Cash: ${formatCurrency(base.totalCashInvested)}`}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{isZh ? '偿债覆盖率 DSCR' : 'DSCR'}</span>
                <div className={`text-xl font-black ${base.dscr < 1.25 ? (base.dscr < 1.0 ? 'text-rose-600' : 'text-amber-600') : 'text-emerald-600'}`}>
                  {base.dscr.toFixed(2)}x
                </div>
                <span className="text-[10px] text-slate-500 block">{isZh ? '行业线: 1.25x' : 'Benchmark: 1.25x'}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 col-span-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{isZh ? '收支平衡点 Break-Even Ratio' : 'Break-Even Ratio'}</span>
                  <span className={`text-xs font-bold ${base.breakEvenRatio > 85 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {formatPercent(base.breakEvenRatio)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all ${
                      base.breakEvenRatio > 90
                        ? 'bg-rose-500'
                        : base.breakEvenRatio > 85
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, base.breakEvenRatio)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block pt-1">
                  {isZh ? `年还贷: ${formatCurrency(base.annualDebtService)} (月供 ${formatCurrency(Math.round(base.monthlyPayment))})` : `Debt Service: ${formatCurrency(base.annualDebtService)} (${formatCurrency(Math.round(base.monthlyPayment))}/mo)`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stress Test Comparison Panel (Appears when toggled) */}
      {showStressTest && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-6 shadow-lg border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold">{isZh ? '交易压力测试对比 (Stress Test Comparison)' : 'Stress Test Side-by-Side Comparison'}</h3>
            </div>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-3 py-1 rounded-full border border-amber-500/30">
              {isZh ? '假设: 空置率 +5%, 利率 +1.0%' : 'Scenario: Vacancy +5%, Interest Rate +1.0%'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Base Case Card */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-white">{isZh ? '1. 基础情景 (Base Case)' : '1. Base Underwriting Case'}</h4>
                  <span className="text-xs text-slate-400">{isZh ? `空置率 ${base.vacancyLoss > 0 ? vacancyRate : 0}% · 利率 ${interestRate}%` : `Vacancy ${vacancyRate}% · Interest Rate ${interestRate}%`}</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${baseBadge.badge}`}>
                  {baseBadge.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">{isZh ? '净营业收入 NOI' : 'Annual NOI'}</span>
                  <span className="font-bold text-sm text-white">{formatCurrency(base.noi)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isZh ? '资本化率 Cap Rate' : 'Cap Rate'}</span>
                  <span className="font-bold text-sm text-emerald-400">{formatPercent(base.capRate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isZh ? '月供还款额' : 'Monthly Payment'}</span>
                  <span className="font-bold text-sm text-white">{formatCurrency(Math.round(base.monthlyPayment))}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isZh ? '年还贷总额' : 'Annual Debt Service'}</span>
                  <span className="font-bold text-sm text-white">{formatCurrency(base.annualDebtService)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isZh ? '现金回报率 CoC' : 'Cash-on-Cash'}</span>
                  <span className="font-bold text-sm text-emerald-400">{formatPercent(base.cashOnCashReturn)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isZh ? '偿债覆盖率 DSCR' : 'DSCR'}</span>
                  <span className={`font-bold text-sm ${base.dscr < 1.25 ? 'text-amber-400' : 'text-emerald-400'}`}>{base.dscr.toFixed(2)}x</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">{isZh ? '收支平衡点 BER' : 'Break-Even Ratio'}</span>
                  <span className="font-bold text-sm text-white">{formatPercent(base.breakEvenRatio)}</span>
                </div>
              </div>
            </div>

            {/* Stress Case Card */}
            <div className="bg-slate-800/80 border border-amber-500/50 rounded-xl p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    {isZh ? '2. 压力情景 (Stress Case)' : '2. Stressed Case (+5% Vacancy, +1.0% Rate)'}
                  </h4>
                  <span className="text-xs text-slate-400">{isZh ? `空置率 ${vacancyRate + 5}% · 利率 ${(interestRate + 1.0).toFixed(2)}%` : `Vacancy ${vacancyRate + 5}% · Interest Rate ${(interestRate + 1.0).toFixed(2)}%`}</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stressBadge.badge}`}>
                  {stressBadge.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">{isZh ? '净营业收入 NOI' : 'Stressed NOI'}</span>
                  <span className="font-bold text-sm text-rose-300">{formatCurrency(stress.noi)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isZh ? '资本化率 Cap Rate' : 'Stressed Cap Rate'}</span>
                  <span className="font-bold text-sm text-slate-200">{formatPercent(stress.capRate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isZh ? '月供还款额' : 'Stressed Monthly Pmt'}</span>
                  <span className="font-bold text-sm text-rose-300">{formatCurrency(Math.round(stress.monthlyPayment))}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isZh ? '年还贷总额' : 'Stressed Debt Service'}</span>
                  <span className="font-bold text-sm text-slate-200">{formatCurrency(stress.annualDebtService)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isZh ? '现金回报率 CoC' : 'Stressed CoC'}</span>
                  <span className="font-bold text-sm text-amber-400">{formatPercent(stress.cashOnCashReturn)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isZh ? '偿债覆盖率 DSCR' : 'Stressed DSCR'}</span>
                  <span className={`font-bold text-sm ${stress.dscr < 1.0 ? 'text-rose-400 font-extrabold' : 'text-amber-400'}`}>{stress.dscr.toFixed(2)}x</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">{isZh ? '收支平衡点 BER' : 'Stressed Break-Even Ratio'}</span>
                  <span className={`font-bold text-sm ${stress.breakEvenRatio > 90 ? 'text-rose-400' : 'text-amber-400'}`}>{formatPercent(stress.breakEvenRatio)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Printable DOM Card for html2canvas-pro Screenshot Export */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div
          ref={pdfTemplateRef}
          className="w-[800px] p-8 bg-white text-slate-900 font-sans space-y-6 border border-slate-200 shadow-none"
        >
          {/* Header */}
          <div className="border-b border-slate-300 pb-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xl">
                <Building2 className="w-6 h-6" />
                <span>{isZh ? '商业地产投资计算器' : 'CRE Calculators'}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                {isZh ? '商业地产尽调与投资分析摘要' : 'Commercial Real Estate Underwriting Summary'}
              </h1>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>Date: {new Date().toISOString().split('T')[0]}</div>
              <div className="font-mono text-[11px] text-emerald-700 font-bold mt-1">https://cre-calculator.pages.dev</div>
            </div>
          </div>

          {/* Deal Health Banner */}
          <div className={`p-4 rounded-xl border ${baseBadge.bg} flex items-center justify-between`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{isZh ? '交易健康度诊断' : 'Deal Health Evaluation'}</span>
              <span className="text-lg font-black">{base.healthTitle}</span>
              <p className="text-xs text-slate-700 mt-0.5">{base.healthDesc}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-sm font-black ${baseBadge.badge}`}>
              {baseBadge.label}
            </div>
          </div>

          {/* Key Inputs Grid */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{isZh ? '关键测算输入参数' : 'Underwriting Input Parameters'}</h3>
            <div className="grid grid-cols-3 gap-3 text-xs text-slate-700">
              <div><strong>{isZh ? '购买价格:' : 'Purchase Price:'}</strong> {formatCurrency(purchasePrice)}</div>
              <div><strong>{isZh ? '过户成本:' : 'Closing Costs:'}</strong> {closingCostsPercent}% ({formatCurrency(base.closingCosts)})</div>
              <div><strong>{isZh ? '总潜在收入 (GPI):' : 'Gross Income (GPI):'}</strong> {formatCurrency(grossPotentialIncome)}</div>
              <div><strong>{isZh ? '空置率:' : 'Vacancy Rate:'}</strong> {vacancyRate}% ({formatCurrency(base.vacancyLoss)})</div>
              <div><strong>{isZh ? '有效毛收入 (EGI):' : 'Effective Income (EGI):'}</strong> {formatCurrency(base.egi)}</div>
              <div><strong>{isZh ? '运营支出 (OpEx):' : 'Operating Expenses:'}</strong> {formatCurrency(operatingExpenses)}</div>
              <div><strong>{isZh ? '首付比例:' : 'Down Payment:'}</strong> {downPaymentPercent}% ({formatCurrency(base.downPayment)})</div>
              <div><strong>{isZh ? '贷款金额:' : 'Loan Amount:'}</strong> {formatCurrency(base.loanAmount)}</div>
              <div><strong>{isZh ? '年利率 / 摊销:' : 'Rate / Amortization:'}</strong> {interestRate}% / {amortizationYears} {isZh ? '年' : 'Years'}</div>
            </div>
          </div>

          {/* Core Metrics & Stress Test Comparison Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{isZh ? '核心指标评估与压力测试对比' : 'Calculated Core CRE Metrics & Stress Test'}</h3>
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="p-2.5 border border-slate-700">{isZh ? '评估指标' : 'Core Metric'}</th>
                  <th className="p-2.5 border border-slate-700">{isZh ? '基础情景' : 'Base Case'}</th>
                  <th className="p-2.5 border border-slate-700">{isZh ? '压力情景 (空置率+5%, 利率+1%)' : 'Stressed Case (+5% Vac, +1% Rate)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{isZh ? '净营业收入 (NOI)' : 'Net Operating Income (NOI)'}</td>
                  <td className="p-2.5 font-bold text-slate-900 border border-slate-200">{formatCurrency(base.noi)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatCurrency(stress.noi)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{isZh ? '资本化率 (Cap Rate)' : 'Cap Rate'}</td>
                  <td className="p-2.5 font-bold text-emerald-700 border border-slate-200">{formatPercent(base.capRate)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatPercent(stress.capRate)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{isZh ? '现金回报率 (Cash-on-Cash Return)' : 'Cash-on-Cash Return (CoC)'}</td>
                  <td className="p-2.5 font-bold text-emerald-700 border border-slate-200">{formatPercent(base.cashOnCashReturn)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatPercent(stress.cashOnCashReturn)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{isZh ? '偿债覆盖率 (DSCR)' : 'Debt Service Coverage Ratio (DSCR)'}</td>
                  <td className="p-2.5 font-bold text-slate-900 border border-slate-200">{base.dscr.toFixed(2)}x</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{stress.dscr.toFixed(2)}x</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{isZh ? '收支平衡点 (Break-Even Ratio)' : 'Break-Even Ratio'}</td>
                  <td className="p-2.5 font-bold text-slate-900 border border-slate-200">{formatPercent(base.breakEvenRatio)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatPercent(stress.breakEvenRatio)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{isZh ? '年还贷总额 (Annual Debt Service)' : 'Annual Debt Service'}</td>
                  <td className="p-2.5 text-slate-900 border border-slate-200">{formatCurrency(base.annualDebtService)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatCurrency(stress.annualDebtService)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Branding */}
          <div className="pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500">
            {isZh
              ? '本文档由 CRE Calculators (https://cre-calculator.pages.dev) 自动生成，仅供商业地产尽调与投资分析使用。'
              : 'Generated by CRE Calculators (https://cre-calculator.pages.dev). For underwriting and deal analysis purposes only.'}
          </div>
        </div>
      </div>
    </div>
  );
}
