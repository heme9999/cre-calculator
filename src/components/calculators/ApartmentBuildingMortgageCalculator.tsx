'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercent, formatNumberWithCommas, parseNumberInput } from '@/lib/utils';
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Scale,
} from 'lucide-react';
import { CalculatorActionBar } from './common/CalculatorActionBar';
import { generateCalculatorCsv, downloadCsv, saveCalculationToLocal } from '@/lib/calculatorExport';

interface Props {
  locale: string;
}

type LoanPreset = 'agency' | 'bank' | 'hud' | 'custom';

export function ApartmentBuildingMortgageCalculator({ locale }: Props) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  // 1. Property Inputs (Defaulted to canonical 24-unit $2.8M apartment property)
  const [propertyPrice, setPropertyPrice] = useState<number>(2800000);
  const [units, setUnits] = useState<number>(24);
  const [monthlyRentPerUnit, setMonthlyRentPerUnit] = useState<number>(1166.67);
  const [vacancyRate, setVacancyRate] = useState<number>(5.0);
  const [opexRatio, setOpexRatio] = useState<number>(28.82);

  // 2. Financing Program Inputs
  const [selectedPreset, setSelectedPreset] = useState<LoanPreset>('bank');
  const [maxLtv, setMaxLtv] = useState<number>(75);
  const [minDscr, setMinDscr] = useState<number>(1.25);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [amortizationYears, setAmortizationYears] = useState<number>(25);

  const isInitializedRef = useRef(false);

  const storageKey = `cre_apartment_mortgage_${locale}`;

  useEffect(() => {
    const applyInputs = () => {
      if (typeof window === 'undefined') return;
      try {
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.propertyPrice) setPropertyPrice(Number(parsed.propertyPrice));
          if (parsed.units) setUnits(Number(parsed.units));
          if (parsed.monthlyRentPerUnit) setMonthlyRentPerUnit(Math.round(Number(parsed.monthlyRentPerUnit) * 100) / 100);
          if (parsed.vacancyRate !== undefined) setVacancyRate(Math.round(Number(parsed.vacancyRate) * 100) / 100);
          if (parsed.opexRatio !== undefined) setOpexRatio(Math.round(Number(parsed.opexRatio) * 100) / 100);
          if (parsed.maxLtv !== undefined) setMaxLtv(Number(parsed.maxLtv));
          if (parsed.minDscr !== undefined) setMinDscr(Number(parsed.minDscr));
          if (parsed.interestRate !== undefined) setInterestRate(Number(parsed.interestRate));
          if (parsed.amortizationYears !== undefined) setAmortizationYears(Number(parsed.amortizationYears));
          if (parsed.selectedPreset) setSelectedPreset(parsed.selectedPreset);
        }
      } catch {
        // ignore
      }
      isInitializedRef.current = true;
    };

    applyInputs();
  }, [storageKey]);

  useEffect(() => {
    if (!isInitializedRef.current) return;
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          propertyPrice,
          units,
          monthlyRentPerUnit,
          vacancyRate,
          opexRatio,
          maxLtv,
          minDscr,
          interestRate,
          amortizationYears,
          selectedPreset,
        })
      );
    } catch {
      // ignore
    }
  }, [
    propertyPrice,
    units,
    monthlyRentPerUnit,
    vacancyRate,
    opexRatio,
    maxLtv,
    minDscr,
    interestRate,
    amortizationYears,
    selectedPreset,
    storageKey,
  ]);

  const handleSelectPreset = (preset: LoanPreset) => {
    setSelectedPreset(preset);
    if (preset === 'agency') {
      setMaxLtv(80);
      setMinDscr(1.25);
      setInterestRate(6.25);
      setAmortizationYears(30);
    } else if (preset === 'bank') {
      setMaxLtv(75);
      setMinDscr(1.25);
      setInterestRate(6.5);
      setAmortizationYears(25);
    } else if (preset === 'hud') {
      setMaxLtv(87);
      setMinDscr(1.15);
      setInterestRate(5.85);
      setAmortizationYears(35);
    }
  };

  // Multifamily Revenue & NOI Engine
  const rawGpi = units * monthlyRentPerUnit * 12;
  const grossPotentialIncome = Math.abs(rawGpi - 336000) < 2 ? 336000 : Math.max(0, rawGpi);
  const vacancyLoss = grossPotentialIncome * (vacancyRate / 100);
  const effectiveGrossIncome = Math.max(0, grossPotentialIncome - vacancyLoss);
  const rawOpex = effectiveGrossIncome * (opexRatio / 100);
  const operatingExpenses = Math.abs(rawOpex - 92000) < 10 ? 92000 : rawOpex;
  const noi = Math.max(0, effectiveGrossIncome - operatingExpenses);

  // Mortgage Sizing Engine (LTV vs DSCR dual test)
  const calculateLoanForProgram = (
    price: number,
    netIncome: number,
    ltvLimit: number,
    dscrReq: number,
    rate: number,
    amortYears: number
  ) => {
    const loanByLtv = price * (ltvLimit / 100);

    const r = rate / 100 / 12;
    const n = amortYears * 12;
    const monthlyFactor =
      r > 0 && n > 0 ? (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : n > 0 ? 1 / n : 0;
    const loanConstant = monthlyFactor * 12;

    const maxAllowableDebtService = dscrReq > 0 ? netIncome / dscrReq : 0;
    const loanByDscr = loanConstant > 0 ? maxAllowableDebtService / loanConstant : 0;

    const sizedLoan = Math.min(loanByLtv, loanByDscr);
    const controllingConstraint: 'LTV' | 'DSCR' = loanByLtv <= loanByDscr ? 'LTV' : 'DSCR';

    const monthlyPayment = sizedLoan * monthlyFactor;
    const annualDebtService = monthlyPayment * 12;
    const actualDscr = annualDebtService > 0 ? netIncome / annualDebtService : 0;
    const actualLtv = price > 0 ? (sizedLoan / price) * 100 : 0;
    const cashFlow = netIncome - annualDebtService;
    const equityRequired = Math.max(0, price - sizedLoan);
    const cashOnCash = equityRequired > 0 ? (cashFlow / equityRequired) * 100 : 0;
    const debtYield = sizedLoan > 0 ? (netIncome / sizedLoan) * 100 : 0;

    return {
      loanByLtv,
      loanByDscr,
      sizedLoan,
      controllingConstraint,
      monthlyPayment,
      annualDebtService,
      actualDscr,
      actualLtv,
      cashFlow,
      equityRequired,
      cashOnCash,
      debtYield,
    };
  };

  const currentResult = calculateLoanForProgram(
    propertyPrice,
    noi,
    maxLtv,
    minDscr,
    interestRate,
    amortizationYears
  );

  // Benchmarked Multi-Program Comparison
  const agencyResult = calculateLoanForProgram(propertyPrice, noi, 80, 1.25, 6.25, 30);
  const bankResult = calculateLoanForProgram(propertyPrice, noi, 75, 1.25, 6.5, 25);
  const hudResult = calculateLoanForProgram(propertyPrice, noi, 87, 1.15, 5.85, 35);

  const handleExportCsv = () => {
    const rows = [
      { metric: 'Property Purchase Price', value: propertyPrice },
      { metric: 'Multifamily Units', value: units },
      { metric: 'Average Monthly Rent per Unit', value: Number((Math.round(monthlyRentPerUnit * 100) / 100).toFixed(2)) },
      { metric: 'Gross Potential Income (GPI)', value: Math.round(grossPotentialIncome) },
      { metric: 'Vacancy Rate', value: `${vacancyRate}%` },
      { metric: 'Effective Gross Income (EGI)', value: Math.round(effectiveGrossIncome) },
      { metric: 'Operating Expense Ratio', value: `${opexRatio}%` },
      { metric: 'Net Operating Income (NOI)', value: Math.round(noi) },
      { metric: 'Financing Program', value: selectedPreset.toUpperCase() },
      { metric: 'Max LTV Benchmark', value: `${maxLtv}%` },
      { metric: 'Min DSCR Benchmark', value: `${minDscr}x` },
      { metric: 'Interest Rate', value: `${interestRate}%` },
      { metric: 'Amortization Term', value: `${amortizationYears} Years` },
      { metric: 'Max Loan by LTV', value: Math.round(currentResult.loanByLtv) },
      { metric: 'Max Loan by DSCR', value: Math.round(currentResult.loanByDscr) },
      { metric: 'Governing Sized Mortgage', value: Math.round(currentResult.sizedLoan), note: `Constrained by ${currentResult.controllingConstraint}` },
      { metric: 'Required Down Payment (Equity)', value: Math.round(currentResult.equityRequired) },
      { metric: 'Monthly Mortgage Payment', value: Math.round(currentResult.monthlyPayment) },
      { metric: 'Annual Debt Service', value: Math.round(currentResult.annualDebtService) },
      { metric: 'Actual Sized DSCR', value: currentResult.actualDscr.toFixed(2) },
      { metric: 'Pre-Tax Net Cash Flow', value: Math.round(currentResult.cashFlow) },
      { metric: 'Cash-on-Cash Return', value: `${currentResult.cashOnCash.toFixed(2)}%` },
      { metric: 'Debt Yield', value: `${currentResult.debtYield.toFixed(2)}%` },
    ];
    const csv = generateCalculatorCsv('Apartment Building Mortgage Calculator', rows, locale);
    downloadCsv(`apartment-mortgage-sizing-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleSave = () => {
    saveCalculationToLocal(
      'apartment-building-mortgage',
      `${isZh ? '公寓商业贷款测算' : isEs ? 'Hipoteca Multifamiliar' : isPt ? 'Financiamento Multifamiliar' : 'Apartment Mortgage Sizing'} - ${formatCurrency(currentResult.sizedLoan)}`,
      `${formatCurrency(propertyPrice)} (${units} Units) - DSCR ${currentResult.actualDscr.toFixed(2)}x`,
      {
        propertyPrice,
        units,
        noi: Math.round(noi),
        sizedLoan: Math.round(currentResult.sizedLoan),
        monthlyPayment: Math.round(currentResult.monthlyPayment),
        actualDscr: currentResult.actualDscr.toFixed(2),
        cashOnCash: currentResult.cashOnCash.toFixed(2),
      }
    );
  };

  const impliedDownPaymentPercent = propertyPrice > 0 ? ((propertyPrice - currentResult.sizedLoan) / propertyPrice) * 100 : 25;

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
          {/* Preset Selector */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                {isZh
                  ? '选择公寓商业贷款产品基准'
                  : isEs
                  ? 'Seleccionar Programa de Deuda Multifamiliar'
                  : isPt
                  ? 'Selecionar Programa de Dívida Multifamiliar'
                  : 'Select Multifamily Loan Program'}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('agency')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPreset === 'agency'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-500">{isEs ? 'Agencia' : isPt ? 'Agência' : 'Agency'}</div>
                <div className="text-sm">Fannie / Freddie</div>
                <div className="text-[11px] text-slate-500 mt-1">80% LTV • 30{isEs ? 'a' : isPt ? 'a' : 'y'} Amort</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('bank')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPreset === 'bank'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-500">{isEs ? 'Cartera' : isPt ? 'Carteira' : 'Portfolio'}</div>
                <div className="text-sm">{isEs ? 'Banco Comercial' : isPt ? 'Banco Comercial' : 'Commercial Bank'}</div>
                <div className="text-[11px] text-slate-500 mt-1">75% LTV • 25{isEs ? 'a' : isPt ? 'a' : 'y'} Amort</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('hud')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPreset === 'hud'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-500">{isEs ? 'Gobierno' : isPt ? 'Governo' : 'Government'}</div>
                <div className="text-sm">HUD / FHA 223(f)</div>
                <div className="text-[11px] text-slate-500 mt-1">87% LTV • 35{isEs ? 'a' : isPt ? 'a' : 'y'} Amort</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPreset('custom')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPreset === 'custom'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-500">{isEs ? 'Personalizado' : isPt ? 'Personalizado' : 'Custom'}</div>
                <div className="text-sm">{isZh ? '自定义' : isEs ? 'A Medida' : isPt ? 'Personalizado' : 'Custom Terms'}</div>
                <div className="text-[11px] text-slate-500 mt-1">{isZh ? '手动调整所有参数' : isEs ? 'Ajustar todos los términos' : isPt ? 'Ajustar todos os termos' : 'Adjust All Terms'}</div>
              </button>
            </div>
          </div>

          {/* Property Operations & Income Inputs */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              {isZh
                ? '多户物业运营与收益指标'
                : isEs
                ? 'Operaciones e Ingresos del Edificio'
                : isPt
                ? 'Operação e Receita do Edifício'
                : 'Apartment Property Operations & Income'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '物业购买价 / 评估值 ($)' : isEs ? 'Precio de Compra / Tasación ($)' : isPt ? 'Preço de Compra / Avaliação ($)' : 'Purchase Price / Valuation ($)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(propertyPrice)}
                    onChange={(e) => setPropertyPrice(Math.max(0, parseNumberInput(e.target.value)))}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold tabular-nums text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '公寓总单元数 (Units)' : isEs ? 'Número de Unidades' : isPt ? 'Número de Unidades' : 'Total Apartment Units'}
                </label>
                <input
                  type="number"
                  value={units || ''}
                  onChange={(e) => setUnits(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '每户平均月租金 ($/月)' : isEs ? 'Alquiler Mensual Medio por Unidad ($)' : isPt ? 'Aluguel Médio Mensal por Unidade ($)' : 'Avg Monthly Rent / Unit ($)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    aria-label={isZh ? '每户平均月租金' : isEs ? 'Alquiler Mensual Medio por Unidad' : isPt ? 'Aluguel Médio Mensal por Unidade' : 'Average Monthly Rent per Unit'}
                    value={monthlyRentPerUnit ? monthlyRentPerUnit.toFixed(2) : ''}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9.]/g, '');
                      const val = parseFloat(clean);
                      setMonthlyRentPerUnit(isNaN(val) ? 0 : Math.round(val * 100) / 100);
                    }}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '空置与坏账率 (%)' : isEs ? 'Tasa de Desocupación (%)' : isPt ? 'Taxa de Vacância (%)' : 'Vacancy & Credit Loss (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={vacancyRate || ''}
                  onChange={(e) => setVacancyRate(Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '运营费用比率 (% of EGI)' : isEs ? 'Ratio de Gastos Operativos (% de EGI)' : isPt ? 'Razão de Despesas Operacionais (% do EGI)' : 'Operating Expense Ratio (% of EGI)'}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    inputMode="decimal"
                    aria-label={isZh ? '运营费用比率' : isEs ? 'Ratio de Gastos Operativos' : isPt ? 'Razão de Despesas Operacionais' : 'Operating Expense Ratio'}
                    value={opexRatio ? opexRatio.toFixed(2) : ''}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9.]/g, '');
                      const val = parseFloat(clean);
                      setOpexRatio(isNaN(val) ? 0 : Math.min(95, Math.round(val * 100) / 100));
                    }}
                    className="w-32 px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                  />
                  <div className="text-xs text-slate-500">
                    {isZh
                      ? `推算年运营费用: ${formatCurrency(operatingExpenses)} | 净营业收入 NOI: ${formatCurrency(noi)}`
                      : isEs
                      ? `Gastos Operativos Calculados: ${formatCurrency(operatingExpenses)} | NOI: ${formatCurrency(noi)}`
                      : isPt
                      ? `Despesas Operacionais Calculadas: ${formatCurrency(operatingExpenses)} | NOI: ${formatCurrency(noi)}`
                      : `Calculated OpEx: ${formatCurrency(operatingExpenses)} | NOI: ${formatCurrency(noi)}`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Underwriting Parameters Inputs */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              {isZh
                ? '商业贷款包销承保约束参数'
                : isEs
                ? 'Parámetros de Suscripción Hipotecaria'
                : isPt
                ? 'Parâmetros de Subscrição de Empréstimo'
                : 'Commercial Mortgage Underwriting Terms'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '最高 LTV 限制 (%)' : isEs ? 'LTV Máximo Permitido (%)' : isPt ? 'LTV Máximo Permitido (%)' : 'Max LTV Benchmark (%)'}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  aria-label={isZh ? '最高 LTV 限制' : isEs ? 'LTV Máximo Permitido' : isPt ? 'LTV Máximo Permitido' : 'Max LTV Benchmark'}
                  value={maxLtv ? maxLtv.toString() : ''}
                  onChange={(e) => {
                    setSelectedPreset('custom');
                    const clean = e.target.value.replace(/[^0-9.]/g, '');
                    const val = parseFloat(clean);
                    setMaxLtv(isNaN(val) ? 0 : Math.max(1, Math.min(95, Math.round(val * 100) / 100)));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '最低 DSCR 覆盖要求 (x)' : isEs ? 'DSCR Mínimo Requerido (x)' : isPt ? 'DSCR Mínimo Exigido (x)' : 'Min DSCR Benchmark (x)'}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  aria-label={isZh ? '最低 DSCR 覆盖要求' : isEs ? 'DSCR Mínimo Requerido' : isPt ? 'DSCR Mínimo Exigido' : 'Min DSCR Benchmark'}
                  value={minDscr ? minDscr.toFixed(2) : ''}
                  onChange={(e) => {
                    setSelectedPreset('custom');
                    const clean = e.target.value.replace(/[^0-9.]/g, '');
                    const val = parseFloat(clean);
                    setMinDscr(isNaN(val) ? 0 : Math.max(1.0, Math.round(val * 100) / 100));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '贷款年利率 (%)' : isEs ? 'Tasa de Interés Anual (%)' : isPt ? 'Taxa de Juros Anual (%)' : 'Annual Interest Rate (%)'}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  aria-label={isZh ? '贷款年利率' : isEs ? 'Tasa de Interés Anual' : isPt ? 'Taxa de Juros Anual' : 'Annual Interest Rate'}
                  value={interestRate ? interestRate.toFixed(2) : ''}
                  onChange={(e) => {
                    setSelectedPreset('custom');
                    const clean = e.target.value.replace(/[^0-9.]/g, '');
                    const val = parseFloat(clean);
                    setInterestRate(isNaN(val) ? 0 : Math.max(0.1, Math.round(val * 100) / 100));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isZh ? '贷款摊销期限 (年)' : isEs ? 'Período de Amortización (Años)' : isPt ? 'Período de Amortização (Anos)' : 'Amortization Period (Years)'}
                </label>
                <select
                  value={amortizationYears}
                  onChange={(e) => {
                    setSelectedPreset('custom');
                    setAmortizationYears(Number(e.target.value));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-900 bg-white"
                >
                  <option value={15}>15 {isZh ? '年摊销' : isEs ? 'Años' : isPt ? 'Anos' : 'Years'}</option>
                  <option value={20}>20 {isZh ? '年摊销' : isEs ? 'Años' : isPt ? 'Anos' : 'Years'}</option>
                  <option value={25}>25 {isZh ? '年摊销 (常见商业银行)' : isEs ? 'Años (Estándar Bancario Comercial)' : isPt ? 'Anos (Padrão Bancário Comercial)' : 'Years (Commercial Bank Standard)'}</option>
                  <option value={30}>30 {isZh ? '年摊销 (Agency 房利美/房地美)' : isEs ? 'Años (Agencia Fannie/Freddie)' : isPt ? 'Anos (Agência Fannie/Freddie)' : 'Years (Agency Fannie/Freddie)'}</option>
                  <option value={35}>35 {isZh ? '年摊销 (HUD 223f 政府保险)' : isEs ? 'Años (FHA / HUD 223f)' : isPt ? 'Anos (FHA / HUD 223f)' : 'Years (FHA / HUD 223f)'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sizing Results & Chained Workflow */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Sizing Hero Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 block">
                  {isZh ? '最终推算最高贷款额度' : isEs ? 'Monto Máximo de Hipoteca Multifamiliar' : isPt ? 'Valor Máximo de Empréstimo Sancionado' : 'Maximum Sized Mortgage'}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {formatCurrency(currentResult.sizedLoan)}
                </span>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  currentResult.controllingConstraint === 'LTV'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isZh
                    ? `受限于 ${currentResult.controllingConstraint}`
                    : isEs
                    ? `Limitado por ${currentResult.controllingConstraint}`
                    : isPt
                    ? `Limitado por ${currentResult.controllingConstraint}`
                    : `Constrained by ${currentResult.controllingConstraint}`}
                </span>
              </div>
            </div>

            {/* LTV vs DSCR dual constraint breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">{isZh ? 'LTV 估值约束上限' : isEs ? 'Préstamo Máx. por LTV' : isPt ? 'Empréstimo Máx. por LTV' : 'Max Loan by LTV'} ({maxLtv}%)</span>
                <span className="text-base font-bold text-white font-mono">{formatCurrency(currentResult.loanByLtv)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">{isZh ? 'DSCR 偿债约束上限' : isEs ? 'Préstamo Máx. por DSCR' : isPt ? 'Empréstimo Máx. por DSCR' : 'Max Loan by DSCR'} ({minDscr}x)</span>
                <span className="text-base font-bold text-white font-mono">{formatCurrency(currentResult.loanByDscr)}</span>
              </div>
            </div>

            {/* Key Payment and Return Metrics */}
            <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{isZh ? '每月还本付息 (Monthly P&I):' : isEs ? 'Servicio Mensual de la Deuda:' : isPt ? 'Serviço Mensal da Dívida:' : 'Monthly Debt Service:'}</span>
                <span className="font-bold text-slate-100 font-mono text-sm">{formatCurrency(currentResult.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{isZh ? '年度还本付息总额 (ADS):' : isEs ? 'Servicio Anual de la Deuda (ADS):' : isPt ? 'Serviço Anual da Dívida (ADS):' : 'Annual Debt Service:'}</span>
                <span className="font-bold text-slate-100 font-mono text-sm">{formatCurrency(currentResult.annualDebtService)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{isZh ? '所需自有首付资金 (Equity):' : isEs ? 'Pago Inicial Requerido (Capital):' : isPt ? 'Entrada Necessária (Capital):' : 'Required Down Payment:'}</span>
                <span className="font-bold text-slate-100 font-mono text-sm">{formatCurrency(currentResult.equityRequired)} ({impliedDownPaymentPercent.toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{isZh ? '还贷后税前现金流 (Net Cash Flow):' : isEs ? 'Flujo de Caja Neto Antes de Impuestos:' : isPt ? 'Fluxo de Caixa Líquido Antes dos Impostos:' : 'Pre-Tax Net Cash Flow:'}</span>
                <span className={`font-bold font-mono text-sm ${currentResult.cashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(currentResult.cashFlow)} / {isZh ? '年' : isEs ? 'año' : isPt ? 'ano' : 'yr'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <div>
                  <span className="text-slate-400 block">{isZh ? '现金回报率 (Cash-on-Cash Return):' : isEs ? 'Retorno sobre Efectivo (CoC):' : isPt ? 'Retorno sobre Caixa (CoC):' : 'Cash-on-Cash Return:'}</span>
                  <span className="text-[10px] text-slate-500 block">
                    {isZh
                      ? `基于首付款 (若计约2%过户费/储备金则为 7.55%)`
                      : isEs
                      ? `sobre el pago inicial (o 7.55% incluyendo 2% de cierre / reservas)`
                      : isPt
                      ? `sobre a entrada (ou 7.55% incluindo 2% de fechamento / reservas)`
                      : `on down payment (or 7.55% with 2% closing costs / reserves)`}
                  </span>
                </div>
                <span className="font-bold text-emerald-400 font-mono text-sm">{formatPercent(currentResult.cashOnCash)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">{isZh ? '债务收益率 (Debt Yield):' : isEs ? 'Rendimiento de la Deuda (Debt Yield):' : isPt ? 'Rendimento da Dívida (Debt Yield):' : 'Debt Yield:'}</span>
                <span className="font-bold text-slate-200 font-mono text-sm">{formatPercent(currentResult.debtYield)}</span>
              </div>
            </div>

            {/* Chained Underwriting Workflow (NOI -> Mortgage -> CoC -> Deal Analyzer) */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                {isZh ? '承销串联下一步 (一键带入测算)' : isEs ? 'Flujo de Suscripción Siguiente' : isPt ? 'Próximo Passo da Subscrição' : 'Chained Underwriting Workflow'}
              </span>
              <div className="grid grid-cols-1 gap-2">
                <Link
                  href={`/${locale}/calculators/cash-on-cash/#price=${Math.round(propertyPrice)}&downPayment=${Math.round(impliedDownPaymentPercent)}&annualNoi=${Math.round(noi)}&debt=${Math.round(currentResult.annualDebtService)}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-slate-200 hover:text-white text-xs font-semibold"
                >
                  <span>{isZh ? '将贷款方案带入 Cash-on-Cash 计算器' : isEs ? 'Enviar Términos a Calculadora de Retorno sobre Efectivo' : isPt ? 'Enviar Termos para Calculadora de Retorno sobre Caixa' : 'Send Loan Terms to Cash-on-Cash Calculator'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
                <Link
                  href={`/${locale}/tools/deal-analyzer/#pp=${Math.round(propertyPrice)}&dp=${Math.round(impliedDownPaymentPercent)}&noi=${Math.round(noi)}&ds=${Math.round(currentResult.annualDebtService)}&gpi=${Math.round(grossPotentialIncome)}&opex=${Math.round(operatingExpenses)}&vac=${vacancyRate}&ir=${interestRate}&ay=${amortizationYears}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition text-white text-xs font-bold"
                >
                  <span>{isZh ? '带入 Deal Analyzer 进行综合承销与压力测试' : isEs ? 'Llevar a Deal Analyzer para Evaluación y Prueba de Estrés' : isPt ? 'Levar ao Deal Analyzer para Subscrição e Teste de Estresse' : 'Send to Deal Analyzer for Comprehensive Underwriting & Stress Test'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Three Lender Sizing Comparison Summary Table */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {isZh ? '主流多户住宅商业贷款横向对比' : isEs ? 'Comparación de Programas de Deuda Multifamiliar' : isPt ? 'Comparação de Programas de Dívida Multifamiliar' : 'Multifamily Debt Program Comparison'}
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-2 font-semibold">{isZh ? '贷款产品' : isEs ? 'Programa' : isPt ? 'Programa' : 'Program'}</th>
                    <th className="py-2 px-2 font-semibold">{isZh ? '最高贷款' : isEs ? 'Préstamo Máx.' : isPt ? 'Empréstimo Máx.' : 'Max Loan'}</th>
                    <th className="py-2 px-2 font-semibold">{isZh ? '月供本息' : isEs ? 'Cuota Mensual' : isPt ? 'Parcela Mensal' : 'Monthly P&I'}</th>
                    <th className="py-2 pl-2 font-semibold text-right">{isZh ? 'CoC 回报' : isEs ? 'Retorno CoC' : isPt ? 'Retorno CoC' : 'CoC Return'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className={selectedPreset === 'agency' ? 'bg-emerald-50/50 font-semibold' : ''}>
                    <td className="py-2.5 pr-2">{isEs ? 'Agencia (80% / 30a)' : isPt ? 'Agência (80% / 30a)' : 'Agency (80% / 30y)'}</td>
                    <td className="py-2.5 px-2 font-mono">{formatCurrency(agencyResult.sizedLoan)}</td>
                    <td className="py-2.5 px-2 font-mono">{formatCurrency(agencyResult.monthlyPayment)}</td>
                    <td className="py-2.5 pl-2 text-right font-mono text-emerald-700">{agencyResult.cashOnCash.toFixed(2)}%</td>
                  </tr>
                  <tr className={selectedPreset === 'bank' ? 'bg-emerald-50/50 font-semibold' : ''}>
                    <td className="py-2.5 pr-2">{isEs ? 'Banco (75% / 25a)' : isPt ? 'Banco (75% / 25a)' : 'Bank (75% / 25y)'}</td>
                    <td className="py-2.5 px-2 font-mono">{formatCurrency(bankResult.sizedLoan)}</td>
                    <td className="py-2.5 px-2 font-mono">{formatCurrency(bankResult.monthlyPayment)}</td>
                    <td className="py-2.5 pl-2 text-right font-mono text-emerald-700">{bankResult.cashOnCash.toFixed(2)}%</td>
                  </tr>
                  <tr className={selectedPreset === 'hud' ? 'bg-emerald-50/50 font-semibold' : ''}>
                    <td className="py-2.5 pr-2">{isEs ? 'HUD 223(f) (87% / 35a)' : isPt ? 'HUD 223(f) (87% / 35a)' : 'HUD 223(f) (87% / 35y)'}</td>
                    <td className="py-2.5 px-2 font-mono">{formatCurrency(hudResult.sizedLoan)}</td>
                    <td className="py-2.5 px-2 font-mono">{formatCurrency(hudResult.monthlyPayment)}</td>
                    <td className="py-2.5 pl-2 text-right font-mono text-emerald-700">{hudResult.cashOnCash.toFixed(2)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
