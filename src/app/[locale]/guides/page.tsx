import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { JsonLd, getArticleJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).guidesHub;

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}/guides/`,
    },
  };
}

export default async function GuidesHubPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).guidesHub;

  const jsonLdData = getArticleJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/guides/`,
    locale
  );

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      <JsonLd data={jsonLdData} />

      {/* Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Guides</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {content.h1}
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          {content.subtitle}
        </p>
      </header>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.guides.map((g) => (
          <Link
            key={g.slug}
            href={`/${locale}/guides/${g.slug}/`}
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                  {g.badge}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {g.readTime}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                {g.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {g.description}
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'zh' ? '阅读完整指南' : 'Read Guide'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
