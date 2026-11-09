'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercent, formatNumberWithCommas, parseNumberInput } from '@/lib/utils';
import { Calculator, DollarSign, Zap, TrendingUp, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { CalculatorActionBar } from './common/CalculatorActionBar';
import { generateCalculatorCsv, downloadCsv, saveCalculationToLocal } from '@/lib/calculatorExport';
import { solveInterestRate } from '@/lib/dealAnalyzerCalculations';

interface Props {
  locale: string;
}

export function CashOnCashCalculator({ locale }: Props) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  // Inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(1200000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [closingCosts, setClosingCosts] = useState<number>(15000);
  const [upfrontCapex, setUpfrontCapex] = useState<number>(15000);
  
  const [annualNoi, setAnnualNoi] = useState<number>(84000);
  const [annualDebtService, setAnnualDebtService] = useState<number>(54000);

  const isInitializedRef = useRef(false);

  const getStorageKey = () => {
    if (typeof window === 'undefined') return 'cre_coc_inputs';
    const subpath = window.location.pathname.replace(/^\/(en|zh|es|pt)/, '');
    return `cre_coc_inputs_${subpath}`;
  };

  useEffect(() => {
    const applyInputs = () => {
      if (typeof window === 'undefined') return;
      let restoredFromHash = false;
      const hash = window.location.hash;
      if (hash && hash.replace(/^#/, '').trim() !== '') {
        try {
          const params = new URLSearchParams(hash.replace(/^#/, ''));
          const p = params.get('price') || params.get('pp') || params.get('p');
          const dp = params.get('downPayment') || params.get('dp');
          const noi = params.get('annualNoi') || params.get('noi');
          const ds = params.get('debt') || params.get('ds') || params.get('annualDebtService');
          const cc = params.get('closingCosts') || params.get('cc');
          const cx = params.get('upfrontCapex') || params.get('capex') || params.get('cx');

          let newPrice = purchasePrice;
          let newDp = downPaymentPercent;
          let newNoi = annualNoi;
          let newDs = annualDebtService;
          let newCc = closingCosts;
          let newCx = upfrontCapex;

          if (p && !isNaN(Number(p)) && Number(p) > 0) {
            newPrice = Number(p);
            setPurchasePrice(newPrice);
            restoredFromHash = true;
          }
          if (dp && !isNaN(Number(dp)) && Number(dp) >= 0) {
            newDp = Number(dp);
            setDownPaymentPercent(newDp);
            restoredFromHash = true;
          }
          if (noi && !isNaN(Number(noi)) && Number(noi) >= 0) {
            newNoi = Number(noi);
            setAnnualNoi(newNoi);
            restoredFromHash = true;
          }
          if (ds && !isNaN(Number(ds)) && Number(ds) >= 0) {
            newDs = Number(ds);
            setAnnualDebtService(newDs);
            restoredFromHash = true;
          }
          if (cc && !isNaN(Number(cc)) && Number(cc) >= 0) {
            newCc = Number(cc);
            setClosingCosts(newCc);
            restoredFromHash = true;
          }
          if (cx && !isNaN(Number(cx)) && Number(cx) >= 0) {
            newCx = Number(cx);
            setUpfrontCapex(newCx);
            restoredFromHash = true;
          }

          if (restoredFromHash) {
            sessionStorage.setItem(getStorageKey(), JSON.stringify({
              purchasePrice: newPrice,
              downPaymentPercent: newDp,
              closingCosts: newCc,
              upfrontCapex: newCx,
              annualNoi: newNoi,
              annualDebtService: newDs,
            }));
          }
        } catch {
          // ignore
        }
      }

      if (!restoredFromHash) {
        try {
          const saved = sessionStorage.getItem(getStorageKey());
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.purchasePrice !== undefined && !isNaN(Number(parsed.purchasePrice))) setPurchasePrice(Number(parsed.purchasePrice));
            if (parsed.downPaymentPercent !== undefined && !isNaN(Number(parsed.downPaymentPercent))) setDownPaymentPercent(Number(parsed.downPaymentPercent));
            if (parsed.closingCosts !== undefined && !isNaN(Number(parsed.closingCosts))) setClosingCosts(Number(parsed.closingCosts));
            if (parsed.upfrontCapex !== undefined && !isNaN(Number(parsed.upfrontCapex))) setUpfrontCapex(Number(parsed.upfrontCapex));
            if (parsed.annualNoi !== undefined && !isNaN(Number(parsed.annualNoi))) setAnnualNoi(Number(parsed.annualNoi));
            if (parsed.annualDebtService !== undefined && !isNaN(Number(parsed.annualDebtService))) setAnnualDebtService(Number(parsed.annualDebtService));
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

  useEffect(() => {
    if (!isInitializedRef.current) return;
    try {
      sessionStorage.setItem(getStorageKey(), JSON.stringify({
        purchasePrice,
        downPaymentPercent,
        closingCosts,
        upfrontCapex,
        annualNoi,
        annualDebtService,
      }));
    } catch {
      // ignore
    }
  }, [purchasePrice, downPaymentPercent, closingCosts, upfrontCapex, annualNoi, annualDebtService]);

  // Derived Values
  const downPaymentAmount = (purchasePrice * downPaymentPercent) / 100;
  const totalCashInvested = downPaymentAmount + closingCosts + upfrontCapex;
  const annualCashFlow = annualNoi - annualDebtService;
  
  const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
  const capRate = purchasePrice > 0 ? (annualNoi / purchasePrice) * 100 : 0;
  
  const formattedCoc = formatPercent(cashOnCashReturn);
  const formattedCap = formatPercent(capRate);

  type ComparisonState = 'higher' | 'lower' | 'equal';
  const comparisonState: ComparisonState =
    formattedCoc === formattedCap || Math.abs(cashOnCashReturn - capRate) < 0.005
      ? 'equal'
      : cashOnCashReturn > capRate
      ? 'higher'
      : 'lower';

  // Dynamic financial diagnostics (Item 7)
  const loanAmount = Math.max(0, purchasePrice - downPaymentAmount);
  const debtConstant = loanAmount > 0 ? (annualDebtService / loanAmount) * 100 : 0;
  const upfrontFriction = closingCosts + upfrontCapex;
  const upfrontFrictionPercent = purchasePrice > 0 ? (upfrontFriction / purchasePrice) * 100 : 0;

  const estimatedOpex = Math.round(annualNoi * 0.40);
  const estimatedGpi = Math.round((annualNoi + estimatedOpex) / 0.95);
  const estimatedRate = solveInterestRate(loanAmount, annualDebtService, 25);
  const ccPercent = purchasePrice > 0 ? (closingCosts / purchasePrice) * 100 : 2;

  const dynamicDiagnosisText = (() => {
    if (comparisonState === 'lower') {
      if (annualCashFlow <= 0) {
        if (isZh) return `现金流倒挂警示：年度偿债额 (${formatCurrency(annualDebtService)}) 超过或耗尽了净营业收入 (${formatCurrency(annualNoi)})，首年现金流出现赤字，负债未能产生正向分配。`;
        if (isEs) return `Déficit de flujo de caja: El servicio anual de la deuda (${formatCurrency(annualDebtService)}) supera el NOI (${formatCurrency(annualNoi)}), generando flujo negativo en el año 1.`;
        if (isPt) return `Déficit de fluxo de caixa: O serviço anual da dívida (${formatCurrency(annualDebtService)}) supera o NOI (${formatCurrency(annualNoi)}), gerando fluxo negativo no ano 1.`;
        return `Cash flow deficit: Annual debt service (${formatCurrency(annualDebtService)}) exhausts NOI (${formatCurrency(annualNoi)}), producing negative year-1 cash flow.`;
      }
      if (debtConstant > capRate) {
        if (isZh) return `负杠杆效应：贷款偿债常数达到 ${debtConstant.toFixed(2)}%，高于物业资产回报率 (Cap Rate ${formattedCap})，本金摊销与利息支出分流了过多经营收入；${upfrontFriction > 0 ? `叠加前期费用与改造 (${formatCurrency(upfrontFriction)}，占买价 ${upfrontFrictionPercent.toFixed(1)}%) 增加了初始资金基数，使首年现金回报率低于资产收益率。` : '从而拉低了首年权益现金回报率。'}`;
        if (isEs) return `Efecto de apalancamiento negativo: La constante de la deuda (${debtConstant.toFixed(2)}%) supera el Cap Rate (${formattedCap}), y el servicio de la deuda absorbe una proporción sustancial del flujo operativo${upfrontFriction > 0 ? `, junto con costos iniciales de ${formatCurrency(upfrontFriction)}` : ''}.`;
        if (isPt) return `Efeito de alavancagem negativa: A constante da dívida (${debtConstant.toFixed(2)}%) supera o Cap Rate (${formattedCap}), e o serviço da dívida absorve parte expressiva da receita operacional${upfrontFriction > 0 ? `, somado aos custos iniciais de ${formatCurrency(upfrontFriction)}` : ''}.`;
        return `Negative financial leverage: The annual debt constant (${debtConstant.toFixed(2)}%) exceeds the unleveraged Cap Rate (${formattedCap}), where debt service absorbs operating cash flow${upfrontFriction > 0 ? `, combined with upfront fees & capex of ${formatCurrency(upfrontFriction)} (${upfrontFrictionPercent.toFixed(1)}% of price)` : ''}, diluting year-1 cash yield below the asset yield.`;
      }
      if (isZh) return `前期费用摊薄：虽然借贷成本相对平稳，但首期过户费用与即时改造共计 ${formatCurrency(upfrontFriction)}（占买价 ${upfrontFrictionPercent.toFixed(1)}%）扩大了实际现金出资基数，导致首年现金回报率暂时低于无杠杆 Cap Rate。`;
      if (isEs) return `Dilución por costos iniciales: Los gastos de cierre y mejoras (${formatCurrency(upfrontFriction)}) aumentaron la base de capital invertido, moderando temporalmente el rendimiento del primer año.`;
      if (isPt) return `Diluição por custos iniciais: Os custos de fechamento e benfeitorias (${formatCurrency(upfrontFriction)}) elevaram a base de capital investido, moderando o rendimento do primeiro ano.`;
      return `Upfront equity dilution: Upfront transaction costs and capex (${formatCurrency(upfrontFriction)}, ${upfrontFrictionPercent.toFixed(1)}% of price) expanded your initial cash basis, temporarily placing year-1 cash yield below the unleveraged Cap Rate.`;
    }
    if (comparisonState === 'higher') {
      if (isZh) return `正向杠杆增益：年度贷款常数 (${debtConstant.toFixed(2)}%) 低于资产回报率 (Cap Rate ${formattedCap})，借贷有效放大了自备股权资本的回报率（现金回报率 ${formattedCoc} > Cap Rate ${formattedCap}）。`;
      if (isEs) return `Apalancamiento positivo activo: La constante de deuda (${debtConstant.toFixed(2)}%) es inferior al Cap Rate (${formattedCap}), amplificando el rendimiento en efectivo sobre el capital propio (${formattedCoc} > ${formattedCap}).`;
      if (isPt) return `Alavancagem positiva ativa: A constante da dívida (${debtConstant.toFixed(2)}%) é inferior ao Cap Rate (${formattedCap}), amplificando o retorno em caixa sobre o capital próprio (${formattedCoc} > ${formattedCap}).`;
      return `Positive financial leverage: The annual debt constant (${debtConstant.toFixed(2)}%) is below the unleveraged Cap Rate (${formattedCap}), successfully magnifying cash return on your invested equity (${formattedCoc} > ${formattedCap}).`;
    }
    if (isZh) return `中性杠杆区间：借贷综合成本与资产总回报率基本匹配，首年现金回报率与资产 Cap Rate 相当。`;
    if (isEs) return `Apalancamiento neutral: El costo del financiamiento se alinea con el rendimiento del activo, igualando aproximadamente el retorno en efectivo con el Cap Rate.`;
    if (isPt) return `Alavancagem neutra: O custo do financiamento alinha-se ao rendimento do ativo, aproximando o retorno em caixa ao Cap Rate.`;
    return `Neutral leverage: Financing costs closely match the asset yield, aligning year-1 cash yield with the unleveraged Cap Rate.`;
  })();

  const handleShareDeal = async () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    params.set('pp', purchasePrice.toString());
    params.set('dp', downPaymentPercent.toString());
    params.set('cc', closingCosts.toString());
    params.set('cx', upfrontCapex.toString());
    params.set('noi', annualNoi.toString());
    params.set('ds', annualDebtService.toString());
    const shareUrl = `${window.location.origin}${window.location.pathname}#${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // ignore
    }
  };

  const handleExportCsv = () => {
    const rows = [
      { metric: 'Purchase Price', value: purchasePrice },
      { metric: 'Down Payment %', value: `${downPaymentPercent}%` },
      { metric: 'Down Payment Amount', value: downPaymentAmount },
      { metric: 'Closing Costs', value: closingCosts },
      { metric: 'Upfront CapEx', value: upfrontCapex },
      { metric: 'Total Initial Cash Invested', value: totalCashInvested },
      { metric: 'Annual Net Operating Income (NOI)', value: annualNoi },
      { metric: 'Annual Debt Service', value: annualDebtService },
      { metric: 'Net Annual Pre-Tax Cash Flow', value: annualCashFlow },
      { metric: 'Cash-on-Cash Return', value: formattedCoc },
      { metric: 'Unleveraged Cap Rate', value: formattedCap },
      { metric: 'Debt Constant', value: `${debtConstant.toFixed(2)}%` },
    ];
    const csv = generateCalculatorCsv('Cash-on-Cash Return Calculator', rows, locale);
    downloadCsv(`cash-on-cash-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleSaveDeal = () => {
    const summary = `CoC: ${formattedCoc} (Cash Flow: ${formatCurrency(annualCashFlow)}, Invested: ${formatCurrency(totalCashInvested)})`;
    saveCalculationToLocal('cash_on_cash', 'Cash-on-Cash Calculator', summary, {
      purchasePrice,
      downPaymentPercent,
      annualNoi,
      annualDebtService,
      cashOnCashReturn,
      annualCashFlow,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {isZh ? '现金回报率计算' : isEs ? 'Herramienta de Retorno Cash-on-Cash' : isPt ? 'Ferramenta de Retorno Cash-on-Cash' : 'Cash-on-Cash Return Tool'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh ? 'Cash-on-Cash Return (现金回报率) 计算器' : isEs ? 'Calculadora de Rendimiento Cash-on-Cash (CoC)' : isPt ? 'Calculadora de Retorno Cash-on-Cash (CoC)' : 'Cash-on-Cash Return Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh
              ? '基于实际投入现金与贷款后的净现金流，计算加杠杆后的资金效率'
              : isEs
              ? 'Mida el rendimiento real antes de impuestos sobre el capital total invertido tras financiar'
              : isPt
              ? 'Meça a rentabilidade real antes de impostos sobre o capital total investido após o financiamento'
              : 'Measure real pre-tax yield on total invested cash after financing'}
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
              {isZh ? '1. 购买价格与实际投入现金' : isEs ? '1. Precio de Adquisición y Capital Total Invertido' : isPt ? '1. Preço de Aquisição e Capital Total Investido' : '1. Acquisition & Total Cash Invested'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="coc-purchase-price" className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '物业购买价格 ($)' : isEs ? 'Precio de Compra ($)' : isPt ? 'Preço de Compra ($)' : 'Purchase Price ($)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="coc-purchase-price"
                    name="purchasePrice"
                    type="text"
                    inputMode="numeric"
                    role="spinbutton"
                    value={formatNumberWithCommas(purchasePrice)}
                    onChange={(e) => setPurchasePrice(parseNumberInput(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm tabular-nums focus:outline-none"
                    placeholder="1,200,000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="coc-down-payment-percent" className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '首付比例 (%)' : isEs ? 'Pago Inicial / Entrada (%)' : isPt ? 'Entrada (%)' : 'Down Payment (%)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    id="coc-down-payment-percent"
                    name="downPaymentPercent"
                    type="number"
                    value={downPaymentPercent || ''}
                    onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                    placeholder="25"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isZh
                    ? `首付金额: ${formatCurrency(downPaymentAmount)}`
                    : isEs
                    ? `Pago Inicial: ${formatCurrency(downPaymentAmount)}`
                    : isPt
                    ? `Valor da Entrada: ${formatCurrency(downPaymentAmount)}`
                    : `Down Payment: ${formatCurrency(downPaymentAmount)}`}
                </p>
              </div>

              <div>
                <label htmlFor="coc-closing-costs" className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '过户与贷款手续费 ($)' : isEs ? 'Costos de Cierre y Financiamiento ($)' : isPt ? 'Custos de Fechamento e Financiamento ($)' : 'Closing & Financing Costs ($)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="coc-closing-costs"
                    name="closingCosts"
                    type="text"
                    inputMode="numeric"
                    role="spinbutton"
                    value={formatNumberWithCommas(closingCosts)}
                    onChange={(e) => setClosingCosts(parseNumberInput(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 text-sm font-medium tabular-nums focus:outline-none"
                    placeholder="15,000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="coc-upfront-capex" className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '前期即时维修/改造 ($)' : isEs ? 'Reparaciones y Mejoras Iniciales ($)' : isPt ? 'Reformas e Benfeitorias Iniciais ($)' : 'Upfront Repairs & Capex ($)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="coc-upfront-capex"
                    name="upfrontCapex"
                    type="text"
                    inputMode="numeric"
                    role="spinbutton"
                    value={formatNumberWithCommas(upfrontCapex)}
                    onChange={(e) => setUpfrontCapex(parseNumberInput(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 text-sm font-medium tabular-nums focus:outline-none"
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
              {isZh ? '2. 年收益与贷款还款 (NOI & Debt Service)' : isEs ? '2. Ingresos y Servicio de Deuda' : isPt ? '2. Receita e Serviço da Dívida' : '2. Income & Debt Service'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="coc-annual-noi" className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '年净营业收入 (Annual NOI)' : isEs ? 'NOI Anual ($)' : isPt ? 'NOI Anual ($)' : 'Annual NOI ($)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="coc-annual-noi"
                    name="annualNoi"
                    type="text"
                    inputMode="numeric"
                    role="spinbutton"
                    value={formatNumberWithCommas(annualNoi)}
                    onChange={(e) => setAnnualNoi(parseNumberInput(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm tabular-nums focus:outline-none"
                    placeholder="84,000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="coc-annual-debt-service" className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '年度贷款还款总额 (Annual Debt Service)' : isEs ? 'Servicio Anual de Deuda (P&I) ($)' : isPt ? 'Serviço Anual da Dívida (P&I) ($)' : 'Annual Debt Service (P&I) ($)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    id="coc-annual-debt-service"
                    name="annualDebtService"
                    type="text"
                    inputMode="numeric"
                    role="spinbutton"
                    value={formatNumberWithCommas(annualDebtService)}
                    onChange={(e) => setAnnualDebtService(parseNumberInput(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm tabular-nums focus:outline-none"
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
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isZh ? '现金回报率分析' : isEs ? 'Análisis de Retorno Cash-on-Cash' : isPt ? 'Análise de Retorno Cash-on-Cash' : 'Cash-on-Cash Analysis'}
              </h3>
              <CalculatorActionBar
                locale={locale}
                onExportCsv={handleExportCsv}
                onSave={handleSaveDeal}
                onShare={handleShareDeal}
              />
            </div>

            {/* Major Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isZh ? 'Cash-on-Cash Return (年化现金回报率)' : isEs ? 'Retorno Cash-on-Cash (CoC)' : isPt ? 'Retorno Cash-on-Cash (CoC)' : 'Cash-on-Cash Return'}
              </span>
              <div data-testid="coc-result-return" className="text-4xl md:text-5xl font-black text-emerald-600 mt-1">
                {formattedCoc}
              </div>
              <p data-testid="coc-result-comparison" className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                {comparisonState === 'higher' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : comparisonState === 'lower' ? (
                  <TrendingUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span>
                  {comparisonState === 'higher'
                    ? (isZh
                        ? `首年现金回报率高于无杠杆 Cap Rate (${formattedCap})`
                        : isEs
                        ? `El rendimiento en efectivo del año 1 supera el Cap Rate sin deuda (${formattedCap})`
                        : isPt
                        ? `O retorno em caixa do ano 1 supera o Cap Rate sem dívida (${formattedCap})`
                        : `Year-1 cash yield is higher than unleveraged Cap Rate (${formattedCap})`)
                    : comparisonState === 'lower'
                    ? (isZh
                        ? `首年现金回报率低于无杠杆 Cap Rate (${formattedCap})（受还本贷款常数与前期费用摊薄影响）`
                        : isEs
                        ? `El rendimiento en efectivo del año 1 es inferior al Cap Rate sin deuda (${formattedCap}) (por constante de deuda y costos iniciales)`
                        : isPt
                        ? `O retorno em caixa do ano 1 é inferior ao Cap Rate sem dívida (${formattedCap}) (por constante da dívida e custos iniciais)`
                        : `Year-1 cash yield is lower than unleveraged Cap Rate (${formattedCap}) (reflecting debt constant/amortization and upfront costs)`)
                    : (isZh
                        ? `首年现金回报率与无杠杆 Cap Rate 相等/基本持平 (${formattedCap})`
                        : isEs
                        ? `El rendimiento en efectivo del año 1 es igual o equivalente al Cap Rate sin deuda (${formattedCap})`
                        : isPt
                        ? `O retorno em caixa do ano 1 é igual ou equivalente ao Cap Rate sem dívida (${formattedCap})`
                        : `Year-1 cash yield is equal to / approximately equal to unleveraged Cap Rate (${formattedCap})`)}
                </span>
              </p>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-600">
                  {isZh ? '实际投入现金总额:' : isEs ? 'Capital Total Invertido:' : isPt ? 'Capital Total Investido:' : 'Total Cash Invested:'}
                </span>
                <span data-testid="coc-result-total-invested" className="font-semibold">{formatCurrency(totalCashInvested)}</span>
              </div>
              <div className="text-xs text-slate-500 pl-3 space-y-1">
                <div className="flex justify-between">
                  <span>└ {isZh ? '首付款 (Down Payment):' : isEs ? 'Pago Inicial:' : isPt ? 'Entrada:' : 'Down Payment:'}</span>
                  <span data-testid="coc-result-down-payment">{formatCurrency(downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>└ {isZh ? '过户/手续费:' : isEs ? 'Costos de Cierre:' : isPt ? 'Custos de Fechamento:' : 'Closing Costs:'}</span>
                  <span data-testid="coc-result-closing-costs">{formatCurrency(closingCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span>└ {isZh ? '前期维修:' : isEs ? 'Mejoras/Capex:' : isPt ? 'Reformas/Capex:' : 'Repairs/Capex:'}</span>
                  <span data-testid="coc-result-upfront-capex">{formatCurrency(upfrontCapex)}</span>
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                <span className="text-slate-800">
                  {isZh ? '年税前净现金流:' : isEs ? 'Flujo de Caja Anual Antes de Impuestos:' : isPt ? 'Fluxo de Caixa Anual Antes de Impostos:' : 'Annual Pre-Tax Cash Flow:'}
                </span>
                <span data-testid="coc-result-cash-flow" className="text-slate-900">{formatCurrency(annualCashFlow)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>
                  {isZh ? '无杠杆 Cap Rate 基准:' : isEs ? 'Cap Rate No Apalancado:' : isPt ? 'Cap Rate Sem Alavancagem:' : 'Unleveraged Cap Rate:'}
                </span>
                <span data-testid="coc-result-cap-rate" className="font-semibold">{formattedCap}</span>
              </div>
            </div>

            {/* Dynamic Calculated Financial Diagnosis (Item 7) */}
            <div data-testid="coc-dynamic-diagnosis" className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/90 text-xs text-emerald-950 leading-relaxed space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isZh ? '财务诊断与杠杆成因剖析' : isEs ? 'Diagnóstico Financiero de Apalancamiento' : isPt ? 'Diagnóstico Financeiro de Alavancagem' : 'Calculated Leverage & Financial Diagnosis'}</span>
              </div>
              <p className="text-emerald-900/90">
                {dynamicDiagnosisText}
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                {isZh
                  ? '衡量关键：Cash-on-Cash Return 仅看你钱包里实际付出的现金。杠杆加得越好，资金利用效率越高。'
                  : isEs
                  ? 'Conclusión clave: El retorno Cash-on-Cash evalúa la rentabilidad específica sobre el capital real desembolsado de su propio bolsillo.'
                  : isPt
                  ? 'Ponto-chave: O retorno Cash-on-Cash avalia a rentabilidade especificamente sobre o dinheiro desembolsado do seu próprio bolso.'
                  : 'Key take-away: Cash-on-cash return evaluates efficiency specifically on out-of-pocket equity invested.'}
              </div>
            </div>

            {/* Chained Parameter Links (Item 8) */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <span className="font-bold text-slate-200 block">
                {isZh ? '承销串链流转 (下一步测算)' : isEs ? 'Siguiente Paso en Suscripción' : isPt ? 'Próximo Passo na Subscrição' : 'Chained Next Steps'}
              </span>
              <div className="grid grid-cols-1 gap-2">
                <Link
                  href={`/${locale}/calculators/dscr/#noi=${annualNoi}&debt=${annualDebtService}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-slate-200 hover:text-white"
                >
                  <span>{isZh ? `带入当前还贷方案 ($${formatCurrency(annualDebtService).replace('$', '')}) 测算 DSCR` : isEs ? 'Evaluar DSCR con este servicio de deuda' : isPt ? 'Avaliar DSCR com este serviço da dívida' : 'Check DSCR Coverage for this Debt'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
                <Link
                  href={`/${locale}/tools/deal-analyzer/#pp=${purchasePrice}&dp=${downPaymentPercent}&noi=${annualNoi}&ds=${annualDebtService}&gpi=${estimatedGpi}&opex=${estimatedOpex}&vac=5&ir=${estimatedRate}&ay=25&cc=${ccPercent.toFixed(2)}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-white font-semibold"
                >
                  <span>{isZh ? '带入 Deal Analyzer 进行综合承销与压力测试' : isEs ? 'Llevar a Deal Analyzer para Evaluación y Prueba de Estrés' : isPt ? 'Levar ao Deal Analyzer para Subscrição e Teste de Estresse' : 'Send to Deal Analyzer for Comprehensive Underwriting & Stress Test'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}