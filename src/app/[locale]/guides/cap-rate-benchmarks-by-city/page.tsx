import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
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
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).capRateBenchmarksGuide;

  return buildSeoMetadata({
    path: 'guides/cap-rate-benchmarks-by-city',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
    noindex: locale !== 'en',
  });
}

export default async function CapRateBenchmarksGuidePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
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
            {locale === 'zh' ? '说明：以下数据为教学测算参考示意区间（主要参考 Newmark 2026 年初市场调研与常规估值逻辑，非官方逐项交易报价发布）' : 'Note: Directional underwriting benchmark ranges for educational reference (informed by Newmark 2026 market survey and valuation conventions; not official transaction quotes)'}
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

      {/* Individual City Deep Dives */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            {locale === 'zh' ? '重点城市商业地产 Cap Rate 专项指南' : 'Key Metro Cap Rate Benchmark Deep Dives'}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {locale === 'zh'
              ? '深入各大热门都会区，探索本地经济驱动因素、细分物业利差与承销测算案例：'
              : 'Explore detailed local economic drivers, asset-class spreads, and underwriting examples for high-volume investment markets:'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/austin-tx-cap-rates/`}
            className="p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group block bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Tier 2 Tech Metro</span>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 mt-2 text-base">Austin, TX</h3>
                <p className="text-xs text-slate-500 mt-1">Multifamily 5.25% - 6.00% · Industrial 5.50% - 6.25%</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/miami-fl-cap-rates/`}
            className="p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group block bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Gateway Growth Metro</span>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 mt-2 text-base">Miami, FL</h3>
                <p className="text-xs text-slate-500 mt-1">Multifamily 5.00% - 5.75% · Industrial 5.25% - 6.00%</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/dallas-tx-cap-rates/`}
            className="p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group block bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Logistics & Corporate Mega Hub</span>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 mt-2 text-base">Dallas - Fort Worth, TX</h3>
                <p className="text-xs text-slate-500 mt-1">Multifamily 5.50% - 6.25% · Industrial 5.60% - 6.30%</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/phoenix-az-cap-rates/`}
            className="p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group block bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Semiconductor & Sunbelt Inflow</span>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 mt-2 text-base">Phoenix, AZ</h3>
                <p className="text-xs text-slate-500 mt-1">Multifamily 5.40% - 6.15% · Industrial 5.50% - 6.25%</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>
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
      <section className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 space-y-6">
        {content.methodologyTitle && (
          <div className="space-y-2 mb-6 border-b border-slate-200 pb-4">
            <h3 className="text-sm font-bold text-slate-900">{content.methodologyTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{content.methodologyContent}</p>
          </div>
        )}

        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-600" />
          {content.dataSourcesTitle}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 list-disc list-inside">
          {content.dataSources.map((source, idx) => (
            <li key={idx} className="leading-relaxed font-mono text-[11px] text-slate-600">
              {typeof source === 'string' ? (
                <span>{source}</span>
              ) : (
                <div className="inline-flex flex-col gap-0.5 ml-1 align-top">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-600 hover:underline">
                    {source.org} - {source.reportName}
                  </a>
                  <span className="text-slate-400">Published: {source.date} · Accessed: {source.accessed}</span>
                </div>
              )}
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
