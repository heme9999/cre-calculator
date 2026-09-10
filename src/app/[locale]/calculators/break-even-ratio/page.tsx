import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { BreakEvenRatioCalculator } from '@/components/calculators/BreakEvenRatioCalculator';
import { JsonLd, getCalculatorJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, BookOpen } from 'lucide-react';

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
  const content = getContent(locale).breakEvenRatio;

  return buildSeoMetadata({
    path: 'calculators/break-even-ratio',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
    noindex: locale === 'zh',
  });
}

export default async function BreakEvenRatioPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).breakEvenRatio;
  const isZh = locale === 'zh';
  const jsonLdData = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/break-even-ratio/`,
    locale
  );

  return (
    <article className="space-y-10 py-4">
      <JsonLd data={jsonLdData} />

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

      {/* Interactive Tool */}
      <section id="tool">
        <BreakEvenRatioCalculator locale={locale} />
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
        </section>

        {/* Formula */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.formulaTitle}</h2>
          <div className="bg-slate-900 text-emerald-400 font-mono text-sm sm:text-base p-4 rounded-xl shadow-inner whitespace-pre-line">
            <code>{content.formulaCode}</code>
          </div>
          <div className="space-y-2 pt-2">
            {content.formulaVariables.map((v, idx) => (
              <div key={idx} className="text-xs sm:text-sm flex items-start gap-2">
                <span className="font-bold text-slate-900 min-w-[180px]">{v.label}:</span>
                <span className="text-slate-600">{v.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Real Example */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{isZh ? '商业地产分析案例 (Illustrative Example)' : 'Worked Commercial Property Example'}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              {isZh ? '回顾我们贯穿始终的 24 单元多户住宅案例（24-unit multifamily）。' : 'Returning to our ongoing 24-unit multifamily example.'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{isZh ? '运营费用 (OpEx): $92,000' : 'Operating Expenses (OpEx): $92,000'}</li>
              <li>{isZh ? '年还本付息额 (Annual Debt Service): $170,152（详见 ' : 'Annual Debt Service: $170,152 (see the '}
                <Link href={`/${locale}/calculators/loan-payment/`} className="text-emerald-600 hover:underline">{isZh ? '商业贷款计算' : 'loan payment calculation'}</Link>
                {isZh ? '）' : ')'}
              </li>
              <li>{isZh ? '年有效毛收入 (Effective Gross Income): $319,200' : 'Effective Gross Income (EGI): $319,200'}</li>
            </ul>
            <p className="font-semibold text-slate-900 mt-2">
              {isZh ? '计算 Break-Even Ratio = ($92,000 + $170,152) / $319,200 = 82.13%' : 'Calculation: Break-Even Ratio = ($92,000 + $170,152) / $319,200 = 82.13%'}
            </p>
            <p className="mt-2">
              {isZh ? '这意味着只要该物业的入住率达到 82% 以上，就能刚好覆盖所有开销和房贷，不会产生负现金流。想在一个页面上同时测试入住率、利率和 ' : 'This means the property needs to maintain at least 82% occupancy just to pay its bills and the mortgage without negative cash flow. To test how changes in occupancy, rates, and '}
              <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? 'Cash-on-Cash 收益率' : 'Cash-on-Cash Return'}</Link>
              {isZh ? ' 之间的联动关系吗？请使用 ' : ' interact together on one page, try our comprehensive '}
              <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? 'Deal Analyzer 综合尽调工具' : 'Deal Analyzer tool'}</Link>.
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

        {/* Deal Analyzer Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {locale === 'zh' ? '综合分析工具' : 'Full Underwriting Tool'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {locale === 'zh' ? '用 Deal Analyzer 测算 Break-Even Ratio 与全套尽调指标' : 'Evaluate Break-Even Ratio & Full Metrics in Deal Analyzer'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {locale === 'zh' ? '一次输入同步算出 Cap Rate、Cash-on-Cash、DSCR、Break-Even Ratio，支持压力测试与 PDF 导出。' : 'Calculate Cap Rate, Cash-on-Cash, DSCR, and BER simultaneously with stress testing.'}
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
      </div>
    </article>
  );
}
