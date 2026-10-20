'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Calculator, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2, Info, Share2, Check, ArrowRight, Building, Mail, DollarSign } from 'lucide-react';
import { DscrCoverageTierVisualizer } from './visuals/DscrCoverageTierVisualizer';

interface Props {
  locale: string;
}

export function DscrCalculator({ locale }: Props) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  // Inputs
  const [noi, setNoi] = useState<number>(250000);
  const [annualDebtService, setAnnualDebtService] = useState<number>(187500);
  const [isMonthlyInput, setIsMonthlyInput] = useState<boolean>(false);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(15625);

  // Share link state
  const [copied, setCopied] = useState<boolean>(false);

  // Lead Magnet form state
  const [leadPropertyType, setLeadPropertyType] = useState<string>('multifamily');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadLoanAmount, setLeadLoanAmount] = useState<string>('1500000');
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);

  // Derived calculations
  const effectiveDebtService = isMonthlyInput ? monthlyPayment * 12 : annualDebtService;
  const dscr = effectiveDebtService > 0 ? noi / effectiveDebtService : 0;
  const cashCushion = noi - effectiveDebtService;
  const maxDebtForTarget = noi / 1.25;

  // Parse URL hash on mount if present
  useEffect(() => {
    const applyHashParams = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) return;
      const params = new URLSearchParams(hash);
      const n = params.get('noi') || params.get('n');
      const d = params.get('debt') || params.get('d');
      const m = params.get('monthly') || params.get('m');
      const isM = params.get('isMonthly');

      if (n && !isNaN(Number(n))) setNoi(Number(n));
      if (d && !isNaN(Number(d))) setAnnualDebtService(Number(d));
      if (m && !isNaN(Number(m))) setMonthlyPayment(Number(m));
      if (isM !== null) setIsMonthlyInput(isM === '1' || isM === 'true');
    };

    const timer = setTimeout(applyHashParams, 0);
    window.addEventListener('hashchange', applyHashParams);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', applyHashParams);
    };
  }, []);

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
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.hash = params.toString();
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !leadEmail.includes('@')) return;
    setLeadSubmitted(true);
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

  return (
    <div className="space-y-8 mb-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                <label className="text-sm font-semibold text-slate-700">
                  {isZh ? '还贷计算方式' : 'Debt Service Input Mode'}
                </label>
                <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsMonthlyInput(false)}
                    className={`px-3 py-1 rounded-md transition ${
                      !isMonthlyInput ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isZh ? '按年输入' : 'Annual'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMonthlyInput(true)}
                    className={`px-3 py-1 rounded-md transition ${
                      isMonthlyInput ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isZh ? '按月输入' : 'Monthly'}
                  </button>
                </div>
              </div>

              {!isMonthlyInput ? (
                <div>
                  <div className="relative rounded-xl border border-slate-300 bg-white focus-ring overflow-hidden">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      value={annualDebtService || ''}
                      onChange={(e) => setAnnualDebtService(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                      placeholder="187,500"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isZh ? '包含本金及利息的全年偿债总额 (Annual Principal & Interest)' : 'Total annual principal and interest payments'}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="relative rounded-xl border border-slate-300 bg-white focus-ring overflow-hidden">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      value={monthlyPayment || ''}
                      onChange={(e) => setMonthlyPayment(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 text-slate-900 font-semibold focus:outline-none"
                      placeholder="15,625"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isZh
                      ? `折算年度还贷: ${formatCurrency(monthlyPayment * 12)} / 年`
                      : `Equivalent Annual Debt Service: ${formatCurrency(monthlyPayment * 12)} / year`}
                  </p>
                </div>
              )}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isZh ? '偿债能力分析' : isEs ? 'Análisis de Cobertura' : isPt ? 'Análise de Cobertura' : 'Underwriting Analysis'}
                </h3>
                <button
                  type="button"
                  onClick={handleShareDeal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 active:scale-95 transition-all shadow-2xs"
                  title={isZh ? '复制带参数的测算链接' : 'Copy link with parameters'}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">{isZh ? '链接已复制！' : 'Link Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isZh ? '分享测算' : 'Share Deal'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Major Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isZh ? 'DSCR 偿债覆盖率' : 'Debt Service Coverage Ratio (DSCR)'}
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

      {/* Lead Magnet Card: Connect with Top-Rated DSCR Lenders */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white border border-slate-700 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isZh ? '商业贷款直通车' : 'Pre-Qualified Commercial Financing'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            {isZh
              ? '获取优质商业地产 DSCR 贷款机构报价方案'
              : 'Connect with Top-Rated DSCR Lenders for This Deal'}
          </h3>
          <p className="text-slate-300 text-xs md:text-sm mt-1 leading-relaxed">
            {isZh
              ? `基于当前测算的 ${dscr.toFixed(2)}x 偿债覆盖率，您的物业已满足多数商业银行与非银机构的核心准入要求。提交参数即可快速匹配最优利率与杠杆方案。`
              : `Based on your calculated ${dscr.toFixed(2)}x DSCR, your transaction aligns with commercial lender underwriting guidelines. Request non-binding quotes from vetted national CRE and portfolio lenders.`}
          </p>

          {leadSubmitted ? (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">{isZh ? '意向已提交！' : 'Quote Request Received!'}</p>
                <p className="text-xs text-emerald-300/90 mt-0.5">
                  {isZh
                    ? '我们的合作放贷机构团队将根据您的物业类型与 DSCR 指标准备定制报价单。'
                    : 'Partner commercial lenders will review your deal parameters and follow up with tailored financing terms.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {isZh ? '期望贷款额度 ($)' : 'Target Loan Amount ($)'}
                </label>
                <div className="relative rounded-xl border border-slate-600 bg-slate-800/90 overflow-hidden focus-within:border-emerald-500">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={leadLoanAmount}
                    onChange={(e) => setLeadLoanAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-xs text-white font-medium bg-transparent focus:outline-none"
                    placeholder="1,500,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {isZh ? '物业类型' : 'Property Asset Type'}
                </label>
                <div className="relative rounded-xl border border-slate-600 bg-slate-800/90 overflow-hidden focus-within:border-emerald-500">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={leadPropertyType}
                    onChange={(e) => setLeadPropertyType(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-xs text-white font-medium bg-transparent focus:outline-none appearance-none"
                  >
                    <option value="multifamily" className="bg-slate-900 text-white">Multifamily (5+ Units)</option>
                    <option value="industrial" className="bg-slate-900 text-white">Industrial / Warehouse</option>
                    <option value="self-storage" className="bg-slate-900 text-white">Self-Storage Facility</option>
                    <option value="nnn" className="bg-slate-900 text-white">NNN Net Lease Retail</option>
                    <option value="mixed-use" className="bg-slate-900 text-white">Mixed-Use Commercial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {isZh ? '工作邮箱' : 'Contact Email'}
                </label>
                <div className="relative rounded-xl border border-slate-600 bg-slate-800/90 overflow-hidden focus-within:border-emerald-500">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-xs text-white font-medium bg-transparent focus:outline-none"
                    placeholder="investor@domain.com"
                  />
                </div>
              </div>

              <div className="sm:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all shadow-sm"
                >
                  <span>{isZh ? '获取贷款预审方案' : 'Request DSCR Lender Quotes'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
