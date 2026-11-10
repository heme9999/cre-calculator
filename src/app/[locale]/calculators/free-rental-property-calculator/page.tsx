import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { FreeRentalPropertyCalculator } from '@/components/calculators/FreeRentalPropertyCalculator';
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
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).freeRentalPropertyCalculator;

  return buildSeoMetadata({
    path: 'calculators/free-rental-property-calculator',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function FreeRentalPropertyCalculatorPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).freeRentalPropertyCalculator;
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const homeLabel = isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home';

  const jsonLdData = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/free-rental-property-calculator/`,
    locale
  );

  return (
    <article className="space-y-10 py-4">
      <JsonLd data={jsonLdData} />

      {/* Page Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">{homeLabel}</Link>
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
        <FreeRentalPropertyCalculator locale={locale} />
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

        {/* Worked Example */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.exampleTitle}</h2>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-xl border border-slate-200/80 font-mono text-xs sm:text-sm">
            {content.exampleContent}
          </div>
        </section>

        {/* Guide Banner */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {isZh
                  ? '租金与全周期尽调'
                  : isEs
                  ? 'Guía de Rendimientos'
                  : isPt
                  ? 'Guia de Retornos'
                  : 'Rental Returns & Underwriting'}
              </span>
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              {isZh
                ? '从首年租金收益到 5 年全周期回报：如何科学评估出租物业'
                : isEs
                ? 'Rendimiento en Efectivo vs TIR: Cómo Evaluar Propiedades en Alquiler'
                : isPt
                ? 'Retorno em Caixa vs TIR: Como Avaliar Imóveis para Locação'
                : 'Rental Cash Flow vs Whole-Life Return: How to Underwrite Rentals'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isZh
                ? '不仅看每月的净现金流，更要结合本金摊销积累、折旧抵税和内部收益率 (IRR) 进行综合压力测试。'
                : isEs
                ? 'Analice el flujo de caja mensual junto con la amortización del préstamo, beneficios fiscales y la TIR proyectada.'
                : isPt
                ? 'Analise o fluxo de caixa mensal juntamente com a amortização da dívida, benefícios fiscais e a TIR projetada.'
                : 'Look beyond monthly cash flow to assess principal paydown, depreciation tax shields, and 5-year IRR.'}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/cash-on-cash-vs-irr/`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shrink-0 transition-all shadow-xs"
          >
            <span>
              {isZh
                ? '阅读回报对比指南'
                : isEs
                ? 'Leer Guía de Retornos'
                : isPt
                ? 'Ler Guia de Retornos'
                : 'Read Returns Guide'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQs */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            {content.faqTitle}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {content.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{faq.question}</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <section className="bg-slate-100 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">{content.relatedTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.relatedCalculators.map((r, idx) => {
              const href = r.slug === 'deal-analyzer'
                ? `/${locale}/tools/deal-analyzer/`
                : `/${locale}/calculators/${r.slug}/`;
              return (
                <Link
                  key={idx}
                  href={href}
                  className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition text-sm font-semibold text-slate-800 hover:text-emerald-700"
                >
                  <span>{r.title}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </article>
  );
}
