import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { JsonLd, getArticleJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, BookOpen, AlertTriangle, Database, Building2 } from 'lucide-react';
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
  const content = getContent(locale).capRateBenchmarksGuide;

  return buildSeoMetadata({
    path: 'guides/cap-rate-benchmarks-by-city',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function CapRateBenchmarksGuidePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).capRateBenchmarksGuide;

  const jsonLdData = getArticleJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/guides/cap-rate-benchmarks-by-city/`,
    locale
  );

  return (
    <article className="space-y-10 py-4 max-w-5xl mx-auto">
      <JsonLd data={jsonLdData} />

      {/* Breadcrumb & Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <span className="text-slate-500">Guides</span>
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

      {/* Prominent Disclaimer Notice */}
      <section className="bg-amber-50/90 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-900">
              {locale === 'zh' ? '重要说明与免责声明' : 'Market Data Disclaimer'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-medium">
              {content.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* Property Type Benchmark Table */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            {content.propertyTypeTitle}
          </h2>
          <p className="text-xs text-slate-500">
            {locale === 'zh' ? '数据基准：2026年全美主流机构交易调研发布' : 'Aggregated 2026 valuation benchmarks across major commercial subtypes'}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 min-w-[200px]">{content.propertyTypeTableHeader.type}</th>
                <th className="py-3 px-4 min-w-[160px]">{content.propertyTypeTableHeader.range}</th>
                <th className="py-3 px-4">{content.propertyTypeTableHeader.notes}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {content.propertyTypes.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.propertyType}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700 whitespace-nowrap bg-emerald-50/40">{row.range}</td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Market Tier Adjustments Table */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            {content.marketTierTitle}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {content.marketTierIntro}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 min-w-[180px]">{content.marketTierTableHeader.tier}</th>
                <th className="py-3 px-4 min-w-[240px]">{content.marketTierTableHeader.metros}</th>
                <th className="py-3 px-4">{content.marketTierTableHeader.pricing}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {content.marketTiers.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{row.tier}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium leading-relaxed">{row.metros}</td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed">{row.pricing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Supplementary Note for US Chinese Investors (ZH Only) */}
      {content.chineseInvestorContent && (
        <section className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 md:p-8 space-y-3 shadow-xs">
          <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
            <span>💡</span>
            {content.chineseInvestorTitle}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed whitespace-pre-line">
            {content.chineseInvestorContent}
          </p>
        </section>
      )}

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

      {/* Data Sources Citations Section */}
      <section className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-600" />
          {content.dataSourcesTitle}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 list-disc list-inside">
          {content.dataSources.map((source, idx) => (
            <li key={idx} className="leading-relaxed font-mono text-[11px] text-slate-600">
              {source}
            </li>
          ))}
        </ul>
      </section>

      {/* Related Calculators */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white">{content.relatedTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    </article>
  );
}
