import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { NoiCalculator } from '@/components/calculators/NoiCalculator';
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
  const content = getContent(locale).noi;

  return buildSeoMetadata({
    path: 'calculators/noi',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function NoiPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).noi;
  const isZh = locale === 'zh';

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/noi/`,
    locale
  );

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isZh ? '首页' : 'Home', url: `${SITE_URL}/${locale}/` },
    { name: isZh ? '计算器' : 'Calculators', url: `${SITE_URL}/${locale}/` },
    { name: content.h1, url: `${SITE_URL}/${locale}/calculators/noi/` },
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

      {/* Interactive Tool */}
      <section id="tool">
        <NoiCalculator locale={locale} />
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
            <span className="font-semibold text-slate-700">{isZh ? '后续计算步骤：' : 'Next Calculation Steps:'}</span>
            <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? '计算 Cap Rate' : 'Cap Rate Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? '计算 Cash-on-Cash' : 'Cash-on-Cash Return'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? '测算 DSCR 偿债覆盖率' : 'DSCR Debt Coverage'}
            </Link>
          </div>
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
          <h2 className="text-xl font-bold text-slate-900">{content.exampleTitle}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 rounded-r-xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {content.exampleContent}
          </div>
        </section>

        {/* Pitfalls & Limitations */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {isZh ? 'NOI 计算中的常见扣除项误区' : 'Critical NOI Calculation Pitfalls & Exclusions'}
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
            <p>
              {isZh
                ? '1. 严禁扣除贷款本息：NOI 衡量的是资产本身的运营创收能力，贷款还本付息属于融资结构成本（在计算 Cash Flow 与 DSCR 时扣除）。'
                : '1. Never Deduct Mortgage Payments: NOI strictly measures pure property operating cash flow before debt service. Debt payments are deducted only when calculating net cash flow.'}
            </p>
            <p>
              {isZh
                ? '2. 区分资本性支出 (CapEx) 与常规维修：更换整个屋顶或升级电梯属于 CapEx，不计入日常运营开支 (OpEx)；但必须为未来的重置准备金留出合理预算。'
                : '2. Operating Expenses vs. Capital Improvements: Routine maintenance belongs in OpEx; structural roof replacement or elevator overhaul is CapEx and capitalized over time.'}
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

        {/* NOI Guide Banner */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              {locale === 'zh' ? '怎么估算 NOI 指南（没有历史财务数据时）' : 'How to Estimate NOI Guide (Even Without Financials)'}
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {locale === 'zh'
                ? '当卖家的数字不完整、被美化过、或者干脆没有历史账本时，如何重新测算真实 NOI。'
                : 'A practical framework for reconstructing NOI when seller numbers are incomplete or nonexistent.'}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/how-to-estimate-noi/`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            <span>{locale === 'zh' ? '阅读估算指南' : 'Read Guide'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
