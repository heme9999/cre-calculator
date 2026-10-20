import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { glossaryContent, GLOSSARY_SLUGS, GlossarySlug } from '@/content/glossary';
import { JsonLd, getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/components/seo/JsonLd';
import { BookOpen, Calculator, ArrowRight, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ComplianceDisclaimer } from '@/components/common/ComplianceDisclaimer';

export function generateStaticParams() {
  const params: { locale: string; term: string }[] = [];
  for (const locale of LOCALES) {
    for (const term of GLOSSARY_SLUGS) {
      params.push({ locale, term });
    }
  }
  return params;
}

interface PageProps {
  params: Promise<{ locale: string; term: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const termSlug = resolvedParams.term as GlossarySlug;
  const termsMap = glossaryContent[locale] || glossaryContent.en;
  const item = termsMap[termSlug];

  if (!item) return {};

  return buildSeoMetadata({
    path: `glossary/${termSlug}`,
    locale,
    title: item.metaTitle,
    description: item.metaDescription,
    noindex: locale !== 'en',
  });
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const isZh = locale === 'zh';
  const termSlug = resolvedParams.term as GlossarySlug;
  const termsMap = glossaryContent[locale] || glossaryContent.en;
  const item = termsMap[termSlug];

  if (!item) {
    notFound();
  }

  const currentUrl = `${SITE_URL}/${locale}/glossary/${item.slug}/`;

  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: item.fullName,
    termCode: item.term,
    description: item.shortDefinition,
    url: currentUrl,
    inDefinedTermSet: `${SITE_URL}/${locale}/glossary/`,
  };

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isZh ? '首页' : 'Home', url: `${SITE_URL}/${locale}/` },
    { name: isZh ? 'CRE 词汇表' : 'CRE Glossary', url: `${SITE_URL}/${locale}/glossary/` },
    { name: item.term, url: currentUrl },
  ]);

  const faqSchema = getFaqPageJsonLd(item.faqs);

  const otherTerms = GLOSSARY_SLUGS.filter((s) => s !== item.slug);

  return (
    <article className="space-y-10 py-4 max-w-4xl mx-auto">
      <JsonLd data={[definedTermSchema, breadcrumbSchema, faqSchema]} />

      {/* Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2 flex-wrap">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/glossary/`} className="hover:text-emerald-600">
            {isZh ? 'CRE 词汇表' : 'Glossary'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{item.term}</span>
        </nav>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{item.term}</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {item.fullName}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {item.h1}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-medium">
          {item.shortDefinition}
        </p>
      </header>

      {/* Interactive Tool Banner (Reverse Keyword Anchor Link) */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
            <Calculator className="w-3 h-3" />
            <span>{isZh ? '配套交互工具' : 'Interactive Tool'}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{item.calculatorCta.title}</h2>
          <p className="text-xs text-emerald-100 leading-relaxed">{item.calculatorCta.desc}</p>
        </div>
        <Link
          href={`/${locale}/${item.calculatorCta.url}/`}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-bold text-xs shrink-0 transition-all shadow-sm"
        >
          <span>{item.calculatorCta.anchorText}</span>
          <ArrowRight className="w-4 h-4 text-emerald-700" />
        </Link>
      </section>

      {/* Full Definition & Why It Matters */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">
            {isZh ? `什么是 ${item.term} (${item.fullName})？` : `What is ${item.term} (${item.fullName})?`}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {item.fullDefinition}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isZh ? '为什么这个指标在商业地产中至关重要？' : 'Why This Metric Matters in CRE Underwriting'}</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            {item.whyItMatters}
          </p>
        </div>
      </section>

      {/* Mathematical Formula */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {isZh ? `${item.term} 计算公式` : `${item.term} Formula & Equation`}
        </h2>
        <div className="bg-slate-900 text-emerald-400 font-mono text-sm sm:text-base p-4 rounded-xl shadow-inner">
          <code>{item.formula}</code>
        </div>
        <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-600">
          {item.variables.map((v, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <span className="font-bold text-slate-900 sm:min-w-[160px]">{v.name}:</span>
              <span className="text-slate-600 break-words">{v.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Worked Example */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900">{item.example.title}</h2>
        <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
          <p>{item.example.scenario}</p>
          <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs sm:text-sm font-bold text-emerald-800">
            {item.example.calculation}
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            <strong>{isZh ? '分析解读：' : 'Analysis: '}</strong>{item.example.interpretation}
          </p>
        </div>
      </section>

      {/* Rules of Thumb & Benchmarks */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-emerald-600" />
          {isZh ? `${item.term} 行业经验法则与参考基准` : `${item.term} Industry Rules of Thumb & Benchmarks`}
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pl-5 list-disc leading-relaxed">
          {item.benchmarks.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
      </section>

      {/* FAQs */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          {isZh ? '常见问题与专家解答 (FAQs)' : 'Frequently Asked Questions (FAQs)'}
        </h2>
        <div className="space-y-6 divide-y divide-slate-100">
          {item.faqs.map((faq, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-6' : ''}>
              <h3 className="text-base font-bold text-slate-900 mb-2">{faq.question}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Other Terms */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white">
          {isZh ? '浏览其他商业地产核心词汇' : 'Explore Other CRE Glossary Terms'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {otherTerms.map((s) => {
            const other = termsMap[s];
            if (!other) return null;
            return (
              <Link
                key={s}
                href={`/${locale}/glossary/${s}/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-3 flex flex-col justify-between group transition-all"
              >
                <span className="text-sm font-black text-emerald-400 group-hover:text-emerald-300">
                  {other.term}
                </span>
                <span className="text-[11px] text-slate-300 line-clamp-1 mt-1">
                  {other.fullName}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <ComplianceDisclaimer locale={locale} />
    </article>
  );
}
