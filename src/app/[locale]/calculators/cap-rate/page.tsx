import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { CapRateCalculator } from '@/components/calculators/CapRateCalculator';
import { JsonLd, getCalculatorJsonLd, getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, BookOpen, AlertTriangle } from 'lucide-react';
import { ComplianceDisclaimer } from '@/components/common/ComplianceDisclaimer';
import { buildSeoMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).capRate;

  return buildSeoMetadata({
    path: 'calculators/cap-rate',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function CapRatePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).capRate;
  const isZh = locale === 'zh';

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/cap-rate/`,
    locale
  );

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isZh ? '首页' : 'Home', url: `${SITE_URL}/${locale}/` },
    { name: isZh ? '计算器' : 'Calculators', url: `${SITE_URL}/${locale}/` },
    { name: content.h1, url: `${SITE_URL}/${locale}/calculators/cap-rate/` },
  ]);

  const faqSchema = getFaqPageJsonLd(content.faqs);

  return (
    <article className="space-y-10 py-4">
      <JsonLd data={[calculatorSchema, breadcrumbSchema, faqSchema]} />

      {/* Page Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{content.h1}</span>
        </nav>
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
        {/* What Is & Why It Matters */}
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

        {/* Formula */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.formulaTitle}</h2>
          <div className="bg-slate-900 text-emerald-400 font-mono text-sm sm:text-base p-4 rounded-xl shadow-inner">
            <code>{content.formulaCode}</code>
          </div>
          <div className="space-y-2 pt-2">
            {content.formulaVariables.map((v, idx) => (
              <div key={idx} className="text-xs sm:text-sm flex items-start gap-2">
                <span className="font-bold text-slate-900 min-w-[120px]">{v.label}:</span>
                <span className="text-slate-600">{v.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Real Example */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.exampleTitle}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 rounded-r-xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {content.exampleContent}
          </div>
        </section>

        {/* Pitfalls & Limitations */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {isZh ? 'Cap Rate 的常见误区与使用限制' : 'Common Cap Rate Pitfalls & Limitations'}
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
            <p>
              {isZh
                ? '1. 忽略债务结构：Cap Rate 是全现金无杠杆回报率指标，不反映贷款利率、月供及杠杆收益（正杠杆或负杠杆），需结合 Cash-on-Cash Return 和 DSCR 综合评估。'
                : '1. Ignores Financing: Cap rate is an unleveraged metric. It does not reflect mortgage interest rates, amortization, or leveraged returns. Always evaluate Alongside Cash-on-Cash Return and DSCR.'}
            </p>
            <p>
              {isZh
                ? '2. 混淆挂牌 Pro-forma 与实际 T12：卖方挂牌常使用未来乐观预测收入，低估实际历史运营开支与资本性支出 (CapEx)。'
                : '2. Pro-Forma vs. In-Place T12: Broker listing packages often use aggressive pro-forma assumptions. Always underwrite based on audited trailing 12-month (T12) operating statements.'}
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            {content.faqTitle}
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
              {locale === 'zh' ? '全美 Cap Rate 基准数据指南' : 'US Cap Rate Benchmarks Guide (2026)'}
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {locale === 'zh'
                ? '查看全美主要都市圈（一二三四级城市）与各大商业物业类型的典型 Cap Rate 收益率参考区间。'
                : 'Explore national capitalization rate ranges across property types and metropolitan market tiers.'}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            <span>{locale === 'zh' ? '查看基准数据指南' : 'View Benchmark Guide'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Deal Analyzer Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {locale === 'zh' ? '综合分析工具' : 'Full Underwriting Tool'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {locale === 'zh' ? '想同时计算 Cap Rate、NOI、DSCR 和 Cash-on-Cash？' : 'Need Cap Rate, NOI, DSCR, and Cash-on-Cash all together?'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {locale === 'zh' ? '使用 Deal Analyzer 综合尽调工具，一次输入算出全部核心指标，支持压力测试与 PDF 导出。' : 'Use the Deal Analyzer tool to run all core CRE metrics from a single set of inputs with stress testing.'}
              </p>
            </div>
            <Link
              href={`/${locale}/tools/deal-analyzer/`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              <span>{locale === 'zh' ? '打开 Deal Analyzer' : 'Launch Deal Analyzer'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Related Calculators */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white">{content.relatedTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.relatedCalculators.map((rel) => (
              <Link
                key={rel.slug}
                href={`/${locale}/calculators/${rel.slug}/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {rel.title}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* Compliance & Legal Disclaimer */}
        <ComplianceDisclaimer locale={locale} />
      </div>
    </article>
  );
}
