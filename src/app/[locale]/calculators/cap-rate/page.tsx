import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { CapRateCalculator } from '@/components/calculators/CapRateCalculator';
import { JsonLd, getCalculatorJsonLd, getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, BookOpen, AlertTriangle } from 'lucide-react';
import { ComplianceDisclaimer } from '@/components/common/ComplianceDisclaimer';
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
  const content = getContent(locale).capRate;

  return buildSeoMetadata({
    path: 'calculators/cap-rate',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function CapRatePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).capRate;

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/cap-rate/`,
    locale
  );

  const homeLabel = locale === 'zh' ? '首页' : locale === 'es' ? 'Inicio' : locale === 'pt' ? 'Início' : 'Home';

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: homeLabel, url: `${SITE_URL}/${locale}/` },
    { name: content.h1, url: `${SITE_URL}/${locale}/calculators/cap-rate/` },
  ]);

  const faqSchema = getFaqPageJsonLd(content.faqs);

  const workflowLabels = {
    chainLabel: locale === 'zh' ? '关键关联工具：' : locale === 'es' ? 'Flujo de Trabajo Relacionado:' : locale === 'pt' ? 'Fluxo de Trabalho Relacionado:' : 'Key Related Workflow:',
    noi: locale === 'zh' ? 'NOI 计算器' : locale === 'es' ? 'Calculadora de NOI' : locale === 'pt' ? 'Calculadora de NOI' : 'NOI Calculator',
    dscr: locale === 'zh' ? 'DSCR 偿债覆盖率' : locale === 'es' ? 'Calculadora de DSCR' : locale === 'pt' ? 'Calculadora de DSCR' : 'DSCR Calculator',
    dealAnalyzer: locale === 'zh' ? 'Deal Analyzer 综合尽调' : locale === 'es' ? 'Deal Analyzer Integral' : locale === 'pt' ? 'Deal Analyzer Completo' : 'Deal Analyzer',
  };

  const exampleContentByLocale = {
    zh: {
      title: '商业地产分析案例 (Illustrative Example)',
      intro: '假设您正在评估一处 24 单元的多户住宅物业（24-unit multifamily）。',
      price: '购买价格: $2,800,000',
      noiPrefix: '净营业收入 (NOI): $227,200（详见 ',
      noiLink: '计算该物业的 NOI',
      noiSuffix: '）',
      calc: '计算 Cap Rate = $227,200 (NOI) / $2,800,000 (价格) = 8.11%',
      desc1: '8.11% 代表如果你全款买下这栋楼，你每年的无杠杆回报率。但大多数投资者会贷款。在计算出 Cap Rate 后，你通常需要将其与房贷利率对比，然后使用 ',
      cocLink: 'Cash-on-Cash 现金回报率计算器',
      desc2: ' 或综合的 ',
      daLink: 'Deal Analyzer 工具',
      desc3: ' 来查看加杠杆后的真实回报率。',
    },
    es: {
      title: 'Caso Práctico en Bienes Raíces Comerciales',
      intro: 'Considere una propiedad multifamiliar hipotética de 24 unidades.',
      price: 'Precio de compra: $2,800,000',
      noiPrefix: 'Ingreso Operativo Neto (NOI): $227,200 (vea cómo ',
      noiLink: 'calculamos el NOI de esta propiedad',
      noiSuffix: ')',
      calc: 'Cálculo: Cap Rate = $227,200 (NOI) / $2,800,000 (Precio) = 8.11%',
      desc1: 'El 8.11% representa su rendimiento no apalancado si adquiriera el inmueble 100% en efectivo. Sin embargo, la mayoría de los inversionistas utilizan deuda hipotecaria. Tras calcular el Cap Rate, comúnmente lo comparará con las tasas de interés y luego usará la ',
      cocLink: 'Calculadora de Retorno Cash-on-Cash',
      desc2: ' o la suite completa ',
      daLink: 'Deal Analyzer',
      desc3: ' para evaluar el rendimiento real sobre el capital propio invertido.',
    },
    pt: {
      title: 'Exemplo Prático em Imóveis Comerciais',
      intro: 'Considere um imóvel multifamiliar hipotético de 24 unidades.',
      price: 'Preço de aquisição: $2.800.000',
      noiPrefix: 'Receita Operacional Líquida (NOI): $227.200 (veja como ',
      noiLink: 'calculamos o NOI deste imóvel',
      noiSuffix: ')',
      calc: 'Cálculo: Cap Rate = $227.200 (NOI) / $2.800.000 (Preço) = 8,11%',
      desc1: 'O índice de 8,11% representa o seu retorno não alavancado caso comprasse o imóvel totalmente à vista. Contudo, a maioria dos investidores recorre a financiamento. Após calcular o Cap Rate, você normalmente irá compará-lo com as taxas de juros hipotecárias e utilizar a ',
      cocLink: 'Calculadora de Retorno Cash-on-Cash',
      desc2: ' ou a ferramenta completa ',
      daLink: 'Deal Analyzer',
      desc3: ' para analisar o retorno real sobre o capital próprio investido.',
    },
    en: {
      title: 'Worked Commercial Property Example',
      intro: 'Consider a hypothetical 24-unit multifamily property.',
      price: 'Purchase price: $2,800,000',
      noiPrefix: 'Net Operating Income (NOI): $227,200 (see how we ',
      noiLink: "calculated this property's NOI",
      noiSuffix: ')',
      calc: 'Calculation: Cap Rate = $227,200 (NOI) / $2,800,000 (Price) = 8.11%',
      desc1: 'The 8.11% represents your unleveraged return if you bought the building in all cash. But most investors use debt. After calculating your Cap Rate, you would typically compare it against mortgage rates and then use the ',
      cocLink: 'Cash-on-Cash Return calculator',
      desc2: ' or the full ',
      daLink: 'Deal Analyzer tool',
      desc3: ' to see your actual return on invested equity.',
    },
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || {
    title: 'Worked Commercial Property Example',
    intro: 'Consider a hypothetical 24-unit multifamily property.',
    price: 'Purchase price: $2,800,000',
    noiPrefix: 'Net Operating Income (NOI): $227,200 (see how we ',
    noiLink: "calculated this property's NOI",
    noiSuffix: ')',
    calc: 'Calculation: Cap Rate = $227,200 (NOI) / $2,800,000 (Price) = 8.11%',
    desc1: 'The 8.11% represents your unleveraged return if you bought the building in all cash. But most investors use debt. After calculating your Cap Rate, you would typically compare it against mortgage rates and then use the ',
    cocLink: 'Cash-on-Cash Return calculator',
    desc2: ' or the full ',
    daLink: 'Deal Analyzer tool',
    desc3: ' to see your actual return on invested equity.',
  };

  const pitfallsByLocale = {
    zh: {
      title: 'Cap Rate 的常见误区与使用限制',
      item1: '1. 忽略债务结构：Cap Rate 是全现金无杠杆回报率指标，不反映贷款利率、月供及杠杆收益（正杠杆或负杠杆），需结合 Cash-on-Cash Return 和 DSCR 综合评估。',
      item2: '2. 混淆挂牌 Pro-forma 与实际 T12：卖方挂牌常使用未来乐观预测收入，低估实际历史运营开支与资本性支出 (CapEx)。',
    },
    es: {
      title: 'Errores Comunes y Limitaciones del Cap Rate',
      item1: '1. Ignora la Estructura de Deuda: El Cap Rate es una métrica no apalancada. No refleja las tasas de interés hipotecarias, la amortización ni los retornos apalancados. Evalúelo siempre junto con el Cash-on-Cash Return y el DSCR.',
      item2: '2. Confusión entre Pro-Forma y T12 Histórico: Los folletos de venta frecuentemente presentan supuestos optimistas a futuro. Analice y evalúe siempre basándose en los estados financieros auditados de los últimos 12 meses (T12).',
    },
    pt: {
      title: 'Erros Comuns e Limitações do Cap Rate',
      item1: '1. Desconsidera o Financiamento: O Cap Rate é uma métrica puramente desalavancada. Não reflete taxas de juros hipotecárias, amortização nem retornos alavancados. Avalie-o sempre em conjunto com o Retorno Cash-on-Cash e o DSCR.',
      item2: '2. Projeção Pro-Forma vs. T12 Histórico: Propostas de corretores costumam utilizar projeções excessivamente otimistas. Sempre analise com base no balanço operacional auditado dos últimos 12 meses (T12).',
    },
    en: {
      title: 'Common Cap Rate Pitfalls & Limitations',
      item1: '1. Ignores Financing: Cap rate is an unleveraged metric. It does not reflect mortgage interest rates, amortization, or leveraged returns. Always evaluate Alongside Cash-on-Cash Return and DSCR.',
      item2: '2. Pro-Forma vs. In-Place T12: Broker listing packages often use aggressive pro-forma assumptions. Always underwrite based on audited trailing 12-month (T12) operating statements.',
    },
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || {
    title: 'Common Cap Rate Pitfalls & Limitations',
    item1: '1. Ignores Financing: Cap rate is an unleveraged metric. It does not reflect mortgage interest rates, amortization, or leveraged returns. Always evaluate Alongside Cash-on-Cash Return and DSCR.',
    item2: '2. Pro-Forma vs. In-Place T12: Broker listing packages often use aggressive pro-forma assumptions. Always underwrite based on audited trailing 12-month (T12) operating statements.',
  };

  const bannersByLocale = {
    zh: {
      guideTitle: '全美 Cap Rate 基准数据指南',
      guideDesc: '查看全美主要都市圈（一二三四级城市）与各大商业物业类型的典型 Cap Rate 收益率参考区间。',
      guideBtn: '查看基准数据指南',
      daBadge: '综合分析工具',
      daTitle: '想同时计算 Cap Rate、NOI、DSCR 和 Cash-on-Cash？',
      daDesc: '使用 Deal Analyzer 综合尽调工具，一次输入算出全部核心指标，支持压力测试与 PDF 导出。',
      daBtn: '打开 Deal Analyzer',
    },
    es: {
      guideTitle: 'Guía de Puntos de Referencia de Cap Rate en EE.UU. (2026)',
      guideDesc: 'Consulte los rangos de tasas de capitalización por tipo de activo y categoría de mercado metropolitano en Estados Unidos.',
      guideBtn: 'Ver Guía de Referencia',
      daBadge: 'Herramienta Integral de Análisis',
      daTitle: '¿Necesita calcular Cap Rate, NOI, DSCR y Cash-on-Cash juntos?',
      daDesc: 'Utilice Deal Analyzer para calcular todas las métricas clave a partir de un conjunto unificado de variables, con pruebas de estrés y exportación en PDF.',
      daBtn: 'Abrir Deal Analyzer',
    },
    pt: {
      guideTitle: 'Guia de Padrões de Cap Rate nos EUA (2026)',
      guideDesc: 'Consulte as faixas de taxa de capitalização consolidadas por classe de imóvel e nível de mercado metropolitano nos EUA.',
      guideBtn: 'Ver Guia de Padrões',
      daBadge: 'Ferramenta Completa de Análise',
      daTitle: 'Precisa calcular Cap Rate, NOI, DSCR e Cash-on-Cash juntos?',
      daDesc: 'Use o Deal Analyzer para calcular todas as métricas essenciais a partir de um conjunto unificado de dados, com testes de estresse e exportação em PDF.',
      daBtn: 'Abrir Deal Analyzer',
    },
    en: {
      guideTitle: 'US Cap Rate Benchmarks Guide (2026)',
      guideDesc: 'Explore national capitalization rate ranges across property types and metropolitan market tiers.',
      guideBtn: 'View Benchmark Guide',
      daBadge: 'Full Underwriting Tool',
      daTitle: 'Need Cap Rate, NOI, DSCR, and Cash-on-Cash all together?',
      daDesc: 'Use the Deal Analyzer tool to run all core CRE metrics from a single set of inputs with stress testing.',
      daBtn: 'Launch Deal Analyzer',
    },
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || {
    guideTitle: 'US Cap Rate Benchmarks Guide (2026)',
    guideDesc: 'Explore national capitalization rate ranges across property types and metropolitan market tiers.',
    guideBtn: 'View Benchmark Guide',
    daBadge: 'Full Underwriting Tool',
    daTitle: 'Need Cap Rate, NOI, DSCR, and Cash-on-Cash all together?',
    daDesc: 'Use the Deal Analyzer tool to run all core CRE metrics from a single set of inputs with stress testing.',
    daBtn: 'Launch Deal Analyzer',
  };

  return (
    <article className="space-y-10 py-4">
      <JsonLd data={[calculatorSchema, breadcrumbSchema, faqSchema]} />

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

      {/* Interactive Calculator Tool */}
      <section id="tool">
        <CapRateCalculator locale={locale} />
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
          <div className="pt-2 text-xs text-slate-500 flex flex-wrap gap-2 items-center">
            <span className="font-semibold text-slate-700">{workflowLabels.chainLabel}</span>
            <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-medium">
              {workflowLabels.noi}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-medium">
              {workflowLabels.dscr}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-medium">
              {workflowLabels.dealAnalyzer}
            </Link>
          </div>
        </section>

        {/* Formula */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.formulaTitle}</h2>
          <div className="bg-slate-900 text-emerald-400 font-mono text-sm sm:text-base p-4 rounded-xl shadow-inner">
            <code>{content.formulaCode}</code>
          </div>
          <div className="space-y-2 pt-2">
            {content.formulaVariables.map((v, idx) => (
              <div key={idx} className="text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="font-bold text-slate-900 sm:min-w-[120px]">{v.label}:</span>
                <span className="text-slate-600 break-words">{v.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Worked Example */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{exampleContentByLocale.title}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              {exampleContentByLocale.intro}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{exampleContentByLocale.price}</li>
              <li>{exampleContentByLocale.noiPrefix}
                <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline">{exampleContentByLocale.noiLink}</Link>
                {exampleContentByLocale.noiSuffix}
              </li>
            </ul>
            <p className="font-semibold text-slate-900 mt-2">
              {exampleContentByLocale.calc}
            </p>
            <p className="mt-2">
              {exampleContentByLocale.desc1}
              <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-semibold">{exampleContentByLocale.cocLink}</Link>
              {exampleContentByLocale.desc2}
              <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-semibold">{exampleContentByLocale.daLink}</Link>
              {exampleContentByLocale.desc3}
            </p>
          </div>
        </section>

        {/* Pitfalls & Limitations */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {pitfallsByLocale.title}
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
            <p>{pitfallsByLocale.item1}</p>
            <p>{pitfallsByLocale.item2}</p>
          </div>
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

        {/* Cap Rate Benchmark Guide Banner */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              {bannersByLocale.guideTitle}
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {bannersByLocale.guideDesc}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            <span>{bannersByLocale.guideBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Deal Analyzer Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {bannersByLocale.daBadge}
              </span>
              <h3 className="text-xl font-bold text-white">
                {bannersByLocale.daTitle}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {bannersByLocale.daDesc}
              </p>
            </div>
            <Link
              href={`/${locale}/tools/deal-analyzer/`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              <span>{bannersByLocale.daBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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

        {/* Compliance & Legal Disclaimer */}
        <ComplianceDisclaimer locale={locale} />
      </div>
    </article>
  );
}
