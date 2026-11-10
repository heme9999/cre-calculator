import React from 'react';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';
import { CapRateCalculator } from '@/components/calculators/CapRateCalculator';
import { JsonLd, getCalculatorJsonLd, getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, BookOpen, AlertTriangle, Building, Layers, CheckCircle } from 'lucide-react';
import { ComplianceDisclaimer } from '@/components/common/ComplianceDisclaimer';
import { PropertyCapRateContent } from '@/content/propertyCapRates';

interface Props {
  content: PropertyCapRateContent;
  locale: string;
}

export function PropertyCapRatePageTemplate({ content, locale }: Props) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const fullUrl = `${SITE_URL}/${locale}/calculators/${content.slug}/`;

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    fullUrl,
    locale
  );

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home', url: `${SITE_URL}/${locale}/` },
    {
      name: isZh
        ? 'Cap Rate 计算器'
        : isEs
        ? 'Calculadora de Cap Rate'
        : isPt
        ? 'Calculadora de Cap Rate'
        : 'Cap Rate Calculator',
      url: `${SITE_URL}/${locale}/calculators/cap-rate/`,
    },
    { name: content.h1, url: fullUrl },
  ]);

  const faqSchema = getFaqPageJsonLd(content.faqs);

  return (
    <article className="space-y-10 py-4">
      <JsonLd data={[calculatorSchema, breadcrumbSchema, faqSchema]} />

      {/* Page Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2 flex-wrap">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">
            {isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/calculators/cap-rate/`} className="hover:text-emerald-600">
            {isZh ? 'Cap Rate 计算器' : isEs ? 'Calculadora de Cap Rate' : isPt ? 'Calculadora de Cap Rate' : 'Cap Rate'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{content.propertyTypeName}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <Building className="w-3.5 h-3.5" />
            <span>{content.propertyTypeName}</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {isZh
              ? '教学示例承销区间: '
              : isEs
              ? 'Rango Ilustrativo de Modelado: '
              : isPt
              ? 'Faixa Ilustrativa de Modelagem: '
              : 'Illustrative Modeling Range: '}
            {content.benchmarkRange}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {content.h1}
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          {content.subtitle}
        </p>
      </header>

      {/* Interactive Calculator Tool */}
      <section id="tool">
        <CapRateCalculator
          locale={locale}
          defaultPrice={content.defaultPrice}
          defaultNoi={content.defaultNoi}
        />
      </section>

      {/* Content Body Section */}
      <div className="max-w-4xl space-y-12">
        {/* What Is & Market Context */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            {content.whatIsTitle}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {content.whatIsContent}
          </p>

          <div className="pt-2 text-xs text-slate-500 flex flex-wrap gap-2 items-center">
            <span className="font-semibold text-slate-700">
              {isZh ? '关键关联工具：' : isEs ? 'Herramientas Relacionadas:' : isPt ? 'Ferramentas Relacionadas:' : 'Key Related Workflow:'}
            </span>
            <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? '通用 Cap Rate 计算器' : isEs ? 'Cap Rate Universal' : isPt ? 'Cap Rate Universal' : 'Universal Cap Rate'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'NOI 计算器' : isEs ? 'Calculadora de NOI' : isPt ? 'Calculadora de NOI' : 'NOI Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'DSCR 偿债覆盖率' : isEs ? 'Calculadora de DSCR' : isPt ? 'Calculadora de DSCR' : 'DSCR Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'Deal Analyzer 综合尽调' : isEs ? 'Deal Analyzer' : isPt ? 'Deal Analyzer' : 'Deal Analyzer'}
            </Link>
          </div>
        </section>

        {/* Property Type Underwriting Drivers */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            {content.metricsExploration.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {content.metricsExploration.points.map((pt, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pt.label}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{pt.text || pt.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Asset-Specific Valuation Framework & Universal Link */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {content.slug === 'multifamily-cap-rate'
                ? (isZh ? '多户住宅特有估值指标与单套经济模型' : isEs ? 'Métricas Clave de Valuación Multifamiliar y Modelo por Unidad' : isPt ? 'Métricas Principais de Avaliação Multifamiliar e Modelo por Unidade' : 'Multifamily Valuation Metrics & Per-Unit Economics')
                : content.slug === 'industrial-cap-rate'
                ? (isZh ? '工业与仓储物流 NNN 租约回收核算机制' : isEs ? 'Mecanismo de Arrendamiento NNN y Recuperación de Gastos Industriales' : isPt ? 'Mecanismo de Contratos NNN e Recuperação de Despesas Industriais' : 'Industrial NNN Lease Pass-Through & Recovery Dynamics')
                : content.slug === 'self-storage-cap-rate'
                ? (isZh ? '自助仓储 RevPAU 租金密度与经济出租率框架' : isEs ? 'Densidad de Renta RevPAU y Ocupación Económica en Self-Storage' : isPt ? 'Densidade de Receita RevPAU e Ocupação Econômica em Self-Storage' : 'Self-Storage Revenue Density (RevPAU) & Economic Occupancy')
                : (isZh ? '单租户净租约 (STNL) 类似债券利差定价模型' : isEs ? 'Modelo de Valuación de Renta NNN Simil-Bono y Riesgo Crediticio' : isPt ? 'Modelo de Avaliação de Renda NNN Similar a Títulos de Dívida' : 'Single-Tenant Net Lease (STNL) Bond-Equivalent Spread Framework')}
            </h2>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {content.propertyTypeName}
            </span>
          </div>

          <div className="bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm p-4 rounded-xl shadow-inner space-y-1">
            {content.slug === 'multifamily-cap-rate' && (
              <>
                <div>Economic Occupancy (%) = [ Actual Collected Rent / Gross Potential Rent ] × 100</div>
                <div>Sustainable NOI = Effective Gross Income − Operating Expenses − Capital Replacement Reserve</div>
              </>
            )}
            {content.slug === 'industrial-cap-rate' && (
              <>
                <div>Net Operating Income (NOI) = Base NNN Rent − Non-Recoverable Structural Reserves − Vacancy Allowance</div>
                <div>Pass-Through Recovery Rate (%) = [ Reimbursed CAM & Taxes / Incurred Operating Expenses ] × 100</div>
              </>
            )}
            {content.slug === 'self-storage-cap-rate' && (
              <>
                <div>RevPAU ($/Unit) = Total Storage Operating Revenue / Total Available Rentable Units</div>
                <div>Economic Occupancy (%) = [ Billed Collected Storage Rent / Gross Potential Street Rate Rent ] × 100</div>
              </>
            )}
            {content.slug === 'nnn-lease-cap-rate' && (
              <>
                <div>Going-In NNN Cap Rate (%) = [ Year-1 Net Contract Rent / Purchase Price ] × 100</div>
                <div>STNL Credit Spread (bps) = [ NNN Cap Rate − 10-Year U.S. Treasury Yield ] × 10,000</div>
              </>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
            <p>
              {content.slug === 'multifamily-cap-rate' && (
                isZh
                  ? '在多户型公寓承销中，仅看表面名义物理出租率（Physical Occupancy）往往会掩盖免租期折扣与欠租损失。机构审贷员（如 Fannie Mae DUS）严格依据实际收缴的租金核算经济出租率，并在 NOI 中强制扣除每门每套 $250–$450/年的重置储备金。'
                  : isEs
                  ? 'En activos multifamiliares, la ocupación física puede enmascarar concesiones de renta y morosidad. Los prestamistas institucionales descuentan reservas de reemplazo obligatorias ($250–$450 por unidad/año) antes de calcular el flujo sostenible.'
                  : isPt
                  ? 'Em imóveis multifamiliares, a ocupação física pode ocultar concessões de carência e inadimplência. Credores institucionais deduzem reservas obrigatórias de reposição ($250–$450 por unidade/ano) antes de projetar o NOI sustentável.'
                  : 'In multifamily underwriting, physical occupancy often masks concession burn-off and bad debt. Institutional lenders evaluate economic occupancy and require mandatory annual replacement reserves ($250–$450/unit) before certifying sustainable NOI.'
              )}
              {content.slug === 'industrial-cap-rate' && (
                isZh
                  ? '现代仓储物流主要采用三净（Triple Net, NNN）租约，租户全额承担地税、建筑保险与园区公摊日常维护（CAM）。但房东必须扣除非租户承担的屋顶结构与地坪沉降维护储备金，以防租约到期时产生巨额资本缺口。'
                  : isEs
                  ? 'Las naves industriales operan bajo contratos NNN donde el inquilino asume impuestos, seguros y mantenimiento común. No obstante, el propietario debe presupuestar reservas estructurales de techo y patio de maniobras que no son reembolsables.'
                  : isPt
                  ? 'Galpões logísticos operam sob contratos NNN onde o inquilino arca com impostos, seguros e condomínio. O proprietário deve, contudo, reservar verbas estruturais para telhados e pátios de carretas que não são reembolsáveis.'
                  : 'Modern logistics facilities rely on NNN leases where tenants reimburse taxes, insurance, and CAM. However, landlords must budget for non-recoverable roof and truck-court structural reserves to prevent deferred capital shocks upon lease expiration.'
              )}
              {content.slug === 'self-storage-cap-rate' && (
                isZh
                  ? '自助仓储无厨房和卫生间管线，日常维保极为精简（运营费用率通常仅 28%–36%）。但由于租约均为按月签约，新增本地竞品设施可迅速侵蚀挂牌租金（Street Rates），必须重点核查 3–5 英里核心辐射圈内的新增供应与存量租客加价（ECRI）能力。'
                  : isEs
                  ? 'El autoalmacenamiento opera con contratos mes a mes sin plomería por unidad, lo que permite ratios de gasto reducidos (28%–36%). La clave de valuación reside en la saturación de oferta en un radio de 3 a 5 millas y en aumentos a clientes existentes (ECRI).'
                  : isPt
                  ? 'O self-storage opera com contratos mensais e sem instalações hidráulicas por unidade, mantendo despesas enxutas (28%–36%). A chave da avaliação reside na saturação de oferta num raio de 3 a 5 milhas e aumentos a locatários existentes (ECRI).'
                  : 'Self-storage operates on 30-day agreements with no internal plumbing fixtures per unit, enabling lean operating expense ratios (28%–36%). Valuation hinges on 3–5 mile radius supply pipeline saturation and existing customer rate increase (ECRI) durability.'
              )}
              {content.slug === 'nnn-lease-cap-rate' && (
                isZh
                  ? '单租户商业净租约（STNL）的现金流特征与企业信用债高度相似。其资本化率利差直接锚定承租人的信用评级（投资级 vs 加盟商）以及剩余有效租约期限（WALT）。若剩余租期不足 5 年，必须准备租客退租后的全面重招商与免租期准备金。'
                  : isEs
                  ? 'Los inmuebles comerciales de inquilino único con contrato NNN (STNL) cotizan como instrumentos de renta fija corporativa. El Cap Rate depende directamente de la calificación crediticia del inquilino y del plazo remanente ponderado (WALT).'
                  : isPt
                  ? 'Imóveis comerciais de inquilino único sob contrato NNN (STNL) comportam-se como títulos de renda fixa corporativa. O Cap Rate depende diretamente do rating do locatário e do prazo remanescente do contrato (WALT).'
                  : 'Single-Tenant Net Leases (STNL) trade much like corporate fixed-income instruments. Cap rates are dictated by tenant credit rating (investment-grade vs franchisee) and remaining lease term (WALT), with steep cap rate expansion as leases approach maturity.'
              )}
            </p>

            <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {isZh ? '通用资本化率基础理论：' : isEs ? 'Fundamento Teórico Universal: ' : isPt ? 'Fundamento Teórico Universal: ' : 'Universal Mathematical Foundations: '}
              </span>
              <span>
                {isZh
                  ? '如需查阅资本化率的无杠杆贴现率数学推导、通用公式定义及跨业态横向对比，请参阅我们的'
                  : isEs
                  ? 'Para consultar la deducción matemática no apalancada, la definición universal y la comparación entre sectores, visite nuestra '
                  : isPt
                  ? 'Para consultar a dedução matemática desalavancada, a definição universal e a comparação entre setores, veja nossa '
                  : 'To review the foundational unleveraged capitalization rate proof, generic formula definitions, and cross-sector valuation theory, visit our '}
              </span>
              <Link
                href={`/${locale}/calculators/cap-rate/`}
                className="font-bold text-emerald-600 hover:text-emerald-700 underline ml-1"
              >
                {isZh ? '通用 Cap Rate 计算器与综合指南' : isEs ? 'Calculadora Universal de Cap Rate' : isPt ? 'Calculadora Universal de Cap Rate' : 'Universal Cap Rate Calculator & Guide'}
              </Link>
              .
            </div>
          </div>
        </section>

        {/* Worked Example */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.workedExample.title}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
            <p>{content.workedExample.intro}</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              {content.workedExample.points.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
            <p className="font-semibold text-slate-900 mt-2 pt-2 border-t border-slate-200">
              {content.workedExample.analysis}
            </p>
          </div>
        </section>

        {/* Pitfalls & Limitations */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {content.pitfallsTitle}
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-amber-900 leading-relaxed">
            {content.pitfalls.map((p, idx) => (
              <div key={idx}>
                <strong>{idx + 1}. {p.title}: </strong>
                <span>{p.desc || (p as unknown as { text?: string }).text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            {isZh ? '常见问题与专家答疑 (FAQs)' : isEs ? 'Preguntas Frecuentes (FAQs)' : isPt ? 'Perguntas Frequentes (FAQs)' : 'Frequently Asked Questions (FAQs)'}
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
              {isZh ? '商业地产 Cap Rate 承销参考指南' : isEs ? 'Guía de Escenarios Ilustrativos de Cap Rate' : isPt ? 'Guia de Cenários Ilustrativos de Cap Rate' : 'Cap Rate Underwriting Reference Guide'}
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {isZh
                ? '查看不同都市圈层级与资产类别的教学承销区间、费用结构与敏感度测算框架。'
                : isEs
                ? 'Explore los rangos ilustrativos de modelado financiero por tipo de activo y nivel de mercado metropolitano.'
                : isPt
                ? 'Explore as faixas ilustrativas de modelagem financeira por classe de imóvel e nível de mercado metropolitano.'
                : 'Explore illustrative underwriting ranges, expense structures, and sensitivity frameworks across property types and market tiers.'}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/cap-rate-benchmarks-by-city/`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            <span>{isZh ? '查看承销参考指南' : isEs ? 'Ver Guía de Referencia' : isPt ? 'Ver Guia de Referência' : 'View Reference Guide'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Deal Analyzer Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isZh ? '综合尽调系统' : isEs ? 'Suite Integral de Evaluación' : isPt ? 'Suite Completa de Análise' : 'Full Underwriting Suite'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {isZh ? '想同时测算该物业的全部核心投资指标？' : isEs ? '¿Desea Modelar el Análisis Financiero Completo con Pruebas de Estrés?' : isPt ? 'Deseja Modelar a Análise Financeira Completa com Testes de Estresse?' : 'Need Full Commercial Underwriting & Stress Testing?'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isZh
                  ? '使用 Deal Analyzer 综合工具，一次性算出 Cap Rate、NOI、DSCR、Cash-on-Cash 与盈亏平衡比率。'
                  : isEs
                  ? 'Calcule simultáneamente Cap Rate, NOI, DSCR y Cash-on-Cash a partir de un único conjunto de datos con exportación en PDF.'
                  : isPt
                  ? 'Calcule simultaneamente Cap Rate, NOI, DSCR e Cash-on-Cash a partir de uma única entrada de dados com exportação em PDF.'
                  : 'Run Cap Rate, NOI, DSCR, and Cash-on-Cash all together from a single set of inputs with PDF export.'}
              </p>
            </div>
            <Link
              href={`/${locale}/tools/deal-analyzer/`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              <span>{isZh ? '进入 Deal Analyzer' : isEs ? 'Abrir Deal Analyzer' : isPt ? 'Abrir Deal Analyzer' : 'Launch Deal Analyzer'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Other Property Types */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white">
            {isZh ? '其他商业物业类型 Cap Rate 计算器' : isEs ? 'Otras Calculadoras de Cap Rate por Tipo de Propiedad' : isPt ? 'Outras Calculadoras de Cap Rate por Tipo de Imóvel' : 'Other Property Type Cap Rate Calculators'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href={`/${locale}/calculators/cap-rate/`}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
            >
              <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                {isZh ? '通用 Cap Rate 计算器' : isEs ? 'Calculadora Universal de Cap Rate' : isPt ? 'Calculadora Universal de Cap Rate' : 'Universal Cap Rate Calculator'}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            {content.slug !== 'multifamily-cap-rate' && (
              <Link
                href={`/${locale}/calculators/multifamily-cap-rate/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {isZh ? 'Multifamily 多户住宅 Cap Rate' : isEs ? 'Cap Rate Multifamiliar' : isPt ? 'Cap Rate Multifamiliar' : 'Multifamily Cap Rate'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {content.slug !== 'industrial-cap-rate' && (
              <Link
                href={`/${locale}/calculators/industrial-cap-rate/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {isZh ? 'Industrial 工业与仓储物流 Cap Rate' : isEs ? 'Cap Rate Industrial y Logística' : isPt ? 'Cap Rate Industrial e Galpões' : 'Industrial & Warehouse Cap Rate'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {content.slug !== 'self-storage-cap-rate' && (
              <Link
                href={`/${locale}/calculators/self-storage-cap-rate/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {isZh ? 'Self-Storage 自助仓储 Cap Rate' : isEs ? 'Cap Rate Autoalmacenamiento (Self-Storage)' : isPt ? 'Cap Rate Self-Storage' : 'Self-Storage Cap Rate'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {content.slug !== 'nnn-lease-cap-rate' && (
              <Link
                href={`/${locale}/calculators/nnn-lease-cap-rate/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {isZh ? 'NNN 三净商业零售 Cap Rate' : isEs ? 'Cap Rate Contratos Net Lease (NNN)' : isPt ? 'Cap Rate Contratos Net Lease (NNN)' : 'NNN Lease Cap Rate'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </section>

        {/* Compliance & Legal Disclaimer */}
        <ComplianceDisclaimer locale={locale} />
      </div>
    </article>
  );
}
