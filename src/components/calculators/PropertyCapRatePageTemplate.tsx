import React from 'react';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';
import { CapRateCalculator } from '@/components/calculators/CapRateCalculator';
import { JsonLd, getCalculatorJsonLd, getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, BookOpen, AlertTriangle, Building, Layers, CheckCircle } from 'lucide-react';
import { ComplianceDisclaimer } from '@/components/common/ComplianceDisclaimer';
import { PropertyCapRateContent } from '@/content/propertyCapRates';

interface Props {
  content: PropertyCapRateContent;
  locale: string;
}

export function PropertyCapRatePageTemplate({ content, locale }: Props) {
  const isZh = locale === 'zh';

  const fullUrl = `${SITE_URL}/${locale}/calculators/${content.slug}/`;

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    fullUrl,
    locale
  );

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isZh ? '首页' : 'Home', url: `${SITE_URL}/${locale}/` },
    { name: isZh ? 'Cap Rate 计算器' : 'Cap Rate Calculator', url: `${SITE_URL}/${locale}/calculators/cap-rate/` },
    { name: content.h1, url: fullUrl },
  ]);

  const faqSchema = getFaqPageJsonLd(content.faqs);

  return (
    <article className="space-y-10 py-4">
      <JsonLd data={[calculatorSchema, breadcrumbSchema, faqSchema]} />

      {/* Page Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2 flex-wrap">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/calculators/cap-rate/`} className="hover:text-emerald-600">
            {isZh ? 'Cap Rate 计算器' : 'Cap Rate'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{content.propertyTypeName}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <Building className="w-3.5 h-3.5" />
            <span>{content.propertyTypeName}</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {isZh ? '2026 参考区间: ' : '2026 Target Range: '}{content.benchmarkRange}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {content.h1}
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          {content.subtitle}
        </p>
      </header>

      {/* Interactive Calculator Tool */}
      <section id="tool">
        <CapRateCalculator locale={locale} />
      </section>

      {/* Content Body Section */}
      <div className="max-w-4xl space-y-12">
        {/* What Is & Market Context */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            {content.whatIsTitle}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {content.whatIsContent}
          </p>

          <div className="pt-2 text-xs text-slate-500 flex flex-wrap gap-2 items-center">
            <span className="font-semibold text-slate-700">{isZh ? '关键关联工具：' : 'Key Related Workflow:'}</span>
            <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? '通用 Cap Rate 计算器' : 'Universal Cap Rate'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'NOI 计算器' : 'NOI Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'DSCR 偿债覆盖率' : 'DSCR Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'Deal Analyzer 综合尽调' : 'Deal Analyzer'}
            </Link>
          </div>
        </section>

        {/* Property Type Underwriting Drivers */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            {content.metricsExploration.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {content.metricsExploration.points.map((pt, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pt.label}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{pt.text || pt.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Formula */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{isZh ? '计算公式与核心变量' : 'Formula & Mathematical Definition'}</h2>
          <div className="bg-slate-900 text-emerald-400 font-mono text-sm sm:text-base p-4 rounded-xl shadow-inner">
            <code>Cap Rate (%) = [ Net Operating Income (NOI) / Purchase Price ] × 100</code>
          </div>
          <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-600">
            <p>
              <strong>NOI (Net Operating Income):</strong> {isZh ? '物业在扣除所有日常运营支出（地税、保险、管理、维护）后的净收益，不包含贷款本息与所得税。' : 'Gross operating revenue minus all operating expenses (property taxes, insurance, management, maintenance), before debt service and income taxes.'}
            </p>
            <p>
              <strong>Purchase Price / Value:</strong> {isZh ? '商业地产的实际成交总价或专业机构独立评估价值。' : 'Total acquisition cost or current independent appraised market value.'}
            </p>
          </div>
        </section>

        {/* Worked Example */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.workedExample.title}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
            <p>{content.workedExample.intro}</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              {content.workedExample.points.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
            <p className="font-semibold text-slate-900 mt-2 pt-2 border-t border-slate-200">
              {content.workedExample.analysis}
            </p>
          </div>
        </section>

        {/* Pitfalls & Limitations */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {content.pitfallsTitle}
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-amber-900 leading-relaxed">
            {content.pitfalls.map((p, idx) => (
              <div key={idx}>
                <strong>{idx + 1}. {p.title}: </strong>
                <span>{p.desc || (p as unknown as { text?: string }).text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            {isZh ? '常见问题与专家答疑 (FAQs)' : 'Frequently Asked Questions (FAQs)'}
          </h2>
          <div className="space-y-6 divide-y divide-slate-100">
            {content.faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-6' : ''}>
                <h3 className="text-base font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cap Rate Benchmark Guide Banner */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              {isZh ? '全美 Cap Rate 基准数据指南' : 'US Cap Rate Benchmarks Guide (2026)'}
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {isZh
                ? '查看全美主要都市圈（一二三四级城市）与各类商业物业的典型 Cap Rate 收益率区间。'
                : 'Explore national capitalization rate ranges across property types and metropolitan market tiers.'}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            <span>{isZh ? '查看基准数据指南' : 'View Benchmark Guide'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Deal Analyzer Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isZh ? '综合尽调系统' : 'Full Underwriting Suite'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {isZh ? '想同时测算该物业的全部核心投资指标？' : 'Need Full Commercial Underwriting & Stress Testing?'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isZh
                  ? '使用 Deal Analyzer 综合工具，一次性算出 Cap Rate、NOI、DSCR、Cash-on-Cash 与盈亏平衡比率。'
                  : 'Run Cap Rate, NOI, DSCR, and Cash-on-Cash all together from a single set of inputs with PDF export.'}
              </p>
            </div>
            <Link
              href={`/${locale}/tools/deal-analyzer/`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              <span>{isZh ? '进入 Deal Analyzer' : 'Launch Deal Analyzer'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Other Property Types */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white">
            {isZh ? '其他商业物业类型 Cap Rate 计算器' : 'Other Property Type Cap Rate Calculators'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href={`/${locale}/calculators/cap-rate/`}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
            >
              <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                {isZh ? '通用 Cap Rate 计算器' : 'Universal Cap Rate Calculator'}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            {content.slug !== 'multifamily-cap-rate' && (
              <Link
                href={`/${locale}/calculators/multifamily-cap-rate/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {isZh ? 'Multifamily 多户住宅 Cap Rate' : 'Multifamily Cap Rate'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {content.slug !== 'industrial-cap-rate' && (
              <Link
                href={`/${locale}/calculators/industrial-cap-rate/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {isZh ? 'Industrial 工业与仓储物流 Cap Rate' : 'Industrial & Warehouse Cap Rate'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {content.slug !== 'self-storage-cap-rate' && (
              <Link
                href={`/${locale}/calculators/self-storage-cap-rate/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {isZh ? 'Self-Storage 自助仓储 Cap Rate' : 'Self-Storage Cap Rate'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {content.slug !== 'nnn-lease-cap-rate' && (
              <Link
                href={`/${locale}/calculators/nnn-lease-cap-rate/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {isZh ? 'NNN 三净商业零售 Cap Rate' : 'NNN Lease Cap Rate'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </section>

        {/* Compliance & Legal Disclaimer */}
        <ComplianceDisclaimer locale={locale} />
      </div>
    </article>
  );
}
