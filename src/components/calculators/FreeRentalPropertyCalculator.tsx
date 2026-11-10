'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercent, formatNumberWithCommas, parseNumberInput } from '@/lib/utils';
import {
  Building2,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Sparkles,
  PieChart,
  Percent,
} from 'lucide-react';
import { CalculatorActionBar } from './common/CalculatorActionBar';
import { generateCalculatorCsv, downloadCsv, saveCalculationToLocal } from '@/lib/calculatorExport';

interface Props {
  locale: string;
}

export function FreeRentalPropertyCalculator({ locale }: Props) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  // 1. Property Acquisition Inputs (Defaulted to canonical 4-unit fourplex $700k baseline)
  const [purchasePrice, setPurchasePrice] = useState<number>(700000);
  const [closingCostsPercent, setClosingCostsPercent] = useState<number>(2.0);

  // 2. Rental Revenue Inputs
  const [annualGrossRent, setAnnualGrossRent] = useState<number>(72000);
  const [annualOtherIncome, setAnnualOtherIncome] = useState<number>(0);
  const [vacancyRate, setVacancyRate] = useState<number>(5.0);

  // 3. Operating Expenses
  const [annualOperatingExpenses, setAnnualOperatingExpenses] = useState<number>(22900);

  // 4. Financing Structure
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30.0);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [amortizationYears, setAmortizationYears] = useState<number>(30);

  const isInitializedRef = useRef(false);
  const storageKey = `cre_free_rental_${locale}`;

  // Read URL Hash or SessionStorage on Mount
  useEffect(() => {
    const applyInputs = () => {
      if (typeof window === 'undefined') return;

      let applied = false;
      const hash = window.location.hash.slice(1);
      if (hash) {
        try {
          const params = new URLSearchParams(hash);
          const pPrice = params.get('price') || params.get('pp');
          const pGpi = params.get('gpi') || params.get('rent');
          const pOpex = params.get('opex');
          const pDp = params.get('downPayment') || params.get('dp');
          const pIr = params.get('interestRate') || params.get('ir');
          const pAy = params.get('amortizationYears') || params.get('ay');
          const pVac = params.get('vacancy') || params.get('vac');

          if (pPrice && !isNaN(Number(pPrice))) {
            setPurchasePrice(Number(pPrice));
            applied = true;
          }
          if (pGpi && !isNaN(Number(pGpi))) {
            setAnnualGrossRent(Number(pGpi));
            applied = true;
          }
          if (pOpex && !isNaN(Number(pOpex))) {
            setAnnualOperatingExpenses(Number(pOpex));
            applied = true;
          }
          if (pDp && !isNaN(Number(pDp))) {
            setDownPaymentPercent(Number(pDp));
            applied = true;
          }
          if (pIr && !isNaN(Number(pIr))) {
            setInterestRate(Number(pIr));
            applied = true;
          }
          if (pAy && !isNaN(Number(pAy))) {
            setAmortizationYears(Number(pAy));
            applied = true;
          }
          if (pVac && !isNaN(Number(pVac))) {
            setVacancyRate(Number(pVac));
            applied = true;
          }
        } catch {
          // ignore
        }
      }

      if (!applied) {
        try {
          const saved = sessionStorage.getItem(storageKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.purchasePrice) setPurchasePrice(Number(parsed.purchasePrice));
            if (parsed.closingCostsPercent !== undefined) setClosingCostsPercent(Number(parsed.closingCostsPercent));
            if (parsed.annualGrossRent) setAnnualGrossRent(Number(parsed.annualGrossRent));
            if (parsed.annualOtherIncome !== undefined) setAnnualOtherIncome(Number(parsed.annualOtherIncome));
            if (parsed.vacancyRate !== undefined) setVacancyRate(Number(parsed.vacancyRate));
            if (parsed.annualOperatingExpenses !== undefined) setAnnualOperatingExpenses(Number(parsed.annualOperatingExpenses));
            if (parsed.downPaymentPercent !== undefined) setDownPaymentPercent(Number(parsed.downPaymentPercent));
            if (parsed.interestRate !== undefined) setInterestRate(Number(parsed.interestRate));
            if (parsed.amortizationYears !== undefined) setAmortizationYears(Number(parsed.amortizationYears));
          }
        } catch {
          // ignore
        }
      }

      isInitializedRef.current = true;
    };

    applyInputs();
    window.addEventListener('hashchange', applyInputs);
    return () => window.removeEventListener('hashchange', applyInputs);
  }, [storageKey]);

  // Persist State to SessionStorage
  useEffect(() => {
    if (!isInitializedRef.current) return;
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          purchasePrice,
          closingCostsPercent,
          annualGrossRent,
          annualOtherIncome,
          vacancyRate,
          annualOperatingExpenses,
          downPaymentPercent,
          interestRate,
          amortizationYears,
        })
      );
    } catch {
      // ignore
    }
  }, [
    purchasePrice,
    closingCostsPercent,
    annualGrossRent,
    annualOtherIncome,
    vacancyRate,
    annualOperatingExpenses,
    downPaymentPercent,
    interestRate,
    amortizationYears,
    storageKey,
  ]);

  // Financial Engine
  const safePrice = Math.max(0, purchasePrice);
  const closingCosts = safePrice * (Math.max(0, closingCostsPercent) / 100);
  const downPayment = safePrice * (Math.max(0, downPaymentPercent) / 100);
  const totalCashInvested = downPayment + closingCosts;

  const loanAmount = Math.max(0, safePrice - downPayment);

  // Revenue & NOI
  const grossPotentialIncome = Math.max(0, annualGrossRent) + Math.max(0, annualOtherIncome);
  const vacancyLoss = grossPotentialIncome * (Math.max(0, Math.min(100, vacancyRate)) / 100);
  const effectiveGrossIncome = Math.max(0, grossPotentialIncome - vacancyLoss);
  const operatingExpenses = Math.max(0, annualOperatingExpenses);
  const noi = effectiveGrossIncome - operatingExpenses;

  const capRate = safePrice > 0 ? (noi / safePrice) * 100 : 0;
  const opexRatio = effectiveGrossIncome > 0 ? (operatingExpenses / effectiveGrossIncome) * 100 : 0;

  // Debt Service (Standard Monthly Equal Installment)
  const r = (Math.max(0, interestRate) / 100) / 12;
  const n = Math.max(1, amortizationYears) * 12;
  const monthlyFactor =
    r > 0 && n > 0 ? (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : n > 0 ? 1 / n : 0;

  const monthlyPayment = loanAmount * monthlyFactor;
  const annualDebtService = monthlyPayment * 12;

  // Returns & Cash Flow
  const preTaxNetCashFlow = noi - annualDebtService;
  const monthlyCashFlow = preTaxNetCashFlow / 12;

  const cashOnCashTotal = totalCashInvested > 0 ? (preTaxNetCashFlow / totalCashInvested) * 100 : 0;
  const cashOnCashDownPaymentOnly = downPayment > 0 ? (preTaxNetCashFlow / downPayment) * 100 : 0;

  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
  const breakEvenRatio = effectiveGrossIncome > 0 ? ((operatingExpenses + annualDebtService) / effectiveGrossIncome) * 100 : 0;
  const breakEvenOccupancy = grossPotentialIncome > 0 ? ((operatingExpenses + annualDebtService) / grossPotentialIncome) * 100 : 0;

  const handleExportCsv = () => {
    const rows = [
      { metric: 'Purchase Price', value: safePrice },
      { metric: 'Estimated Closing Costs', value: Math.round(closingCosts), note: `${closingCostsPercent}%` },
      { metric: 'Gross Potential Rent', value: annualGrossRent },
      { metric: 'Other Annual Income', value: annualOtherIncome },
      { metric: 'Gross Potential Income (GPI)', value: Math.round(grossPotentialIncome) },
      { metric: 'Vacancy & Credit Loss', value: Math.round(vacancyLoss), note: `${vacancyRate}%` },
      { metric: 'Effective Gross Income (EGI)', value: Math.round(effectiveGrossIncome) },
      { metric: 'Annual Operating Expenses (OpEx)', value: Math.round(operatingExpenses), note: `${opexRatio.toFixed(2)}% of EGI` },
      { metric: 'Net Operating Income (NOI)', value: Math.round(noi) },
      { metric: 'Unleveraged Cap Rate', value: `${capRate.toFixed(2)}%` },
      { metric: 'Down Payment (Equity)', value: Math.round(downPayment), note: `${downPaymentPercent}%` },
      { metric: 'Total Initial Cash Invested', value: Math.round(totalCashInvested), note: 'Down Payment + Closing Costs' },
      { metric: 'Loan Amount', value: Math.round(loanAmount) },
      { metric: 'Interest Rate', value: `${interestRate}%` },
      { metric: 'Amortization Period', value: `${amortizationYears} Years` },
      { metric: 'Monthly Mortgage Payment', value: Math.round(monthlyPayment) },
      { metric: 'Annual Debt Service (ADS)', value: Math.round(annualDebtService) },
      { metric: 'Pre-Tax Annual Cash Flow', value: Math.round(preTaxNetCashFlow) },
      { metric: 'Pre-Tax Monthly Cash Flow', value: Math.round(monthlyCashFlow) },
      { metric: 'Cash-on-Cash Return (Total Cash)', value: `${cashOnCashTotal.toFixed(2)}%` },
      { metric: 'Cash-on-Cash Return (Down Payment Only)', value: `${cashOnCashDownPaymentOnly.toFixed(2)}%` },
      { metric: 'Debt Service Coverage Ratio (DSCR)', value: `${dscr.toFixed(2)}x` },
      { metric: 'Break-Even Ratio (BER)', value: `${breakEvenRatio.toFixed(2)}%` },
      { metric: 'Break-Even Occupancy (BEO)', value: `${breakEvenOccupancy.toFixed(2)}%` },
    ];
    const csv = generateCalculatorCsv('Free Rental Property Calculator', rows, locale);
    downloadCsv(`rental-property-analysis-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleSave = () => {
    saveCalculationToLocal(
      'free-rental-property-calculator',
      `${isZh ? '出租物业现金流分析' : isEs ? 'Análisis de Inmueble en Alquiler' : isPt ? 'Análise de Imóvel de Locação' : 'Rental Property Analysis'} - ${formatCurrency(safePrice)}`,
      `NOI ${formatCurrency(noi)} | Cash Flow ${formatCurrency(preTaxNetCashFlow)}/yr | CoC ${cashOnCashTotal.toFixed(2)}%`,
      {
        purchasePrice: safePrice,
        noi: Math.round(noi),
        cashFlow: Math.round(preTaxNetCashFlow),
        capRate: capRate.toFixed(2),
        cashOnCash: cashOnCashTotal.toFixed(2),
        dscr: dscr.toFixed(2),
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Action Bar (Save, CSV, Print, Share) */}
      <CalculatorActionBar
        locale={locale}
        onSave={handleSave}
        onExportCsv={handleExportCsv}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Property Acquisition & Capital */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              {isZh ? '1. 物业收购与自有出资' : isEs ? '1. Adquisición y Capital' : isPt ? '1. Aquisição e Capital' : '1. Property Acquisition & Capital'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '物业购买总价 ($)' : isEs ? 'Precio de Compra ($)' : isPt ? 'Preço de Compra ($)' : 'Purchase Price ($)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(purchasePrice)}
                    onChange={(e) => setPurchasePrice(Math.max(0, parseNumberInput(e.target.value)))}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold tabular-nums text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '过户杂费与初期储备 (%)' : isEs ? 'Gastos de Cierre y Reservas (%)' : isPt ? 'Custos de Fechamento e Reservas (%)' : 'Closing Costs & Reserves (%)'}
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-32">
                    <input
                      type="number"
                      step="0.1"
                      value={closingCostsPercent || ''}
                      onChange={(e) => setClosingCostsPercent(Math.max(0, Number(e.target.value)))}
                      className="w-full pr-8 pl-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-semibold">%</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    ≈ {formatCurrency(closingCosts)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Rental Income & Vacancy */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              {isZh ? '2. 租金收入与空置损失' : isEs ? '2. Ingresos de Alquiler y Vacancia' : isPt ? '2. Receita de Locação e Vacância' : '2. Rental Income & Vacancy'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '年度租金毛收入 (Gross Rent) ($)' : isEs ? 'Alquiler Bruto Anual Programado ($)' : isPt ? 'Aluguel Bruto Anual Programado ($)' : 'Gross Scheduled Annual Rent ($)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(annualGrossRent)}
                    onChange={(e) => setAnnualGrossRent(Math.max(0, parseNumberInput(e.target.value)))}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold tabular-nums text-slate-900"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  ≈ {formatCurrency(annualGrossRent / 12)} / {isZh ? '月' : isEs ? 'mes' : isPt ? 'mês' : 'mo'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '其他年杂项收益 (车位/储藏/洗衣) ($)' : isEs ? 'Otros Ingresos Anuales ($)' : isPt ? 'Outras Receitas Anuais ($)' : 'Other Annual Income (Parking/Laundry) ($)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(annualOtherIncome)}
                    onChange={(e) => setAnnualOtherIncome(Math.max(0, parseNumberInput(e.target.value)))}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold tabular-nums text-slate-900"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '预计空置与坏账率 (%)' : isEs ? 'Tasa Estimada de Vacancia (%)' : isPt ? 'Taxa Estimada de Vacância (%)' : 'Vacancy & Credit Loss Rate (%)'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32">
                    <input
                      type="number"
                      step="0.1"
                      value={vacancyRate || ''}
                      onChange={(e) => setVacancyRate(Math.max(0, Math.min(100, Number(e.target.value))))}
                      className="w-full pr-8 pl-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-semibold">%</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {isZh
                      ? `空置损失: ${formatCurrency(vacancyLoss)} | 有效毛收入 (EGI): ${formatCurrency(effectiveGrossIncome)}`
                      : isEs
                      ? `Pérdida por Vacancia: ${formatCurrency(vacancyLoss)} | Ingreso Bruto Efectivo (EGI): ${formatCurrency(effectiveGrossIncome)}`
                      : isPt
                      ? `Perda por Vacância: ${formatCurrency(vacancyLoss)} | Receita Bruta Efetiva (EGI): ${formatCurrency(effectiveGrossIncome)}`
                      : `Vacancy Loss: ${formatCurrency(vacancyLoss)} | EGI: ${formatCurrency(effectiveGrossIncome)}`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Operating Expenses & NOI */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              {isZh ? '3. 运营支出与净收益 (OpEx & NOI)' : isEs ? '3. Gastos Operativos y NOI' : isPt ? '3. Despesas Operacionais e NOI' : '3. Operating Expenses & NOI'}
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isZh ? '年度运营总支出 (房产税/保险/维修/管理/水电) ($)' : isEs ? 'Gastos Operativos Anuales Totales ($)' : isPt ? 'Despesas Operacionais Anuais Totais ($)' : 'Total Annual Operating Expenses (Taxes, Ins, Maint, Mgmt) ($)'}
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(annualOperatingExpenses)}
                    onChange={(e) => setAnnualOperatingExpenses(Math.max(0, parseNumberInput(e.target.value)))}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold tabular-nums text-slate-900"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  {isZh
                    ? `费用率: ${opexRatio.toFixed(1)}% EGI | 净营业收入 (NOI): ${formatCurrency(noi)}`
                    : isEs
                    ? `Ratio de Gastos: ${opexRatio.toFixed(1)}% EGI | Ingreso Operativo Neto (NOI): ${formatCurrency(noi)}`
                    : isPt
                    ? `Índice de Despesas: ${opexRatio.toFixed(1)}% EGI | Receita Operacional Líquida (NOI): ${formatCurrency(noi)}`
                    : `Expense Ratio: ${opexRatio.toFixed(1)}% | NOI: ${formatCurrency(noi)}`}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Financing & Mortgage Terms */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-600" />
              {isZh ? '4. 贷款融资方案' : isEs ? '4. Estructura de Financiación' : isPt ? '4. Estrutura de Financiamento' : '4. Mortgage & Financing Terms'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '首付比例 (%)' : isEs ? 'Anticipo / Entrada (%)' : isPt ? 'Entrada Própria (%)' : 'Down Payment (%)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    value={downPaymentPercent || ''}
                    onChange={(e) => setDownPaymentPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-full pr-8 pl-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-semibold">%</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  {formatCurrency(downPayment)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '贷款年利率 (%)' : isEs ? 'Tasa de Interés (%)' : isPt ? 'Taxa de Juros (%)' : 'Interest Rate (%)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={interestRate || ''}
                    onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                    className="w-full pr-8 pl-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-semibold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '摊销年限 (年)' : isEs ? 'Amortización (Años)' : isPt ? 'Amortização (Anos)' : 'Amortization (Yrs)'}
                </label>
                <select
                  value={amortizationYears}
                  onChange={(e) => setAmortizationYears(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900 bg-white"
                >
                  <option value={15}>{isZh ? '15 年' : isEs ? '15 Años' : isPt ? '15 Anos' : '15 Years'}</option>
                  <option value={20}>{isZh ? '20 年' : isEs ? '20 Años' : isPt ? '20 Anos' : '20 Years'}</option>
                  <option value={25}>{isZh ? '25 年 (商业银行常用)' : isEs ? '25 Años (Estándar Bancario)' : isPt ? '25 Anos (Padrão Bancário)' : '25 Years (Bank Std)'}</option>
                  <option value={30}>{isZh ? '30 年 (Agency/住宅标准)' : isEs ? '30 Años (Estándar de Agencia/Residencial)' : isPt ? '30 Anos (Padrão de Agência/Residencial)' : '30 Years (Agency Std)'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Metrics & Chained Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Hero Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 block">
                  {isZh ? '税前净现金流 (Net Cash Flow)' : isEs ? 'Flujo de Caja Neto Antes de Impuestos' : isPt ? 'Fluxo de Caixa Líquido Antes dos Impostos' : 'Pre-Tax Annual Cash Flow'}
                </span>
                <span className={`text-3xl sm:text-4xl font-black tracking-tight ${preTaxNetCashFlow >= 0 ? 'text-white' : 'text-rose-400'}`}>
                  {formatCurrency(preTaxNetCashFlow)}
                  <span className="text-xs font-normal text-slate-400 block mt-0.5">
                    {formatCurrency(monthlyCashFlow)} / {isZh ? '月' : isEs ? 'mes' : isPt ? 'mês' : 'mo'}
                  </span>
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <TrendingUp className="w-3.5 h-3.5" />
                  CoC {cashOnCashTotal.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Core Return Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">
                  {isZh ? '净营业收入 NOI' : isEs ? 'Ingreso Operativo Neto (NOI)' : isPt ? 'Receita Operacional Líquida (NOI)' : 'Net Operating Income'}
                </span>
                <span className="text-base font-bold text-white font-mono">{formatCurrency(noi)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">
                  {isZh ? '资本化率 Cap Rate' : isEs ? 'Tasa de Capitalización (Cap Rate)' : isPt ? 'Taxa de Capitalização (Cap Rate)' : 'Going-In Cap Rate'}
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono">{formatPercent(capRate)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">
                  {isZh ? '偿债覆盖率 DSCR' : isEs ? 'Cobertura de Deuda (DSCR)' : isPt ? 'Cobertura da Dívida (DSCR)' : 'DSCR Coverage'}
                </span>
                <span className="text-base font-bold text-white font-mono">{dscr.toFixed(2)}x</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">
                  {isZh ? '保本比率 BER' : isEs ? 'Punto de Equilibrio (BER)' : isPt ? 'Ponto de Equilíbrio (BER)' : 'Break-Even Ratio'}
                </span>
                <span className="text-base font-bold text-slate-200 font-mono">{formatPercent(breakEvenRatio)}</span>
              </div>
            </div>

            {/* Detailed Line-by-Line Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">
                  {isZh ? '贷款本金 (Loan Amount):' : isEs ? 'Monto del Préstamo:' : isPt ? 'Valor do Empréstimo:' : 'Loan Amount:'}
                </span>
                <span className="font-bold text-slate-100 font-mono">{formatCurrency(loanAmount)} ({((100 - downPaymentPercent)).toFixed(0)}% LTV)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">
                  {isZh ? '月供与年度还本付息 (ADS):' : isEs ? 'Servicio Anual de la Deuda (ADS):' : isPt ? 'Serviço Anual da Dívida (ADS):' : 'Annual Debt Service (ADS):'}
                </span>
                <span className="font-bold text-slate-100 font-mono">{formatCurrency(annualDebtService)} ({formatCurrency(monthlyPayment)}/{isZh ? '月' : isEs ? 'mes' : isPt ? 'mês' : 'mo'})</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">
                  {isZh ? '实际自付总现金 (Total Equity):' : isEs ? 'Capital Total Invertido:' : isPt ? 'Capital Total Investido:' : 'Total Cash Invested:'}
                </span>
                <span className="font-bold text-slate-100 font-mono">{formatCurrency(totalCashInvested)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <div>
                  <span className="text-slate-400 block">
                    {isZh ? '现金回报率 (全款自付口径):' : isEs ? 'Retorno sobre Efectivo (Capital Total):' : isPt ? 'Retorno sobre Caixa (Capital Total):' : 'Cash-on-Cash (All-In):'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {isZh
                      ? `首付 + 过户费 ($${totalCashInvested.toLocaleString()})`
                      : isEs
                      ? `Entrada + Gastos de cierre ($${totalCashInvested.toLocaleString()})`
                      : isPt
                      ? `Entrada + Custos de fechamento ($${totalCashInvested.toLocaleString()})`
                      : 'Down payment + Closing costs'}
                  </span>
                </div>
                <span className="font-bold text-emerald-400 font-mono text-sm">{formatPercent(cashOnCashTotal)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <div>
                  <span className="text-slate-400 block">
                    {isZh ? '现金回报率 (仅首付款口径):' : isEs ? 'Retorno sobre Efectivo (Solo Entrada):' : isPt ? 'Retorno sobre Caixa (Apenas Entrada):' : 'Cash-on-Cash (Down Payment):'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {isZh
                      ? `仅限首付款 ($${downPayment.toLocaleString()})`
                      : isEs
                      ? `Solo entrada inicial ($${downPayment.toLocaleString()})`
                      : isPt
                      ? `Apenas entrada inicial ($${downPayment.toLocaleString()})`
                      : 'Pure down payment only'}
                  </span>
                </div>
                <span className="font-bold text-slate-300 font-mono text-sm">{formatPercent(cashOnCashDownPaymentOnly)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">
                  {isZh ? '保本所需最低出租率 (BEO):' : isEs ? 'Ocupación de Equilibrio (BEO):' : isPt ? 'Ocupação de Equilíbrio (BEO):' : 'Break-Even Occupancy (BEO):'}
                </span>
                <span className="font-bold text-slate-200 font-mono">{formatPercent(breakEvenOccupancy)}</span>
              </div>
            </div>

            {/* Chained Navigation Buttons */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                {isZh ? '承销串联与深度分析' : isEs ? 'Flujo de Suscripción Siguiente' : isPt ? 'Próximo Passo da Subscrição' : 'Chained Underwriting Workflow'}
              </span>
              <div className="grid grid-cols-1 gap-2">
                <Link
                  href={`/${locale}/tools/deal-analyzer/#pp=${Math.round(safePrice)}&dp=${Math.round(downPaymentPercent)}&noi=${Math.round(noi)}&ds=${Math.round(annualDebtService)}&gpi=${Math.round(grossPotentialIncome)}&opex=${Math.round(operatingExpenses)}&vac=${vacancyRate}&ir=${interestRate}&ay=${amortizationYears}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition text-white text-xs font-bold"
                >
                  <span>{isZh ? '带入 Deal Analyzer 进行综合承销与压力测试' : isEs ? 'Llevar a Deal Analyzer para Evaluación y Prueba de Estrés' : isPt ? 'Levar ao Deal Analyzer para Subscrição e Teste de Estresse' : 'Send to Deal Analyzer for Comprehensive Underwriting & Stress Test'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/${locale}/calculators/apartment-building-mortgage/`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-slate-200 hover:text-white text-xs font-semibold"
                >
                  <span>{isZh ? '使用多户商业房贷计算器测算 Agency / Bank / HUD 额度' : isEs ? 'Dimensionar Hipoteca Multifamiliar (Agencia / Banco / HUD)' : isPt ? 'Dimensionar Financiamento Multifamiliar (Agência / Banco / HUD)' : 'Size Loan via Apartment Building Mortgage Calculator'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Value Proposition Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {isZh ? '100% 免费，无门槛限制' : isEs ? '100% Gratuito y Sin Restricciones' : isPt ? '100% Gratuito e Sem Restrições' : '100% Free & Unrestricted'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isZh
                ? '无需注册账号、无需绑定信用卡、无分析次数上限。所有计算全部在您的浏览器本地实时完成，数据不上传第三方服务器，保障投资尽调隐私。'
                : isEs
                ? 'Sin registro obligatorio, sin tarjeta de crédito y sin muros de pago. Todos los cálculos se ejecutan localmente en su navegador para garantizar privacidad instantánea.'
                : isPt
                ? 'Sem necessidade de cadastro, sem cartão de crédito e sem bloqueios pagos. Todos os cálculos são executados localmente no seu navegador para total privacidade.'
                : 'Zero sign-up required, zero credit card prompts, and zero artificial paywalls. All calculations execute locally inside your browser for instant privacy and zero data leakage.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
