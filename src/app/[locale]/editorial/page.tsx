import React from 'react';
import { Metadata } from 'next';
import { LOCALES, SITE_URL, resolveLocale, Locale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { JsonLd, getEditorialWebPageJsonLd } from '@/components/seo/JsonLd';
import { Calculator, CheckCircle2, Database, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

const EDITORIAL_COPY: Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    badge: string;
    h1: string;
    subtitle: string;
    coreTitle: string;
    capRateLabel: string;
    capRateDesc: string;
    noiLabel: string;
    noiDesc: string;
    dscrLabel: string;
    dscrDesc: string;
    cocLabel: string;
    cocDesc: string;
    sourcesTitle: string;
    sourcesIntro: string;
    cbreDesc: string;
    jllDesc: string;
    fedDesc: string;
    fannieDesc: string;
    sourcesNote: string;
    ctaLabel: string;
  }
> = {
  en: {
    metaTitle: 'Calculation Methodology & Underwriting Standards | CRE Methodologies',
    metaDescription:
      'Explore our transparent underwriting formulas, variable definitions, and educational reference sources.',
    badge: 'Calculation Methodology',
    h1: 'Underwriting Standards & Calculation Formulas',
    subtitle:
      'All financial models and tools on CRE Calculators adhere to standard commercial real estate underwriting formulas and explicit mathematical definitions.',
    coreTitle: 'Core Formulas & Financial Definitions',
    capRateLabel: 'Cap Rate (Capitalization Rate)',
    capRateDesc:
      'Measures unleveraged initial yield of a property based solely on stabilized annual NOI and acquisition price.',
    noiLabel: 'NOI (Net Operating Income)',
    noiDesc:
      'Operating expenses include property taxes, insurance, management fees, and routine maintenance, but exclude debt service payments and capital expenditures (CapEx).',
    dscrLabel: 'DSCR (Debt Service Coverage Ratio)',
    dscrDesc:
      'Key cash-flow coverage metric used by commercial lenders. Many conventional lending programs reference DSCR ≥ 1.20x to 1.25x as a baseline guideline.',
    cocLabel: 'Cash-on-Cash Return',
    cocDesc:
      'Calculates the ratio of annual pre-tax cash flow received relative to the total initial equity invested (down payment plus closing costs and initial reserves).',
    sourcesTitle: 'Public Research Portals & Reference Links',
    sourcesIntro:
      'While all default values and scenario tables on this site are illustrative educational assumptions, investors researching current market conditions can consult the following public industry research portals and official rate releases:',
    cbreDesc: 'Publicly published metro market survey portal and capitalization rate research',
    jllDesc: 'Multifamily, industrial, office, and retail sector research publications',
    fedDesc: 'Official U.S. Treasury yield and benchmark interest rate releases',
    fannieDesc: 'Multifamily underwriting guidelines and DSCR coverage documentation',
    sourcesNote:
      'Market conditions change continuously. Default numbers and benchmark tables on this site are for educational modeling only; verify the latest published data directly from primary sources before making transaction decisions.',
    ctaLabel: 'Launch Deal Analyzer Tool',
  },
  zh: {
    metaTitle: '计算公式与方法论假设 | CRE Methodologies',
    metaDescription:
      '详细了解 CRE Calculators 的计算公式推导逻辑、假设定义与公开研究参考来源。',
    badge: '公式与假设',
    h1: '计算公式透明说明与底层测算假设',
    subtitle:
      '本站所有工具均遵循商业地产行业通用的标准财务公式与清晰透明的数学定义。',
    coreTitle: '核心公式与定义标准',
    capRateLabel: 'Cap Rate (Capitalization Rate 资本化率)',
    capRateDesc:
      '衡量物业全现金购买状态下的无负债资产收益率，仅取决于年度稳定 NOI 与收购价格，不计入贷款杠杆。',
    noiLabel: 'NOI (Net Operating Income 净营业收入)',
    noiDesc:
      '注意：运营费用（Operating Expenses）包含房产税、保险、管理费、日常维修维护费，但不包含债务还本付息（Debt Service）和资本性支出（CapEx）。',
    dscrLabel: 'DSCR (Debt Service Coverage Ratio 偿债备付率)',
    dscrDesc:
      '商业地产贷款审贷核心指标。许多常规商业贷款项目通常将 DSCR ≥ 1.20x - 1.25x 作为基础参考线。',
    cocLabel: 'Cash-on-Cash Return (现金回报率)',
    cocDesc:
      '衡量投资者实际投入的现金总额（首付款加过户费用与初始储备金）在首年产生的税前现金流回报比例。',
    sourcesTitle: '公开研究门户与官方参考链接',
    sourcesIntro:
      '本站计算器默认值与示例区间均为教学测算假设；若需查询最新公开市场报告或官方基准利率，可访问以下机构研究门户与官方数据发布页：',
    cbreDesc: '公开都市圈市场调查门户与资本化率研究报告入口',
    jllDesc: '多户住宅、工业、办公与零售行业研究出版物',
    fedDesc: '美联储官方国债收益率与基准利率统计发布',
    fannieDesc: '多户住宅承销指南与 DSCR 偿债覆盖标准文档',
    sourcesNote:
      '市场数据随时间持续波动。本站提供的示例数值仅用于教学建模；在做出真实交易决策前，请直接查阅上述原始机构最新发布报告。',
    ctaLabel: '体验 Deal Analyzer 综合尽调工具',
  },
  es: {
    metaTitle: 'Metodología de Cálculo y Estándares de Evaluación | CRE Methodologies',
    metaDescription:
      'Conozca nuestras fórmulas transparentes de evaluación inmobiliaria comercial, definiciones de variables y fuentes de referencia.',
    badge: 'Metodología de Cálculo',
    h1: 'Estándares de Evaluación y Fórmulas de Cálculo',
    subtitle:
      'Todos los modelos financieros y calculadoras de CRE Calculators aplican fórmulas estándar de evaluación inmobiliaria comercial con definiciones matemáticas explícitas.',
    coreTitle: 'Fórmulas Fundamentales y Definiciones Financieras',
    capRateLabel: 'Cap Rate (Tasa de Capitalización)',
    capRateDesc:
      'Mide el rendimiento inicial no apalancado de una propiedad basándose únicamente en el NOI anual estabilizado y el precio de adquisición.',
    noiLabel: 'NOI (Ingreso Operativo Neto)',
    noiDesc:
      'Los gastos operativos incluyen impuestos prediales, seguros, honorarios de administración y mantenimiento ordinario, pero excluyen el servicio de la deuda y las inversiones de capital (CapEx).',
    dscrLabel: 'DSCR (Ratio de Cobertura del Servicio de la Deuda)',
    dscrDesc:
      'Métrica clave de cobertura de flujo de caja utilizada por prestamistas comerciales. Muchos programas convencionales toman como referencia orientativa un DSCR ≥ 1.20x a 1.25x.',
    cocLabel: 'Cash-on-Cash Return (Retorno Efectivo sobre Efectivo)',
    cocDesc:
      'Calcula la proporción del flujo de caja anual antes de impuestos en relación con el capital total en efectivo invertido inicialmente (enganche más costos de cierre y reservas).',
    sourcesTitle: 'Portales Públicos de Investigación y Enlaces de Referencia',
    sourcesIntro:
      'Si bien todos los valores predeterminados y tablas de escenarios de este sitio son supuestos ilustrativos con fines educativos, los inversionistas que deseen consultar informes públicos del sector o tasas oficiales pueden visitar los siguientes portales:',
    cbreDesc: 'Portal público de encuestas de tasas de capitalización e investigación de mercado',
    jllDesc: 'Publicaciones de investigación sobre sectores multifamiliar, industrial, oficinas y retail',
    fedDesc: 'Publicación oficial de tasas de interés y rendimientos de bonos del Tesoro de EE.UU.',
    fannieDesc: 'Guías de evaluación multifamiliar y estándares de cobertura DSCR',
    sourcesNote:
      'Las condiciones del mercado cambian continuamente. Las cifras de ejemplo de este sitio son exclusivamente para modelado educativo; verifique siempre las publicaciones más recientes en las fuentes originales antes de tomar decisiones de inversión.',
    ctaLabel: 'Abrir Herramienta Deal Analyzer',
  },
  pt: {
    metaTitle: 'Metodologia de Cálculo e Padrões de Avaliação | CRE Methodologies',
    metaDescription:
      'Conheça nossas fórmulas transparentes de análise imobiliária comercial, definições de variáveis e fontes de referência.',
    badge: 'Metodologia de Cálculo',
    h1: 'Padrões de Avaliação e Fórmulas de Cálculo',
    subtitle:
      'Todos os modelos financeiros e calculadoras do CRE Calculators seguem fórmulas padrão de análise imobiliária comercial com definições matemáticas explícitas.',
    coreTitle: 'Fórmulas Fundamentais e Definições Financeiras',
    capRateLabel: 'Cap Rate (Taxa de Capitalização)',
    capRateDesc:
      'Mede o rendimento inicial desalavancado de um imóvel com base exclusivamente no NOI anual estabilizado e no preço de aquisição.',
    noiLabel: 'NOI (Receita Operacional Líquida)',
    noiDesc:
      'As despesas operacionais incluem impostos imobiliários, seguros, taxas de administração e manutenção de rotina, mas excluem o serviço da dívida e despesas de capital (CapEx).',
    dscrLabel: 'DSCR (Índice de Cobertura do Serviço da Dívida)',
    dscrDesc:
      'Métrica essencial de cobertura de fluxo de caixa utilizada por credores comerciais. Muitos programas convencionais utilizam DSCR ≥ 1.20x a 1.25x como diretriz referencial.',
    cocLabel: 'Cash-on-Cash Return (Retorno sobre o Caixa Investido)',
    cocDesc:
      'Calcula a proporção do fluxo de caixa anual antes de impostos em relação ao capital total em dinheiro investido inicialmente (entrada mais custos de fechamento e reservas).',
    sourcesTitle: 'Portais Públicos de Pesquisa e Links de Referência',
    sourcesIntro:
      'Embora todos os valores padrão e tabelas de cenários deste site sejam premissas ilustrativas para fins educacionais, investidores que buscam pesquisas públicas de mercado ou taxas oficiais podem consultar os seguintes portais:',
    cbreDesc: 'Portal público de pesquisas de mercado e estudos sobre taxas de capitalização',
    jllDesc: 'Publicações de pesquisa sobre os setores multifamiliar, industrial, escritórios e varejo',
    fedDesc: 'Divulgação oficial de taxas de juros e rendimentos dos títulos do Tesouro dos EUA',
    fannieDesc: 'Diretrizes de análise multifamiliar e documentação de cobertura DSCR',
    sourcesNote:
      'As condições de mercado mudam continuamente. Os números de exemplo neste site destinam-se apenas à modelagem educacional; verifique sempre os dados mais recentes diretamente nas fontes primárias antes de tomar decisões de investimento.',
    ctaLabel: 'Abrir Ferramenta Deal Analyzer',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const copy = EDITORIAL_COPY[locale] || EDITORIAL_COPY.en;

  return buildSeoMetadata({
    path: 'editorial',
    locale,
    title: copy.metaTitle,
    description: copy.metaDescription,
    noindex: true,
  });
}

export default async function EditorialPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const copy = EDITORIAL_COPY[locale] || EDITORIAL_COPY.en;
  const canonicalUrl = `${SITE_URL}/${locale}/editorial/`;
  const jsonLdData = getEditorialWebPageJsonLd(canonicalUrl, locale);

  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4">
      <JsonLd data={jsonLdData} />
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span>{copy.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {copy.h1}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {copy.subtitle}
        </p>
      </header>

      {/* Methodology Section */}
      <div className="space-y-6">
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {copy.coreTitle}
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 divide-y divide-slate-100">
            {/* Cap Rate */}
            <div className="pt-2 space-y-1.5">
              <span className="font-bold text-slate-900">
                {copy.capRateLabel}
              </span>
              <p className="text-slate-600 font-mono bg-slate-100 p-2.5 rounded-lg text-xs">Cap Rate = (NOI / Purchase Price) × 100%</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {copy.capRateDesc}
              </p>
            </div>

            {/* NOI */}
            <div className="pt-4 space-y-1.5">
              <span className="font-bold text-slate-900">
                {copy.noiLabel}
              </span>
              <p className="text-slate-600 font-mono bg-slate-100 p-2.5 rounded-lg text-xs">NOI = Gross Potential Income - Vacancy Loss + Other Income - Operating Expenses</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {copy.noiDesc}
              </p>
            </div>

            {/* DSCR */}
            <div className="pt-4 space-y-1.5">
              <span className="font-bold text-slate-900">
                {copy.dscrLabel}
              </span>
              <p className="text-slate-600 font-mono bg-slate-100 p-2.5 rounded-lg text-xs">DSCR = Annual NOI / Annual Debt Service</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {copy.dscrDesc}
              </p>
            </div>

            {/* Cash-on-Cash */}
            <div className="pt-4 space-y-1.5">
              <span className="font-bold text-slate-900">
                {copy.cocLabel}
              </span>
              <p className="text-slate-600 font-mono bg-slate-100 p-2.5 rounded-lg text-xs">Cash-on-Cash = (Annual Pre-Tax Cash Flow / Total Cash Invested) × 100%</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {copy.cocDesc}
              </p>
            </div>
          </div>
        </section>

        {/* Data Sources & Citations with Clickable External Links */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            {copy.sourcesTitle}
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed">
            <p>{copy.sourcesIntro}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href="https://www.cbre.com/insights/reports/us-cap-rate-survey"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-500/50 rounded-xl transition-all group block space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-emerald-700">
                  <span>CBRE US Cap Rate Survey</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">{copy.cbreDesc}</p>
              </a>

              <a
                href="https://www.us.jll.com/en/trends-and-insights/research"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-500/50 rounded-xl transition-all group block space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-emerald-700">
                  <span>JLL Commercial Property Research</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">{copy.jllDesc}</p>
              </a>

              <a
                href="https://www.federalreserve.gov/releases/h15/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-500/50 rounded-xl transition-all group block space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-emerald-700">
                  <span>Federal Reserve H.15 Selected Interest Rates</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">{copy.fedDesc}</p>
              </a>

              <a
                href="https://multifamily.fanniemae.com/underwriting-property-types"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-500/50 rounded-xl transition-all group block space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-emerald-700">
                  <span>Fannie Mae Multifamily Underwriting</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">{copy.fannieDesc}</p>
              </a>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
              <span>{copy.sourcesNote}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center pt-4">
        <Link
          href={`/${locale}/tools/deal-analyzer/`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md"
        >
          <span>{copy.ctaLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
