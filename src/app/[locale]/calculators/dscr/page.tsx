import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { DscrCalculator } from '@/components/calculators/DscrCalculator';
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
  const content = getContent(locale).dscr;

  return buildSeoMetadata({
    path: 'calculators/dscr',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function DscrPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).dscr;

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/dscr/`,
    locale
  );

  const homeLabel = locale === 'zh' ? '首页' : locale === 'es' ? 'Inicio' : locale === 'pt' ? 'Início' : 'Home';

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: homeLabel, url: `${SITE_URL}/${locale}/` },
    { name: content.h1, url: `${SITE_URL}/${locale}/calculators/dscr/` },
  ]);

  const faqSchema = getFaqPageJsonLd(content.faqs);

  const workflowLabels = {
    chainLabel: locale === 'zh' ? '信贷与尽调闭环：' : locale === 'es' ? 'Flujo de Crédito y Debida Diligencia:' : locale === 'pt' ? 'Fluxo de Crédito e Due Diligence:' : 'Financing & Underwriting Chain:',
    loan: locale === 'zh' ? '商业贷款月供计算器' : locale === 'es' ? 'Calculadora de Pagos de Préstamos' : locale === 'pt' ? 'Calculadora de Financiamento' : 'Loan Payment Calculator',
    noi: locale === 'zh' ? 'NOI 净营业收入' : locale === 'es' ? 'Calculadora de NOI' : locale === 'pt' ? 'Calculadora de NOI' : 'NOI Calculator',
    dealAnalyzer: locale === 'zh' ? 'Deal Analyzer 全景尽调' : locale === 'es' ? 'Deal Analyzer Integral' : locale === 'pt' ? 'Deal Analyzer Completo' : 'Deal Analyzer',
  };

  const exampleContentByLocale = {
    zh: {
      title: '商业地产分析案例 (Illustrative Example)',
      intro: '假设您正在评估一处 24 单元的多户住宅物业（24-unit multifamily）。',
      noiPrefix: '净营业收入 (NOI): $227,200（详见 ',
      noiLink: '计算该物业的 NOI',
      noiSuffix: '）',
      debtPrefix: '年还本付息额 (Annual Debt Service): $170,152（基于 210万美元，6.5%利率贷款，详见 ',
      debtLink: '测算商业贷款',
      debtSuffix: '）',
      calc: '计算 DSCR = $227,200 (NOI) / $170,152 (贷款偿还) = 1.34x',
      desc1: '1.34x 是一个健康的比率，远超银行通常要求的 1.20x 门槛。确认债务安全后，你可以将扣除房贷后的剩余现金流用于 ',
      cocLink: '评估你的股权 Cash-on-Cash 现金回报',
      desc2: '，或前往 ',
      daLink: 'Deal Analyzer 工具',
      desc3: ' 测试在空置率上升时的抗压能力。',
    },
    es: {
      title: 'Caso Práctico en Bienes Raíces Comerciales',
      intro: 'Considere una propiedad multifamiliar hipotética de 24 unidades.',
      noiPrefix: 'Ingreso Operativo Neto (NOI): $227,200 (vea cómo ',
      noiLink: 'calculamos el NOI de esta propiedad',
      noiSuffix: ')',
      debtPrefix: 'Servicio Anual de la Deuda: $170,152 (basado en un préstamo de $2.1M al 6.5%, vea cómo ',
      debtLink: 'calculamos esta cuota de préstamo comercial',
      debtSuffix: ')',
      calc: 'Cálculo: DSCR = $227,200 (NOI) / $170,152 (Servicio de Deuda) = 1.34x',
      desc1: 'Un ratio de 1.34x es muy saludable, superando con holgura el umbral estándar de 1.20x que exigen la mayoría de los bancos. Una vez confirmada la solvencia de la deuda, puede utilizar el flujo de caja restante después de la hipoteca para ',
      cocLink: 'evaluar el retorno Cash-on-Cash sobre su capital',
      desc2: ', o dirigirse a la herramienta completa ',
      daLink: 'Deal Analyzer',
      desc3: ' para probar la resistencia de la cobertura ante mayores tasas de vacancia.',
    },
    pt: {
      title: 'Exemplo Prático em Imóveis Comerciais',
      intro: 'Considere um imóvel multifamiliar hipotético de 24 unidades.',
      noiPrefix: 'Receita Operacional Líquida (NOI): $227.200 (veja como ',
      noiLink: 'calculamos o NOI deste imóvel',
      noiSuffix: ')',
      debtPrefix: 'Serviço Anual da Dívida: $170.152 (com base em um financiamento de $2,1M a 6,5%, veja como ',
      debtLink: 'calculamos a parcela deste empréstimo comercial',
      debtSuffix: ')',
      calc: 'Cálculo: DSCR = $227.200 (NOI) / $170.152 (Serviço da Dívida) = 1,34x',
      desc1: 'Um índice de 1,34x é muito saudável, superando confortavelmente o requisito mínimo habitual de 1,20x da maioria dos credores. Uma vez confirmada a segurança da dívida, você pode usar o fluxo de caixa residual após o pagamento do empréstimo para ',
      cocLink: 'avaliar o retorno Cash-on-Cash sobre o capital próprio',
      desc2: ', ou acessar a ferramenta completa ',
      daLink: 'Deal Analyzer',
      desc3: ' para testar o estresse dessa cobertura contra aumentos na taxa de vacância.',
    },
    en: {
      title: 'Worked Commercial Property Example',
      intro: 'Consider a hypothetical 24-unit multifamily property.',
      noiPrefix: 'Net Operating Income (NOI): $227,200 (see how we ',
      noiLink: "calculated this property's NOI",
      noiSuffix: ')',
      debtPrefix: 'Annual Debt Service: $170,152 (based on a $2.1M loan at 6.5%, see how we ',
      debtLink: 'calculated this commercial loan payment',
      debtSuffix: ')',
      calc: 'Calculation: DSCR = $227,200 (NOI) / $170,152 (Debt Service) = 1.34x',
      desc1: "A 1.34x ratio is very healthy, comfortably exceeding most lenders' 1.20x minimum requirement. Once you confirm debt safety, you can use the remaining cash flow after debt to ",
      cocLink: 'evaluate your equity Cash-on-Cash Return',
      desc2: ', or head to the full ',
      daLink: 'Deal Analyzer tool',
      desc3: ' to stress-test this coverage against higher vacancy rates.',
    },
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || {
    title: 'Worked Commercial Property Example',
    intro: 'Consider a hypothetical 24-unit multifamily property.',
    noiPrefix: 'Net Operating Income (NOI): $227,200 (see how we ',
    noiLink: "calculated this property's NOI",
    noiSuffix: ')',
    debtPrefix: 'Annual Debt Service: $170,152 (based on a $2.1M loan at 6.5%, see how we ',
    debtLink: 'calculated this commercial loan payment',
    debtSuffix: ')',
    calc: 'Calculation: DSCR = $227,200 (NOI) / $170,152 (Debt Service) = 1.34x',
    desc1: "A 1.34x ratio is very healthy, comfortably exceeding most lenders' 1.20x minimum requirement. Once you confirm debt safety, you can use the remaining cash flow after debt to ",
    cocLink: 'evaluate your equity Cash-on-Cash Return',
    desc2: ', or head to the full ',
    daLink: 'Deal Analyzer tool',
    desc3: ' to stress-test this coverage against higher vacancy rates.',
  };

  const pitfallsByLocale = {
    zh: {
      title: 'DSCR 承销常见风险与压力测试要点',
      item1: '1. 浮动利率与加息风险：固定期结束后或采用浮动利率贷款时，利率上升 100-200 bps 可能直接将原本 1.25x 的安全 DSCR 压低至 1.0x 以下。',
      item2: '2. 租金违约与单一租户集中度：单租户商业物业若发生租约到期或租客破产，NOI 归零将导致 DSCR 瞬间崩塌，必须审查租客信用与租期剩余年限 (WALT)。',
    },
    es: {
      title: 'Riesgos en la Suscripción del DSCR y Pruebas de Estrés',
      item1: '1. Exposición a Tasa Flotante y Reajuste de Intereses: Un aumento de 100 a 200 bps al reiniciar o reajustar el préstamo puede erosionar rápidamente un DSCR saludable de 1.25x llevándolo a zona de impago (< 1.0x).',
      item2: '2. Concentración de Inquilinos y Vencimiento de Arrendamientos: Las propiedades monoinquilino enfrentan caídas catastróficas del DSCR si el arrendatario entra en quiebra. Realice siempre pruebas de estrés frente a aumentos localizados de vacancia.',
    },
    pt: {
      title: 'Riscos na Análise do DSCR e Testes de Estresse',
      item1: '1. Exposição a Juros Variáveis e Reajustes: Uma alta de 100 a 200 bps no vencimento do período fixo pode rapidamente empurrar um DSCR saudável de 1,25x para território de inadimplência (< 1,0x).',
      item2: '2. Concentração de Locatários e Fim de Contrato: Imóveis de locatário único enfrentam colapsos severos de DSCR em caso de inadimplência. Sempre teste a sensibilidade do ativo contra aumentos localizados de vacância.',
    },
    en: {
      title: 'DSCR Underwriting Pitfalls & Stress Testing',
      item1: '1. Floating Rate & Rate Reset Exposure: A 100–200 bps rate hike upon loan reset can rapidly erode a healthy 1.25x DSCR into debt service default territory (< 1.0x).',
      item2: '2. Tenant Concentration & Lease Expiry: Single-tenant properties face catastrophic DSCR drop if the tenant defaults. Always stress-test against localized vacancy spikes.',
    },
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || {
    title: 'DSCR Underwriting Pitfalls & Stress Testing',
    item1: '1. Floating Rate & Rate Reset Exposure: A 100–200 bps rate hike upon loan reset can rapidly erode a healthy 1.25x DSCR into debt service default territory (< 1.0x).',
    item2: '2. Tenant Concentration & Lease Expiry: Single-tenant properties face catastrophic DSCR drop if the tenant defaults. Always stress-test against localized vacancy spikes.',
  };

  const bannersByLocale = {
    zh: {
      daBadge: '综合分析工具',
      daTitle: '用 Deal Analyzer 完成包含 DSCR 的完整尽调测算',
      daDesc: '一次输入同步算出 Cap Rate、Cash-on-Cash、DSCR、Break-Even Ratio，支持压力测试与 PDF 导出。',
      daBtn: '打开 Deal Analyzer',
    },
    es: {
      daBadge: 'Herramienta Integral de Análisis',
      daTitle: 'Realice una Debida Diligencia Completa con DSCR en Deal Analyzer',
      daDesc: 'Calcule simultáneamente Cap Rate, Cash-on-Cash, DSCR y Break-Even Ratio con pruebas de estrés y exportación en PDF.',
      daBtn: 'Abrir Deal Analyzer',
    },
    pt: {
      daBadge: 'Ferramenta Completa de Análise',
      daTitle: 'Execute a Análise Completa com DSCR no Deal Analyzer',
      daDesc: 'Calcule simultaneamente Cap Rate, Cash-on-Cash, DSCR e Break-Even Ratio com testes de estresse e exportação em PDF.',
      daBtn: 'Abrir Deal Analyzer',
    },
    en: {
      daBadge: 'Full Underwriting Tool',
      daTitle: 'Run Complete Underwriting Including DSCR in Deal Analyzer',
      daDesc: 'Calculate Cap Rate, Cash-on-Cash, DSCR, and BER simultaneously with stress testing.',
      daBtn: 'Launch Deal Analyzer',
    },
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || {
    daBadge: 'Full Underwriting Tool',
    daTitle: 'Run Complete Underwriting Including DSCR in Deal Analyzer',
    daDesc: 'Calculate Cap Rate, Cash-on-Cash, DSCR, and BER simultaneously with stress testing.',
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

      {/* Interactive Tool */}
      <section id="tool">
        <DscrCalculator locale={locale} />
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
            <Link href={`/${locale}/calculators/loan-payment/`} className="text-emerald-600 hover:underline font-medium">
              {workflowLabels.loan}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-medium">
              {workflowLabels.noi}
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
          <h2 className="text-xl font-bold text-slate-900">{exampleContentByLocale.title}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              {exampleContentByLocale.intro}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{exampleContentByLocale.noiPrefix}
                <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline">{exampleContentByLocale.noiLink}</Link>
                {exampleContentByLocale.noiSuffix}
              </li>
              <li>{exampleContentByLocale.debtPrefix}
                <Link href={`/${locale}/calculators/loan-payment/`} className="text-emerald-600 hover:underline">{exampleContentByLocale.debtLink}</Link>
                {exampleContentByLocale.debtSuffix}
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

        {/* Chinese DSCR Loan Guide Banner (ZH ONLY) */}
        {locale === 'zh' && (
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                DSCR贷款指南：没有美国信用记录也能贷款买商业地产
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                针对华人投资者与境外身份的实操贷款指南，讲透申请流程、材料要求与首付比例。
              </p>
            </div>
            <Link
              href="/zh/guides/dscr-loan-guide-chinese-investors/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              <span>阅读贷款指南</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}

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
