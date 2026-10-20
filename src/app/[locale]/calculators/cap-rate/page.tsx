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
      guideTitle: '商业地产 Cap Rate 承销参考指南',
      guideDesc: '查看不同都市圈层级与资产类别的教学承销区间、费用结构与敏感度测算框架。',
      guideBtn: '查看承销参考指南',
      daBadge: '综合分析工具',
      daTitle: '想同时计算 Cap Rate、NOI、DSCR 和 Cash-on-Cash？',
      daDesc: '使用 Deal Analyzer 综合尽调工具，一次输入算出全部核心指标，支持压力测试与 PDF 导出。',
      daBtn: '打开 Deal Analyzer',
      assetTitle: '按物业资产类型查看 Cap Rate 专项承销指南',
      assetDesc: '不同商业地产类别的费用率、空置假设与资本性支出结构差异显著。选择具体物业类型查看对应的教学承销案例：',
      assets: [
        { slug: 'multifamily-cap-rate', title: 'Multifamily 多户住宅公寓 Cap Rate', sub: '5+ 单元公寓 · 换手翻新与管理费承销' },
        { slug: 'industrial-cap-rate', title: 'Industrial 工业与仓储物流 Cap Rate', sub: '物流仓库与轻工业 · NNN 费用回收与屋顶储备' },
        { slug: 'self-storage-cap-rate', title: 'Self-Storage 自助仓储 Cap Rate', sub: '自助仓设施 · 经济入住率与动态租金建模' },
        { slug: 'nnn-lease-cap-rate', title: 'NNN 单租户三净租赁 Cap Rate', sub: '绝对三净零售 · 租户信用利差与剩余租期分析' },
      ],
    },
    es: {
      guideTitle: 'Guía de Escenarios Ilustrativos de Cap Rate',
      guideDesc: 'Consulte los rangos ilustrativos de modelado financiero por tipo de activo y nivel de mercado metropolitano.',
      guideBtn: 'Ver Guía de Referencia',
      daBadge: 'Herramienta Integral de Análisis',
      daTitle: '¿Necesita calcular Cap Rate, NOI, DSCR y Cash-on-Cash juntos?',
      daDesc: 'Utilice Deal Analyzer para calcular todas las métricas clave a partir de un conjunto unificado de variables, con pruebas de estrés y exportación en PDF.',
      daBtn: 'Abrir Deal Analyzer',
      assetTitle: 'Calculadoras y Escenarios de Cap Rate por Tipo de Propiedad',
      assetDesc: 'Las estructuras de gastos operativos, vacancia y reservas de capital varían según el tipo de inmueble. Explore escenarios específicos por clase de activo:',
      assets: [
        { slug: 'multifamily-cap-rate', title: 'Cap Rate Multifamiliar (5+ Unidades)', sub: 'Apartamentos · Rotación, impuestos y reservas por unidad' },
        { slug: 'industrial-cap-rate', title: 'Cap Rate Industrial y Logística', sub: 'Bodegas y distribución · Contratos NNN y reservas estructurales' },
        { slug: 'self-storage-cap-rate', title: 'Cap Rate Autoalmacenamiento (Self-Storage)', sub: 'Instalaciones de almacenaje · Ocupación económica vs. física' },
        { slug: 'nnn-lease-cap-rate', title: 'Cap Rate Contratos Net Lease (NNN)', sub: 'Inquilino único · Solvencia crediticia y plazo remanente' },
      ],
    },
    pt: {
      guideTitle: 'Guia de Cenários Ilustrativos de Cap Rate',
      guideDesc: 'Consulte as faixas ilustrativas de modelagem financeira por classe de imóvel e nível de mercado metropolitano.',
      guideBtn: 'Ver Guia de Referência',
      daBadge: 'Ferramenta Completa de Análise',
      daTitle: 'Precisa calcular Cap Rate, NOI, DSCR e Cash-on-Cash juntos?',
      daDesc: 'Use o Deal Analyzer para calcular todas as métricas essenciais a partir de um conjunto unificado de dados, com testes de estresse e exportação em PDF.',
      daBtn: 'Abrir Deal Analyzer',
      assetTitle: 'Calculadoras e Cenários de Cap Rate por Tipo de Imóvel',
      assetDesc: 'As estruturas de despesas operacionais, vacância e reservas de capital variam conforme a classe do ativo. Explore cenários específicos por tipo de propriedade:',
      assets: [
        { slug: 'multifamily-cap-rate', title: 'Cap Rate Multifamiliar (5+ Unidades)', sub: 'Prédios residenciais · Rotatividade, impostos e reservas por unidade' },
        { slug: 'industrial-cap-rate', title: 'Cap Rate Industrial e Galpões Logísticos', sub: 'Galpões e distribuição · Contratos NNN e reservas estruturais' },
        { slug: 'self-storage-cap-rate', title: 'Cap Rate Autoarmazenamento (Self-Storage)', sub: 'Unidades de armazenamento · Ocupação econômica vs. física' },
        { slug: 'nnn-lease-cap-rate', title: 'Cap Rate Contratos Net Lease (NNN)', sub: 'Inquilino único · Risco de crédito corporativo e prazo de locação' },
      ],
    },
    en: {
      guideTitle: 'Cap Rate Underwriting Reference Guide',
      guideDesc: 'Explore illustrative capitalization rate modeling ranges across property types and metropolitan market tiers.',
      guideBtn: 'View Reference Guide',
      daBadge: 'Full Underwriting Tool',
      daTitle: 'Need Cap Rate, NOI, DSCR, and Cash-on-Cash all together?',
      daDesc: 'Use the Deal Analyzer tool to run all core CRE metrics from a single set of inputs with stress testing.',
      daBtn: 'Launch Deal Analyzer',
      assetTitle: 'Property-Type Cap Rate Calculators & Underwriting Scenarios',
      assetDesc: 'Operating expense ratios, vacancy assumptions, and capital reserve requirements vary significantly across commercial sectors. Explore specialized asset-class scenarios:',
      assets: [
        { slug: 'multifamily-cap-rate', title: 'Multifamily Cap Rate Calculator', sub: '5+ Unit Apartments · Turnover, OpEx ratio & per-unit reserves' },
        { slug: 'industrial-cap-rate', title: 'Industrial & Warehouse Cap Rate Calculator', sub: 'Distribution & Flex · NNN recoveries & structural CapEx' },
        { slug: 'self-storage-cap-rate', title: 'Self-Storage Cap Rate Calculator', sub: 'Storage Facilities · Economic occupancy & street-rate modeling' },
        { slug: 'nnn-lease-cap-rate', title: 'NNN Lease Cap Rate Calculator', sub: 'Single-Tenant Net Lease · Credit spreads & lease term risk' },
      ],
    },
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || {
    guideTitle: 'Cap Rate Underwriting Reference Guide',
    guideDesc: 'Explore illustrative capitalization rate modeling ranges across property types and metropolitan market tiers.',
    guideBtn: 'View Reference Guide',
    daBadge: 'Full Underwriting Tool',
    daTitle: 'Need Cap Rate, NOI, DSCR, and Cash-on-Cash all together?',
    daDesc: 'Use the Deal Analyzer tool to run all core CRE metrics from a single set of inputs with stress testing.',
    daBtn: 'Launch Deal Analyzer',
    assetTitle: 'Property-Type Cap Rate Calculators & Underwriting Scenarios',
    assetDesc: 'Operating expense ratios, vacancy assumptions, and capital reserve requirements vary significantly across commercial sectors. Explore specialized asset-class scenarios:',
    assets: [
      { slug: 'multifamily-cap-rate', title: 'Multifamily Cap Rate Calculator', sub: '5+ Unit Apartments · Turnover, OpEx ratio & per-unit reserves' },
      { slug: 'industrial-cap-rate', title: 'Industrial & Warehouse Cap Rate Calculator', sub: 'Distribution & Flex · NNN recoveries & structural CapEx' },
      { slug: 'self-storage-cap-rate', title: 'Self-Storage Cap Rate Calculator', sub: 'Storage Facilities · Economic occupancy & street-rate modeling' },
      { slug: 'nnn-lease-cap-rate', title: 'NNN Lease Cap Rate Calculator', sub: 'Single-Tenant Net Lease · Credit spreads & lease term risk' },
    ],
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
        <CapRateCalculator locale={locale} defaultPrice={2800000} defaultNoi={227200} />
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

        {/* Property-Type Cap Rate Entry Cards */}
        <section
          data-testid="property-type-cap-rate-links"
          className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4"
        >
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{bannersByLocale.assetTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {bannersByLocale.assetDesc}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {bannersByLocale.assets.map((asset) => (
              <Link
                key={asset.slug}
                href={`/${locale}/calculators/${asset.slug}/`}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                    {asset.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{asset.sub}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
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
