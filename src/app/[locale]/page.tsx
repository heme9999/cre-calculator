import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { JsonLd, getWebSiteJsonLd } from '@/components/seo/JsonLd';
import { Calculator, ArrowRight, TrendingUp, ShieldCheck, Zap, Workflow, BookOpen, Layers } from 'lucide-react';
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
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl mt-2">
              {isZh ? '正在分析加杠杆后的真实回报？直接使用我们的 ' : 'Looking to measure your leveraged equity return? Jump straight to our '}
              <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-medium">
                {isZh ? 'Cash-on-Cash 现金回报率计算器' : 'Cash-on-Cash Return Calculator'}
              </Link>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={`/${locale}/tools/deal-analyzer/`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <span>{isZh ? '免费分析一笔交易' : 'Run a Free Deal Analysis'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/calculators/cap-rate/`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors border border-slate-300"
              >
                <span>{isZh ? 'Cap Rate 计算器' : 'Cap Rate Calculator'}</span>
              </Link>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isZh ? '免费使用 · 无需注册 · 数据在浏览器本地计算 · 支持 PDF 与 CSV 导出' : 'Free · No signup · Calculations run in your browser · PDF & CSV export'}
            </p>
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

      {/* Semantic Internal Linking Hub: Underwriting Pipeline & Framework Links */}
            {/* Dynamic Underwriting Hub */}
      <section className="space-y-8 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <Layers className="w-3.5 h-3.5" />
            <span>{home.underwritingHub.label}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {home.underwritingHub.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            {home.underwritingHub.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {home.underwritingHub.calculators.map((calc) => (
            <div key={calc.key} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  <Link href={`/${locale}/calculators/${calc.key}/`} className="hover:text-emerald-600 hover:underline">
                    {calc.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {calc.desc}
                </p>
              </div>
              <Link href={`/${locale}/calculators/${calc.key}/`} className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
                <span>{calc.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 mb-2">
                <Workflow className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">
                <Link href={`/${locale}/tools/deal-analyzer/`} className="hover:text-emerald-300 hover:underline">
                  {isZh ? '综合交易分析' : 'Comprehensive Deal Analyzer'}
                </Link>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isZh ? '在一个工具中合并所有测算并进行压力测试。' : 'Combine all calculations into one master view with stress testing.'}
              </p>
            </div>
            <Link href={`/${locale}/tools/deal-analyzer/`} className="text-xs font-bold text-emerald-300 inline-flex items-center gap-1 hover:gap-2 transition-all">
              <span>{isZh ? '运行分析' : 'Run Analysis'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {home.underwritingHub.guides.length > 0 && (
        <section className="space-y-8 bg-slate-50/50 rounded-3xl p-8 md:p-10 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{home.underwritingHub.guidesLabel}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {home.underwritingHub.guidesTitle}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                {home.underwritingHub.guidesDesc}
              </p>
            </div>
            <Link href={`/${locale}/guides/`} className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1">
              <span>{isZh ? '查看所有指南' : 'View All Guides'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {home.underwritingHub.guides.map((guide) => (
              <Link
                key={guide.key}
                href={`/${locale}/guides/${guide.key}/`}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 transition-all block group bg-white"
              >
                <span className="text-xs font-bold text-emerald-600 group-hover:underline">{guide.label}</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1">{guide.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {guide.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

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
