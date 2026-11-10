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
  const isZh = locale === 'zh';

  const workflowLabels = {
    chainLabel: locale === 'zh' ? '关键关联工具：' : locale === 'es' ? 'Flujo de Trabajo Relacionado:' : locale === 'pt' ? 'Fluxo de Trabalho Relacionado:' : 'Key Related Workflow:',
    noi: locale === 'zh' ? 'NOI 计算器' : locale === 'es' ? 'Calculadora de NOI' : locale === 'pt' ? 'Calculadora de NOI' : 'NOI Calculator',
    dscr: locale === 'zh' ? 'DSCR 偿债覆盖率' : locale === 'es' ? 'Calculadora de DSCR' : locale === 'pt' ? 'Calculadora de DSCR' : 'DSCR Calculator',
    dealAnalyzer: locale === 'zh' ? 'Deal Analyzer 综合尽调' : locale === 'es' ? 'Deal Analyzer Integral' : locale === 'pt' ? 'Deal Analyzer Completo' : 'Deal Analyzer',
  };

  const exampleContentByLocale = {
    zh: {
      title: '商业地产分析案例 1：32 单元郊区花园公寓 (Suburban Multifamily)',
      intro: '假设您正在评估一处位于稳健次级市场的 32 单元 Class B 花园公寓：',
      price: '购买价格: $3,850,000',
      noiPrefix: '核实后净营业收入 (NOI): $269,500（详见 ',
      noiLink: 'NOI 计算方法与 T-12 规范化',
      noiSuffix: '）',
      calc: '计算 Cap Rate = $269,500 (NOI) ÷ $3,850,000 (价格) = 7.00%',
      desc1: '7.00% 代表全款买下该物业时的无杠杆年度现金回报率。若采用 65% LTV、利率为 6.25% 的商业贷款，进场资本化率高于借贷成本（7.00% > 6.25%），形成正杠杆（Positive Leverage），可通过 ',
      cocLink: 'Cash-on-Cash 现金回报率计算器',
      desc2: ' 或 ',
      daLink: 'Deal Analyzer 综合尽调工具',
      desc3: ' 测算加杠杆后 8.4% 以上的真实股东权益回报。',
    },
    es: {
      title: 'Caso Práctico 1: Edificio Residencial de 32 Unidades',
      intro: 'Evaluación de una propiedad multifamiliar Clase B de 32 unidades en un mercado secundario estable:',
      price: 'Precio de compra: $3,850,000',
      noiPrefix: 'Ingreso Operativo Neto (NOI) auditado: $269,500 (consulte ',
      noiLink: 'cómo calcular el NOI',
      noiSuffix: ')',
      calc: 'Cálculo: Cap Rate = $269,500 (NOI) ÷ $3,850,000 (Precio) = 7.00%',
      desc1: 'El 7.00% representa el rendimiento anual desapalancado. Con una hipoteca al 65% LTV y tasa del 6.25%, el Cap Rate supera el coste financiero generando apalancamiento positivo. Verifíquelo en la ',
      cocLink: 'Calculadora de Cash-on-Cash',
      desc2: ' o en ',
      daLink: 'Deal Analyzer',
      desc3: ' para proyectar retornos sobre capital superiores al 8.4%.',
    },
    pt: {
      title: 'Exemplo Prático 1: Condomínio Residencial de 32 Unidades',
      intro: 'Avaliação de um imóvel multifamiliar Classe B de 32 apartamentos em mercado secundário consolidado:',
      price: 'Preço de aquisição: $3,850,000',
      noiPrefix: 'Receita Operacional Líquida (NOI) auditada: $269,500 (veja ',
      noiLink: 'como calcular o NOI',
      noiSuffix: ')',
      calc: 'Cálculo: Cap Rate = $269,500 (NOI) ÷ $3,850,000 (Preço) = 7.00%',
      desc1: 'A taxa de 7.00% expressa o retorno não alavancado do ativo. Financiando a 65% LTV com juros de 6.25%, obtém-se alavancagem positiva. Projete no ',
      cocLink: 'Calculadora de Retorno Cash-on-Cash',
      desc2: ' ou no ',
      daLink: 'Deal Analyzer',
      desc3: ' para verificar retornos sobre patrimônio acima de 8.4%.',
    },
    en: {
      title: 'Worked Example 1: 32-Unit Suburban Garden Apartment Property',
      intro: 'Consider a 32-unit Class B garden apartment acquisition in a growing secondary metropolitan submarket:',
      price: 'Purchase price: $3,850,000',
      noiPrefix: 'Stabilized Net Operating Income (NOI): $269,500 (see our ',
      noiLink: "NOI calculation methodology and T-12 normalization",
      noiSuffix: ')',
      calc: 'Calculation: Cap Rate = $269,500 (NOI) ÷ $3,850,000 (Purchase Price) = 7.00%',
      desc1: 'The 7.00% represents your unleveraged cash yield if acquired for 100% cash. Sizing a 65% LTV commercial bank loan at 6.25% fixed interest creates positive financial leverage (7.00% Cap Rate > 6.25% debt rate). Combine this NOI with debt terms in our ',
      cocLink: 'Cash-on-Cash Return Calculator',
      desc2: ' or full ',
      daLink: 'Deal Analyzer Tool',
      desc3: ' to project leveraged equity yields exceeding 8.4%.',
    },
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || {
    title: 'Worked Example 1: 32-Unit Suburban Garden Apartment Property',
    intro: 'Consider a 32-unit Class B garden apartment acquisition in a growing secondary metropolitan submarket:',
    price: 'Purchase price: $3,850,000',
    noiPrefix: 'Stabilized Net Operating Income (NOI): $269,500 (see our ',
    noiLink: "NOI calculation methodology and T-12 normalization",
    noiSuffix: ')',
    calc: 'Calculation: Cap Rate = $269,500 (NOI) ÷ $3,850,000 (Purchase Price) = 7.00%',
    desc1: 'The 7.00% represents your unleveraged cash yield if acquired for 100% cash. Sizing a 65% LTV commercial bank loan at 6.25% fixed interest creates positive financial leverage (7.00% Cap Rate > 6.25% debt rate). Combine this NOI with debt terms in our ',
    cocLink: 'Cash-on-Cash Return Calculator',
    desc2: ' or full ',
    daLink: 'Deal Analyzer Tool',
    desc3: ' to project leveraged equity yields exceeding 8.4%.',
  };

  const pitfallsByLocale = {
    zh: {
      title: 'Cap Rate 的常见误区与使用限制',
      item1: '1. 忽略债务结构：Cap Rate 是全现金无杠杆回报率指标，不反映贷款利率、月供及杠杆收益（正杠杆或负杠杆），需结合 Cash-on-Cash Return 和 DSCR 综合评估。',
      item2: '2. 混淆挂牌 Pro-forma 与实际 T12：卖方挂牌常使用未来乐观预测收入，低估实际历史运营开支与资本性支出 (CapEx)。',
    },
    es: {
      title: 'Errores Comunes y Limitaciones del Cap Rate',
      item1: '1. Ignora la Estructura de Deuda: El Cap Rate es una métrica no apalancada. No refleja las tasas de interés hipotecarias, la amortización ni los retornos apalancados. Evalúelo siempre junto con el Retorno sobre Efectivo (Cash-on-Cash) y el DSCR.',
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
        {/* Worked Example 1 */}
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

        {/* Worked Example 2: Comparative Commercial Asset */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            {isZh
              ? '商业地产分析案例 2：12,500 平方英尺社区商铺 (Retail Center 对比)'
              : locale === 'es'
              ? 'Caso Práctico 2: Centro Comercial de Vecindario de 12,500 sq ft'
              : locale === 'pt'
              ? 'Exemplo Prático 2: Centro Comercial de Vizinhança de 12,500 sq ft'
              : 'Worked Example 2: 12,500 Sq Ft Neighborhood Retail Strip Center'}
          </h2>
          <div className="bg-slate-50 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              {isZh
                ? '为了理解跨资产类别的收益率利差，我们对比一处挂牌价 $2,200,000 的 4 租户街角零售商业中心（包含一家咖啡店、干洗店与药房）：'
                : locale === 'es'
                ? 'Para comprender las diferencias de rendimiento entre sectores, comparemos un centro comercial minorista de 4 locales adquirido por $2,200,000:'
                : locale === 'pt'
                ? 'Para compreender os diferenciais de rendimento entre segmentos, comparemos um centro comercial de 4 lojas adquirido por $2,200,000:'
                : 'To understand cross-sector yield spreads, evaluate a 4-tenant corner retail strip center acquired for $2,200,000 (featuring a coffee shop, dry cleaner, and pharmacy):'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {isZh ? '合同买入价格: $2,200,000' : locale === 'es' ? 'Precio de compra: $2,200,000' : locale === 'pt' ? 'Preço de compra: $2,200,000' : 'Contract purchase price: $2,200,000'}
              </li>
              <li>
                {isZh ? '有效租金与杂费分摊 (EGI): $238,000 | 扣除房产税与维护费 (OpEx $73,000) 后的纯运营净收益 (NOI): $165,000' : 'Effective Gross Income (EGI): $238,000 | In-Place Stabilized NOI after $73,000 OpEx: $165,000'}
              </li>
            </ul>
            <p className="font-semibold text-slate-900 mt-2">
              {isZh
                ? '计算 Cap Rate = $165,000 (NOI) ÷ $2,200,000 (购买价格) = 7.50%'
                : locale === 'es'
                ? 'Cálculo: Cap Rate = $165,000 (NOI) ÷ $2,200,000 (Precio) = 7.50%'
                : locale === 'pt'
                ? 'Cálculo: Cap Rate = $165,000 (NOI) ÷ $2,200,000 (Preço) = 7.50%'
                : 'Calculation: Cap Rate = $165,000 (NOI) ÷ $2,200,000 (Purchase Price) = 7.50%'}
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              {isZh
                ? '【横向利差启示】：该零售物业的资本化率（7.50%）比前面的多户住宅（7.00%）高出 50 个基点 (bps)。这多出的 50 bps 并非免费午餐，而是市场对于单商户退租风险、较长免租招商期及租户改造成本 (TI) 所要求的风险溢价。'
                : locale === 'es'
                ? 'Conclusión del diferencial: El Cap Rate del 7.50% en retail es 50 puntos básicos superior al multifamiliar (7.00%). Esta prima refleja el mayor riesgo de rotación de locales comerciales y mayores costos de adecuación (TI).'
                : locale === 'pt'
                ? 'Conclusão comparativa: A taxa de 7.50% no varejo supera a do multifamiliar (7.00%) em 50 pontos-base. Esse adicional reflete a maior exposição a custos de readequação de lojas e vacância prolongada.'
                : 'Comparative Takeaway: The retail center’s 7.50% Cap Rate reflects a 50 bps yield premium over the 7.00% multifamily example. This spread compensates investors for commercial lease rollover risk, longer re-tenanting downtime, and tenant improvement (TI) capital allowances.'}
            </p>
          </div>
        </section>

        {/* How to Interpret Cap Rate Results */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            {isZh
              ? '结果深度解读：如何判断 Cap Rate 的高低与风险定价'
              : locale === 'es'
              ? 'Cómo Interpretar el Resultado: Rendimiento, Riesgo y Tasas'
              : locale === 'pt'
              ? 'Como Interpretar o Resultado: Rendimento, Risco e Alavancagem'
              : 'How to Interpret Your Cap Rate Result (Underwriting Guidelines)'}
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              {isZh
                ? 'Cap Rate 本身没有绝对的“好”与“坏”，它反映的是资本市场对特定资产风险与增长预期的定价权衡。机构投资者通常通过以下三大维度评估测算结果：'
                : locale === 'es'
                ? 'Un Cap Rate no es intrínsecamente "bueno" o "malo". Refleja la valoración del mercado respecto al binomio rentabilidad-riesgo. Evalúelo según tres pilares clave:'
                : locale === 'pt'
                ? 'O Cap Rate não é isoladamente "bom" ou "ruim". Expressa o equilíbrio entre risco e liquidez. Avalie o resultado sob três pilares fundamentais:'
                : 'A cap rate is neither universally "good" nor "bad"; it represents the unleveraged pricing equilibrium between risk and reward. Professional underwriters interpret the output across three institutional benchmarks:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                  {isZh ? '1. 借贷利差与正负杠杆' : locale === 'es' ? '1. Coste de Deuda y Apalancamiento' : locale === 'pt' ? '1. Custo da Dívida e Alavancagem' : '1. Positive vs. Negative Leverage'}
                </span>
                <p>
                  {isZh
                    ? '将 Cap Rate 与商业贷款年化综合利率对比。若 Cap Rate > 借贷成本，则形成正杠杆（加杠杆可提升股东 Cash-on-Cash 回报）；若 Cap Rate < 借贷成本，则属于负杠杆（利息正在吞噬物业本身创造的现金流）。'
                    : locale === 'es'
                    ? 'Compare el Cap Rate con la tasa de interés del crédito. Si Cap Rate > coste de deuda, existe apalancamiento positivo. Si Cap Rate < coste de deuda, la deuda destruye flujo de caja para el capital propio.'
                    : locale === 'pt'
                    ? 'Compare o Cap Rate com o custo do financiamento. Se o Cap Rate for maior que os juros, há alavancagem positiva. Caso contrário, a dívida reduz o retorno sobre o capital próprio.'
                    : 'Compare your cap rate against prevailing mortgage interest rates. Positive leverage occurs when the property cap rate exceeds your borrowing cost, increasing equity cash-on-cash yield. Negative leverage occurs when borrowing costs exceed property yields.'}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
                  {isZh ? '2. 无风险利率溢价 (Spread)' : locale === 'es' ? '2. Diferencial sobre Deuda Soberana' : locale === 'pt' ? '2. Prêmio sobre Renda Fixa Soberana' : '2. Spread over 10-Year Treasury'}
                </span>
                <p>
                  {isZh
                    ? '机构资金会衡量 Cap Rate 相对 10 年期美国国债收益率的利差（Historical Spread）。健康商业地产通常要求 200–300 个基点 (bps) 的风险补偿，以覆盖不动产的流动性折损、招租周期与资本开支。'
                    : locale === 'es'
                    ? 'Los fondos institucionales evalúan el diferencial frente al bono del Tesoro estadounidense a 10 años. Históricamente se exige un diferencial de 200 a 300 puntos básicos para compensar la iliquidez.'
                    : locale === 'pt'
                    ? 'Grandes fundos analisam o prêmio em relação ao título do Tesouro de 10 anos. Tradicionalmente exige-se um spread de 200 a 300 bps para cobrir iliquidez e manutenção.'
                    : 'Institutional capital monitors the historical yield spread between commercial cap rates and the 10-Year U.S. Treasury. A healthy risk premium is typically 200 to 300 basis points (bps) to compensate for illiquidity, leasing downtime, and capital risk.'}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">
                  {isZh ? '3. 核心品质 vs 增值溢价' : locale === 'es' ? '3. Activo Core vs Value-Add' : locale === 'pt' ? '3. Imóvel Core vs Oportunidade' : '3. Core Quality vs. Value-Add'}
                </span>
                <p>
                  {isZh
                    ? '一线门户城市核心 Class A 物业（4.5%–5.5%）抗跌性高、租金增长确定，但当期分红偏低；三级市场增值型 Class B/C 物业（6.5%–8.5%+）名义收益高，但需准备充足的重置与防违约准备金。'
                    : locale === 'es'
                    ? 'Activos Core Clase A (4.5%–5.5%) ofrecen alta liquidez y flujo estable; inmuebles value-add Clase B/C (6.5%–8.5%+) ofrecen mayor rendimiento inmediato pero requieren reservas de remodelación.'
                    : locale === 'pt'
                    ? 'Ativos Core Classe A (4.5%–5.5%) oferecem liquidez e estabilidade; imóveis Classe B/C (6.5%–8.5%+) geram dividendos mais altos mas exigem reservas financeiras para reparos.'
                    : 'Gateway Class A core properties (4.5%–5.5%) prioritize stability and capital preservation. Suburban Class B and tertiary value-add properties (6.5%–8.5%+) deliver higher nominal cash flow but require active asset management.'}
                </p>
              </div>
            </div>

            <p className="pt-2">
              {isZh ? (
                <>
                  若需查验全美 7 大主要商业物业（多户、工业、零售、办公、仓储、酒店、单租户 NNN）的最新市场调研区间，请查阅我们的{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    全美主要商业物业 Cap Rate 基准参考表
                  </Link>
                  。
                </>
              ) : locale === 'es' ? (
                <>
                  Consulte los rangos actualizados de las 7 principales clases de activos en nuestra{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    Tabla Maestra de Cap Rates Nacionales por Tipo de Activo
                  </Link>
                  .
                </>
              ) : locale === 'pt' ? (
                <>
                  Verifique os parâmetros atualizados dos 7 principais segmentos em nossa{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    Tabela Mestra de Cap Rates Nacionais
                  </Link>
                  .
                </>
              ) : (
                <>
                  To compare your calculated cap rate against current institutional ranges across multifamily, industrial, retail, office, self-storage, hotel, and single-tenant NNN properties, visit our{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    National Cap Rate Benchmarks Master Reference Table
                  </Link>
                  .
                </>
              )}
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
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`}
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
