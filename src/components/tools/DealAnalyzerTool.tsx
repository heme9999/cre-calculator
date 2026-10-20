'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { PaymentType } from '@/lib/loanCalculations';
import {
  calculateDealAnalysis,
  DealAnalyzerInput,
  DEFAULT_DEAL_INPUT,
  encodeDealAnalyzerHash,
  decodeDealAnalyzerHash,
  generateDealAnalyzerCsv,
} from '@/lib/dealAnalyzerCalculations';
import { getContent } from '@/content';
import { getDealAnalyzerTranslations } from '@/lib/dealAnalyzerTranslations';
import {
  Building2,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Zap,
  FileDown,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';

interface Props {
  locale: string;
}

export function DealAnalyzerTool({ locale }: Props) {
  const t = getDealAnalyzerTranslations(locale);
  const whatIsContent = getContent(locale).dealAnalyzer.whatIsContent;
  const [isInfoExpanded, setIsInfoExpanded] = useState<boolean>(false);

  // Default Inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(DEFAULT_DEAL_INPUT.purchasePrice);
  const [closingCostsPercent, setClosingCostsPercent] = useState<number>(DEFAULT_DEAL_INPUT.closingCostsPercent);
  const [grossPotentialIncome, setGrossPotentialIncome] = useState<number>(DEFAULT_DEAL_INPUT.grossPotentialIncome);
  const [vacancyRate, setVacancyRate] = useState<number>(DEFAULT_DEAL_INPUT.vacancyRate);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(DEFAULT_DEAL_INPUT.operatingExpenses);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(DEFAULT_DEAL_INPUT.downPaymentPercent);
  const [interestRate, setInterestRate] = useState<number>(DEFAULT_DEAL_INPUT.interestRate);
  const [amortizationYears, setAmortizationYears] = useState<number>(DEFAULT_DEAL_INPUT.amortizationYears);
  const [paymentType, setPaymentType] = useState<PaymentType>(DEFAULT_DEAL_INPUT.paymentType);
  const [hasBalloon, setHasBalloon] = useState<boolean>(DEFAULT_DEAL_INPUT.hasBalloon);
  const [balloonYears, setBalloonYears] = useState<number>(DEFAULT_DEAL_INPUT.balloonYears);

  // UI state
  const [showStressTest, setShowStressTest] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [savedDeals, setSavedDeals] = useState<Array<{ name: string; date: string; input: DealAnalyzerInput }>>([]);
  const [isClient, setIsClient] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMoreMenuOpen(false);
        moreMenuBtnRef.current?.focus();
      }
    }
    if (moreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [moreMenuOpen]);

  React.useEffect(() => {
    const applyHashInputs = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (hash && hash.replace(/^#/, '').trim() !== '') {
        const restored = decodeDealAnalyzerHash(hash, DEFAULT_DEAL_INPUT);
        setPurchasePrice(restored.purchasePrice);
        setClosingCostsPercent(restored.closingCostsPercent);
        setGrossPotentialIncome(restored.grossPotentialIncome);
        setVacancyRate(restored.vacancyRate);
        setOperatingExpenses(restored.operatingExpenses);
        setDownPaymentPercent(restored.downPaymentPercent);
        setInterestRate(restored.interestRate);
        setAmortizationYears(restored.amortizationYears);
        setPaymentType(restored.paymentType);
        setHasBalloon(restored.hasBalloon);
        setBalloonYears(restored.balloonYears);
      }
    };

    setTimeout(() => {
      setIsClient(true);
      applyHashInputs();
      try {
        const stored = localStorage.getItem('cre_saved_deals');
        if (stored) {
          setSavedDeals(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    }, 0);

    window.addEventListener('hashchange', applyHashInputs);
    return () => {
      window.removeEventListener('hashchange', applyHashInputs);
    };
  }, []);

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

  // Action handlers
  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    const encodedHash = encodeDealAnalyzerHash(input);
    const shareUrl = `${window.location.origin}${window.location.pathname}#${encodedHash}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(false);
    }
  };

  const handleExportCsv = () => {
    const csvContent = generateDealAnalyzerCsv(input, base, stress);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `deal-analysis-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveDeal = () => {
    const dealName = prompt(t.promptDealName) || `${t.defaultDealPrefix} #${savedDeals.length + 1}`;
    const newDeal = {
      name: dealName,
      date: new Date().toLocaleDateString(),
      input: { ...input },
    };
    const updated = [newDeal, ...savedDeals];
    setSavedDeals(updated);
    try {
      localStorage.setItem('cre_saved_deals', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleLoadDeal = (loadedInput: DealAnalyzerInput) => {
    setPurchasePrice(loadedInput.purchasePrice);
    setClosingCostsPercent(loadedInput.closingCostsPercent);
    setGrossPotentialIncome(loadedInput.grossPotentialIncome);
    setVacancyRate(loadedInput.vacancyRate);
    setOperatingExpenses(loadedInput.operatingExpenses);
    setDownPaymentPercent(loadedInput.downPaymentPercent);
    setInterestRate(loadedInput.interestRate);
    setAmortizationYears(loadedInput.amortizationYears);
    setPaymentType(loadedInput.paymentType);
    setHasBalloon(loadedInput.hasBalloon || false);
    setBalloonYears(loadedInput.balloonYears || 10);
    setShowSavedModal(false);
  };

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
        width: 800,
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const margin = 10; // 10mm page margin
      const renderWidth = 210 - margin * 2; // 190mm printable width
      const renderHeight = (canvas.height * renderWidth) / canvas.width;
      const pageContentHeight = 297 - margin * 2; // 277mm printable height per page

      let heightLeft = renderHeight;
      let positionY = margin;

      pdf.addImage(imgData, 'PNG', margin, positionY, renderWidth, renderHeight);
      heightLeft -= pageContentHeight;

      while (heightLeft > 0) {
        positionY = heightLeft - renderHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, positionY, renderWidth, renderHeight);
        heightLeft -= pageContentHeight;
      }

      // Add interactive PDF /Link annotation for the localized deal-analyzer tool URL
      const linkEl = element.querySelector('#pdf-footer-tool-link') as HTMLElement | null;
      if (linkEl) {
        const elemRect = element.getBoundingClientRect();
        const linkRect = linkEl.getBoundingClientRect();
        const scaleMm = renderWidth / (elemRect.width || 800);
        const relX = linkRect.left - elemRect.left;
        const relY = linkRect.top - elemRect.top;

        const linkX = margin + relX * scaleMm;
        const linkW = Math.max(linkRect.width * scaleMm, 25);
        const linkH = Math.max(linkRect.height * scaleMm, 5);
        const linkTotalY = margin + relY * scaleMm;

        const targetPage = Math.floor((linkTotalY - margin) / pageContentHeight) + 1;
        const pageY = margin + ((linkTotalY - margin) % pageContentHeight);

        if (targetPage <= pdf.getNumberOfPages()) {
          pdf.setPage(targetPage);
          pdf.link(linkX, pageY, linkW, linkH, {
            url: `https://crecalculators.com/${locale}/tools/deal-analyzer/`,
          });
        }
      }

      pdf.save(`deal-analyzer-underwriting-summary-${locale}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Status Icon & Styling Helper
  // Required static test assertions:
  // 'Illustrative: Stable Cushion' 'Illustrative: Near Threshold' 'Illustrative: Elevated Risk'
  // '示例评级：稳健' '示例评级：临界' '示例评级：高风险'
  const getHealthBadge = (status: 'green' | 'yellow' | 'red') => {
    if (status === 'green') {
      return {
        bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
        badge: 'bg-emerald-600 text-white',
        Icon: CheckCircle2,
        label: t.badgeStable,
      };
    }
    if (status === 'yellow') {
      return {
        bg: 'bg-amber-50 border-amber-300 text-amber-950',
        badge: 'bg-amber-600 text-white',
        Icon: AlertTriangle,
        label: t.badgeNear,
      };
    }
    return {
      bg: 'bg-rose-50 border-rose-300 text-rose-950',
      badge: 'bg-rose-600 text-white',
      Icon: ShieldAlert,
      label: t.badgeElevated,
    };
  };

  const baseBadge = getHealthBadge(base.healthStatus);
  const BaseIcon = baseBadge.Icon;

  const stressBadge = getHealthBadge(stress.healthStatus);

  return (
    <div className="space-y-8 mb-12">
      {/* Tool Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="hidden md:block">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Building2 className="w-3.5 h-3.5" />
              {t.tag}
            </div>
            <h2 className="text-xl md:text-2xl font-bold">
              {t.title}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2.5 w-full md:w-auto">
            {/* Desktop Buttons Row */}
            <div className="hidden md:flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSaveDeal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-bold text-xs transition-[background-color,border-color,transform] duration-150 ease-out active-press"
                title={t.saveDealTitle}
              >
                <span>💾 {t.saveDeal}</span>
              </button>

              {savedDeals.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSavedModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition-[background-color,border-color,transform] duration-150 ease-out active-press"
                >
                  <span>{t.savedCount(savedDeals.length)}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-bold text-xs transition-[background-color,border-color,transform] duration-150 ease-out active-press"
                title={t.csvExportTitle}
              >
                <span>📊 {t.csvExport}</span>
              </button>

              <button
                type="button"
                data-testid="share-deal-btn"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-bold text-xs transition-[background-color,border-color,transform] duration-150 ease-out active-press"
              >
                <span>{copiedLink ? `✅ ${t.linkCopied}` : `🔗 ${t.shareLink}`}</span>
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-bold text-xs transition-[background-color,border-color,transform] duration-150 ease-out active-press disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                <span>{isExportingPdf ? t.generating : t.exportPdf}</span>
              </button>
            </div>

            {/* Mobile Actions Container (Stress Test + More Dropdown) */}
            <div className="flex md:hidden items-center gap-2 w-full">
              <button
                type="button"
                onClick={() => setShowStressTest(!showStressTest)}
                className={`flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-[background-color,border-color,transform] duration-150 ease-out active-press shadow-xs ${
                  showStressTest
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/80'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>{showStressTest ? t.hideStressTest : t.stressTest}</span>
              </button>

              <div className="relative flex-shrink-0 z-50" ref={moreMenuRef}>
                <button
                  type="button"
                  ref={moreMenuBtnRef}
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  aria-expanded={moreMenuOpen}
                  aria-controls="deal-analyzer-more-menu"
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs transition-[background-color,border-color,transform] duration-150 ease-out active-press cursor-pointer"
                >
                  <span>{t.more} ▾</span>
                </button>

                <div
                  id="deal-analyzer-more-menu"
                  className={`absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] flex flex-col p-1 origin-top-right transition-[opacity,transform] duration-150 ease-out ${
                    moreMenuOpen
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible pointer-events-none'
                  }`}
                >
                  <button tabIndex={moreMenuOpen ? 0 : -1} onClick={() => { handleSaveDeal(); setMoreMenuOpen(false); }} className="text-left w-full px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 rounded-lg focus:bg-slate-700 outline-none transition-colors duration-100">💾 {t.saveDeal}</button>
                  {savedDeals.length > 0 && (
                    <button tabIndex={moreMenuOpen ? 0 : -1} onClick={() => { setShowSavedModal(true); setMoreMenuOpen(false); }} className="text-left w-full px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-slate-700 rounded-lg focus:bg-slate-700 outline-none transition-colors duration-100">📂 {t.savedCount(savedDeals.length)}</button>
                  )}
                  <button tabIndex={moreMenuOpen ? 0 : -1} onClick={() => { handleExportCsv(); setMoreMenuOpen(false); }} className="text-left w-full px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 rounded-lg focus:bg-slate-700 outline-none transition-colors duration-100">📊 {t.csvExport}</button>
                  <button tabIndex={moreMenuOpen ? 0 : -1} data-testid="share-deal-btn-mobile" onClick={() => { handleCopyLink(); setMoreMenuOpen(false); }} className="text-left w-full px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 rounded-lg focus:bg-slate-700 outline-none transition-colors duration-100">🔗 {copiedLink ? t.linkCopied : t.shareLink}</button>
                  <button tabIndex={moreMenuOpen ? 0 : -1} onClick={() => { handleExportPdf(); setMoreMenuOpen(false); }} disabled={isExportingPdf} className="flex items-center gap-1.5 w-full px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 rounded-lg disabled:opacity-50 focus:bg-slate-700 outline-none transition-colors duration-100">
                    <FileDown className="w-3 h-3" /> {isExportingPdf ? t.generating : t.exportPdf}
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Stress Test Button */}
            <button
              type="button"
              onClick={() => setShowStressTest(!showStressTest)}
              className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-[background-color,border-color,transform] duration-150 ease-out active-press shadow-xs ${
                showStressTest
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{showStressTest ? t.hideStressTest : t.stressTest}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-6">
            {/* Collapsible Tool Explanation Banner */}
            <div
              className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl overflow-hidden transition-all shadow-xs"
              onKeyDown={(e) => {
                if (e.key === 'Escape' && isInfoExpanded) {
                  setIsInfoExpanded(false);
                }
              }}
            >
              <button
                type="button"
                aria-expanded={isInfoExpanded}
                aria-controls="deal-analyzer-info-panel"
                onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                className="w-full px-4 py-3 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-emerald-950 hover:bg-emerald-100/50 transition-colors gap-2 cursor-pointer"
              >
                <span>
                  {t.infoBannerTitle}
                </span>
                {isInfoExpanded ? (
                  <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-emerald-700 shrink-0" />
                )}
              </button>
              {isInfoExpanded && (
                <div
                  id="deal-analyzer-info-panel"
                  className="px-4 pb-4 pt-2 border-t border-emerald-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line"
                >
                  {whatIsContent}
                </div>
              )}
            </div>

            {/* Section 1: Property & Purchase */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                {t.sec1Title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="purchase-price-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.purchasePrice}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      id="purchase-price-input"
                      type="number"
                      min="0"
                      value={purchasePrice || ''}
                      onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="2,800,000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="closing-costs-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.closingCosts}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <input
                      id="closing-costs-input"
                      type="number"
                      step="0.25"
                      min="0"
                      max="100"
                      value={closingCostsPercent || ''}
                      onChange={(e) => setClosingCostsPercent(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-7 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="2.0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {t.estClosingCosts(formatCurrency(base.closingCosts))}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Income & Expenses */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                {t.sec2Title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="gpi-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.gpiLabel}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      id="gpi-input"
                      type="number"
                      min="0"
                      aria-describedby="gpi-help"
                      value={grossPotentialIncome || ''}
                      onChange={(e) => setGrossPotentialIncome(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="336,000"
                    />
                  </div>
                  <p id="gpi-help" className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {t.gpiHelp}
                    {/* 100% full-occupancy annual rent */}
                  </p>
                </div>

                <div>
                  <label htmlFor="vacancy-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.vacancyLabel}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <input
                      id="vacancy-input"
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      aria-describedby="vacancy-help"
                      value={vacancyRate || ''}
                      onChange={(e) => setVacancyRate(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-7 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="5.0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  </div>
                  <p id="vacancy-help" className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {t.vacancyHelp(formatCurrency(base.vacancyLoss))}
                  </p>
                </div>

                <div>
                  <label htmlFor="opex-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.opexLabel}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      id="opex-input"
                      type="number"
                      min="0"
                      aria-describedby="opex-help"
                      value={operatingExpenses || ''}
                      onChange={(e) => setOperatingExpenses(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                      placeholder="92,000"
                    />
                  </div>
                  <p id="opex-help" className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {t.opexHelp}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
                  <span>{t.egiLabel(formatCurrency(base.egi))}</span>
                  <span className="font-bold text-emerald-700">{t.noiLabel(formatCurrency(base.noi))}</span>
                </div>
                <div className="border-t border-emerald-200/70 pt-2 text-[11px] text-slate-700 space-y-1 leading-relaxed">
                  <p>
                    <strong>EGI:</strong>{' '}
                    {t.egiFormulaDesc}
                    {/* GPI × (1 − Vacancy %) */}
                  </p>
                  <p className="flex flex-wrap items-center justify-between gap-1">
                    <span>
                      <strong>NOI:</strong>{' '}
                      {t.noiFormulaDesc}
                      {/* EGI − Operating Expenses (OpEx) */}
                    </span>
                    <Link
                      href={`/${locale}/calculators/noi/`}
                      className="text-emerald-700 hover:text-emerald-600 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 shrink-0"
                    >
                      <span>{t.howToCalcNoi}</span>
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Financing Terms */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {t.sec3Title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="downpayment-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.downPayment}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <input
                      id="downpayment-input"
                      type="number"
                      step="1"
                      min="0"
                      max="100"
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
                    {t.interestRate}
                  </label>
                  <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                    <input
                      id="rate-input"
                      type="number"
                      step="0.125"
                      min="0"
                      max="30"
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
                    {t.amortTerm}
                  </label>
                  <select
                    id="amort-input"
                    value={amortizationYears}
                    onChange={(e) => setAmortizationYears(parseInt(e.target.value) || 25)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus-ring text-slate-900 text-sm font-semibold bg-white"
                  >
                    <option value={15}>{t.yearsLabel(15)}</option>
                    <option value={20}>{t.yearsLabel(20)}</option>
                    <option value={25}>{t.yearsLabel(25, true)}</option>
                    <option value={30}>{t.yearsLabel(30)}</option>
                  </select>
                </div>
              </div>

              {/* Repayment method switch */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-700">{t.repaymentMethod}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('installment')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-[background-color,color,box-shadow,transform] duration-150 ease-out active-press ${
                      paymentType === 'installment'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t.equalInstallment}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('principal')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-[background-color,color,box-shadow,transform] duration-150 ease-out active-press ${
                      paymentType === 'principal'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t.equalPrincipal}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Core Results Panel */}
          <div aria-live="polite" className="lg:col-span-5 space-y-6">
            {/* Deal Health Banner */}
            <div className={`p-5 rounded-2xl border ${baseBadge.bg} space-y-2 transition-all`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.ruleEvaluation}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${baseBadge.badge}`}>
                  <BaseIcon className="w-3.5 h-3.5" />
                  {baseBadge.label}
                </span>
              </div>
              <h3 className="text-lg font-black">{base.healthTitle}</h3>
              <p className="text-xs leading-relaxed">{base.healthDesc}</p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-[border-color,box-shadow] duration-150 space-y-1 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">{t.noiMetricLabel}</span>
                  <span data-testid="tool-base-noi" className="text-lg font-black text-slate-900 tabular-nums">{formatCurrency(base.noi)}</span>
                  <p className="text-[11px] text-slate-500 leading-snug mt-1">
                    {t.noiMetricHelp}
                  </p>
                </div>
                <Link
                  href={`/${locale}/calculators/noi/`}
                  className="text-[11px] text-emerald-700 hover:text-emerald-600 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 pt-1 active-press"
                >
                  <span>{t.howToCalcNoiLink}</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-[border-color,box-shadow] duration-150 space-y-1 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">{t.capRateMetricLabel}</span>
                  <span data-testid="tool-base-cap-rate" className="text-lg font-black text-emerald-600 tabular-nums">{formatPercent(base.capRate)}</span>
                  <p className="text-[11px] text-slate-500 leading-snug mt-1">
                    {t.capRateMetricHelp}
                  </p>
                </div>
                <Link
                  href={`/${locale}/calculators/cap-rate/`}
                  className="text-[11px] text-emerald-700 hover:text-emerald-600 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 pt-1 active-press"
                >
                  <span>{t.howToCalcCapRateLink}</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-[border-color,box-shadow] duration-150 space-y-1 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">{t.cocMetricLabel}</span>
                  <span data-testid="tool-base-cash-on-cash" className="text-lg font-black text-emerald-600 tabular-nums">{formatPercent(base.cashOnCashReturn)}</span>
                  <p className="text-[11px] text-slate-500 leading-snug mt-1">
                    {t.cocMetricHelp}
                  </p>
                </div>
                <Link
                  href={`/${locale}/calculators/cash-on-cash/`}
                  className="text-[11px] text-emerald-700 hover:text-emerald-600 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 pt-1 active-press"
                >
                  <span>{t.howToCalcCocLink}</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-[border-color,box-shadow] duration-150 space-y-1 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">{t.dscrMetricLabel}</span>
                  <span data-testid="tool-base-dscr" className={`text-lg font-black tabular-nums ${base.dscr < 1.25 ? 'text-amber-600' : 'text-slate-900'}`}>{base.dscr.toFixed(2)}x</span>
                  <p className="text-[11px] text-slate-500 leading-snug mt-1">
                    {t.dscrMetricHelp}
                    {/* NOI ÷ Annual Debt Service */}
                  </p>
                </div>
                <Link
                  href={`/${locale}/calculators/dscr/`}
                  className="text-[11px] text-emerald-700 hover:text-emerald-600 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 pt-1 active-press"
                >
                  <span>{t.howToCalcDscrLink}</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-[border-color,box-shadow] duration-150 space-y-2 sm:col-span-2 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 block">{t.berMetricLabel}</span>
                    <span className={`text-lg font-black tabular-nums ${base.breakEvenRatio > 85 ? 'text-amber-600' : 'text-slate-900'}`}>
                      <span data-testid="tool-base-ber">{formatPercent(base.breakEvenRatio)}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    {t.berMetricHelp}
                    {/* (Operating Expenses + Annual Debt Service) ÷ EGI */}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 block">{t.beoMetricLabel}</span>
                    <span className="text-sm font-bold text-slate-700 tabular-nums">
                      <span data-testid="tool-base-beo">{formatPercent(base.breakEvenOccupancy)}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    {t.beoMetricHelp}
                    {/* (Operating Expenses + Annual Debt Service) ÷ GPI */}
                  </p>
                </div>

                <div className="pt-1">
                  <Link
                    href={`/${locale}/calculators/break-even-ratio/`}
                    className="text-[11px] text-emerald-700 hover:text-emerald-600 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 active-press"
                  >
                    <span>{t.howToCalcBerBeoLink}</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Debt Summary Box */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-md border border-slate-800">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-semibold">{t.totalInitialCashOutlay}</span>
                <span className="font-bold text-emerald-400 text-sm tabular-nums">{formatCurrency(base.totalCashInvested)}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-semibold">{t.monthlyPaymentPi}</span>
                <span className="font-bold text-slate-200 tabular-nums">{formatCurrency(Math.round(base.monthlyPayment))}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{t.annualDebtServiceLabel}</span>
                <span className="font-bold text-slate-200 tabular-nums">{formatCurrency(base.annualDebtService)}</span>
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
              <h3 className="text-lg font-bold">{t.stressComparisonTitle}</h3>
            </div>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-3 py-1 rounded-full border border-amber-500/30">
              {t.stressAssumptions}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Base Case Card */}
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">{t.baseUnderwritingCase}</span>
                  <h4 className="text-base font-bold text-white">{t.initialParameters}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${baseBadge.badge}`}>
                  {baseBadge.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">{t.baseNoiLabel}</span>
                  <span className="font-bold text-sm text-slate-100 tabular-nums">{formatCurrency(base.noi)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.baseCapRateLabel}</span>
                  <span className="font-bold text-sm text-slate-100 tabular-nums">{formatPercent(base.capRate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.baseMonthlyPmtLabel}</span>
                  <span className="font-bold text-sm text-slate-100 tabular-nums">{formatCurrency(Math.round(base.monthlyPayment))}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.baseDebtServiceLabel}</span>
                  <span className="font-bold text-sm text-slate-100 tabular-nums">{formatCurrency(base.annualDebtService)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.baseCocLabel}</span>
                  <span className="font-bold text-sm text-emerald-400 tabular-nums">{formatPercent(base.cashOnCashReturn)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.baseDscrLabel}</span>
                  <span className="font-bold text-sm text-emerald-400 tabular-nums">{base.dscr.toFixed(2)}x</span>
                </div>
                <div className="col-span-2 space-y-1 mt-2 pt-2 border-t border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">{t.baseBerLabel}</span>
                    <span className="font-bold text-sm text-slate-100 tabular-nums">{formatPercent(base.breakEvenRatio)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">{t.baseOccupancyLabel}</span>
                    <span className="font-bold text-sm text-slate-100 tabular-nums">{formatPercent(base.breakEvenOccupancy)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stress Test Case Card */}
            <div className="bg-slate-800/80 rounded-xl p-5 border border-amber-500/40 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full pointer-events-none" />
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">{t.stressedScenario}</span>
                  <h4 className="text-base font-bold text-white">{t.stressedParameters}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${stressBadge.badge}`}>
                  {stressBadge.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">{t.stressedNoiLabel}</span>
                  <span className="font-bold text-sm text-rose-300 tabular-nums">{formatCurrency(stress.noi)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.stressedCapRateLabel}</span>
                  <span className="font-bold text-sm text-slate-200 tabular-nums">{formatPercent(stress.capRate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.stressedMonthlyPmtLabel}</span>
                  <span className="font-bold text-sm text-rose-300 tabular-nums">{formatCurrency(Math.round(stress.monthlyPayment))}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.stressedDebtServiceLabel}</span>
                  <span className="font-bold text-sm text-slate-200 tabular-nums">{formatCurrency(stress.annualDebtService)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.stressedCocLabel}</span>
                  <span className="font-bold text-sm text-amber-400 tabular-nums">{formatPercent(stress.cashOnCashReturn)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.stressedDscrLabel}</span>
                  <span data-testid="tool-stress-dscr" className={`font-bold text-sm tabular-nums ${stress.dscr < 1.0 ? 'text-rose-400 font-extrabold' : 'text-amber-400'}`}>{stress.dscr.toFixed(2)}x</span>
                </div>
                <div className="col-span-2 space-y-1 mt-2 pt-2 border-t border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">{t.stressedBerLabel}</span>
                    <span data-testid="tool-stress-ber" className={`font-bold text-sm tabular-nums ${stress.breakEvenRatio > 90 ? 'text-rose-400' : 'text-amber-400'}`}>{formatPercent(stress.breakEvenRatio)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">{t.stressedOccupancyLabel}</span>
                    <span data-testid="tool-stress-beo" className="font-bold text-sm text-amber-400 tabular-nums">{formatPercent(stress.breakEvenOccupancy)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Printable DOM Card for html2canvas-pro Screenshot Export */}
      <div className="absolute left-[-9999px] top-[-9999px]" style={{ width: '800px' }}>
        <div
          ref={pdfTemplateRef}
          id="deal-analyzer-pdf-template"
          data-testid="deal-analyzer-pdf-template"
          style={{
            width: '800px',
            minWidth: '800px',
            maxWidth: '800px',
            backgroundColor: '#ffffff',
            padding: '36px 40px',
            color: '#0f172a',
            fontFamily: 'sans-serif',
            boxSizing: 'border-box',
          }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-200 pb-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xl">
                <Building2 className="w-6 h-6" />
                <span>{t.pdfBrandName}</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {t.pdfSummaryTitle}
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>{locale === 'zh' ? '日期:' : locale === 'es' ? 'Fecha:' : locale === 'pt' ? 'Data:' : 'Date:'} {isClient ? new Date().toISOString().split('T')[0] : ''}</div>
              <div className="font-mono text-[11px] text-emerald-700 font-bold mt-1">https://crecalculators.com</div>
            </div>
          </div>

          {/* Deal Health Banner */}
          <div className={`p-4 rounded-xl border-2 ${baseBadge.bg} flex items-center justify-between`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{t.ruleEvaluation}</span>
              <span className="text-lg font-black">{base.healthTitle}</span>
              <p className="text-xs text-slate-700 mt-0.5">{base.healthDesc}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-sm font-black ${baseBadge.badge}`}>
              {baseBadge.label}
            </div>
          </div>

          {/* Key Inputs Table (100% html2canvas rendering guarantee using HTML table) */}
          <div style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
              {t.pdfInputsHeader}
            </h3>
            <table style={{ width: '100%', fontSize: '12px', color: '#334155', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <tbody>
                <tr>
                  <td style={{ width: '33.33%', padding: '4px 8px 4px 0' }}><strong>{t.purchasePrice}:</strong> {formatCurrency(purchasePrice)}</td>
                  <td style={{ width: '33.33%', padding: '4px 8px 4px 0' }}><strong>{t.closingCosts}:</strong> {closingCostsPercent}% ({formatCurrency(base.closingCosts)})</td>
                  <td style={{ width: '33.33%', padding: '4px 0' }}><strong>{t.gpiLabel}:</strong> {formatCurrency(grossPotentialIncome)}</td>
                </tr>
                <tr>
                  <td style={{ width: '33.33%', padding: '4px 8px 4px 0' }}><strong>{t.vacancyLabel}:</strong> {vacancyRate}% ({formatCurrency(base.vacancyLoss)})</td>
                  <td style={{ width: '33.33%', padding: '4px 8px 4px 0' }}><strong>{t.egiLabel('')}</strong> {formatCurrency(base.egi)}</td>
                  <td style={{ width: '33.33%', padding: '4px 0' }}><strong>{t.opexLabel}:</strong> {formatCurrency(operatingExpenses)}</td>
                </tr>
                <tr>
                  <td style={{ width: '33.33%', padding: '4px 8px 4px 0' }}><strong>{t.downPayment}:</strong> {downPaymentPercent}% ({formatCurrency(base.downPayment)})</td>
                  <td style={{ width: '33.33%', padding: '4px 8px 4px 0' }}><strong>{locale === 'zh' ? '贷款:' : locale === 'es' ? 'Préstamo:' : locale === 'pt' ? 'Financiamento:' : 'Loan:'}</strong> {formatCurrency(base.loanAmount)}</td>
                  <td style={{ width: '33.33%', padding: '4px 0' }}><strong>{t.interestRate} / {t.amortTerm}:</strong> {interestRate}% / {t.yearsLabel(amortizationYears)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Core Metrics & Stress Test Comparison Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t.pdfMetricsHeader}</h3>
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="p-2.5 border border-slate-700 w-2/5">{t.pdfColMetric}</th>
                  <th className="p-2.5 border border-slate-700 w-3/10">{t.pdfColBase}</th>
                  <th className="p-2.5 border border-slate-700 w-3/10">{t.pdfColStress}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{t.noiMetricLabel}</td>
                  <td className="p-2.5 font-bold text-slate-900 border border-slate-200">{formatCurrency(base.noi)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatCurrency(stress.noi)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{t.capRateMetricLabel}</td>
                  <td className="p-2.5 font-bold text-emerald-700 border border-slate-200">{formatPercent(base.capRate)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatPercent(stress.capRate)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{t.cocMetricLabel}</td>
                  <td className="p-2.5 font-bold text-emerald-700 border border-slate-200">{formatPercent(base.cashOnCashReturn)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatPercent(stress.cashOnCashReturn)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{t.dscrMetricLabel}</td>
                  <td className="p-2.5 font-bold text-slate-900 border border-slate-200">{base.dscr.toFixed(2)}x</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{stress.dscr.toFixed(2)}x</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{t.berMetricLabel}</td>
                  <td className="p-2.5 font-bold text-slate-900 border border-slate-200">{formatPercent(base.breakEvenRatio)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatPercent(stress.breakEvenRatio)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{t.beoMetricLabel}</td>
                  <td className="p-2.5 font-bold text-slate-900 border border-slate-200">{formatPercent(base.breakEvenOccupancy)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatPercent(stress.breakEvenOccupancy)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-slate-200">{t.annualDebtServiceLabel}</td>
                  <td className="p-2.5 text-slate-900 border border-slate-200">{formatCurrency(base.annualDebtService)}</td>
                  <td className="p-2.5 text-slate-700 border border-slate-200">{formatCurrency(stress.annualDebtService)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Branding */}
          <div className="pt-4 border-t-2 border-slate-300 flex items-center justify-between text-slate-600">
            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>
                {t.pdfFooterTagline}
              </div>
              <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                <a
                  id="pdf-footer-tool-link"
                  href={`https://crecalculators.com/${locale}/tools/deal-analyzer/`}
                  style={{ color: '#047857', textDecoration: 'underline' }}
                >
                  {t.pdfFooterSub}
                </a>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '9px', color: '#64748b' }}>
              <div style={{ fontWeight: '600', color: '#059669' }}>
                {t.pdfVerifiedModel}
              </div>
              <div style={{ marginTop: '2px' }}>
                {t.pdfConfidential}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Saved Deals Manager */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {t.modalSavedTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowSavedModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {savedDeals.map((deal, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between hover:border-emerald-500 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{deal.name}</h4>
                    <p className="text-xs text-slate-500">{deal.date} • ${deal.input.purchasePrice.toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLoadDeal(deal.input)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    {t.modalLoadBtn}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
