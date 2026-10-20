import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { NoiCalculator } from '@/components/calculators/NoiCalculator';
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
  const content = getContent(locale).noi;

  return buildSeoMetadata({
    path: 'calculators/noi',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function NoiPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).noi;
  const isZh = locale === 'zh';

  const homeLabel = locale === 'zh' ? '首页' : locale === 'es' ? 'Inicio' : locale === 'pt' ? 'Início' : 'Home';

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/noi/`,
    locale
  );

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: homeLabel, url: `${SITE_URL}/${locale}/` },
    { name: content.h1, url: `${SITE_URL}/${locale}/calculators/noi/` },
  ]);

  const faqSchema = getFaqPageJsonLd(content.faqs);

  const nextSteps = {
    label: locale === 'zh' ? '后续计算步骤：' : locale === 'es' ? 'Siguientes Pasos de Cálculo:' : locale === 'pt' ? 'Próximas Etapas de Cálculo:' : 'Next Calculation Steps:',
    capRate: locale === 'zh' ? '计算 Cap Rate' : locale === 'es' ? 'Calculadora de Cap Rate' : locale === 'pt' ? 'Calculadora de Cap Rate' : 'Cap Rate Calculator',
    coc: locale === 'zh' ? '计算 Cash-on-Cash' : locale === 'es' ? 'Calculadora de Cash-on-Cash' : locale === 'pt' ? 'Calculadora de Cash-on-Cash' : 'Cash-on-Cash Return',
    dscr: locale === 'zh' ? '测算 DSCR 偿债覆盖率' : locale === 'es' ? 'Calculadora de DSCR' : locale === 'pt' ? 'Calculadora de DSCR' : 'DSCR Debt Coverage',
  };

  const workedExampleByLocale = {
    en: {
      title: 'Worked Commercial Property Example',
      intro: 'Consider a hypothetical 24-unit multifamily property purchased for $2,800,000. To calculate its NOI, we only look at property-level operations:',
      p1: 'Gross potential income: $336,000',
      p2: 'Vacancy loss: 5% ($16,800)',
      p3: 'Effective gross income (EGI): $319,200',
      p4: 'Operating expenses: $92,000',
      calc: 'Calculation: NOI = $319,200 (EGI) - $92,000 (OpEx) = $227,200',
      note: 'Note that we explicitly ignore the mortgage here. Once you have this $227,200 NOI, your typical next step is to use it to ',
      capLink: 'calculate the property\'s Cap Rate',
      orText: ' or ',
      dscrLink: 'measure your loan\'s DSCR',
    },
    zh: {
      title: '商业地产分析案例 (Illustrative Example)',
      intro: '假设您正在评估一处 24 单元的多户住宅物业（24-unit multifamily），购买价为 $2,800,000。要计算其 NOI，我们只需要关注物业自身的运营表现：',
      p1: '年潜在毛收入: $336,000',
      p2: '空置率: 5% ($16,800)',
      p3: '有效毛收入 (EGI): $319,200',
      p4: '年度运营费用: $92,000',
      calc: '计算 NOI = $319,200 (EGI) - $92,000 (OpEx) = $227,200',
      note: '注意：我们在此不扣除房贷。得到 $227,200 的 NOI 后，您的下一步通常是利用这个数字来 ',
      capLink: '计算物业的 Cap Rate',
      orText: ' 或 ',
      dscrLink: '测量贷款的 DSCR',
    },
    es: {
      title: 'Caso Práctico en Bienes Raíces Comerciales',
      intro: 'Considere una propiedad multifamiliar hipotética de 24 unidades adquirida por $2,800,000. Para calcular su NOI, nos enfocamos exclusivamente en la operación directa del activo:',
      p1: 'Ingreso potencial bruto: $336,000',
      p2: 'Pérdida por vacancia: 5% ($16,800)',
      p3: 'Ingreso bruto efectivo (EGI): $319,200',
      p4: 'Gastos operativos anuales: $92,000',
      calc: 'Cálculo: NOI = $319,200 (EGI) − $92,000 (OpEx) = $227,200',
      note: 'Nota: En este punto se excluyen deliberadamente las cuotas hipotecarias. Tras obtener los $227,200 de NOI, el siguiente paso típico es utilizar esta cifra para ',
      capLink: 'calcular el Cap Rate del inmueble',
      orText: ' o ',
      dscrLink: 'medir el DSCR de la hipoteca',
    },
    pt: {
      title: 'Exemplo Prático em Imóveis Comerciais',
      intro: 'Considere um imóvel multifamiliar hipotético de 24 unidades adquirido por $2.800.000. Para calcular o NOI, focamos unicamente no desempenho operacional do ativo:',
      p1: 'Receita potencial bruta: $336.000',
      p2: 'Perda por vacância: 5% ($16.800)',
      p3: 'Receita bruta efetiva (EGI): $319.200',
      p4: 'Despesas operacionais anuais: $92.000',
      calc: 'Cálculo: NOI = $319.200 (EGI) − $92.000 (OpEx) = $227.200',
      note: 'Nota: Ignoramos expressamente as parcelas do empréstimo nesta etapa. Ao apurar o NOI de $227.200, a etapa seguinte usual é utilizá-lo para ',
      capLink: 'calcular o Cap Rate do imóvel',
      orText: ' ou ',
      dscrLink: 'medir o DSCR do financiamento',
    },
  };

  const ex = workedExampleByLocale[locale as keyof typeof workedExampleByLocale] || workedExampleByLocale.en;

  const pitfallsByLocale = {
    en: {
      title: 'Critical NOI Calculation Pitfalls & Exclusions',
      item1: '1. Never Deduct Mortgage Payments: NOI strictly measures pure property operating cash flow before debt service. Debt payments are deducted only when calculating net cash flow.',
      item2: '2. Operating Expenses vs. Capital Improvements: Routine maintenance belongs in OpEx; structural roof replacement or elevator overhaul is CapEx and capitalized over time.',
    },
    zh: {
      title: 'NOI 计算中的常见扣除项误区',
      item1: '1. 严禁扣除贷款本息：NOI 衡量的是资产本身的运营创收能力，贷款还本付息属于融资结构成本（在计算 Cash Flow 与 DSCR 时扣除）。',
      item2: '2. 区分资本性支出 (CapEx) 与常规维修：更换整个屋顶或升级电梯属于 CapEx，不计入日常运营开支 (OpEx)；但必须为未来的重置准备金留出合理预算。',
    },
    es: {
      title: 'Errores Críticos en la Deducción y Cálculo del NOI',
      item1: '1. Nunca deduzca las cuotas de hipoteca: El NOI mide estrictamente el flujo operativo de la propiedad antes del servicio de la deuda. Los pagos del crédito se descuentan únicamente al determinar el flujo de caja neto.',
      item2: '2. Diferenciar gastos operativos (OpEx) de mejoras de capital (CapEx): El mantenimiento rutinario pertenece a OpEx; sustituir un tejado completo o renovar ascensores es CapEx y se amortiza en el tiempo.',
    },
    pt: {
      title: 'Erros Críticos na Dedução e no Cálculo do NOI',
      item1: '1. Nunca deduza as parcelas da hipoteca: O NOI afere com rigor o fluxo operacional da propriedade antes do serviço da dívida. Parcelas de empréstimo são deduzidas exclusivamente na apuração do fluxo de caixa líquido.',
      item2: '2. Diferenciar despesas operacionais (OpEx) de investimentos de capital (CapEx): A manutenção preventiva integra o OpEx; a substituição integral de telhado ou elevadores é CapEx e amortizada contabilmente ao longo do tempo.',
    },
  };

  const pit = pitfallsByLocale[locale as keyof typeof pitfallsByLocale] || pitfallsByLocale.en;

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

      {/* Interactive Tool */}
      <section id="tool">
        <NoiCalculator locale={locale} />
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
            <span className="font-semibold text-slate-700">{nextSteps.label}</span>
            <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-medium">
              {nextSteps.capRate}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-medium">
              {nextSteps.coc}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-medium">
              {nextSteps.dscr}
            </Link>
          </div>
        </section>

        {/* Formula */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.formulaTitle}</h2>
          <div className="bg-slate-900 text-emerald-400 font-mono text-sm sm:text-base p-4 rounded-xl shadow-inner whitespace-pre-line">
            <code>{content.formulaCode}</code>
          </div>
          <div className="space-y-2 pt-2">
            {content.formulaVariables.map((v, idx) => (
              <div key={idx} className="text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="font-bold text-slate-900 sm:min-w-[180px]">{v.label}:</span>
                <span className="text-slate-600 break-words">{v.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Worked Example */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{ex.title}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
            <p>{ex.intro}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{ex.p1}</li>
              <li>{ex.p2}</li>
              <li>{ex.p3}</li>
              <li>{ex.p4}</li>
            </ul>
            <p className="font-semibold text-slate-900 mt-2">
              {ex.calc}
            </p>
            <p className="mt-2">
              {ex.note}
              <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-semibold">{ex.capLink}</Link>
              {ex.orText}
              <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">{ex.dscrLink}</Link>.
            </p>
          </div>
        </section>

        {/* Pitfalls & Limitations */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {pit.title}
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
            <p>{pit.item1}</p>
            <p>{pit.item2}</p>
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

        {/* NOI Guide Banner */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              {locale === 'zh'
                ? '怎么估算 NOI 指南（没有历史财务数据时）'
                : locale === 'es'
                ? 'Guía: Cómo Estimar el NOI (Sin Balances Históricos)'
                : locale === 'pt'
                ? 'Guia: Como Estimar o NOI (Mesmo sem Histórico Financeiro)'
                : 'How to Estimate NOI Guide (Even Without Financials)'}
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {locale === 'zh'
                ? '当卖家的数字不完整、被美化过、或者干脆没有历史账本时，如何重新测算真实 NOI。'
                : locale === 'es'
                ? 'Un marco práctico para reconstruir el ingreso operativo neto cuando las cifras del vendedor son incompletas o inexistentes.'
                : locale === 'pt'
                ? 'Um método prático para reconstruir a receita operacional líquida quando os números do vendedor estão incompletos ou indisponíveis.'
                : 'A practical framework for reconstructing NOI when seller numbers are incomplete or nonexistent.'}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/how-to-estimate-noi/`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            <span>
              {locale === 'zh'
                ? '阅读估算指南'
                : locale === 'es'
                ? 'Leer Guía Completa'
                : locale === 'pt'
                ? 'Ler Guia Completo'
                : 'Read Guide'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Deal Analyzer Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isZh
                  ? '从 NOI 进入完整承销'
                  : locale === 'es'
                  ? 'Del NOI al Análisis Integral'
                  : locale === 'pt'
                  ? 'Do NOI à Análise Completa'
                  : 'From NOI to Full Underwriting'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {isZh
                  ? '用同一组数据继续测算完整交易'
                  : locale === 'es'
                  ? 'Lleve este NOI al Análisis Integral de la Inversión'
                  : locale === 'pt'
                  ? 'Leve este NOI para a Análise Completa do Negócio'
                  : 'Carry This NOI into a Complete Deal Analysis'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isZh
                  ? '在 Deal Analyzer 中结合购买价、融资条件与现金投入，同步计算 Cap Rate、Cash-on-Cash、DSCR 和 Break-Even Ratio，并对空置率与利率进行压力测试。'
                  : locale === 'es'
                  ? 'Combine el NOI con precio de compra, financiamiento y capital invertido para calcular Cap Rate, Cash-on-Cash, DSCR y Break-Even Ratio, aplicando pruebas de estrés.'
                  : locale === 'pt'
                  ? 'Combine o NOI com preço de compra, financiamento e capital investido para calcular Cap Rate, Cash-on-Cash, DSCR e Break-Even Ratio com testes de estresse.'
                  : 'Combine NOI with purchase price, financing, and invested cash to calculate Cap Rate, Cash-on-Cash, DSCR, and Break-Even Ratio, then stress-test vacancy and interest rates.'}
              </p>
            </div>
            <Link
              href={`/${locale}/tools/deal-analyzer/`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              <span>
                {isZh
                  ? '打开 Deal Analyzer'
                  : locale === 'es'
                  ? 'Abrir Deal Analyzer'
                  : locale === 'pt'
                  ? 'Abrir Deal Analyzer'
                  : 'Continue in Deal Analyzer'}
              </span>
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
