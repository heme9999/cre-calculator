'use client';

import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency, formatNumberWithCommas, parseNumberInput } from '@/lib/utils';
import { Calculator, ShieldAlert, CheckCircle2, Calendar, FileText, ArrowRight, Layers } from 'lucide-react';
import { Exchange1031Timeline } from './visuals/Exchange1031Timeline';
import { CalculatorActionBar } from './common/CalculatorActionBar';
import { generateCalculatorCsv, downloadCsv, saveCalculationToLocal } from '@/lib/calculatorExport';

export type FilingStatus = 'single' | 'married_jointly' | 'married_separately' | 'head_of_household';

interface Props {
  locale: string;
}

export function Exchange1031Calculator({ locale }: Props) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  // Default worked example: $875k sale price, $565k purchase basis, $132k depreciation, $52.5k expenses
  const [salePrice, setSalePrice] = useState<number>(875000);
  const [originalCostBasis, setOriginalCostBasis] = useState<number>(565000);
  const [depreciationTaken, setDepreciationTaken] = useState<number>(132000);
  const [sellingExpenses, setSellingExpenses] = useState<number>(52500);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [sellerMagi, setSellerMagi] = useState<number>(650000);
  const [capitalGainsRate, setCapitalGainsRate] = useState<number>(15);
  const [stateTaxRate, setStateTaxRate] = useState<number>(5);

  // Closing Date for 45/180 Day Deadline Calculator
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };
  const [closingDate, setClosingDate] = useState<string>(getTodayDateString());

  const isInitializedRef = useRef(false);

  const getStorageKey = () => {
    if (typeof window === 'undefined') return 'cre_1031_inputs';
    const subpath = window.location.pathname.replace(/^\/(en|zh|es|pt)/, '');
    return `cre_1031_inputs_${subpath}`;
  };

  useEffect(() => {
    const applyInputs = () => {
      if (typeof window === 'undefined') return;
      try {
        const saved = sessionStorage.getItem(getStorageKey());
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.salePrice !== undefined && !isNaN(Number(parsed.salePrice))) setSalePrice(Number(parsed.salePrice));
          if (parsed.originalCostBasis !== undefined && !isNaN(Number(parsed.originalCostBasis))) setOriginalCostBasis(Number(parsed.originalCostBasis));
          if (parsed.depreciationTaken !== undefined && !isNaN(Number(parsed.depreciationTaken))) setDepreciationTaken(Number(parsed.depreciationTaken));
          if (parsed.sellingExpenses !== undefined && !isNaN(Number(parsed.sellingExpenses))) setSellingExpenses(Number(parsed.sellingExpenses));
          if (parsed.filingStatus) setFilingStatus(parsed.filingStatus as FilingStatus);
          if (parsed.sellerMagi !== undefined && !isNaN(Number(parsed.sellerMagi))) setSellerMagi(Number(parsed.sellerMagi));
          if (parsed.capitalGainsRate !== undefined && !isNaN(Number(parsed.capitalGainsRate))) setCapitalGainsRate(Number(parsed.capitalGainsRate));
          if (parsed.stateTaxRate !== undefined && !isNaN(Number(parsed.stateTaxRate))) setStateTaxRate(Number(parsed.stateTaxRate));
          if (parsed.closingDate) setClosingDate(parsed.closingDate);
        }
      } catch {
        // ignore
      }
      isInitializedRef.current = true;
    };

    const timer = setTimeout(applyInputs, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitializedRef.current) return;
    try {
      sessionStorage.setItem(getStorageKey(), JSON.stringify({
        salePrice,
        originalCostBasis,
        depreciationTaken,
        sellingExpenses,
        filingStatus,
        sellerMagi,
        capitalGainsRate,
        stateTaxRate,
        closingDate,
      }));
    } catch {
      // ignore
    }
  }, [salePrice, originalCostBasis, depreciationTaken, sellingExpenses, filingStatus, sellerMagi, capitalGainsRate, stateTaxRate, closingDate]);

  const niitThresholdMap: Record<FilingStatus, number> = {
    single: 200000,
    married_jointly: 250000,
    married_separately: 125000,
    head_of_household: 200000,
  };
  const currentNiitThreshold = niitThresholdMap[filingStatus];

  // Rigorous Tax Breakdown Calculations
  // 1. Adjusted Cost Basis = Original Purchase Basis - Cumulative Depreciation
  const adjustedCostBasis = Math.max(0, originalCostBasis - depreciationTaken);

  // 2. Net Sales Proceeds = Sale Price - Selling Expenses
  const netSaleProceeds = Math.max(0, salePrice - sellingExpenses);

  // 3. Total Realized Capital Gain = Net Sales Proceeds - Adjusted Basis
  const realizedGain = Math.max(0, netSaleProceeds - adjustedCostBasis);

  // 4. §1250 Depreciation Recapture Gain (lesser of total realized gain or depreciation taken, per Thomson Reuters / IRC §1250)
  const depreciationRecaptureGain = Math.min(realizedGain, Math.max(0, depreciationTaken));

  // 5. Remaining Long-Term Capital Gain
  const remainingCapitalGain = Math.max(0, realizedGain - depreciationRecaptureGain);

  // 6. Tax Breakdown Items
  const depreciationRecaptureTax = depreciationRecaptureGain * 0.25; // Flat 25% federal §1250 recapture
  const federalCapitalGainsTax = remainingCapitalGain * (capitalGainsRate / 100); // 0%, 15%, or 20%
  // IRC §1411 imposes 3.8% NIIT on lesser of realized gain or excess of MAGI over filing threshold
  const magiExcessOverThreshold = Math.max(0, sellerMagi - currentNiitThreshold);
  const niitSubjectGain = Math.min(realizedGain, magiExcessOverThreshold);
  const niitTax = niitSubjectGain * 0.038; // Net Investment Income Tax 3.8% under IRC §1411
  const stateTax = realizedGain * (stateTaxRate / 100); // Illustrative State income tax rate

  // 7. Total Tax Liability & Effective Combined Rate
  const totalTaxLiability = depreciationRecaptureTax + federalCapitalGainsTax + niitTax + stateTax;
  const effectiveTaxRate = realizedGain > 0 ? (totalTaxLiability / realizedGain) * 100 : 0;
  const deferredTax = totalTaxLiability;

  // Deadline Calculations (Calendar Days)
  const calculateDeadlineDate = (baseDateStr: string, daysToAdd: number): string => {
    try {
      const parts = baseDateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        d.setDate(d.getDate() + daysToAdd);
        return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-ES' : locale === 'pt' ? 'pt-BR' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    } catch {
      // fallback
    }
    return '';
  };

  const idDeadlineDate = calculateDeadlineDate(closingDate, 45);
  const exchangeDeadlineDate = calculateDeadlineDate(closingDate, 180);

  const handleShareDeal = async () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    params.set('sp', salePrice.toString());
    params.set('basis', originalCostBasis.toString());
    params.set('dep', depreciationTaken.toString());
    params.set('exp', sellingExpenses.toString());
    params.set('cgr', capitalGainsRate.toString());
    params.set('st', stateTaxRate.toString());
    params.set('fs', filingStatus);
    params.set('magi', sellerMagi.toString());
    const shareUrl = `${window.location.origin}${window.location.pathname}#${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // ignore
    }
  };

  const handleExportCsv = () => {
    const rows = [
      { metric: 'Relinquished Property Sale Price', value: salePrice },
      { metric: 'Original Purchase Cost Basis', value: originalCostBasis },
      { metric: 'Cumulative Depreciation Taken', value: depreciationTaken },
      { metric: 'Adjusted Cost Basis', value: Math.round(adjustedCostBasis) },
      { metric: 'Selling Expenses & Fees', value: sellingExpenses },
      { metric: 'Net Sales Proceeds', value: Math.round(netSaleProceeds) },
      { metric: 'Total Realized Capital Gain', value: Math.round(realizedGain) },
      { metric: '§1250 Depreciation Recapture Gain (25% rate)', value: Math.round(depreciationRecaptureGain) },
      { metric: '§1250 Recapture Tax (25%)', value: Math.round(depreciationRecaptureTax) },
      { metric: 'Remaining Long-Term Capital Gain', value: Math.round(remainingCapitalGain) },
      { metric: `Federal Capital Gains Tax (${capitalGainsRate}%)`, value: Math.round(federalCapitalGainsTax) },
      { metric: 'Net Investment Income Tax (NIIT 3.8%)', value: Math.round(niitTax) },
      { metric: `State Tax (${stateTaxRate}% illustrative)`, value: Math.round(stateTax) },
      { metric: 'Total Estimated Tax Liability', value: Math.round(totalTaxLiability) },
      { metric: 'Effective Combined Tax Rate', value: `${effectiveTaxRate.toFixed(2)}%` },
      { metric: 'Total Deferred Tax via 1031 Exchange', value: Math.round(deferredTax) },
      { metric: 'Relinquished Closing Date', value: closingDate },
      { metric: '45-Day Identification Deadline', value: idDeadlineDate },
      { metric: '180-Day Exchange Completion Deadline', value: exchangeDeadlineDate },
      { metric: '100% Tax Deferral Replacement Value Target', value: salePrice },
      { metric: '100% Tax Deferral Reinvestment Equity Target', value: Math.round(netSaleProceeds) },
    ];
    const csv = generateCalculatorCsv('1031 Exchange Tax Breakdown Calculator', rows, locale);
    downloadCsv(`1031-exchange-breakdown-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleSaveDeal = () => {
    const summary = `1031 Deferred Tax: ${formatCurrency(Math.round(deferredTax))} (Gain: ${formatCurrency(Math.round(realizedGain))}, Recapture: ${formatCurrency(Math.round(depreciationRecaptureTax))}, Target: ${formatCurrency(salePrice)})`;
    saveCalculationToLocal('exchange_1031', '1031 Exchange Breakdown Calculator', summary, {
      salePrice,
      originalCostBasis,
      depreciationTaken,
      sellingExpenses,
      adjustedCostBasis: Math.round(adjustedCostBasis),
      realizedGain: Math.round(realizedGain),
      depreciationRecaptureTax: Math.round(depreciationRecaptureTax),
      federalCapitalGainsTax: Math.round(federalCapitalGainsTax),
      niitTax: Math.round(niitTax),
      stateTax: Math.round(stateTax),
      totalTaxLiability: Math.round(totalTaxLiability),
      closingDate,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>
              {isZh ? '资本利得与折旧追回税拆分' : isEs ? 'Desglose de Ganancias y Recaptura §1250' : isPt ? 'Detalhamento Tributário e Recaptura §1250' : 'Tax Deferral & §1250 Recapture Breakdown'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh
              ? '1031 Exchange 延税与折旧追回税计算器'
              : isEs
              ? 'Calculadora de Aplazamiento Fiscal 1031 y Recaptura §1250'
              : isPt
              ? 'Calculadora de Diferimento Fiscal 1031 e Recaptura §1250'
              : '1031 Exchange Tax Deferral & §1250 Recapture Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
            {isZh
              ? '分别拆算 §1250 折旧追回税 (25%)、联邦长期资本利得税 (15%-20%)、NIIT (3.8%) 与州税，并自动计算 45 天识别与 180 天交割法定截止日。'
              : isEs
              ? 'Desglose detallado de recaptura §1250 (25%), ganancias federales a largo plazo (15%-20%), NIIT (3.8%) e impuestos estatales con calculadora de plazos de 45/180 días.'
              : isPt
              ? 'Detalhamento de recaptura §1250 (25%), ganho de capital federal (15%-20%), NIIT (3,8%) e tributos estaduais com cálculo automático de prazos de 45 e 180 dias.'
              : 'Break down §1250 depreciation recapture (25%), federal long-term capital gains (15%–20%), NIIT (3.8%), and state taxes, with automatic 45-day and 180-day deadline calculators.'}
          </p>
        </div>
      </div>

      {/* Prominent Tax Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 p-4 px-6 md:px-8 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isZh ? (
            <>
              <strong>税务与法规说明：</strong>
              本计算器用于教育演示与财务测算。2026 年联邦长期资本利得税门槛参照 IRS 收入程序规则 Rev. Proc. 2025-32；§1250 折旧追回原则（取已提折旧与总收益之较小者）遵循 Thomson Reuters 税务标准与 IRC §1250。州税率（示例 5%）因所在州而异（0% 至 13.3%）。本工具不构成法律或税务建议，交易前请务必咨询合格中介人 (QI) 及执业注册会计师 (CPA)。
            </>
          ) : isEs ? (
            <>
              <strong>Aviso Legal y Fiscal:</strong> Los tramos federales 2026 corresponden a IRS Rev. Proc. 2025-32. La recaptura de depreciación §1250 (menor entre ganancia o depreciación acumulada) sigue los estándares de Thomson Reuters e IRC §1250. La tasa impositiva estatal (5% de ejemplo) varía según el estado (0% a 13.3%). Consulte a su Intermediario Calificado (QI) y a su CPA.
            </>
          ) : isPt ? (
            <>
              <strong>Aviso Fiscal Obrigatório:</strong> As faixas federais de 2026 baseiam-se na Rev. Proc. 2025-32 do IRS. A recaptura de depreciação §1250 (menor entre ganho ou depreciação acumulada) segue as normas contábeis da Thomson Reuters e IRC §1250. A alíquota estadual (5% ilustrativa) varia entre 0% e 13,3%. Consulte seu Intermediário Qualificado (QI) e seu contador (CPA).
            </>
          ) : (
            <>
              <strong>Mandatory Tax Disclosure:</strong> 2026 federal capital gains brackets reflect IRS Rev. Proc. 2025-32. Unrecaptured §1250 depreciation recapture (lesser of total realized gain or cumulative depreciation) is modeled under IRC §1250 and Thomson Reuters Tax standards. State tax rates (example 5% illustrative) range from 0% to 13.3% depending on jurisdiction. Always consult a Qualified Intermediary (QI) and licensed CPA before executing an exchange.
            </>
          )}
        </p>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>{isZh ? '1. 物业交易与税务假设' : isEs ? '1. Datos de Venta y Parámetros Fiscales' : isPt ? '1. Dados da Venda e Parâmetros Fiscais' : '1. Property Sale & Tax Parameters'}</span>
            </h3>

            {/* Sale Price */}
            <div>
              <label htmlFor="sale-price-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                {isZh ? '拟出售物业售价 (Sale Price)' : isEs ? 'Precio de Venta del Inmueble ($)' : isPt ? 'Preço de Venda do Imóvel ($)' : 'Relinquished Property Sale Price ($)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  id="sale-price-input"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(salePrice)}
                  onChange={(e) => setSalePrice(Math.max(0, parseNumberInput(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 text-slate-900 font-semibold tabular-nums focus:outline-none text-sm"
                  placeholder="875,000"
                />
              </div>
            </div>

            {/* Cost Basis & Cumulative Depreciation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cost-basis-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isZh ? '原始买入成本基准 (Original Cost Basis)' : isEs ? 'Base de Costo Original de Compra ($)' : isPt ? 'Custo de Aquisição Original ($)' : 'Original Purchase Cost Basis ($)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="cost-basis-input"
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(originalCostBasis)}
                    onChange={(e) => setOriginalCostBasis(Math.max(0, parseNumberInput(e.target.value)))}
                    className="w-full pl-8 pr-4 py-2.5 text-slate-900 font-semibold tabular-nums focus:outline-none text-sm"
                    placeholder="565,000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="depreciation-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isZh ? '累计已提取折旧 (Depreciation Taken)' : isEs ? 'Depreciación Acumulada Deducida ($)' : isPt ? 'Depreciação Acumulada Duzida ($)' : 'Cumulative Depreciation Taken ($)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="depreciation-input"
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(depreciationTaken)}
                    onChange={(e) => setDepreciationTaken(Math.max(0, parseNumberInput(e.target.value)))}
                    className="w-full pl-8 pr-4 py-2.5 text-slate-900 font-semibold tabular-nums focus:outline-none text-sm"
                    placeholder="132,000"
                  />
                </div>
              </div>
            </div>

            {/* Selling Expenses */}
            <div>
              <label htmlFor="selling-expenses-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                {isZh ? '经纪佣金与过户交割税费 (Selling Expenses & Fees)' : isEs ? 'Comisiones y Gastos de Cierre ($)' : isPt ? 'Comissões e Despesas de Fechamento ($)' : 'Selling Expenses & Broker Commissions ($)'}
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  id="selling-expenses-input"
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(sellingExpenses)}
                  onChange={(e) => setSellingExpenses(Math.max(0, parseNumberInput(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 text-slate-900 font-semibold tabular-nums focus:outline-none text-sm"
                  placeholder="52,500"
                />
              </div>
            </div>

            {/* Tax Rates & Filing Status Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label htmlFor="filing-status-select" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isZh ? '纳税申报身份 (Filing Status)' : isEs ? 'Estado de Declaración (Filing Status)' : isPt ? 'Status de Declaração (Filing Status)' : 'Tax Filing Status'}
                </label>
                <select
                  id="filing-status-select"
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold text-xs sm:text-sm bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="single">Single ($200k NIIT)</option>
                  <option value="married_jointly">Married Filing Jointly ($250k NIIT)</option>
                  <option value="married_separately">Married Filing Separately ($125k NIIT)</option>
                  <option value="head_of_household">Head of Household ($200k NIIT)</option>
                </select>
              </div>

              <div>
                <label htmlFor="seller-magi-input" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{isZh ? '预估年总调整收入 MAGI (含本次利得)' : isEs ? 'MAGI Total Estimado (con ganancia)' : isPt ? 'MAGI Total Estimado (com ganho)' : 'Estimated Total MAGI (incl. gain)'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">IRC §1411</span>
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">$</span>
                  <input
                    id="seller-magi-input"
                    type="text"
                    inputMode="decimal"
                    value={formatNumberWithCommas(sellerMagi)}
                    onChange={(e) => setSellerMagi(parseNumberInput(e.target.value))}
                    className="w-full pl-7 pr-3 py-2.5 text-slate-900 font-semibold text-xs sm:text-sm focus:outline-none"
                    placeholder="650,000"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {isZh
                    ? `NIIT 计税基数: min(利得, MAGI - 门槛) = $${formatNumberWithCommas(Math.round(niitSubjectGain))}`
                    : `NIIT taxable base: min(gain, MAGI − $${(currentNiitThreshold / 1000).toFixed(0)}k threshold) = $${formatNumberWithCommas(Math.round(niitSubjectGain))}`}
                </p>
              </div>

              <div>
                <label htmlFor="capital-gains-rate-select" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isZh ? '联邦长期资本利得税率' : isEs ? 'Tasa Federal Ganancias Capital' : isPt ? 'Alíquota Federal de Capital' : 'Federal Capital Gains Rate'}
                </label>
                <select
                  id="capital-gains-rate-select"
                  value={capitalGainsRate}
                  onChange={(e) => setCapitalGainsRate(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold text-xs sm:text-sm bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={15}>15% (Standard · Rev. Proc. 2025-32)</option>
                  <option value={20}>20% (High Income Bracket)</option>
                  <option value={0}>0% (Low Income Exemption)</option>
                </select>
              </div>

              <div>
                <label htmlFor="state-tax-rate-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isZh ? '州所得税率 (示例 5%)' : isEs ? 'Tasa Estatal (Ej. 5%)' : isPt ? 'Alíquota Estadual (Ex. 5%)' : 'State Tax Rate (5% Example)'}
                </label>
                <div className="relative rounded-xl border border-slate-300 focus-ring overflow-hidden">
                  <input
                    id="state-tax-rate-input"
                    type="number"
                    min="0"
                    max="15"
                    step="0.1"
                    value={stateTaxRate || ''}
                    onChange={(e) => setStateTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-8 py-2.5 text-slate-900 font-semibold text-sm focus:outline-none"
                    placeholder="5.0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">%</span>
                </div>
              </div>
            </div>

            {/* Statutory Deadline Date Picker Section */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{isZh ? '2. 法定置换截止日测算' : isEs ? '2. Plazos Legales de Intercambio 1031' : isPt ? '2. Prazos Legais da Troca 1031' : '2. Statutory 1031 Deadline Calculator'}</span>
              </h3>
              <div>
                <label htmlFor="closing-date-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isZh ? '旧物业出售交割日 (Relinquished Property Closing Date)' : isEs ? 'Fecha de Cierre de Venta del Inmueble Cedido' : isPt ? 'Data de Fechamento da Venda do Imóvel Cedido' : 'Relinquished Property Closing Date'}
                </label>
                <input
                  id="closing-date-input"
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold text-sm bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                    {isZh ? '45 天物业识别截止日' : isEs ? 'Plazo de Identificación (45 Días)' : isPt ? 'Prazo de Identificação (45 Dias)' : '45-Day Identification Deadline'}
                  </span>
                  <span className="text-sm font-black text-amber-950 block mt-0.5">{idDeadlineDate || 'Day 45 Midnight'}</span>
                  <span className="text-[10px] text-amber-700 block mt-0.5">
                    {isZh ? '严格日历日（含周末与节假日，午夜截止）' : 'Strict calendar days by midnight (no extensions)'}
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    {isZh ? '180 天交割完成截止日' : isEs ? 'Plazo de Cierre Final (180 Días)' : isPt ? 'Prazo de Fechamento Final (180 Dias)' : '180-Day Exchange Completion Deadline'}
                  </span>
                  <span className="text-sm font-black text-emerald-950 block mt-0.5">{exchangeDeadlineDate || 'Day 180 Midnight'}</span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">
                    {isZh ? '完成全部目标物业交割过户' : 'Must close & title replacement asset'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div aria-live="polite" className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isZh ? '10 项逐项税务拆解总览' : isEs ? 'Desglose Impositivo de 10 Puntos' : isPt ? 'Detalhamento Tributário em 10 Pontos' : '10-Point Tax Deferral Summary'}
                </h3>
                <CalculatorActionBar
                  locale={locale}
                  onExportCsv={handleExportCsv}
                  onSave={handleSaveDeal}
                  onShare={handleShareDeal}
                />
              </div>

              {/* Major Output: Total Tax Deferred */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isZh ? '预计延税总额 (Total Tax Deferred)' : isEs ? 'Impuesto Total Diferido Estimado' : isPt ? 'Total de Imposto Diferido Estimado' : 'Total Estimated Tax Deferred via 1031'}
                </span>
                <div className="text-3xl md:text-4xl font-black text-emerald-600 mt-1">
                  {formatCurrency(Math.round(deferredTax))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
                  <span>{isZh ? '总收益实际综合税负:' : 'Effective Tax Rate:'}</span>
                  <span className="font-bold text-slate-800">{effectiveTaxRate.toFixed(1)}% of realized gain</span>
                </div>
              </div>

              {/* 10-Item Structured Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-200 pt-3 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{isZh ? '1. 调整后成本基准 (Adjusted Basis):' : '1. Adjusted Cost Basis:'}</span>
                  <span className="font-bold text-slate-900">{formatCurrency(Math.round(adjustedCostBasis))}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{isZh ? '2. 出售净所得 (Net Sale Proceeds):' : '2. Net Sale Proceeds:'}</span>
                  <span className="font-bold text-slate-900">{formatCurrency(Math.round(netSaleProceeds))}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 bg-slate-100/60 px-1.5 rounded">
                  <span className="font-semibold text-slate-900">{isZh ? '3. 变现资本利得总额 (Total Realized Gain):' : '3. Total Realized Capital Gain:'}</span>
                  <span className="font-black text-slate-950">{formatCurrency(Math.round(realizedGain))}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 pl-2">
                  <span className="text-amber-800 font-medium">{isZh ? '• §1250 折旧追回额 (Recapture Part):' : '• §1250 Depreciation Recapture Part:'}</span>
                  <span className="font-bold text-amber-900">{formatCurrency(Math.round(depreciationRecaptureGain))}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 pl-2">
                  <span className="text-slate-600">{isZh ? '• 剩余长期资本利得 (Remaining LTCG):' : '• Remaining Long-Term Gain:'}</span>
                  <span className="font-bold text-slate-900">{formatCurrency(Math.round(remainingCapitalGain))}</span>
                </div>

                <div className="pt-2 pb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {isZh ? '四项具体税款明细 (Tax Breakdown)' : 'Four Tax Component Breakdown'}
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 pl-2 text-amber-900">
                  <span>{isZh ? '4. §1250 折旧追回税 (固定 25%):' : '4. §1250 Recapture Tax (Flat 25%):'}</span>
                  <span className="font-bold">{formatCurrency(Math.round(depreciationRecaptureTax))}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 pl-2">
                  <span>{isZh ? `5. 联邦长期资本利得税 (${capitalGainsRate}%):` : `5. Federal Capital Gains Tax (${capitalGainsRate}%):`}</span>
                  <span className="font-bold text-slate-900">{formatCurrency(Math.round(federalCapitalGainsTax))}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 pl-2">
                  <span>
                    {isZh
                      ? `6. 净投资所得税 NIIT (3.8% · 计税基数 $${formatNumberWithCommas(Math.round(niitSubjectGain))}):`
                      : `6. Net Investment Income Tax (3.8% NIIT · on $${formatNumberWithCommas(Math.round(niitSubjectGain))} base):`}
                  </span>
                  <span className="font-bold text-slate-900">{formatCurrency(Math.round(niitTax))}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 pl-2">
                  <span>{isZh ? `7. 州资本利得税 (示例 ${stateTaxRate}%):` : `7. State Capital Gains Tax (${stateTaxRate}% Example):`}</span>
                  <span className="font-bold text-slate-900">{formatCurrency(Math.round(stateTax))}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-slate-950 bg-emerald-100/60 px-2 rounded mt-2">
                  <span>{isZh ? '8. 应纳税款总计 (Total Tax Liability):' : '8. Total Tax Liability without 1031:'}</span>
                  <span>{formatCurrency(Math.round(totalTaxLiability))}</span>
                </div>
              </div>

              {/* 100% Tax Deferral Reinvestment Rule Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1 mt-3">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isZh ? '100% 全额延税再投资硬性规则:' : '100% Full Deferral Reinvestment Rules:'}</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  {isZh
                    ? `新购买的目标物业售价需 ≥ ${formatCurrency(salePrice)}，且全部出售净现金（${formatCurrency(Math.round(netSaleProceeds))}）必须全额转入新项目（经由合格中介人 QI 保管），若留存现金或贷款减少将产生即期应税 Boot。`
                    : `Replacement property purchase price must be ≥ ${formatCurrency(salePrice)} and all net cash equity (${formatCurrency(Math.round(netSaleProceeds))}) must be reinvested through your Qualified Intermediary (QI). Retaining cash or debt reduction triggers taxable boot.`}
                </p>
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
