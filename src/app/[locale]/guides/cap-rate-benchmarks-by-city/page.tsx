import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { JsonLd, getArticleJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, BookOpen, AlertTriangle, Database, Building2 } from 'lucide-react';
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
  const content = getContent(locale).capRateBenchmarksGuide;

  return buildSeoMetadata({
    path: 'guides/cap-rate-benchmarks-by-city',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function CapRateBenchmarksGuidePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).capRateBenchmarksGuide;
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const homeLabel = isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home';
  const guidesLabel = isZh ? '实操指南' : isEs ? 'Guías' : isPt ? 'Guias' : 'Guides';

  const jsonLdData = getArticleJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/guides/cap-rate-benchmarks-by-city/`,
    locale
  );

  return (
    <article className="space-y-10 py-4 max-w-5xl mx-auto">
      <JsonLd data={jsonLdData} />

      {/* Breadcrumb & Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">{homeLabel}</Link>
          <span>/</span>
          <Link href={`/${locale}/guides/`} className="hover:text-emerald-600">{guidesLabel}</Link>
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

      {/* Prominent Disclaimer Notice */}
      <section className="bg-amber-50/90 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-900">
              {isZh
                ? '重要说明与免责声明'
                : isEs
                ? 'Aviso de Datos de Mercado y Descargo de Responsabilidad'
                : isPt
                ? 'Aviso sobre Dados de Mercado e Isenção de Responsabilidade'
                : 'Market Data Disclaimer'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-medium">
              {content.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* Universal National Cap Rate Benchmark Table (All 7 Asset Classes) */}
      <section id="national-benchmarks" className="scroll-mt-24 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <Building2 className="w-3.5 h-3.5" />
            <span>{isZh ? '全美基准参考表' : isEs ? 'Tabla Maestra de Referencia Nacional' : isPt ? 'Tabela Mestra de Referência Nacional' : 'National Benchmark Master Reference'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isZh ? '全美 7 大主要商业物业 Cap Rate 基准全距 (2026)' : isEs ? 'Rangos Nacionales de Cap Rate por Tipo de Activo Comercial (2026)' : isPt ? 'Faixas Nacionais de Cap Rate por Classe de Imóvel Comercial (2026)' : 'National Commercial Real Estate Cap Rate Benchmark Ranges (2026)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {isZh
              ? '跨物业类别与资产评级的全美 Cap Rate 参考总表。综合 Newmark 2026 年一季度全美调查（多户、工业、零售、办公、自存仓、酒店跨档位全距）与 The Boulder Group 2026 年三季度净租金市场报告（单租户 NNN 整体平均 6.92%）。'
              : isEs
              ? 'Tabla resumen nacional que cubre los 7 principales sectores comerciales. Informada por el sondeo nacional de Newmark Q1 2026 y el informe de The Boulder Group Q3 2026 (promedio nacional NNN 6.92%).'
              : isPt
              ? 'Quadro resumo de referência nacional para as 7 principais classes comerciais. Baseado na pesquisa Newmark T1 2026 e relatório da The Boulder Group T3 2026 (média NNN 6,92%).'
              : 'Universal national benchmark reference table spanning all 7 major commercial property sectors. Derived from Newmark Q1 2026 National Investor Survey (comprehensive ranges across Class A to C tiers) and The Boulder Group Q3 2026 Net Lease Market Report (6.92% national NNN average).'}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-white font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 min-w-[180px]">{isZh ? '物业类型 (Asset Class)' : 'Asset Class'}</th>
                <th className="py-3.5 px-4 min-w-[150px]">{isZh ? '全美基准区间 (Range)' : 'National Benchmark Range'}</th>
                <th className="py-3.5 px-4 min-w-[160px]">{isZh ? '主要数据来源 (Source)' : 'Primary Source & Methodology'}</th>
                <th className="py-3.5 px-4">{isZh ? '测算要点与说明 (Underwriting Notes)' : 'Key Underwriting Notes'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">Multifamily (多户住宅公寓)</td>
                <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap bg-emerald-50/40">4.50% – 7.00%</td>
                <td className="py-3 px-4 text-xs text-slate-600">Newmark Q1 2026 Survey</td>
                <td className="py-3 px-4 text-slate-600 leading-relaxed text-xs">Span covers gateway Class A (4.50%–5.25%) to secondary/tertiary Class B/C (5.50%–7.00%). Tightest institutional liquidity spread.</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">Industrial & Logistics (工业与物流仓储)</td>
                <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap bg-emerald-50/40">5.00% – 7.50%</td>
                <td className="py-3 px-4 text-xs text-slate-600">Newmark Q1 2026 Survey</td>
                <td className="py-3 px-4 text-slate-600 leading-relaxed text-xs">Bulk modern distribution commands 5.00%–6.25%; shallow-bay and flex industrial trade wider at 6.50%–7.50%.</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">Retail (商业零售中心)</td>
                <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap bg-emerald-50/40">5.50% – 9.25%</td>
                <td className="py-3 px-4 text-xs text-slate-600">Newmark Q1 2026 / JLL</td>
                <td className="py-3 px-4 text-slate-600 leading-relaxed text-xs">Grocery-anchored neighborhood retail trades tightly (5.50%–6.50%); unanchored strip centers price with credit discount up to 9.25%.</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">Office (办公楼宇)</td>
                <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap bg-emerald-50/40">5.75% – 11.25%</td>
                <td className="py-3 px-4 text-xs text-slate-600">Newmark Q1 2026 Survey</td>
                <td className="py-3 px-4 text-slate-600 leading-relaxed text-xs">Bifurcated market: Trophy CBD buildings trade around 5.75%–7.50%; commodity suburban Class B/C trade with elevated risk premium up to 11.25%.</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">Self-Storage (自存仓)</td>
                <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap bg-emerald-50/40">5.00% – 9.00%</td>
                <td className="py-3 px-4 text-xs text-slate-600">Newmark Q1 2026 / Cushman</td>
                <td className="py-3 px-4 text-slate-600 leading-relaxed text-xs">Primary climate-controlled multi-story trades 5.00%–6.00%; tertiary drive-up facilities price 7.00%–9.00% reflecting month-to-month leases.</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">Hotel & Hospitality (酒店)</td>
                <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap bg-emerald-50/40">6.50% – 11.50%</td>
                <td className="py-3 px-4 text-xs text-slate-600">Newmark Q1 2026 / CBRE Survey</td>
                <td className="py-3 px-4 text-slate-600 leading-relaxed text-xs">Full-service gateway luxury prices 6.50%–7.50%; economy limited-service trades up to 11.50%. Note: CBRE hotel survey reflects narrower central tendency (7.0%–9.5% for select-service).</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">Single-Tenant Net Lease / NNN (单租户净租)</td>
                <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap bg-emerald-50/40">6.00% – 8.00%</td>
                <td className="py-3 px-4 text-xs text-slate-600">The Boulder Group Q3 2026 / CBRE Net Lease</td>
                <td className="py-3 px-4 text-slate-600 leading-relaxed text-xs">National overall net lease average is 6.92% (Retail 6.69%, Industrial 7.05% per Boulder Group). Sub-tier: CBRE U.S. Net Lease Survey documents prime investment-grade corporate credit (e.g., McDonald&apos;s, CVS, 7-Eleven) trading down to 6.00%–6.75%; franchisee guarantees trade 7.25%–8.00%+.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed italic">
          {isZh
            ? '注：上述宽泛区间反映全美不同区域（一线核心市场至三线市场）与资产评级（Class A 至 Class C）的全谱系分布。CBRE 酒店调查在中心趋向统计上与 Newmark 略有分歧（CBRE 精选服务型多集中于 7.0%–9.5%），已在表中特别注明。个别数字经 JLL 与 Marcus & Millichap 行业二级报告复核。'
            : 'Note: Wide ranges reflect the full national continuum across market tiers (Gateway Tier 1 to Tertiary Tier 3) and property quality (Class A to Class C). CBRE hospitality surveys indicate narrower central tendencies for select-service hotels (7.0%–9.5%) as footnoted. Select figures cross-checked against JLL and Marcus & Millichap market reports.'}
        </p>
      </section>

      {/* Property Type Benchmark Table */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            {content.propertyTypeTitle}
          </h2>
          <p className="text-xs text-slate-500">
            {isZh
              ? '说明：以下数据为教学测算参考示意区间（主要参考 Newmark 2026 年初市场调研与常规估值逻辑，非官方逐项交易报价发布）'
              : isEs
              ? 'Nota: Rangos de referencia orientativos con fines educativos (basados en sondeos de mercado de Newmark 2026 y convenciones de valuación; no constituyen cotizaciones oficiales).'
              : isPt
              ? 'Nota: Faixas de referência para fins educativos (baseadas em pesquisas de mercado da Newmark 2026 e convenções de avaliação; não constituem cotações oficiais).'
              : 'Note: Directional underwriting benchmark ranges for educational reference (informed by Newmark 2026 market survey and valuation conventions; not official transaction quotes)'}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 min-w-[200px]">{content.propertyTypeTableHeader.type}</th>
                <th className="py-3 px-4 min-w-[160px]">{content.propertyTypeTableHeader.range}</th>
                <th className="py-3 px-4">{content.propertyTypeTableHeader.notes}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {content.propertyTypes.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.propertyType}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700 whitespace-nowrap bg-emerald-50/40">{row.range}</td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Market Tier Adjustments Table */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            {content.marketTierTitle}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {content.marketTierIntro}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 min-w-[180px]">{content.marketTierTableHeader.tier}</th>
                <th className="py-3 px-4 min-w-[240px]">{content.marketTierTableHeader.metros}</th>
                <th className="py-3 px-4">{content.marketTierTableHeader.pricing}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {content.marketTiers.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{row.tier}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium leading-relaxed">{row.metros}</td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed">{row.pricing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Comprehensive Capital Markets & Underwriting Analysis */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isZh ? '宏观资本市场深度研判' : isEs ? 'Análisis Macroeconómico de Capitales' : isPt ? 'Análise Macroeconômica de Capitais' : 'Macro Capital Markets Analysis'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isZh
              ? '利率周期、利差结构与正负杠杆机制全解析'
              : isEs
              ? 'Dinámica de Tasas del Tesoro, Spreads Crediticios y Mecánica de Apalancamiento'
              : isPt
              ? 'Dinâmica de Juros do Tesouro, Spreads de Crédito e Mecânica de Alavancagem'
              : 'Interest Rate Dynamics, Risk Spreads, and Positive vs. Negative Leverage Mechanics'}
          </h2>
          <p className="text-xs text-slate-500">
            {isZh
              ? '最后更新：2026年11月 · 宏观利差模型审核人：Marcus Vance, CCIM'
              : isEs
              ? 'Última actualización: Noviembre 2026 · Revisado por Marcus Vance, CCIM'
              : isPt
              ? 'Última atualização: Novembro 2026 · Revisado por Marcus Vance, CCIM'
              : 'Last Updated: November 2026 · Underwriting Review by Marcus Vance, CCIM'}
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-5">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">
              {isZh
                ? '1. 资本化率与 10 年期美国国债收益率的利差规律 (Spread to Benchmark)'
                : isEs
                ? '1. El Diferencial Histórico sobre los Bonos del Tesoro a 10 Años'
                : isPt
                ? '1. O Spread Histórico sobre os Títulos do Tesouro de 10 Anos'
                : '1. The Historical Spread Over the 10-Year U.S. Treasury Yield'}
            </h3>
            <p>
              {isZh
                ? '在商业不动产估值实践中，资本化率（Cap Rate）绝非孤立存在，而是作为“基准无风险收益率（10年期美债）+ 风险溢价（Risk Premium）”的函数运行。历史上，全美优质商业地产（如核心多户型和现代物流仓储）相对于 10 年期美债收益率的合理利差区间为 175 到 250 个基点（bps）；而次级零售或办公楼等业态的利差通常需达到 300 到 450 个基点以上，以补偿流动性不足、再招商停工期以及资本性重置支出。当美债收益率维持在 4.0%–4.5% 区间时，低于 5.50% 的资本化率往往意味着投资者在依赖未来的高租金增长预期进行激进定价。'
                : isEs
                ? 'En la práctica de valuación comercial, el Cap Rate opera como la suma de la tasa libre de riesgo (bono del Tesoro a 10 años) más una prima de riesgo de liquidez e iliquidez inmobiliaria. Históricamente, activos institucionales Clase A en multifamiliar y logística exigen un diferencial de 175 a 250 puntos básicos (bps) sobre el Tesoro. Para activos comerciales secundarios o de oficinas, este diferencial se amplía a más de 300–450 bps para compensar la menor liquidez y períodos prolongados de desocupación.'
                : isPt
                ? 'Na prática de avaliação imobiliária comercial, o Cap Rate opera como a taxa livre de risco (título do Tesouro americano de 10 anos) acrescida de um prêmio de risco do imóvel. Historicamente, ativos Classe A em logística e multifamiliar demandam um spread de 175 a 250 pontos-base (bps) sobre o Tesouro. Em ativos comerciais secundários ou escritórios, esse spread supera 300–450 bps para remunerar o risco de desocupação e reposição de capital.'
                : 'In institutional commercial real estate underwriting, capitalization rates operate as a function of the risk-free benchmark yield (the 10-Year U.S. Treasury) plus an equity risk premium. Historically, prime Class A multifamily and industrial assets trade at a 175 to 250 basis point (bps) spread over the 10-Year Treasury. For secondary retail, suburban flex, or commodity office buildings, the required spread widens past 300 to 450+ bps to compensate for tenant credit risk, extended re-leasing downtime, and capital expenditure drag. When benchmark Treasury yields hover between 4.0% and 4.5%, entering into a deal below a 5.50% cap rate implies aggressive reliance on post-acquisition net rental growth.'}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">
              {isZh
                ? '2. 谨防“负杠杆陷阱”：贷款常数 (Loan Constant) vs. 进场 Cap Rate'
                : isEs
                ? '2. La Trampa del Apalancamiento Negativo: Constante de Deuda vs. Cap Rate'
                : isPt
                ? '2. A Armadilha da Alavancagem Negativa: Constante da Dívida vs. Cap Rate'
                : '2. Avoiding the Negative Leverage Trap: Loan Constant vs. Going-In Cap Rate'}
            </h3>
            <p>
              {isZh
                ? '许多新手投资者常犯的错误是仅仅对比“名义房贷利率”与“Cap Rate”。例如：以 5.75% 的固定利率贷款购买 6.00% Cap Rate 的物业，看似存在 25 bps 的正向利差。然而，商业贷款通常包含 25 年或 30 年的本金摊销。在 5.75% 利率、30 年等额还本付息条件下，年度贷款常数（Annual Debt Constant = 年还本付息总额 ÷ 贷款本金）高达 7.00%！因为 7.00% 的贷款常数远高于 6.00% 的进场 Cap Rate，每一元借款不仅没有放大股权回报，反而造成现金流净倒贴，导致首年现金回报率（Cash-on-Cash Return）被压缩至 4.0%–4.5%，并显著削弱偿债备付率（DSCR）。'
                : isEs
                ? 'Un error recurrente en adquisiciones es comparar la tasa nominal del préstamo contra el Cap Rate. Un préstamo al 5.75% amortizable a 30 años genera una constante anual de deuda del 7.00%. Dado que el 7.00% supera un Cap Rate de entrada del 6.00%, el apalancamiento es negativo en flujo de caja: cada dólar financiado reduce el retorno efectivo inicial (Cash-on-Cash) a niveles de 4.0%–4.5%, reduciendo el margen de cobertura DSCR.'
                : isPt
                ? 'Um equívoco frequente consiste em comparar apenas a taxa de juros nominal com o Cap Rate. Um financiamento com juros nominais de 5,75% amortizável em 30 anos gera uma constante anual da dívida de 7,00%. Como 7,00% excede um Cap Rate de 6,00%, a alavancagem é negativa em fluxo de caixa, derrubando o retorno de caixa (Cash-on-Cash) para 4,0%–4,5% e comprimindo o DSCR.'
                : 'A critical mistake in commercial underwriting is comparing the nominal mortgage interest rate directly against the Going-In Cap Rate. For instance, securing a loan at 5.75% fixed interest on a 6.00% cap rate asset appears to offer a 25 bps positive spread. However, because commercial mortgages include principal amortization, a 5.75% loan amortized over 30 years generates an Annual Debt Constant (Annual P&I ÷ Loan Amount) of 7.00%. Because the 7.00% debt constant exceeds the 6.00% unleveraged yield, the debt exerts negative cash-flow leverage, compressing Year-1 Cash-on-Cash yields down to 4.0%–4.5% and reducing debt service coverage.'}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">
              {isZh
                ? '3. 机构审贷员如何根据个盘风险校准基准 Cap Rate'
                : isEs
                ? '3. Cómo Ajustan los Analistas Institucionales los Cap Rates de Referencia'
                : isPt
                ? '3. Como Analistas Institucionais Calibram os Cap Rates de Referência'
                : '3. How Institutional Underwriters Adjust Benchmark Cap Rates for Individual Assets'}
            </h3>
            <p>
              {isZh
                ? '宏观都市圈基准（如 Austin Class A 多户 5.25%–6.00%）仅是尽调起步参考。在实际承销中，分析师会根据四个微观维度对基准利差进行加减校准：'
                : isEs
                ? 'Los rangos metropolitanos son solo un punto de partida. En la práctica, los analistas ajustan el Cap Rate objetivo considerando cuatro variables específicas del activo:'
                : isPt
                ? 'As faixas metropolitanas são apenas a partida. Na prática, analistas calibram o Cap Rate de avaliação com base em quatro fatores determinantes do imóvel:'
                : 'Metropolitan benchmark ranges serve solely as an initial underwriting baseline. In practice, institutional investment committees adjust target capitalization rates by evaluating four micro-level asset attributes:'}
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>{isZh ? '加权平均剩余租期 (WALT)：' : isEs ? 'Plazo Remanente de Contrato (WALT): ' : isPt ? 'Prazo Remanescente do Contrato (WALT): ' : 'Weighted Average Lease Term (WALT): '}</strong>
                {isZh
                  ? '租约剩余不足 3–5 年的商业物业需上浮 50–100 bps 贴现，以覆盖租客退租再招商的免租期与中介佣金成本。'
                  : isEs
                  ? 'Contratos con menos de 3–5 años remanentes exigen un incremento de 50 a 100 bps para absorber costos de reacondicionamiento y comisiones de corretaje.'
                  : isPt
                  ? 'Contratos com menos de 3 a 5 anos restantes exigem um prêmio de 50 a 100 bps para absorver desocupação e comissões imobiliárias.'
                  : 'Assets with under 3–5 years of remaining lease term require a 50 to 100 bps cap rate expansion to account for tenant turnover capital, leasing commissions (LCs), and concession downtime.'}
              </li>
              <li>
                <strong>{isZh ? '交易后房产税重新评估 (Tax Reassessment)：' : isEs ? 'Revaluación de Impuestos Prediales: ' : isPt ? 'Reavaliação de Impostos Prediais: ' : 'Post-Closing Property Tax Reassessment: '}</strong>
                {isZh
                  ? '在得克萨斯（Austin/Dallas）和佛罗里达（Miami）等无州个人所得税的州，地方评估所通常在过户后将评估价提升至成交价的 85%–95%，若沿用卖家历史税单将导致测算收益率严重失真。'
                  : isEs
                  ? 'En estados sin impuesto estatal sobre la renta como Texas o Florida, el valor catastral suele revaluarse al 85%–95% del precio de venta tras el cierre.'
                  : isPt
                  ? 'Em estados como Texas ou Flórida, o valor venal costuma ser reavaliado para 85% a 95% do preço de venda após o fechamento.'
                  : 'In states without personal income taxes (e.g., Texas and Florida), appraisal districts aggressively reassess taxable value toward 85%–95% of purchase price, shifting net yields downward if historical tax bills are used.'}
              </li>
              <li>
                <strong>{isZh ? '资本重置储备金 (CapEx Replacement Reserves)：' : isEs ? 'Reservas de Reposición de Capital: ' : isPt ? 'Reservas de Reposição de Capital: ' : 'Recurring Capital Replacement Reserves: '}</strong>
                {isZh
                  ? '严格在 NOI 中扣除公寓每户每年 $250–$450、工业厂房每平方英尺 $0.15–$0.25 的结构与设备储备。'
                  : isEs
                  ? 'Descontar obligatoriamente entre $250 y $450 por unidad en multifamiliar y $0.15–$0.25 por pie cuadrado en industrial.'
                  : isPt
                  ? 'Deduzir obrigatoriamente entre US$ 250 e US$ 450 por unidade em residencial e US$ 0,15–US$ 0,25 por pé quadrado em galpões.'
                  : 'Deducting mandatory recurring reserves ($250–$450/unit for multifamily; $0.15–$0.25/SF for industrial) directly before calculating sustainable NOI.'}
              </li>
              <li>
                <strong>{isZh ? '次级市场流动性折价 (Liquidity Spread)：' : isEs ? 'Prima por Iliquidez Secundaria: ' : isPt ? 'Prêmio de Iliquidez Secundária: ' : 'Secondary Market Liquidity Spread: '}</strong>
                {isZh
                  ? '从 Tier 1 门户城市向 Tier 3/4 偏远都会区过渡时，按层级递增 75 到 200 bps 的退出收益率折价，确保再融资与退出抗周期性。'
                  : isEs
                  ? 'Ampliar el Cap Rate entre 75 y 200 bps al salir de mercados principales hacia áreas metropolitanas de menor escala.'
                  : isPt
                  ? 'Expandir o Cap Rate entre 75 e 200 bps ao transitar de praças principais para áreas metropolitanas menores.'
                  : 'Expanding exit capitalization rate assumptions by 75 to 200 bps when transitioning from primary gateway metros to tertiary markets to protect refinancing viability.'}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Individual City Deep Dives */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            {isZh
              ? '重点城市商业地产 Cap Rate 专项指南'
              : isEs
              ? 'Guías Especializadas de Cap Rate por Ciudad'
              : isPt
              ? 'Guias Especializados de Cap Rate por Cidade'
              : 'Key Metro Cap Rate Benchmark Deep Dives'}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isZh
              ? '深入各大热门都会区，探索本地经济驱动因素、细分物业利差与承销测算案例：'
              : isEs
              ? 'Explore en detalle los motores económicos locales, diferenciales por tipo de activo y ejemplos de evaluación para los principales mercados de inversión:'
              : isPt
              ? 'Explore em detalhes os motores econômicos locais, diferenciais por tipo de ativo e exemplos de avaliação para os principais mercados de investimento:'
              : 'Explore detailed local economic drivers, asset-class spreads, and underwriting examples for high-volume investment markets:'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/austin-tx-cap-rates/`}
            className="p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group block bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {isZh ? 'Tier 2 科技都会区' : isEs ? 'Metrópoli Tecnológica Tier 2' : isPt ? 'Metrópole Tecnológica Tier 2' : 'Tier 2 Tech Metro'}
                </span>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 mt-2 text-base">Austin, TX</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isZh
                    ? '教学示意区间：多户 5.25% - 6.00% · 工业 5.50% - 6.25%'
                    : isEs
                    ? ' Ejemplo ilustrativo: Multifamiliar 5.25% - 6.00% · Industrial 5.50% - 6.25%'
                    : isPt
                    ? 'Exemplo ilustrativo: Multifamiliar 5.25% - 6.00% · Industrial 5.50% - 6.25%'
                    : 'Illustrative example: Multifamily 5.25% - 6.00% · Industrial 5.50% - 6.25%'}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/miami-fl-cap-rates/`}
            className="p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group block bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {isZh ? '门户枢纽与高增长都会区' : isEs ? 'Metrópoli Gateway de Alto Crecimiento' : isPt ? 'Metrópole Gateway de Alto Crescimento' : 'Gateway Growth Metro'}
                </span>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 mt-2 text-base">Miami, FL</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isZh
                    ? '教学示意区间：多户 5.00% - 5.75% · 工业 5.25% - 6.00%'
                    : isEs
                    ? 'Ejemplo ilustrativo: Multifamiliar 5.00% - 5.75% · Industrial 5.25% - 6.00%'
                    : isPt
                    ? 'Exemplo ilustrativo: Multifamiliar 5.00% - 5.75% · Industrial 5.25% - 6.00%'
                    : 'Illustrative example: Multifamily 5.00% - 5.75% · Industrial 5.25% - 6.00%'}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/dallas-tx-cap-rates/`}
            className="p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group block bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {isZh ? '全美物流与企业总部超级枢纽' : isEs ? 'Megacentro Logístico y Corporativo' : isPt ? 'Megacentro Logístico e Corporativo' : 'Logistics & Corporate Mega Hub'}
                </span>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 mt-2 text-base">Dallas - Fort Worth, TX</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isZh
                    ? '教学示意区间：多户 5.50% - 6.25% · 工业 5.60% - 6.30%'
                    : isEs
                    ? 'Ejemplo ilustrativo: Multifamiliar 5.50% - 6.25% · Industrial 5.60% - 6.30%'
                    : isPt
                    ? 'Exemplo ilustrativo: Multifamiliar 5.50% - 6.25% · Industrial 5.60% - 6.30%'
                    : 'Illustrative example: Multifamily 5.50% - 6.25% · Industrial 5.60% - 6.30%'}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/phoenix-az-cap-rates/`}
            className="p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group block bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {isZh ? '半导体制造与阳光带人口净流入' : isEs ? 'Semiconductores y Atracción del Sunbelt' : isPt ? 'Semicondutores e Atração do Sunbelt' : 'Semiconductor & Sunbelt Inflow'}
                </span>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 mt-2 text-base">Phoenix, AZ</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isZh
                    ? '教学示意区间：多户 5.40% - 6.15% · 工业 5.50% - 6.25%'
                    : isEs
                    ? 'Ejemplo ilustrativo: Multifamiliar 5.40% - 6.15% · Industrial 5.50% - 6.25%'
                    : isPt
                    ? 'Exemplo ilustrativo: Multifamiliar 5.40% - 6.15% · Industrial 5.50% - 6.25%'
                    : 'Illustrative example: Multifamily 5.40% - 6.15% · Industrial 5.50% - 6.25%'}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </section>

      {/* Supplementary Note for US Chinese Investors (ZH Only) */}
      {content.chineseInvestorContent && (
        <section className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 md:p-8 space-y-3 shadow-xs">
          <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
            <span>💡</span>
            {content.chineseInvestorTitle}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed whitespace-pre-line">
            {content.chineseInvestorContent}
          </p>
        </section>
      )}

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

      {/* Data Sources Citations Section */}
      <section className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 space-y-6">
        {content.methodologyTitle && (
          <div className="space-y-2 mb-6 border-b border-slate-200 pb-4">
            <h3 className="text-sm font-bold text-slate-900">{content.methodologyTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{content.methodologyContent}</p>
          </div>
        )}

        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-600" />
          {content.dataSourcesTitle}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 list-disc list-inside">
          {content.dataSources.map((source, idx) => (
            <li key={idx} className="leading-relaxed font-mono text-[11px] text-slate-600">
              {typeof source === 'string' ? (
                <span>{source}</span>
              ) : (
                <div className="inline-flex flex-col gap-0.5 ml-1 align-top">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-600 hover:underline">
                    {source.org} - {source.reportName}
                  </a>
                  <span className="text-slate-400">
                    {isZh
                      ? `发布日期: ${source.date} · 查阅日期: ${source.accessed}`
                      : isEs
                      ? `Publicado: ${source.date} · Consultado: ${source.accessed}`
                      : isPt
                      ? `Publicado: ${source.date} · Consultado: ${source.accessed}`
                      : `Published: ${source.date} · Accessed: ${source.accessed}`}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Related Calculators */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white">{content.relatedTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    </article>
  );
}
