import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { cityCapRatesContent, CITY_SLUGS, CitySlug } from '@/content/cityCapRates';
import { JsonLd, getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/components/seo/JsonLd';
import { MapPin, TrendingUp, AlertTriangle, ArrowRight, Calculator, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ComplianceDisclaimer } from '@/components/common/ComplianceDisclaimer';

export function generateStaticParams() {
  const params: { locale: string; city: string }[] = [];
  for (const locale of LOCALES) {
    for (const city of CITY_SLUGS) {
      params.push({ locale, city });
    }
  }
  return params;
}

interface PageProps {
  params: Promise<{ locale: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const citySlug = resolvedParams.city as CitySlug;
  const cityMap = cityCapRatesContent[locale] || cityCapRatesContent.en;
  const item = cityMap[citySlug];

  if (!item) return {};

  return buildSeoMetadata({
    path: `guides/cap-rate-benchmarks-by-city/${citySlug}`,
    locale,
    title: item.metaTitle,
    description: item.metaDescription,
    noindex: locale !== 'en',
  });
}

export default async function CityCapRatePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';
  const citySlug = resolvedParams.city as CitySlug;
  const cityMap = cityCapRatesContent[locale] || cityCapRatesContent.en;
  const item = cityMap[citySlug];

  if (!item) {
    notFound();
  }

  const currentUrl = `${SITE_URL}/${locale}/guides/cap-rate-benchmarks-by-city/${item.slug}/`;

  const homeLabel = isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home';
  const guidesLabel = isZh ? '指南' : isEs ? 'Guías' : isPt ? 'Guias' : 'Guides';
  const benchmarksLabel = isZh ? '全美 Cap Rate 基准' : isEs ? 'Puntos de Referencia de Cap Rate' : isPt ? 'Referências de Cap Rate' : 'Cap Rate Benchmarks';

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: homeLabel, url: `${SITE_URL}/${locale}/` },
    { name: guidesLabel, url: `${SITE_URL}/${locale}/guides/` },
    { name: benchmarksLabel, url: `${SITE_URL}/${locale}/guides/cap-rate-benchmarks-by-city/` },
    { name: item.cityName, url: currentUrl },
  ]);

  const faqSchema = getFaqPageJsonLd(item.faqs);

  const otherCities = CITY_SLUGS.filter((s) => s !== item.slug);

  return (
    <article className="space-y-10 py-4 max-w-4xl mx-auto">
      <JsonLd data={[breadcrumbSchema, faqSchema]} />

      {/* Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2 flex-wrap">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">{homeLabel}</Link>
          <span>/</span>
          <Link href={`/${locale}/guides/`} className="hover:text-emerald-600">
            {guidesLabel}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/`} className="hover:text-emerald-600">
            {benchmarksLabel}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{item.cityName}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <MapPin className="w-3.5 h-3.5" />
            <span>{item.cityName}, {item.state}</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {item.marketTier}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {item.h1}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {item.subtitle}
        </p>
      </header>

      {/* Market Overview & Economic Drivers */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">
            {isZh ? `${item.cityName} 商业地产市场概况` : `${item.cityName} Commercial Real Estate Overview`}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {item.overview}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {isZh ? '核心经济驱动引擎' : 'Core Regional Economic Drivers'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {item.economicDrivers.map((driver, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{driver.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{driver.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2026 Cap Rate Benchmarks Table */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            {isZh ? `${item.cityName} 各业态 2026 Cap Rate 收益率基准` : `${item.cityName} 2026 Yield Benchmarks by Asset Class`}
          </h2>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {isZh ? '2026 最新校准' : '2026 Calibrated'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-800 font-bold">
                <th className="py-3 px-3">{isZh ? '商业物业类型' : isEs ? 'Tipo de Propiedad' : isPt ? 'Tipo de Imóvel' : 'Property Type'}</th>
                <th className="py-3 px-3">{isZh ? 'Class A (核心优质)' : isEs ? 'Clase A (Prime)' : isPt ? 'Classe A (Prime)' : 'Class A (Prime)'}</th>
                <th className="py-3 px-3">{isZh ? 'Class B (增值稳定)' : isEs ? 'Clase B (Value-Add)' : isPt ? 'Classe B (Value-Add)' : 'Class B (Value-Add)'}</th>
                <th className="py-3 px-3">{isZh ? '市场趋势' : isEs ? 'Tendencia' : isPt ? 'Tendência' : 'Trend'}</th>
                <th className="py-3 px-3">{isZh ? '承销洞察' : isEs ? 'Notas de Mercado' : isPt ? 'Notas de Mercado' : 'Market Notes'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {item.benchmarks.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{row.type}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-700 font-mono">{row.classARange}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700 font-mono">{row.classBRange}</td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {row.trend}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Underwriting Example */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900">{item.underwritingExample.title}</h2>
        <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
          <p>{item.underwritingExample.scenario || item.underwritingExample.intro}</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            {item.underwritingExample.points.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
          <p className="font-semibold text-slate-900 mt-2 pt-2 border-t border-slate-200">
            {item.underwritingExample.analysis}
          </p>
        </div>
      </section>

      {/* Local Risks & Due Diligence Alerts */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
        <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          {isZh ? `${item.cityName} 商业地产尽调与风控提示` : `${item.cityName} Underwriting Risks & Due Diligence Considerations`}
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-amber-900 pl-5 list-disc leading-relaxed">
          {item.localRisks.map((risk, idx) => (
            <li key={idx}>{risk}</li>
          ))}
        </ul>
      </section>

      {/* Calculator CTA Card */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md border border-slate-700">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {isZh ? '本地化尽调测算' : isEs ? 'Evaluación Local' : isPt ? 'Avaliação Local' : 'Local Property Underwriting'}
          </span>
          <h3 className="text-xl font-bold text-white">
            {isZh ? `准备好测算 ${item.cityName} 的具体商业项目了吗？` : isEs ? `¿Listo para evaluar una inversión en ${item.cityName}?` : isPt ? `Pronto para avaliar um imóvel em ${item.cityName}?` : `Ready to Underwrite a Deal in ${item.cityName}?`}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isZh
              ? '使用我们的 Cap Rate 计算器与 Deal Analyzer，输入本地 NOI 与买价，对比基准利差并进行压力测试。'
              : isEs
              ? 'Compare el NOI de su propiedad con los puntos de referencia locales y realice pruebas de estrés con nuestras herramientas gratuitas.'
              : isPt
              ? 'Compare o NOI do seu imóvel com as referências locais e realize testes de estresse com nossas ferramentas gratuitas.'
              : 'Test your property’s NOI against local benchmarks and run mortgage stress tests with our free tools.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <Link
            href={`/${locale}/calculators/cap-rate/`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition-all shadow-xs"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{isZh ? 'Cap Rate 计算器' : isEs || isPt ? 'Calculadora de Cap Rate' : 'Cap Rate Calculator'}</span>
          </Link>
          <Link
            href={`/${locale}/tools/deal-analyzer/`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold text-xs text-white transition-all"
          >
            <span>{isZh ? '综合尽调 Deal Analyzer' : 'Deal Analyzer'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          {isZh ? `${item.cityName} 商业地产投资常见问题 (FAQs)` : isEs ? `Preguntas Frecuentes sobre Inversión Comercial en ${item.cityName}` : isPt ? `Perguntas Frequentes sobre Imóveis Comerciais em ${item.cityName}` : `${item.cityName} Commercial Real Estate FAQs`}
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

      {/* Other City Benchmark Guides */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white">
          {isZh ? '查看其他重点都市圈 Cap Rate 基准' : isEs ? 'Explorar Referencias de Cap Rate en Otras Ciudades' : isPt ? 'Explorar Referências de Cap Rate em Outras Cidades' : 'Explore Other Metro Cap Rate Benchmarks'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {otherCities.map((slug) => {
            const city = cityMap[slug];
            if (!city) return null;
            return (
              <Link
                key={slug}
                href={`/${locale}/guides/cap-rate-benchmarks-by-city/${slug}/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-400">
                    {city.cityName}, {city.state}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {city.marketTier}
                  </div>
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-3 inline-flex items-center gap-1">
                  <span>{isZh ? '查看基准' : isEs ? 'Ver Referencias' : isPt ? 'Ver Referências' : 'View Benchmarks'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <ComplianceDisclaimer locale={locale} />
    </article>
  );
}
