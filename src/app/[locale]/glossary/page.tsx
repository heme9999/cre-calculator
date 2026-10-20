import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { glossaryContent, GLOSSARY_SLUGS } from '@/content/glossary';
import { JsonLd, getBreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { BookMarked, ArrowRight, Calculator } from 'lucide-react';
import { ComplianceDisclaimer } from '@/components/common/ComplianceDisclaimer';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const isZh = locale === 'zh';

  return buildSeoMetadata({
    path: 'glossary',
    locale,
    title: isZh ? '商业地产 (CRE) 核心财务指标词汇表 | CRE 词典' : 'Commercial Real Estate (CRE) Financial Glossary & Acronyms',
    description: isZh
      ? '详解美国商业地产核心财务缩写与指标：NOI、Cap Rate、DSCR、BER、BEO、IRR、GRM。包含公式推导与在线计算工具。'
      : 'Comprehensive commercial real estate underwriting glossary. Definitions, mathematical formulas, and benchmark rules for NOI, Cap Rate, DSCR, BER, BEO, IRR, and GRM.',
    noindex: locale !== 'en',
  });
}

export default async function GlossaryHubPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const isZh = locale === 'zh';
  const termsMap = glossaryContent[locale] || glossaryContent.en;

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isZh ? '首页' : 'Home', url: `${SITE_URL}/${locale}/` },
    { name: isZh ? 'CRE 词汇表' : 'CRE Glossary', url: `${SITE_URL}/${locale}/glossary/` },
  ]);

  return (
    <article className="space-y-10 py-4 max-w-4xl mx-auto">
      <JsonLd data={[breadcrumbSchema]} />

      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{isZh ? 'CRE 词汇表' : 'Glossary'}</span>
        </nav>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <BookMarked className="w-3.5 h-3.5" />
          <span>{isZh ? '商业地产承销指标全书' : 'CRE Underwriting Dictionary'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isZh ? '商业地产 (CRE) 核心财务指标与缩写词汇表' : 'Commercial Real Estate Financial Glossary & Formulas'}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {isZh
            ? '精准掌握美国商业地产尽调与银行审贷中最关键的财务指标。每个词汇均附带标准定义、计算公式、测算案例以及对应的在线计算工具。'
            : 'Master the fundamental underwriting acronyms, formulas, and bank criteria across commercial real estate. Each entry includes mathematical formulas, worked examples, and direct links to interactive calculators.'}
        </p>
      </header>

      {/* Terms Grid */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GLOSSARY_SLUGS.map((slug) => {
            const item = termsMap[slug];
            if (!item) return null;
            return (
              <div
                key={slug}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-emerald-700 tracking-tight">
                      {item.term}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {isZh ? '核心指标' : 'Core Metric'}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {item.fullName}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.shortDefinition}
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-lg font-mono text-[11px] text-slate-800 border border-slate-200">
                    <code>{item.formula}</code>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/${locale}/glossary/${slug}/`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{isZh ? '查看详细定义与案例' : 'Read Full Definition & Guide'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/${locale}/${item.calculatorCta.url}/`}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                    title={item.calculatorCta.anchorText}
                  >
                    <Calculator className="w-3 h-3 text-emerald-600" />
                    <span>{isZh ? '去计算' : 'Calculate'}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Deal Analyzer Suite Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isZh ? '一体化商业地产尽调' : 'All-in-One Underwriting Suite'}
            </span>
            <h3 className="text-xl font-bold text-white">
              {isZh ? '不想逐个指标手动计算？' : 'Need All These Core Metrics Calculated Together?'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isZh
                ? '使用 Deal Analyzer 综合工具，只需输入一次交易参数，自动算出 Cap Rate、NOI、DSCR、BER 及压力情景并支持导出 PDF 报告。'
                : 'Use the Deal Analyzer tool to compute Cap Rate, NOI, DSCR, BER, and BEO in a unified institutional model.'}
            </p>
          </div>
          <Link
            href={`/${locale}/tools/deal-analyzer/`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            <span>{isZh ? '打开 Deal Analyzer' : 'Launch Deal Analyzer'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <ComplianceDisclaimer locale={locale} />
    </article>
  );
}
