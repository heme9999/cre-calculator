import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { LeaseVsBuyCalculator } from '@/components/calculators/LeaseVsBuyCalculator';
import { LeaseVsBuyScenarioComparison } from '@/components/calculators/LeaseVsBuyScenarioComparison';
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
  const content = getContent(locale).leaseVsBuy;

  return buildSeoMetadata({
    path: 'calculators/lease-vs-buy',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function LeaseVsBuyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).leaseVsBuy;
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const homeLabel = isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home';

  const jsonLdData = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/lease-vs-buy/`,
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
        <LeaseVsBuyCalculator locale={locale} />
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
          <LeaseVsBuyScenarioComparison locale={locale} />
        </section>

        {/* Strategic Decision Factors: Holding Period & Tax Shields */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            {isZh
              ? '深度决策模型：持有周期与税务折旧抵税测算'
              : isEs
              ? 'Factores Estratégicos de Decisión: Horizonte Temporal y Escudos Fiscales'
              : isPt
              ? 'Fatores Estratégicos de Decisão: Prazo de Posse e Benefícios Fiscais'
              : 'Strategic Underwriting Factors: Holding Period Dynamics & Tax Shields'}
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              {isZh
                ? '商业物业的买租决策绝非仅仅对比每月租金与月供。真正的核心分水岭在于业务的持有周期预期、资金机会成本以及沉淀资本的折旧抵税效应：'
                : isEs
                ? 'La decisión entre comprar o alquilar no es una simple comparación entre renta mensual y cuota hipotecaria. Los dos factores determinantes son el horizonte temporal y los escudos fiscales:'
                : isPt
                ? 'A decisão entre comprar ou alugar vai muito além de comparar o aluguel mensal com a parcela do financiamento. Os fatores críticos são o horizonte de permanência e os benefícios fiscais:'
                : 'Deciding whether to lease or purchase commercial real estate is never a simple comparison of monthly rent versus monthly loan debt service. The true break-even inflection point is driven by two institutional factors: the planned holding horizon and the tax shield created by real estate depreciation:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  {isZh ? '1. 持有周期效应 (3–5 年 vs 7–10 年)' : isEs ? '1. Horizonte Temporal (3–5 vs 7–10 Años)' : isPt ? '1. Horizonte de Posse (3–5 vs 7–10 Anos)' : '1. Holding Period Inflection (3–5 vs. 7–10+ Years)'}
                </h3>
                <p>
                  {isZh
                    ? '短期持有（3–5 年以内）通常偏向租赁。因为商业地产买卖的交易摩擦成本极高：购入时需支付 2%–4% 的尽调与交割费，出售时需支付 5%–6% 的经纪佣金与过户税。若持有年限不足以摊销这些沉没成本并累积本金偿付，租赁能保持企业营运资金的充沛流动性。反之，7 年以上周期买入优势显著，不仅锁定了固定居住成本，还能享受长期资产增值与贷款本金偿付形成的权益积累。'
                    : isEs
                    ? 'Plazos cortos (3 a 5 años) suelen favorecer el alquiler debido a los altos costos de transacción (2%–4% en la adquisición y 5%–6% de comisiones en la venta). Para periodos superiores a 7 años, comprar suele ser más ventajoso al amortizar deuda y capturar plusvalías a largo plazo.'
                    : isPt
                    ? 'Prazos curtos (3 a 5 anos) geralmente favorecem o aluguel devido aos custos transacionais elevados. Acima de 7 anos, a compra compensa pelo acúmulo de patrimônio na amortização da dívida e valorização imobiliária.'
                    : 'Short holding horizons (under 5 years) almost invariably favor leasing due to heavy transaction friction: 2% to 4% in upfront financing and due diligence closing costs, plus 5% to 6% in broker disposition fees upon exit. If your business relocates or expands before these frictions are amortized, leasing preserves vital working capital. Conversely, holding horizons exceeding 7 to 10 years strongly favor ownership as debt principal paydown accelerates and property equity accumulates.'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  {isZh ? '2. 折旧与成本分离抵税 (IRC §168)' : isEs ? '2. Depreciación y Segregación de Costos' : isPt ? '2. Depreciação e Benefício Fiscal' : '2. Depreciation Shields & Cost Segregation'}
                </h3>
                <p>
                  {isZh
                    ? '商业物业（非住宅）按 IRC §168(c) 实行 39 年直线折旧（住宅出租物业为 27.5 年）。虽然全额租金支出可作为营业费用 100% 抵税，但购置商业地产可通过“成本分离”（Cost Segregation）将 20%–35% 的建筑成本（如地毯、专用电气、景观铺装）拆分为 5 年、7 年或 15 年资产，在前几年产生巨额账面折旧亏损，抵减企业利润税。'
                    : isEs
                    ? 'Los inmuebles comerciales se amortizan en 39 años según la normativa estadounidense. Aunque el alquiler es 100% deducible como gasto operativo, la compra permite realizar estudios de segregación de costos para acelerar deducciones fiscales sustanciales en los primeros años.'
                    : isPt
                    ? 'Imóveis comerciais geram amortização fiscal dedutível. Enquanto o aluguel é integralmente dedutível como despesa, a propriedade permite estruturar estratégias de depreciação acelerada para reduzir tributos.'
                    : 'Under IRC §168(c), non-residential commercial buildings are depreciated straight-line over 39 years (residential over 27.5 years). While lease payments are 100% deductible as ordinary operating expenses, property acquisition unlocks cost segregation studies, accelerating 20% to 35% of building components into 5-, 7-, and 15-year MACRS property to generate front-loaded tax shields.'}
                </p>
              </div>
            </div>

            <p className="pt-2">
              {isZh ? (
                <>
                  若您正在评估自用或投资型商业物业的买入价格是否公允，请查阅我们的{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    全美主要商业物业 Cap Rate 基准参考表
                  </Link>
                  ，核对目标资产的无杠杆回报水平与市场均值。同时，建议深入阅读完整的{' '}
                  <Link href={`/${locale}/guides/buy-vs-lease-decision-framework/`} className="text-emerald-600 hover:underline font-semibold">
                    商业地产买 vs 租决策分析框架
                  </Link>
                  。
                </>
              ) : isEs ? (
                <>
                  Si evalúa si el precio de compra propuesto se ajusta a las condiciones del mercado, consulte nuestra{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    Tabla Maestra de Cap Rates Nacionales
                  </Link>
                  {' '}y lea el{' '}
                  <Link href={`/${locale}/guides/buy-vs-lease-decision-framework/`} className="text-emerald-600 hover:underline font-semibold">
                    Marco de Decisión Completo
                  </Link>
                  .
                </>
              ) : isPt ? (
                <>
                  Se você está avaliando se o preço de compra está condizente com o mercado, consulte a nossa{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    Tabela Mestra de Cap Rates Nacionais
                  </Link>
                  {' '}e leia o{' '}
                  <Link href={`/${locale}/guides/buy-vs-lease-decision-framework/`} className="text-emerald-600 hover:underline font-semibold">
                    Guia de Decisão Completo
                  </Link>
                  .
                </>
              ) : (
                <>
                  If you are evaluating whether an acquisition price aligns with institutional market norms, check prevailing sector cap rates in our{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    National Cap Rate Benchmarks Master Reference Table
                  </Link>
                  , or explore our in-depth{' '}
                  <Link href={`/${locale}/guides/buy-vs-lease-decision-framework/`} className="text-emerald-600 hover:underline font-semibold">
                    Commercial Buy vs. Lease Decision Framework Guide
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </section>

        {/* Guide Banner */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {isZh
                  ? '战略决策指南'
                  : isEs
                  ? 'Guía Estratégica'
                  : isPt
                  ? 'Guia Estratégico'
                  : 'Strategic CRE Guide'}
              </span>
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              {isZh
                ? '商业地产买 vs 租决策分析框架'
                : isEs
                ? 'Marco de Decisión: Comprar vs Alquilar Propiedades Comerciales'
                : isPt
                ? 'Estrutura de Decisão: Comprar vs Alugar Imóveis Comerciais'
                : 'Commercial Real Estate Buy vs Lease Decision Framework'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isZh
                ? '系统评估资金机会成本、折旧抵税、改造成本风险与 5–10 年全周期财务净现值 (NPV) 对比。'
                : isEs
                ? 'Un marco financiero completo que evalúa costo de oportunidad, deducciones fiscales, capex y valor presente neto.'
                : isPt
                ? 'Uma análise financeira detalhada avaliando custo de oportunidade, benefícios fiscais e valor presente líquido.'
                : 'A step-by-step financial framework evaluating opportunity cost, tax deductions, capital expenditure risk, and 5-to-10 year hold scenarios.'}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/buy-vs-lease-decision-framework/`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shrink-0 transition-all shadow-xs"
          >
            <span>
              {isZh
                ? '阅读决策指南'
                : isEs
                ? 'Leer Marco de Decisión'
                : isPt
                ? 'Ler Estrutura de Decisão'
                : 'Read Decision Framework'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

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

        {/* Related Calculators */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white">{content.relatedTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </article>
  );
}
