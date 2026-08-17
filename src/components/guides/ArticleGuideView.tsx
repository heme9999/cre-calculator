import React from 'react';
import Link from 'next/link';
import { ArticleGuideContent } from '@/content/types';
import { JsonLd, getArticleJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, BookOpen, AlertTriangle, Database } from 'lucide-react';
import { SITE_URL } from '@/lib/constants';
import { UnderwritingWorkflowDiagram } from './visuals/UnderwritingWorkflowDiagram';

interface Props {
  content: ArticleGuideContent;
  locale: string;
  guideSlug: string;
}

export function ArticleGuideView({ content, locale, guideSlug }: Props) {
  const jsonLdData = getArticleJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/guides/${guideSlug}/`,
    locale
  );

  return (
    <article className="space-y-10 py-4 max-w-4xl mx-auto">
      <JsonLd data={jsonLdData} />

      {/* Header & Breadcrumb */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/guides/`} className="hover:text-emerald-600">Guides</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{content.h1}</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {content.h1}
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          {content.subtitle}
        </p>
      </header>

      {/* Structured Underwriting Workflow Infographic */}
      {guideSlug === 'how-to-underwrite-a-deal' && (
        <UnderwritingWorkflowDiagram locale={locale} />
      )}

      {/* Deal Analyzer Action Banner for Underwriting Guide */}
      {guideSlug === 'how-to-underwrite-a-deal' && (
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {locale === 'zh' ? '尽调流程落地工具' : 'Underwriting Tool Implementation'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {locale === 'zh' ? '用 Deal Analyzer 走一遍完整尽调流程' : 'Run This Full Underwriting Process in Deal Analyzer'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {locale === 'zh' ? '不用在5个单独计算器间来算去。一次输入购买价、收入开支与融资条件，同时算出 Cap Rate、CoC、DSCR、BER 并做压力测试。' : 'No need to switch across 5 separate pages. Input terms once to run Cap Rate, CoC, DSCR, and BER with stress testing.'}
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
      )}

      {/* Disclaimer Banner if present */}
      {content.disclaimer && (
        <section className="bg-amber-50/90 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900">
                {locale === 'zh' ? '重要提醒与免责声明' : 'Important Notice'}
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-medium">
                {content.disclaimer}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Article Sections */}
      <div className="space-y-8">
        {content.sections.map((sec, idx) => (
          <section key={idx} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{sec.title}</span>
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {sec.content}
            </div>
          </section>
        ))}
      </div>

      {/* FAQs */}
      {content.faqs && content.faqs.length > 0 && (
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
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
      )}

      {/* Data Sources / Citations */}
      {content.dataSources && content.dataSources.length > 0 && (
        <section className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-600" />
            {content.dataSourcesTitle || (locale === 'zh' ? '数据来源与参考文献' : 'Data Sources & References')}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 list-disc list-inside">
            {content.dataSources.map((source, idx) => (
              <li key={idx} className="leading-relaxed font-mono text-[11px] text-slate-600">
                {source}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Tools / Calculators */}
      {content.relatedCalculators && content.relatedCalculators.length > 0 && (
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
      )}
    </article>
  );
}
