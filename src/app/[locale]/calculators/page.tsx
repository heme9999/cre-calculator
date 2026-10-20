import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, Calculator, Building2, TrendingUp, DollarSign, Key, Percent, Layers, ShieldCheck } from 'lucide-react';
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

  const titles: Record<string, string> = {
    en: 'Commercial Real Estate Calculators & Investment Tools | CRE Calculators',
    zh: '商业地产专业投资计算器全集 - Cap Rate、NOI与DSCR测算 | CRE Calculators',
    es: 'Calculadoras de Bienes Raíces Comerciales - Cap Rate, NOI y DSCR | CRE Calculators',
    pt: 'Calculadoras de Imóveis Comerciais - Cap Rate, NOI e DSCR | CRE Calculators',
  };

  const descriptions: Record<string, string> = {
    en: 'Explore our full suite of commercial real estate calculators: Cap Rate, NOI, Cash-on-Cash, Loan Payment, DSCR, 1031 Exchange, Lease vs Buy, and Deal Analyzer.',
    zh: '探索完整的商业地产投资计算器工具包：资本化率(Cap Rate)、净营业收入(NOI)、现金回报率(CoC)、商业房贷还款、DSCR偿债覆盖率及1031置换延税。',
    es: 'Explore nuestra suite completa de calculadoras para bienes raíces comerciales: Cap Rate, NOI, Cash-on-Cash, Cuota de Préstamo, DSCR, Intercambio 1031 y Lease vs Buy.',
    pt: 'Explore nossa suite completa de calculadoras para imóveis comerciais: Cap Rate, NOI, Cash-on-Cash, Financiamento, DSCR, Troca 1031 e Lease vs Buy.',
  };

  return buildSeoMetadata({
    path: 'calculators',
    locale,
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    noindex: true,
  });
}

