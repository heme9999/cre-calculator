import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { JsonLd, getWebSiteJsonLd } from '@/components/seo/JsonLd';
import { Calculator, ArrowRight, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { DealAnalyzerPreview } from '@/components/home/DealAnalyzerPreview';

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
  const content = getContent(locale);

  return buildSeoMetadata({
    path: '',
    locale,
    title: content.home.metaTitle,
    description: content.home.metaDescription,
  });
}

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';
  const content = getContent(locale);
  const home = content.home;

  const jsonLdData = getWebSiteJsonLd(
    content.nav.brandName,
    home.metaDescription,
    `${SITE_URL}/${locale}/`,
    locale
  );

  return (
    <div className="space-y-16 py-4">
      <JsonLd data={jsonLdData} />
      {/* Hero Section */}
      <section className="pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Value Proposition, Primary CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-xs">
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isZh ? '美国商业地产 (CRE) 专业投资决策工具' : 'US Commercial Real Estate Underwriting Suite'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {home.heroH1}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {home.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={`/${locale}/tools/deal-analyzer/`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <span>{isZh ? '免费体验 Deal Analyzer' : 'Try Deal Analyzer Suite'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/calculators/cap-rate/`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors border border-slate-300"
              >
                <span>{isZh ? 'Cap Rate 计算器' : 'Cap Rate Calculator'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Original Deal Analyzer Interactive Preview */}
          <div className="lg:col-span-6">
            <DealAnalyzerPreview locale={locale} />
          </div>
        </div>
      </section>

      {/* Featured Calculators Grid */}
      <section className="space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">{home.featuredTitle}</h2>
          <p className="text-sm text-slate-600 mt-1">{home.featuredDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {home.calculators.map((calc) => (
            <Link
              key={calc.slug}
              href={`/${locale}/calculators/${calc.slug}/`}
              className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    {calc.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
                  {calc.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {calc.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                <span>{isZh ? '立即开始计算' : 'Launch Calculator'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Us / Value Proposition */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 space-y-8 shadow-md cv-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">{home.whyUsTitle}</h2>
          <p className="text-xs text-slate-400">
            {isZh ? '不写泛泛攻略，只做专业可执行的判断工具' : 'Built around numbers, transparent calculations, and market clarity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {home.whyUsItems.map((item, idx) => (
            <div key={idx} className="bg-slate-800/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                {idx === 0 ? <Zap className="w-4 h-4" /> : idx === 1 ? <TrendingUp className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
