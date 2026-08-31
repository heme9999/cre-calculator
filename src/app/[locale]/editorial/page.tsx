import React from 'react';
import { Metadata } from 'next';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { JsonLd, getEditorialWebPageJsonLd } from '@/components/seo/JsonLd';
import { Calculator, CheckCircle2, Database, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';

  return buildSeoMetadata({
    path: 'editorial',
    locale,
    title: isZh ? '计算公式与方法论假设 | CRE Methodologies' : 'Calculation Methodology & Underwriting Standards | CRE Methodologies',
    description: isZh
      ? '详细了解 CRE Calculators 的计算公式推导逻辑、假设定义、数据更新频率与全美主要机构数据来源。'
      : 'Explore our transparent underwriting formulas, variable definitions, market benchmark sources, and audit dates.',
    noindex: true,
  });
}

export default async function EditorialPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';
  const canonicalUrl = `${SITE_URL}/${locale}/editorial/`;
  const jsonLdData = getEditorialWebPageJsonLd(canonicalUrl, locale);

  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4">
      <JsonLd data={jsonLdData} />
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span>{isZh ? '公式与假设' : 'Calculation Methodology'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isZh ? '计算公式透明说明与底层测算假设' : 'Underwriting Standards & Calculation Formulas'}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {isZh
            ? '本站所有工具均遵循全美商业地产行业标准的财务公式与银行承销（Lender Underwriting）计算规范。'
            : 'All financial models and tools on CRE Calculators adhere to standard commercial real estate underwriting principles and institutional lender formulas.'}
        </p>
      </header>

      {/* Methodology Section */}
      <div className="space-y-6">
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {isZh ? '核心公式与定义标准' : 'Core Formulas & Financial Definitions'}
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 divide-y divide-slate-100">
            {/* Cap Rate */}
            <div className="pt-2 space-y-1.5">
              <span className="font-bold text-slate-900">
                {isZh ? 'Cap Rate (Capitalization Rate 资本化率)' : 'Cap Rate (Capitalization Rate)'}
              </span>
              <p className="text-slate-600 font-mono bg-slate-100 p-2.5 rounded-lg text-xs">Cap Rate = (NOI / Purchase Price) × 100%</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isZh
                  ? '衡量物业全现金购买状态下的无负债资产收益率。不计算贷款杠杆或债务费用。'
                  : 'Measures unleveraged initial yield of a property based solely on property NOI and acquisition price.'}
              </p>
            </div>

            {/* NOI */}
            <div className="pt-4 space-y-1.5">
              <span className="font-bold text-slate-900">
                {isZh ? 'NOI (Net Operating Income 净营业收入)' : 'NOI (Net Operating Income)'}
              </span>
              <p className="text-slate-600 font-mono bg-slate-100 p-2.5 rounded-lg text-xs">NOI = Gross Potential Income - Vacancy Loss + Other Income - Operating Expenses</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isZh
                  ? '注意：运营费用（Operating Expenses）包含房产税、保险、管理费、维修维护费，但不包含债务还本付息（Debt Service）和资本性支出（CapEx）。'
                  : 'Operating expenses include property taxes, insurance, management fees, and routine maintenance, but exclude debt service payments and capital expenditures (CapEx).'}
              </p>
            </div>

            {/* DSCR */}
            <div className="pt-4 space-y-1.5">
              <span className="font-bold text-slate-900">
                {isZh ? 'DSCR (Debt Service Coverage Ratio 偿债备付率)' : 'DSCR (Debt Service Coverage Ratio)'}
              </span>
              <p className="text-slate-600 font-mono bg-slate-100 p-2.5 rounded-lg text-xs">DSCR = Annual NOI / Annual Debt Service</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isZh
                  ? '商业地产贷款审贷核心指标。大部分商业银行与 DSCR 专案放款机构要求 DSCR ≥ 1.20x - 1.25x。'
                  : 'Key underwriting metric used by commercial lenders. Standard bank requirements mandate DSCR ≥ 1.20x to 1.25x.'}
              </p>
            </div>

            {/* Cash-on-Cash */}
            <div className="pt-4 space-y-1.5">
              <span className="font-bold text-slate-900">
                {isZh ? 'Cash-on-Cash Return (现金回报率)' : 'Cash-on-Cash Return'}
              </span>
              <p className="text-slate-600 font-mono bg-slate-100 p-2.5 rounded-lg text-xs">Cash-on-Cash = (Annual Pre-Tax Cash Flow / Total Cash Invested) × 100%</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isZh
                  ? '衡量投资者实际掏出的现金首付与过户交易费用，在第一年产生的实际税前现金流回报比率。'
                  : 'Calculates the ratio of annual pre-tax cash flow received relative to the total initial equity invested (down payment plus closing costs).'}
              </p>
            </div>
          </div>
        </section>

        {/* Data Sources & Citations with Clickable External Links */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            {isZh ? '权威基准数据来源与官方引用链接' : 'Authoritative Data Sources & Reference Links'}
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed">
            <p>
              {isZh
                ? '全美 Cap Rate 城市基准数据与商业贷款参考假设汇集自以下权威机构的公开报告与官方数据源：'
                : 'Market cap rate benchmark ranges and commercial underwriting parameters are compiled from official research publications and data endpoints:'}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href="https://www.cbre.com/insights/reports/us-cap-rate-survey"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-500/50 rounded-xl transition-all group block space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-emerald-700">
                  <span>CBRE US Cap Rate Survey</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">Tier 1-4 US Metro Cap Rates (Published H2 2025 / 2026)</p>
              </a>

              <a
                href="https://www.us.jll.com/en/trends-and-insights/research"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-500/50 rounded-xl transition-all group block space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-emerald-700">
                  <span>JLL Commercial Property Research</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">Multifamily, Industrial & Retail Sector Yield Reports</p>
              </a>

              <a
                href="https://www.federalreserve.gov/releases/h15/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-500/50 rounded-xl transition-all group block space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-emerald-700">
                  <span>Federal Reserve H.15 Selected Interest Rates</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">SOFR Benchmark Rates & Treasury Yield Spreads</p>
              </a>

              <a
                href="https://multifamily.fanniemae.com/underwriting-property-types"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-500/50 rounded-xl transition-all group block space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-emerald-700">
                  <span>Fannie Mae Multifamily Underwriting</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">Standard DSCR Coverage Benchmarks (1.20x-1.25x)</p>
              </a>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs font-mono text-emerald-950 flex items-center justify-between">
              <span>{isZh ? '📅 数据核对与外部引用审核时间：2026 年 8 月 12 日' : '📅 Last External Citation & Data Audit: August 12, 2026'}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center pt-4">
        <Link
          href={`/${locale}/tools/deal-analyzer/`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md"
        >
          <span>{isZh ? '体验 Deal Analyzer 综合尽调工具' : 'Launch Deal Analyzer Tool'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
