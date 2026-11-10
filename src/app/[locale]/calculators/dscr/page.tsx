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
      title: '商业地产分析案例：200万美元商业物业信贷承销',
      intro: '假设您正在评估一处售价为 $2,000,000 的商业办公/多商户物业。',
      noiPrefix: '核准后净营业收入 (NOI): $150,000（详见 ',
      noiLink: '计算该物业的 NOI',
      noiSuffix: '）',
      debtPrefix: '年还本付息额 (Annual Debt Service): $121,536（基于 $1,500,000 贷款按 6.50% 利率、25年摊销测算，详见 ',
      debtLink: '测算商业贷款',
      debtSuffix: '）',
      calc: '计算 DSCR = $150,000 (NOI) ÷ $121,536 (年偿债额) = 1.23x',
      desc1: '1.23x 满足大多数商业银行 1.20x–1.25x 的放贷基准线。确认债务安全后，你可以将扣除房贷后的每年 $28,464 剩余现金流用于 ',
      cocLink: '评估你的股权 Cash-on-Cash 现金回报',
      desc2: '，或前往 ',
      daLink: 'Deal Analyzer 工具',
      desc3: ' 测试在空置率上升时的抗压能力。',
    },
    es: {
      title: 'Caso Práctico: Inmueble Comercial de $2,000,000',
      intro: 'Considere la adquisición de un edificio comercial valorado en $2,000,000.',
      noiPrefix: 'Ingreso Operativo Neto (NOI): $150,000 (vea cómo ',
      noiLink: 'calculamos el NOI de esta propiedad',
      noiSuffix: ')',
      debtPrefix: 'Servicio Anual de la Deuda: $121,536 (basado en un préstamo de $1.5M al 6.50% a 25 años, vea cómo ',
      debtLink: 'calculamos esta cuota de préstamo comercial',
      debtSuffix: ')',
      calc: 'Cálculo: DSCR = $150,000 (NOI) ÷ $121,536 (Servicio de Deuda) = 1.23x',
      desc1: 'Un ratio de 1.23x cumple con el umbral estándar de 1.20x–1.25x exigido por la banca comercial. Una vez confirmada la solvencia de la deuda, puede utilizar los $28,464 de flujo de caja libre para ',
      cocLink: 'evaluar el retorno Cash-on-Cash sobre su capital',
      desc2: ', o dirigirse a la herramienta completa ',
      daLink: 'Deal Analyzer',
      desc3: ' para probar la resistencia de la cobertura ante mayores tasas de vacancia.',
    },
    pt: {
      title: 'Exemplo Prático: Imóvel Comercial de $2,000,000',
      intro: 'Considere a aquisição de um imóvel comercial avaliado em $2,000,000.',
      noiPrefix: 'Receita Operacional Líquida (NOI): $150,000 (veja como ',
      noiLink: 'calculamos o NOI deste imóvel',
      noiSuffix: ')',
      debtPrefix: 'Serviço Anual da Dívida: $121,536 (com base em financiamento de $1,5M a 6,50% em 25 anos, veja como ',
      debtLink: 'calculamos a parcela deste empréstimo comercial',
      debtSuffix: ')',
      calc: 'Cálculo: DSCR = $150,000 (NOI) ÷ $121,536 (Serviço da Dívida) = 1.23x',
      desc1: 'Um índice de 1.23x atende à exigência habitual de 1.20x–1.25x da maioria dos credores institucionais. Uma vez confirmada a segurança da dívida, você pode usar os $28,464 de fluxo de caixa livre para ',
      cocLink: 'avaliar o retorno Cash-on-Cash sobre o capital próprio',
      desc2: ', ou acessar a ferramenta completa ',
      daLink: 'Deal Analyzer',
      desc3: ' para testar o estresse dessa cobertura contra aumentos na taxa de vacância.',
    },
    en: {
      title: 'Worked Commercial Property Example ($2M Commercial Building)',
      intro: 'Consider a commercial building acquisition priced at $2,000,000 with a $1,500,000 senior commercial mortgage:',
      noiPrefix: 'Net Operating Income (NOI): $150,000 ($220,000 EGI minus $70,000 OpEx; see how we ',
      noiLink: "calculated this property's NOI",
      noiSuffix: ')',
      debtPrefix: 'Annual Debt Service: $121,536 (based on a $1.5M loan at 6.50% interest, 25-year amortization; see how we ',
      debtLink: 'calculated this commercial loan payment',
      debtSuffix: ')',
      calc: 'Calculation: DSCR = $150,000 (NOI) ÷ $121,536 (Debt Service) = 1.23x',
      desc1: "A 1.23x ratio satisfies conventional commercial bank underwriting standards (typical 1.20x to 1.25x minimum). Once you confirm debt safety, you can use the remaining $28,464 annual cash flow to ",
      cocLink: 'evaluate your equity Cash-on-Cash Return',
      desc2: ', or head to the full ',
      daLink: 'Deal Analyzer tool',
      desc3: ' to stress-test this coverage against higher vacancy rates.',
    },
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || {
    title: 'Worked Commercial Property Example ($2M Commercial Building)',
    intro: 'Consider a commercial building acquisition priced at $2,000,000 with a $1,500,000 senior commercial mortgage:',
    noiPrefix: 'Net Operating Income (NOI): $150,000 ($220,000 EGI minus $70,000 OpEx; see how we ',
    noiLink: "calculated this property's NOI",
    noiSuffix: ')',
    debtPrefix: 'Annual Debt Service: $121,536 (based on a $1.5M loan at 6.50% interest, 25-year amortization; see how we ',
    debtLink: 'calculated this commercial loan payment',
    debtSuffix: ')',
    calc: 'Calculation: DSCR = $150,000 (NOI) ÷ $121,536 (Debt Service) = 1.23x',
    desc1: "A 1.23x ratio satisfies conventional commercial bank underwriting standards (typical 1.20x to 1.25x minimum). Once you confirm debt safety, you can use the remaining $28,464 annual cash flow to ",
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
      title: 'Riesgos en la Evaluación del DSCR y Pruebas de Estrés',
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

  const guideBanner = {
    en: {
      badge: 'In-Depth Underwriting Guide',
      title: 'The Complete Guide to DSCR (Debt Service Coverage Ratio)',
      desc: 'Learn what lenders actually look for, worked 20-unit calculation steps, how debt constants affect sizing, and how to improve your ratio before submitting a loan application.',
      btn: 'Read Complete Guide',
    },
    zh: {
      badge: '深度承销指南',
      title: 'DSCR (偿债备付率) 完全指南：从公式到银行审贷实操',
      desc: '系统解析银行风控标准、20单元实操测算案例、常数表计算法，以及如何优化比率以获取最高贷款额度。',
      btn: '阅读完全指南',
    },
    es: {
      badge: 'Guía Integral de Suscripción',
      title: 'Guía Completa de DSCR (Ratio de Cobertura del Servicio de la Deuda)',
      desc: 'Aprenda qué evalúan realmente los bancos, cálculo paso a paso para 20 unidades, constantes de deuda y cómo optimizar su ratio antes de solicitar un préstamo.',
      btn: 'Leer Guía Completa',
    },
    pt: {
      badge: 'Guia Completo de Subscrição',
      title: 'Guia Completo de DSCR (Índice de Cobertura do Serviço da Dívida)',
      desc: 'Entenda os critérios dos credores, cálculos passo a passo para 20 unidades, constantes da dívida e como otimizar o índice antes da solicitação.',
      btn: 'Ler Guia Completo',
    },
  }[locale as 'en' | 'zh' | 'es' | 'pt'] || {
    badge: 'In-Depth Underwriting Guide',
    title: 'The Complete Guide to DSCR (Debt Service Coverage Ratio)',
    desc: 'Learn what lenders actually look for, worked 20-unit calculation steps, how debt constants affect sizing, and how to improve your ratio before submitting a loan application.',
    btn: 'Read Complete Guide',
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

        {/* In-Depth Guide Feature Banner */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{guideBanner.badge}</span>
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              {guideBanner.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {guideBanner.desc}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/dscr-complete-guide/`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shrink-0 transition-all shadow-xs"
          >
            <span>{guideBanner.btn}</span>
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