export default async function CalculatorsHubPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);

  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const homeLabel = isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home';
  const calculatorsLabel = isZh ? '计算器列表' : isEs ? 'Calculadoras' : isPt ? 'Calculadoras' : 'Calculators';

  const h1 = isZh
    ? '商业地产专业投资计算器全集'
    : isEs
    ? 'Calculadoras de Inversión en Bienes Raíces Comerciales'
    : isPt
    ? 'Calculadoras de Investimento em Imóveis Comerciais'
    : 'Commercial Real Estate Calculators';

  const subtitle = isZh
    ? '无需注册，100% 浏览器本地高精度运行。涵盖资产估值、净收益核算、杠杆回报、信贷风险与税务筹划全流程。'
    : isEs
    ? 'Herramientas 100% gratuitas que se ejecutan localmente en su navegador. Modelos precisos de valoración, rendimiento operativo, estructura de deuda y aplazamiento fiscal.'
    : isPt
    ? 'Ferramentas 100% gratuitas que rodam localmente no navegador. Modelos precisos de avaliação, receita operacional, estrutura de dívida e diferimento fiscal.'
    : 'Professional, browser-based financial models for commercial underwriting, debt coverage, tax deferral, and yield analysis. Zero sign-up required.';

  const openCalcBtn = isZh ? '打开计算器' : isEs ? 'Abrir Calculadora' : isPt ? 'Abrir Calculadora' : 'Launch Calculator';
  const featuredBadge = isZh ? '全案综合建模' : isEs ? 'Suite Integral' : isPt ? 'Suite Integrada' : 'Full Underwriting Suite';
  const featuredTitle = isZh ? 'Deal Analyzer: 商业地产综合尽调与压力测试' : isEs ? 'Deal Analyzer: Suite Integral de Debida Diligencia' : isPt ? 'Deal Analyzer: Análise Abrangente de Investimentos' : 'Deal Analyzer: Comprehensive CRE Underwriting';
  const featuredDesc = isZh
    ? '一次输入关键参数，同步测算 Cap Rate、NOI、CoC、DSCR 和收支平衡比率 (BER)，支持一键加压测试与专业 PDF/CSV 报告导出。'
    : isEs
    ? 'Unifique Cap Rate, NOI, Cash-on-Cash, DSCR y Break-Even Ratio en un solo análisis con pruebas de estrés financiero y exportación en PDF/CSV.'
    : isPt
    ? 'Unifique Cap Rate, NOI, Cash-on-Cash, DSCR e Break-Even Ratio em uma única modelagem com testes de estresse e exportação em PDF/CSV.'
    : 'Unified financial modeling for Cap Rate, NOI, Cash-on-Cash, DSCR, and Break-Even Ratio with instant stress testing and PDF export.';
  const featuredCta = isZh ? '进入 Deal Analyzer' : isEs ? 'Abrir Deal Analyzer' : isPt ? 'Abrir Deal Analyzer' : 'Open Deal Analyzer';

  const calculators = [
    {
      slug: 'cap-rate',
      badge: isZh ? '核心估值' : isEs ? 'Valoración Clave' : isPt ? 'Avaliação Principal' : 'Valuation Benchmark',
      title: isZh ? 'Cap Rate (资本化率) 计算器' : isEs ? 'Calculadora de Cap Rate' : isPt ? 'Calculadora de Cap Rate' : 'Cap Rate Calculator',
      formula: 'Cap Rate = NOI ÷ Purchase Price',
      desc: isZh
        ? '衡量无杠杆全款收购时的年度净收益率，用于横向对比不同城市与物业类型的资产估值水平。'
        : isEs
        ? 'Calcule el rendimiento no apalancado al contado para comparar la rentabilidad y el precio entre diferentes activos.'
        : isPt
        ? 'Calcule a rentabilidade anual à vista sem alavancagem para comparar retorno e preço entre diferentes imóveis.'
        : 'Calculate unleveraged yield to benchmark pricing, compare markets, and determine fair asset valuation.',
      icon: TrendingUp,
    },
    {
      slug: 'noi',
      badge: isZh ? '收益核算' : isEs ? 'Rendimiento Operativo' : isPt ? 'Receita Operacional' : 'Income Statement',
      title: isZh ? 'NOI (净营业收入) 计算器' : isEs ? 'Calculadora de NOI' : isPt ? 'Calculadora de NOI' : 'Net Operating Income (NOI) Calculator',
      formula: 'NOI = Effective Gross Income − Operating Expenses',
      desc: isZh
        ? '细分总毛收入、空置损失与各项运营开支（房产税、保险、维修、管理费），精确还原物业实际净收益。'
        : isEs
        ? 'Desglose ingresos potenciales, vacancia y gastos operativos para determinar el ingreso operativo antes de deuda.'
        : isPt
        ? 'Detallhe receitas brutas, perdas por vacância e despesas operacionais para calcular a receita líquida antes da dívida.'
        : 'Itemize gross rent, vacancy losses, and operating expenses to derive the true operational income before debt.',
      icon: Layers,
    },
    {
      slug: 'dscr',
      badge: isZh ? '信贷风控' : isEs ? 'Riesgo de Deuda' : isPt ? 'Risco de Financiamento' : 'Lender Underwriting',
      title: isZh ? 'DSCR (偿债覆盖率) 计算器' : isEs ? 'Calculadora de DSCR' : isPt ? 'Calculadora de DSCR' : 'DSCR Calculator',
      formula: 'DSCR = NOI ÷ Annual Debt Service',
      desc: isZh
        ? '商业银行衡量借款人违约风险的黄金指标。评估经营现金流覆盖年度房贷本息的倍数与安全缓冲垫。'
        : isEs
        ? 'Mida la capacidad del ingreso operativo neto para cubrir las cuotas anuales del préstamo hipotecario comercial.'
        : isPt
        ? 'Avalie a capacidade da receita operacional líquida para cobrir as parcelas anuais do financiamento bancário.'
        : 'Essential commercial lending metric measuring the cushion between operating income and required debt payments.',
      icon: ShieldCheck,
    },
    {
      slug: 'cash-on-cash',
      badge: isZh ? '杠杆回报' : isEs ? 'Rendimiento de Capital' : isPt ? 'Retorno de Capital' : 'Equity Return',
      title: isZh ? 'Cash-on-Cash (现金回报率) 计算器' : isEs ? 'Calculadora de Retorno Cash-on-Cash' : isPt ? 'Calculadora de Retorno Cash-on-Cash' : 'Cash-on-Cash Return Calculator',
      formula: 'CoC = Annual Pre-Tax Cash Flow ÷ Total Cash Invested',
      desc: isZh
        ? '评估实际掏出自付现金（首付+过户费+改造）的年度资金使用效率，直观呈现正向或负向杠杆效应。'
        : isEs
        ? 'Mida la rentabilidad sobre el capital real desembolsado en efectivo tras pagar las cuotas del préstamo.'
        : isPt
        ? 'Meça o retorno sobre o capital real desembolsado do seu bolso após o pagamento das parcelas da dívida.'
        : 'Measure real cash flow yields specifically on out-of-pocket invested equity after loan financing.',
      icon: DollarSign,
    },
    {
      slug: 'loan-payment',
      badge: isZh ? '房贷测算' : isEs ? 'Financiamiento' : isPt ? 'Financiamento' : 'Debt Structuring',
      title: isZh ? '商业贷款月供与气球尾款计算器' : isEs ? 'Calculadora de Préstamo Comercial y Balloon' : isPt ? 'Calculadora de Financiamento Comercial' : 'Commercial Loan Payment Calculator',
      formula: 'P&I Amortization & Balloon Payoff Modeling',
      desc: isZh
        ? '支持等额本息与等额本金双模式，提供前12个月摊销明细表，精准计算到期时的气球尾款 (Balloon Balance)。'
        : isEs
        ? 'Compare cuota constante vs amortización constante y proyecte el pago balloon al vencimiento del plazo.'
        : isPt
        ? 'Compare Tabela Price vs SAC com cronograma de amortização e projeção de saldo residual balloon.'
        : 'Model amortization schedules, compare fixed vs declining payments, and calculate maturity balloon balances.',
      icon: Building2,
    },
    {
      slug: '1031-exchange',
      badge: isZh ? '税务筹划' : isEs ? 'Diferimiento Fiscal' : isPt ? 'Diferimento Fiscal' : 'Tax Strategy',
      title: isZh ? '1031 Exchange 延税计算器' : isEs ? 'Calculadora de Intercambio 1031' : isPt ? 'Calculadora de Troca 1031' : '1031 Exchange Tax Calculator',
      formula: 'Capital Gains Tax Deferral & Reinvestment Target',
      desc: isZh
        ? '测算美国商业地产出售时的资本利得税延税额度，内置 IRS 法定 45 天识别期与 180 天完成期全流程指引。'
        : isEs
        ? 'Estime el impuesto diferido en ganancias de capital y visualice las reglas estatutarias de 45 y 180 días del IRS.'
        : isPt
        ? 'Estime o imposto diferido sobre ganho de capital e visualize os prazos legais de 45 e 180 dias do IRS.'
        : 'Estimate deferred capital gains taxes and track mandatory 45-day and 180-day statutory exchange deadlines.',
      icon: Percent,
    },
    {
      slug: 'lease-vs-buy',
      badge: isZh ? '决策对比' : isEs ? 'Decisión Inmobiliaria' : isPt ? 'Decisão Imobiliária' : 'Strategic Comparison',
      title: isZh ? 'Lease vs Buy (租买对比) 计算器' : isEs ? 'Calculadora de Alquilar vs Comprar' : isPt ? 'Calculadora de Alugar vs Comprar' : 'Lease vs Buy Calculator',
      formula: 'Cumulative Lease Cost vs Net Purchase Cost',
      desc: isZh
        ? '全面对比5-15年持有期内租金支出与自购净成本，扣除资产升值变现与贷款本金偿付积累的净资产。'
        : isEs
        ? 'Compare el desembolso acumulado en alquiler frente al costo neto de adquisición tras la venta final.'
        : isPt
        ? 'Compare o desembolso total em aluguel frente ao custo líquido de aquisição após a valorização do imóvel.'
        : 'Analyze total financial outcomes of leasing versus buying commercial property across multiple holding horizons.',
      icon: Key,
    },
    {
      slug: 'break-even-ratio',
      badge: isZh ? '安全边际' : isEs ? 'Margen de Seguridad' : isPt ? 'Margem de Segurança' : 'Risk Threshold',
      title: isZh ? '收支平衡点 (BER & BEO) 计算器' : isEs ? 'Calculadora de Punto de Equilibrio' : isPt ? 'Calculadora de Ponto de Equilíbrio' : 'Break-Even Ratio Calculator',
      formula: 'BER = (OpEx + ADS) ÷ EGI | BEO = (OpEx + ADS) ÷ GPI',
      desc: isZh
        ? '计算覆盖运营费用与房贷偿付所需的最低收支平衡比率与保本出租率，防范现金流枯竭风险。'
        : isEs
        ? 'Determine la proporción de ingresos consumida por gastos y deuda, y la ocupación mínima requerida.'
        : isPt
        ? 'Determine a proporção da receita consumida por despesas e dívida, e a taxa de ocupação mínima para equilíbrio.'
        : 'Determine the exact occupancy and revenue required to satisfy all operating expenses and debt obligations.',
      icon: Calculator,
    },
  ];

  const propertyTypes = [
    { slug: 'multifamily-cap-rate', title: isZh ? '多户住宅 Cap Rate 计算' : isEs ? 'Cap Rate Multifamiliar (5+ Unidades)' : isPt ? 'Cap Rate Multifamiliar (5+ Unidades)' : 'Multifamily Cap Rate Calculator' },
    { slug: 'industrial-cap-rate', title: isZh ? '工业与仓储 Cap Rate 计算' : isEs ? 'Cap Rate Inmuebles Industriales' : isPt ? 'Cap Rate Galpões Industriais' : 'Industrial Cap Rate Calculator' },
    { slug: 'self-storage-cap-rate', title: isZh ? '自助仓储 Cap Rate 计算' : isEs ? 'Cap Rate Almacenamiento (Self-Storage)' : isPt ? 'Cap Rate Self-Storage' : 'Self-Storage Cap Rate Calculator' },
    { slug: 'nnn-lease-cap-rate', title: isZh ? '单租户 NNN 净租赁 Cap Rate 计算' : isEs ? 'Cap Rate Arrendamiento Neto NNN' : isPt ? 'Cap Rate Locação Líquida NNN' : 'NNN Lease Cap Rate Calculator' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: h1,
    description: subtitle,
    url: `${SITE_URL}/${locale}/calculators/`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: calculators.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/${locale}/calculators/${c.slug}/`,
        name: c.title,
      })),
    },
  };

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      <JsonLd data={jsonLd} />

      {/* Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600 transition-colors">{homeLabel}</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{calculatorsLabel}</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {h1}
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </header>

      {/* Featured Underwriting Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30">
            {featuredBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {featuredTitle}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {featuredDesc}
          </p>
          <div className="pt-2">
            <Link
              href={`/${locale}/tools/deal-analyzer/`}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-xl transition shadow-sm hover:shadow active:scale-95 text-sm"
            >
              <span>{featuredCta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Core Calculators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculators.map((c) => {
          const IconComp = c.icon;
          return (
            <Link
              key={c.slug}
              href={`/${locale}/calculators/${c.slug}/`}
              className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                    {c.badge}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                    {c.title}
                  </h2>
                  <p className="font-mono text-[11px] text-slate-400 mt-1">
                    {c.formula}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {c.desc}
                </p>
              </div>
              <div className="pt-6 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform border-t border-slate-100 mt-4">
                <span>{openCalcBtn}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Specialized Property-Type Models Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          {isZh ? '细分物业类型资本化率模型' : isEs ? 'Modelos Especializados por Tipo de Propiedad' : isPt ? 'Modelos Especializados por Tipo de Imóvel' : 'Property-Specific Cap Rate Models'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          {isZh
            ? '不同商业资产类别具备独特的租约结构、费用分摊机制与资本开支特征：'
            : isEs
            ? 'Diferentes clases de activos comerciales tienen estructuras de arrendamiento y perfiles de riesgo específicos:'
            : isPt
            ? 'Diferentes classes de ativos comerciais possuem estruturas contratuais e perfis de risco específicos:'
            : 'Explore dedicated benchmarks and expense structures tailored to specific asset classes:'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {propertyTypes.map((pt) => (
            <Link
              key={pt.slug}
              href={`/${locale}/calculators/${pt.slug}/`}
              className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-3.5 text-xs font-bold text-slate-800 hover:text-emerald-700 transition flex items-center justify-between group shadow-2xs"
            >
              <span>{pt.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
