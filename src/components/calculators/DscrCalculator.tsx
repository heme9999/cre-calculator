'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatCurrency, formatNumberWithCommas, parseNumberInput } from '@/lib/utils';
import { Calculator, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2, Info, ArrowRight, Scale, TrendingDown, Sparkles, BookOpen } from 'lucide-react';
import { DscrCoverageTierVisualizer } from './visuals/DscrCoverageTierVisualizer';
import { getUiTranslations } from '@/lib/translations';
import { CalculatorActionBar } from './common/CalculatorActionBar';
import { generateCalculatorCsv, downloadCsv, saveCalculationToLocal } from '@/lib/calculatorExport';

interface Props {
  locale: string;
}

export function DscrCalculator({ locale }: Props) {
  const t = getUiTranslations(locale);
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  // Primary DSCR Inputs
  const [noi, setNoi] = useState<number>(250000);
  const [annualDebtService, setAnnualDebtService] = useState<number>(187500);
  const [isMonthlyInput, setIsMonthlyInput] = useState<boolean>(false);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(15625);

  // Three-Constraint Sizing Engine Inputs (Item 5)
  const [propertyValue, setPropertyValue] = useState<number>(3333333);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [amortizationYears, setAmortizationYears] = useState<number>(30);
  const [targetLtv, setTargetLtv] = useState<number>(75);
  const [targetDebtYield, setTargetDebtYield] = useState<number>(10.0);
  const [targetDscr, setTargetDscr] = useState<number>(1.25);

  // Derived primary calculations
  const effectiveDebtService = isMonthlyInput ? monthlyPayment * 12 : annualDebtService;
  const dscr = effectiveDebtService > 0 ? noi / effectiveDebtService : 0;
  const cashCushion = noi - effectiveDebtService;
  const maxDebtForTarget = noi / 1.25;

  // Three-Constraint Sizing Engine Calculations (Item 5)
  const maxLoanLtv = propertyValue * (targetLtv / 100);
  const maxLoanDy = targetDebtYield > 0 ? noi / (targetDebtYield / 100) : 0;

  const r = (interestRate / 100) / 12;
  const n = amortizationYears * 12;
  const monthlyFactor =
    r > 0 && n > 0
      ? (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : n > 0
      ? 1 / n
      : 0;
  const loanConstant = monthlyFactor * 12;
  const maxDebtForCustomDscr = targetDscr > 0 ? noi / targetDscr : 0;
  const maxLoanDscr = loanConstant > 0 ? maxDebtForCustomDscr / loanConstant : 0;

  const bindingMaxLoan = Math.min(maxLoanLtv, maxLoanDy, maxLoanDscr);

  const getBindingConstraintInfo = () => {
    if (Math.abs(bindingMaxLoan - maxLoanLtv) < 50 && Math.abs(bindingMaxLoan - maxLoanDy) < 50) {
      return {
        name: isZh ? 'LTV 价值比率 与 Debt Yield 债务收益率' : isEs ? 'LTV y Debt Yield' : isPt ? 'LTV e Debt Yield' : 'LTV & Debt Yield',
        key: 'ltv_dy',
      };
    }
    if (Math.abs(bindingMaxLoan - maxLoanLtv) < 50) {
      return {
        name: isZh ? `LTV 价值比率 (${targetLtv}%)` : isEs ? `LTV (${targetLtv}%)` : isPt ? `LTV (${targetLtv}%)` : `LTV (${targetLtv}%)`,
        key: 'ltv',
      };
    }
    if (Math.abs(bindingMaxLoan - maxLoanDy) < 50) {
      return {
        name: isZh ? `Debt Yield 债务收益率 (${targetDebtYield}%)` : isEs ? `Debt Yield (${targetDebtYield}%)` : isPt ? `Debt Yield (${targetDebtYield}%)` : `Debt Yield (${targetDebtYield}%)`,
        key: 'dy',
      };
    }
    return {
      name: isZh ? `DSCR 偿债覆盖率 (${targetDscr}x)` : isEs ? `DSCR (${targetDscr}x)` : isPt ? `DSCR (${targetDscr}x)` : `DSCR (${targetDscr}x)`,
      key: 'dscr',
    };
  };

  const bindingInfo = getBindingConstraintInfo();

  // Rate sensitivity (+100 bps) (Item 7)
  const stressRate = interestRate + 1.0;
  const rStress = (stressRate / 100) / 12;
  const stressMonthlyFactor =
    rStress > 0 && n > 0
      ? (rStress * Math.pow(1 + rStress, n)) / (Math.pow(1 + rStress, n) - 1)
      : n > 0
      ? 1 / n
      : 0;
  const stressLoanConstant = stressMonthlyFactor * 12;
  const stressMaxLoanDscr = stressLoanConstant > 0 ? maxDebtForCustomDscr / stressLoanConstant : 0;
  const dscrLoanDrop = Math.max(0, maxLoanDscr - stressMaxLoanDscr);
  const stressBindingMaxLoan = Math.min(maxLoanLtv, maxLoanDy, stressMaxLoanDscr);
  const stressBindingName =
    Math.abs(stressBindingMaxLoan - stressMaxLoanDscr) < 50
      ? (isZh ? 'DSCR 偿债覆盖率' : isEs ? 'DSCR' : isPt ? 'DSCR' : 'DSCR')
      : Math.abs(stressBindingMaxLoan - maxLoanLtv) < 50
      ? (isZh ? 'LTV 价值比率' : isEs ? 'LTV' : isPt ? 'LTV' : 'LTV')
      : (isZh ? 'Debt Yield 债务收益率' : isEs ? 'Debt Yield' : isPt ? 'Debt Yield' : 'Debt Yield');

  // 2D Sensitivity Matrix: NOI (±10%) vs Interest Rate (±1.0%)
  const noiSteps = [
    { label: '-10%', val: noi * 0.9 },
    { label: 'Base', val: noi },
    { label: '+10%', val: noi * 1.1 },
  ];
  const rateSteps = [
    { label: `-1.0% (${Math.max(0.1, interestRate - 1).toFixed(2)}%)`, rate: Math.max(0.1, interestRate - 1) },
    { label: `Base (${interestRate.toFixed(2)}%)`, rate: interestRate },
    { label: `+1.0% (${(interestRate + 1).toFixed(2)}%)`, rate: interestRate + 1 },
  ];

  const currentLoanAmount = loanConstant > 0 ? (effectiveDebtService / loanConstant) : bindingMaxLoan;

  const getMatrixDscr = (testNoi: number, testRate: number) => {
    const rTest = (Math.max(0.1, testRate) / 100) / 12;
    const mFactor =
      rTest > 0 && n > 0
        ? (rTest * Math.pow(1 + rTest, n)) / (Math.pow(1 + rTest, n) - 1)
        : n > 0
        ? 1 / n
        : 0;
    const testAds = currentLoanAmount * mFactor * 12;
    if (testAds <= 0) return 0;
    return testNoi / testAds;
  };

  // Chained parameter calculations (Item 8)
  const impliedDownPayment = Math.max(0, propertyValue - bindingMaxLoan);
  const impliedDownPaymentPercent = propertyValue > 0 ? Math.round((impliedDownPayment / propertyValue) * 100) : 25;
  const impliedAnnualDebt = Math.round(bindingMaxLoan * loanConstant);

  const isInitializedRef = useRef(false);

  const getStorageKey = () => {
    if (typeof window === 'undefined') return 'cre_dscr_inputs';
    const subpath = window.location.pathname.replace(/^\/(en|zh|es|pt)/, '');
    return `cre_dscr_inputs_${subpath}`;
  };

  // Parse URL hash on mount (highest priority) or restore from sessionStorage
  useEffect(() => {
    const applyInputs = () => {
      if (typeof window === 'undefined') return;
      let restoredFromHash = false;
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        const params = new URLSearchParams(hash);
        const n = params.get('noi') || params.get('n');
        const d = params.get('debt') || params.get('d');
        const m = params.get('monthly') || params.get('m');
        const isM = params.get('isMonthly');
        const pv = params.get('pv') || params.get('price');
        const ir = params.get('ir') || params.get('rate');
        const ay = params.get('ay') || params.get('term');
        const ltv = params.get('ltv');
        const dy = params.get('dy');
        const td = params.get('targetDscr');

        if (n && !isNaN(Number(n))) { setNoi(Number(n)); restoredFromHash = true; }
        if (d && !isNaN(Number(d))) { setAnnualDebtService(Number(d)); restoredFromHash = true; }
        if (m && !isNaN(Number(m))) { setMonthlyPayment(Number(m)); restoredFromHash = true; }
        if (isM !== null) { setIsMonthlyInput(isM === '1' || isM === 'true'); restoredFromHash = true; }
        if (pv && !isNaN(Number(pv))) { setPropertyValue(Number(pv)); restoredFromHash = true; }
        if (ir && !isNaN(Number(ir))) { setInterestRate(Number(ir)); restoredFromHash = true; }
        if (ay && !isNaN(Number(ay))) { setAmortizationYears(Number(ay)); restoredFromHash = true; }
        if (ltv && !isNaN(Number(ltv))) { setTargetLtv(Number(ltv)); restoredFromHash = true; }
        if (dy && !isNaN(Number(dy))) { setTargetDebtYield(Number(dy)); restoredFromHash = true; }
        if (td && !isNaN(Number(td))) { setTargetDscr(Number(td)); restoredFromHash = true; }
      }

      if (!restoredFromHash) {
        try {
          const saved = sessionStorage.getItem(getStorageKey());
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.noi !== undefined && !isNaN(Number(parsed.noi))) setNoi(Number(parsed.noi));
            if (parsed.annualDebtService !== undefined && !isNaN(Number(parsed.annualDebtService))) setAnnualDebtService(Number(parsed.annualDebtService));
            if (parsed.monthlyPayment !== undefined && !isNaN(Number(parsed.monthlyPayment))) setMonthlyPayment(Number(parsed.monthlyPayment));
            if (parsed.isMonthlyInput !== undefined) setIsMonthlyInput(Boolean(parsed.isMonthlyInput));
            if (parsed.propertyValue !== undefined && !isNaN(Number(parsed.propertyValue))) setPropertyValue(Number(parsed.propertyValue));
            if (parsed.interestRate !== undefined && !isNaN(Number(parsed.interestRate))) setInterestRate(Number(parsed.interestRate));
            if (parsed.amortizationYears !== undefined && !isNaN(Number(parsed.amortizationYears))) setAmortizationYears(Number(parsed.amortizationYears));
            if (parsed.targetLtv !== undefined && !isNaN(Number(parsed.targetLtv))) setTargetLtv(Number(parsed.targetLtv));
            if (parsed.targetDebtYield !== undefined && !isNaN(Number(parsed.targetDebtYield))) setTargetDebtYield(Number(parsed.targetDebtYield));
            if (parsed.targetDscr !== undefined && !isNaN(Number(parsed.targetDscr))) setTargetDscr(Number(parsed.targetDscr));
          }
        } catch {
          // ignore
        }
      }
      isInitializedRef.current = true;
    };

    const timer = setTimeout(applyInputs, 0);
    window.addEventListener('hashchange', applyInputs);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', applyInputs);
    };
  }, []);

  // Sync state changes to sessionStorage
  useEffect(() => {
    if (!isInitializedRef.current) return;
    try {
      sessionStorage.setItem(getStorageKey(), JSON.stringify({
        noi,
        annualDebtService,
        monthlyPayment,
        isMonthlyInput,
        propertyValue,
        interestRate,
        amortizationYears,
        targetLtv,
        targetDebtYield,
        targetDscr,
      }));
    } catch {
      // ignore
    }
  }, [noi, annualDebtService, monthlyPayment, isMonthlyInput, propertyValue, interestRate, amortizationYears, targetLtv, targetDebtYield, targetDscr]);

  const handleShareDeal = async () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    params.set('noi', noi.toString());
    if (isMonthlyInput) {
      params.set('monthly', monthlyPayment.toString());
      params.set('isMonthly', '1');
    } else {
      params.set('debt', annualDebtService.toString());
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}#${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // ignore
    }
  };

  const handleExportCsv = () => {
    const rows = [
      { metric: 'Annual NOI', value: noi },
      { metric: 'Annual Debt Service', value: effectiveDebtService },
      { metric: 'Debt Service Coverage Ratio (DSCR)', value: `${dscr.toFixed(2)}x` },
      { metric: 'Annual Cash Cushion', value: cashCushion },
      { metric: 'Max Annual Debt Service for 1.25x', value: maxDebtForTarget },
      { metric: 'Property Valuation', value: propertyValue },
      { metric: 'Interest Rate', value: `${interestRate}%` },
      { metric: 'Amortization', value: `${amortizationYears} Years` },
      { metric: 'Target LTV Limit', value: maxLoanLtv },
      { metric: 'Target Debt Yield Limit', value: maxLoanDy },
      { metric: 'Target DSCR Principal Limit', value: Math.round(maxLoanDscr) },
      { metric: 'Governing Binding Loan', value: Math.round(bindingMaxLoan), note: bindingInfo.name },
    ];
    const csv = generateCalculatorCsv('DSCR Coverage & Sizing Calculator', rows, locale);
    downloadCsv(`dscr-analysis-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleSaveDeal = () => {
    const summary = `DSCR: ${dscr.toFixed(2)}x, Max Loan: ${formatCurrency(bindingMaxLoan)} (NOI: ${formatCurrency(noi)})`;
    saveCalculationToLocal('dscr', 'DSCR Calculator', summary, {
      noi,
      effectiveDebtService,
      dscr,
      propertyValue,
      interestRate,
      bindingMaxLoan,
    });
  };

  // Status Tier based on user specification
  let statusColor = 'text-emerald-600';
  let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let statusText = isZh
    ? '较为健康的安全边际 (符合绝大多数商业地产贷款机构标准)'
    : isEs
    ? 'Margen de seguridad saludable (Cumple con los estándares de prestamistas comerciales)'
    : isPt
    ? 'Margem de segurança saudável (Atende aos padrões de credores comerciais)'
    : 'Healthy Safety Margin (Meets or exceeds commercial lender standards)';
  let StatusIcon = CheckCircle2;

  if (dscr < 1.0) {
    statusColor = 'text-rose-600';
    badgeBg = 'bg-rose-50 text-rose-900 border-rose-300 font-bold';
    statusText = isZh
      ? '警示：净营业收入不足以覆盖贷款还款 (现金流倒挂)'
      : isEs
      ? 'Advertencia: Ingresos operativos insuficientes para cubrir el servicio de la deuda'
      : isPt
      ? 'Aviso: Receita operacional insuficiente para cobrir o serviço da dívida'
      : 'Warning: Net Operating Income Insufficient to Cover Debt Service';
    StatusIcon = ShieldAlert;
  } else if (dscr < 1.25) {
    statusColor = 'text-amber-600';
    badgeBg = 'bg-amber-50 text-amber-900 border-amber-300 font-semibold';
    statusText = isZh
      ? '处于多数贷款机构最低门槛附近 (1.20 - 1.25x)，需谨慎评估'
      : isEs
      ? 'Cerca del umbral mínimo del prestamista (1.20 - 1.25x)'
      : isPt
      ? 'Perto do limite mínimo do credor (1.20 - 1.25x)'
      : 'Near Lender Minimum Threshold (1.20 - 1.25x), Requires Cautious Evaluation';
    StatusIcon = AlertTriangle;
  }

  const serviceUnavailableNote = {
    en: 'crecalculators.com operates strictly as an independent analysis toolkit. All DSCR sizing and debt calculations run 100% locally in your browser. We never broker mortgages or share borrower data.',
    zh: 'crecalculators.com 恪守独立第三方工具原则。所有 DSCR 试算与借贷能力测算均 100% 在您的本地浏览器运行，不从事贷款中介业务，亦不收集或向外分享您的交易参数。',
    es: 'crecalculators.com opera estrictamente como una herramienta analítica independiente. Todos los cálculos se ejecutan 100% en su navegador. No intermediamos préstamos ni compartimos datos con terceros.',
    pt: 'O crecalculators.com opera exclusivamente como um conjunto de ferramentas analíticas independentes. Todos os cálculos rodam 100% no seu navegador. Não intermediamos empréstimos nem compartilhamos dados.',
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || 'crecalculators.com operates strictly as an independent analysis toolkit. All DSCR sizing and debt calculations run 100% locally in your browser.';

  const dealAnalyzerCtaLabel = {
    en: 'Model Loan Terms Locally in Deal Analyzer',
    zh: '前往 Deal Analyzer 本地测算完整贷款方案',
    es: 'Simular Financiamiento Localmente en Deal Analyzer',
    pt: 'Simular Financiamento Localmente no Deal Analyzer',
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || 'Model Loan Terms Locally in Deal Analyzer';

  return (
    <div className="space-y-8 mb-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Calculator className="w-3.5 h-3.5" />
              {t.dscrCalc.toolBadge}
            </div>
            <h2 className="text-xl md:text-2xl font-bold">
              {t.dscrCalc.title}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {t.dscrCalc.subtitle}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Annual NOI */}
            <div>
              <label htmlFor="dscr-noi-input" className="block text-sm font-semibold text-slate-700 mb-2">
                {t.dscrCalc.noiLabel}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  id="dscr-noi-input"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(noi)}
                  onChange={(e) => setNoi(parseNumberInput(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold tabular-nums focus:outline-none"
                  placeholder="250,000"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[100000, 250000, 500000, 1000000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setNoi(val)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-md transition"
                  >
                    {formatCurrency(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Mode Toggle */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor={!isMonthlyInput ? 'dscr-annual-debt-input' : 'dscr-monthly-payment-input'}
                  className="text-sm font-semibold text-slate-700"
                >
                  {t.dscrCalc.debtModeLabel}
                </label>
                <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsMonthlyInput(false)}
                    className={`px-3 py-1 rounded-md transition ${
                      !isMonthlyInput ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.dscrCalc.annualMode}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMonthlyInput(true)}
                    className={`px-3 py-1 rounded-md transition ${
                      isMonthlyInput ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.dscrCalc.monthlyMode}
                  </button>
                </div>
              </div>

              {!isMonthlyInput ? (
                <div>
                  <div className="relative rounded-xl border border-slate-300 bg-white focus-ring overflow-hidden">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      id="dscr-annual-debt-input"
                      type="text"
                      inputMode="numeric"
                      value={formatNumberWithCommas(annualDebtService)}
                      onChange={(e) => setAnnualDebtService(parseNumberInput(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold tabular-nums focus:outline-none"
                      placeholder="187,500"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.dscrCalc.annualHelp}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="relative rounded-xl border border-slate-300 bg-white focus-ring overflow-hidden">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      id="dscr-monthly-payment-input"
                      type="text"
                      inputMode="numeric"
                      value={formatNumberWithCommas(monthlyPayment)}
                      onChange={(e) => setMonthlyPayment(parseNumberInput(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold tabular-nums focus:outline-none"
                      placeholder="15,625"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.dscrCalc.monthlyHelp(formatCurrency(monthlyPayment * 12))}
                  </p>
                </div>
              )}
            </div>

            {/* Underwriting Threshold Info Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-slate-500" />
                {t.dscrCalc.benchmarkHeader}
              </span>
              <ul className="space-y-1 text-slate-600 pl-5 list-disc">
                <li><strong>≥ 1.25x</strong>: {t.dscrCalc.benchmarkTier1}</li>
                <li><strong>1.15x - 1.20x</strong>: {t.dscrCalc.benchmarkTier2}</li>
                <li><strong>&lt; 1.00x</strong>: {t.dscrCalc.benchmarkTier3}</li>
              </ul>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.dscrCalc.summaryTitle}
                </h3>
                <CalculatorActionBar
                  locale={locale}
                  onExportCsv={handleExportCsv}
                  onSave={handleSaveDeal}
                  onShare={handleShareDeal}
                />
              </div>

              {/* Major Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.dscrCalc.dscrCardTitle}
                </span>
                <div aria-live="polite" className={`text-4xl md:text-5xl font-black mt-1 ${statusColor}`}>
                  {dscr.toFixed(2)}x
                </div>
                <div className={`mt-3 inline-flex items-center gap-1.5 p-2 rounded-lg border text-xs font-medium ${badgeBg}`}>
                  <StatusIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{statusText}</span>
                </div>
              </div>

              {/* Visual Coverage Tier Scale */}
              <DscrCoverageTierVisualizer
                dscr={dscr}
                noi={noi}
                debtService={effectiveDebtService}
                locale={locale}
              />

              {/* Financial Cushion Breakdown */}
              <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">{t.dscrCalc.annualNoiRow}</span>
                  <span className="font-semibold">{formatCurrency(noi)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{t.dscrCalc.annualDebtRow}</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(effectiveDebtService)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-slate-200 pt-2">
                  <span className="text-slate-800">{t.dscrCalc.cashCushionRow}</span>
                  <span className={cashCushion >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                    {formatCurrency(cashCushion)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{t.dscrCalc.maxDebtRow}</span>
                  <span className="font-semibold">{formatCurrency(maxDebtForTarget)}</span>
                </div>
                {t.dscrCalc.maxDebtNote && (
                  <div className="text-[11px] text-slate-400 mt-1 leading-normal">
                    {t.dscrCalc.maxDebtNote}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 mt-6 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                {t.dscrCalc.tipText}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three-Constraint Maximum Loan Sizing Engine (Item 5, 7, 8) */}
      <section
        data-testid="dscr-three-constraint-sizing"
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Scale className="w-3.5 h-3.5" />
              {t.dscrCalc.sizingBadge}
            </div>
            <h3 className="text-xl md:text-2xl font-bold">
              {t.dscrCalc.sizingTitle}
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              {t.dscrCalc.sizingSubtitle}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sizing Inputs */}
          <div className="lg:col-span-7 space-y-5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isZh ? '承销假设参数' : isEs ? 'Supuestos de Suscripción' : isPt ? 'Premissas de Subscrição' : 'Underwriting Inputs'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dscr-property-value-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.dscrCalc.propertyValueLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
                  <input
                    id="dscr-property-value-input"
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(propertyValue)}
                    onChange={(e) => setPropertyValue(parseNumberInput(e.target.value))}
                    className="w-full pl-7 pr-3 py-2.5 text-slate-900 text-sm font-semibold tabular-nums focus:outline-none"
                    placeholder="3,333,333"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dscr-interest-rate-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.dscrCalc.interestRateLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    id="dscr-interest-rate-input"
                    type="number"
                    step="0.05"
                    value={interestRate || ''}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none"
                    placeholder="6.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">%</span>
                </div>
              </div>

              <div>
                <label htmlFor="dscr-amortization-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.dscrCalc.amortizationYearsLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    id="dscr-amortization-input"
                    type="number"
                    value={amortizationYears || ''}
                    onChange={(e) => setAmortizationYears(parseInt(e.target.value, 10) || 0)}
                    className="w-full pl-3 pr-3 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none"
                    placeholder="30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dscr-target-ltv-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.dscrCalc.targetLtvLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    id="dscr-target-ltv-input"
                    type="number"
                    value={targetLtv || ''}
                    onChange={(e) => setTargetLtv(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none"
                    placeholder="75"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">%</span>
                </div>
              </div>

              <div>
                <label htmlFor="dscr-target-dy-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.dscrCalc.targetDebtYieldLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    id="dscr-target-dy-input"
                    type="number"
                    step="0.1"
                    value={targetDebtYield || ''}
                    onChange={(e) => setTargetDebtYield(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none"
                    placeholder="10.0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">%</span>
                </div>
              </div>

              <div>
                <label htmlFor="dscr-target-dscr-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.dscrCalc.targetDscrLabel}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    id="dscr-target-dscr-input"
                    type="number"
                    step="0.05"
                    value={targetDscr || ''}
                    onChange={(e) => setTargetDscr(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none"
                    placeholder="1.25"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">x</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              {t.dscrCalc.sizingAssumption(amortizationYears, interestRate)}
            </div>
          </div>

          {/* Sizing Outputs & Comparative Analysis */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                {t.dscrCalc.bindingConstraintTitle}
              </h4>

              {/* Major Binding Card */}
              <div className="bg-white p-5 rounded-xl border border-emerald-300 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {isZh ? '最大可贷本金上限' : isEs ? 'Préstamo Máximo Autorizado' : isPt ? 'Financiamento Máximo Autorizado' : 'Maximum Allowable Loan'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {isZh ? '限制性瓶颈' : isEs ? 'Vinculante' : isPt ? 'Limitante' : 'Binding'}
                  </span>
                </div>
                <div data-testid="dscr-binding-max-loan" className="text-3xl md:text-4xl font-black text-slate-900 mt-1">
                  {formatCurrency(bindingMaxLoan)}
                </div>
                <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                  {t.dscrCalc.bindingReason(bindingInfo.name, formatCurrency(bindingMaxLoan))}
                </p>
              </div>

              {/* 3-Way Constraint Breakdown Cards */}
              <div className="space-y-2 text-xs">
                <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  Math.abs(bindingMaxLoan - maxLoanLtv) < 50
                    ? 'bg-emerald-50/70 border-emerald-300 font-bold text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <span>{t.dscrCalc.ltvConstraintRow} ({targetLtv}%):</span>
                  <span className="font-mono text-sm">{formatCurrency(maxLoanLtv)}</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  Math.abs(bindingMaxLoan - maxLoanDy) < 50
                    ? 'bg-emerald-50/70 border-emerald-300 font-bold text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <span>{t.dscrCalc.dyConstraintRow} ({targetDebtYield}%):</span>
                  <span className="font-mono text-sm">{formatCurrency(maxLoanDy)}</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  Math.abs(bindingMaxLoan - maxLoanDscr) < 50
                    ? 'bg-emerald-50/70 border-emerald-300 font-bold text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <span>{t.dscrCalc.dscrConstraintRow} ({targetDscr}x):</span>
                  <span className="font-mono text-sm">{formatCurrency(maxLoanDscr)}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Rate Sensitivity (+100 bps) (Item 7) */}
            <div data-testid="dscr-rate-sensitivity" className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <TrendingDown className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.dscrCalc.rateSensitivityTitle}</span>
              </div>
              <p className="leading-relaxed text-amber-900/90">
                {t.dscrCalc.rateSensitivityDesc(
                  formatCurrency(maxLoanDscr),
                  formatCurrency(stressMaxLoanDscr),
                  formatCurrency(dscrLoanDrop),
                  stressRate,
                  stressBindingName
                )}
              </p>
            </div>

            {/* 2D Sensitivity Matrix: NOI vs Interest Rate */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 block">
                  {isZh ? 'DSCR 敏感性压力测试矩阵 (NOI ±10% · 利率 ±1%)' : isEs ? 'Matriz de Estrés DSCR (NOI ±10% · Tasa ±1%)' : isPt ? 'Matriz de Estresse DSCR (NOI ±10% · Juros ±1%)' : 'DSCR Sensitivity Matrix (NOI ±10% vs Rate ±1%)'}
                </span>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">{targetDscr}x Target</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-1.5 text-left font-bold">{isZh ? '利率 \\ NOI' : 'Rate \\ NOI'}</th>
                      {noiSteps.map((s, idx) => (
                        <th key={idx} className="p-1.5 font-bold">{s.label} ({formatCurrency(Math.round(s.val))})</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rateSteps.map((r, rIdx) => (
                      <tr key={rIdx}>
                        <td className="p-1.5 text-left font-bold text-slate-800 bg-slate-50 whitespace-nowrap">{r.label}</td>
                        {noiSteps.map((s, sIdx) => {
                          const matrixDscr = getMatrixDscr(s.val, r.rate);
                          const isPass = matrixDscr >= targetDscr;
                          const isBreakeven = matrixDscr >= 1.0;
                          return (
                            <td
                              key={sIdx}
                              className={`p-1.5 font-bold ${
                                isPass
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : isBreakeven
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-rose-50 text-rose-800'
                              }`}
                            >
                              {matrixDscr.toFixed(2)}x
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> ≥ {targetDscr}x ({isZh ? '达标' : 'Compliant'})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> 1.00x–{targetDscr}x ({isZh ? '缓冲偏低' : 'Tight Cushion'})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> &lt; 1.00x ({isZh ? '现金流赤字' : 'Deficit'})</span>
              </div>
            </div>

            {/* Chained Parameter Flows (Item 8) */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <span className="font-bold text-slate-200 block">
                {isZh ? '承销串链流转 (下一步测算)' : isEs ? 'Flujo de Suscripción (Siguiente Paso)' : isPt ? 'Fluxo de Subscrição (Próximo Passo)' : 'Chained Underwriting Workflow'}
              </span>
              <div className="grid grid-cols-1 gap-2">
                <Link
                  href={`/${locale}/calculators/cash-on-cash/#price=${Math.round(propertyValue)}&downPayment=${impliedDownPaymentPercent}&annualNoi=${Math.round(noi)}&debt=${impliedAnnualDebt}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-slate-200 hover:text-white"
                >
                  <span>{t.dscrCalc.nextStepCoc}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
                <Link
                  href={`/${locale}/tools/deal-analyzer/#pp=${Math.round(propertyValue)}&dp=${impliedDownPaymentPercent}&noi=${Math.round(noi)}&ir=${interestRate}&ay=${amortizationYears}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-white font-semibold"
                >
                  <span>{t.dscrCalc.nextStepAnalyzer}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Independent Underwriting & Educational Resource Notice */}
      <section
        data-testid="dscr-lender-service-disabled"
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white border border-slate-700 shadow-md"
      >
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.dscrCalc.leadBadge}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            {t.dscrCalc.leadHeading}
          </h3>
          <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed">
            {t.dscrCalc.leadSubtitle(dscr.toFixed(2))}
          </p>

          <div className="mt-5 p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 leading-relaxed">
            {serviceUnavailableNote}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/guides/dscr-complete-guide/`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.dscrCalc.leadSubmitBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/${locale}/tools/deal-analyzer/`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 active:scale-95 text-slate-200 hover:text-white font-bold text-xs transition-all shadow-sm"
            >
              <span>{dealAnalyzerCtaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            {t.dscrCalc.leadTrustNotes}
          </p>
        </div>
      </section>
    </div>
  );
}
