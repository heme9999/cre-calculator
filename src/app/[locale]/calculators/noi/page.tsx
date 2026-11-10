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
      intro: 'Consider a hypothetical 18-unit garden-style multifamily property acquired for $2,450,000. To calculate its Net Operating Income (NOI), we look exclusively at operational revenues and property-level expenses:',
      p1: 'Gross potential rent (18 units × $1,250/mo × 12): $270,000 + Laundry & parking income: $14,400 (Total GPI: $284,400)',
      p2: 'Economic vacancy & credit loss: 5.5% (-$15,642)',
      p3: 'Effective Gross Income (EGI): $268,758',
      p4: 'Operating expenses (taxes, insurance, management, maintenance, utilities): $98,400',
      calc: 'Calculation: NOI = $268,758 (EGI) - $98,400 (OpEx) = $170,358 (6.95% unlevered property yield)',
      note: 'Note that debt service is excluded from NOI. Once you establish this $170,358 stabilized NOI, your next underwriting step is to ',
      capLink: 'calculate the property\'s Cap Rate',
      orText: ' or ',
      dscrLink: 'measure your loan\'s DSCR',
    },
    zh: {
      title: '商业地产分析案例 (Illustrative Example)',
      intro: '假设您正在评估一处 18 单元的花园式多户住宅物业（18-unit multifamily），购买价为 $2,450,000。要计算其净营业收入 (NOI)，我们只需聚焦于物业层面的实际运营收支：',
      p1: '潜在租金总额 (18 单元 × $1,250/月 × 12): $270,000 + 洗衣与停车其他收入: $14,400 (潜在毛收入 GPI: $284,400)',
      p2: '经济空置与坏账准备: 5.5% (-$15,642)',
      p3: '有效毛收入 (EGI): $268,758',
      p4: '年度运营开支 (房产税、保险、物业管理费、日常维护与水电): $98,400',
      calc: '计算: NOI = $268,758 (EGI) - $98,400 (OpEx) = $170,358 (对应 6.95% 无杠杆资本化率)',
      note: '注意：我们在此严格不扣除房贷。得到 $170,358 的 NOI 后，后续步骤通常是利用该数字来 ',
      capLink: '计算物业的 Cap Rate',
      orText: ' 或 ',
      dscrLink: '测算贷款的 DSCR',
    },
    es: {
      title: 'Caso Práctico en Bienes Raíces Comerciales',
      intro: 'Considere una propiedad multifamiliar de 18 unidades adquirida por $2,450,000. Para determinar su Ingreso Operativo Neto (NOI), evaluamos exclusivamente los flujos operativos a nivel de propiedad:',
      p1: 'Renta potencial bruta: $270,000 + Ingresos de lavandería y estacionamiento: $14,400 (GPI total: $284,400)',
      p2: 'Pérdida por vacancia económica y morosidad: 5.5% (-$15,642)',
      p3: 'Ingreso bruto efectivo (EGI): $268,758',
      p4: 'Gastos operativos anuales (impuestos, seguros, administración y mantenimiento): $98,400',
      calc: 'Cálculo: NOI = $268,758 (EGI) − $98,400 (OpEx) = $170,358 (rendimiento desapalancado del 6.95%)',
      note: 'Nota: Excluimos deliberadamente el servicio de deuda en este punto. Al obtener $170,358 de NOI, el paso siguiente es ',
      capLink: 'calcular el Cap Rate del inmueble',
      orText: ' o ',
      dscrLink: 'medir el DSCR de la hipoteca',
    },
    pt: {
      title: 'Exemplo Prático em Imóveis Comerciais',
      intro: 'Considere um imóvel multifamiliar de 18 unidades adquirido por $2,450,000. Para apurar a Receita Operacional Líquida (NOI), focamos exclusivamente nas receitas operacionais e despesas do ativo:',
      p1: 'Aluguel potencial bruto: $270,000 + Receitas adicionais: $14,400 (GPI total: $284,400)',
      p2: 'Perda por vacância econômica e inadimplência: 5.5% (-$15,642)',
      p3: 'Receita bruta efetiva (EGI): $268,758',
      p4: 'Despesas operacionais anuais (impostos, seguro, gestão e manutenção): $98,400',
      calc: 'Cálculo: NOI = $268,758 (EGI) − $98,400 (OpEx) = $170,358 (retorno desalavancado de 6.95%)',
      note: 'Nota: O serviço da dívida é rigorosamente excluído do NOI. Ao estabelecer o NOI estabilizado de $170,358, o passo seguinte é ',
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

        {/* Institutional Underwriting: T-12 Normalization & Tax Reassessments */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            {isZh
              ? '机构级承销：T-12 财报规范化与交易后房产税重估'
              : locale === 'es'
              ? 'Suscripción Institucional: Normalización de T-12 y Reevaluación Fiscal'
              : locale === 'pt'
              ? 'Subscrição Institucional: Normalização de T-12 e Reavaliação Fiscal'
              : 'Institutional Underwriting: T-12 Normalization & Tax Reassessments'}
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              {isZh
                ? '在实际商业地产交易中，经纪人推介手册（Offering Memorandum）中的“预计”或“预测” NOI 往往经过美化（例如假设零坏账、低估维修费）。机构尽调人员必须依据过去 12 个月的实际流水账目（Trailing-12 或 T-12）进行严格规范化：'
                : locale === 'es'
                ? 'En transacciones comerciales reales, el NOI "proyectado" en los folletos de venta suele ser excesivamente optimista. Los evaluadores institucionales normalizan las cifras basándose en los estados financieros de los últimos 12 meses (T-12):'
                : locale === 'pt'
                ? 'Em negociações comerciais, o NOI "projetado" em memorandos de venda frequentemente mascara custos reais. Avaliadores institucionais normalizam os números com base nos balancetes dos últimos 12 meses (T-12):'
                : 'In commercial acquisitions, broker-marketed "pro-forma" NOI frequently inflates true operating health by ignoring recurring tenant concessions and underestimating turnover costs. Institutional underwriters strictly audit Trailing-12 (T-12) financial statements to normalize operational cash flows:'}
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>{isZh ? '剥离非经常性收支：' : locale === 'es' ? 'Depurar partidas no recurrentes: ' : locale === 'pt' ? 'Expurgar itens não recorrentes: ' : 'Eliminate Non-Recurring Adjustments: '}</strong>
                {isZh
                  ? '剔除前房东一次性的法律纠纷支出、个人车辆加油等非物业支出，补足合理的职业物业管理费（通常占 EGI 的 4%–8%，即使买家打算自行管理也需计入）。'
                  : locale === 'es'
                  ? 'Eliminar gastos personales del vendedor y contingencias legales únicas, reservando honorarios de gestión profesional de terceros (4% a 8% del EGI).'
                  : locale === 'pt'
                  ? 'Remover despesas pessoais do proprietário anterior e processos pontuais, garantindo taxa de administração profissional (4% a 8% da EGI).'
                  : 'Remove seller-specific discretionary expenses, one-off insurance claims, and add market-rate third-party management fees (typically 4% to 8% of EGI), even if self-managed.'}
              </li>
              <li>
                <strong>{isZh ? '交割后房产税重估风险：' : locale === 'es' ? 'Reevaluación de impuestos prediales tras la compra: ' : locale === 'pt' ? 'Reavaliação de IPTU pós-aquisição: ' : 'Post-Closing Property Tax Reassessment: '}</strong>
                {isZh
                  ? '这是承销中最常见的致命漏洞。许多地区的评估部门会在产权过户后，将计税估值直接重估至最新成交价（如德克萨斯州或加利福尼亚州）。若仍沿用前业主的历史低税额，实际 NOI 可能会直接缩水 15%–25%。'
                  : locale === 'es'
                  ? 'Un error crítico común: en muchas jurisdicciones, la compraventa dispara una retasación del valor catastral al nuevo precio de compra, lo que puede incrementar los impuestos y reducir el NOI real entre un 15% y un 25%.'
                  : locale === 'pt'
                  ? 'Um risco fatal comum: em muitos municípios, a transferência do imóvel dispara a reavaliação do valor venal ao preço de compra, elevando o imposto e reduzindo o NOI real em 15% a 25%.'
                  : 'Never rely on the seller\'s historical tax bill. In reassessment jurisdictions (such as Texas or California upon change of ownership), local taxing authorities reassess assessed values toward the new purchase price, often increasing property taxes by 20% to 50% and erasing tens of thousands from net operating income.'}
              </li>
              <li>
                <strong>{isZh ? '资本重置准备金：' : locale === 'es' ? 'Reservas para reposición de capital: ' : locale === 'pt' ? 'Reserva para substituição de capital: ' : 'Replacement Reserves: '}</strong>
                {isZh
                  ? '机构放贷机构（如 Fannie Mae 与 Freddie Mac）要求每套住宅每年提留 $250–$350 的重置准备金，用于未来的屋顶、暖通空调及大型设备更新。'
                  : locale === 'es'
                  ? 'Prestamistas institucionales (como Fannie Mae y Freddie Mac) exigen reservar entre $250 y $350 por unidad al año para futuros reemplazos de techos, sistemas HVAC y pavimentación.'
                  : locale === 'pt'
                  ? 'Credores institucionais exigem reservar de $250 a $350 por unidade ao ano para substituição periódica de telhados, sistemas de ar-condicionado e pavimentação.'
                  : 'Fannie Mae, Freddie Mac, and life companies require deducting $250 to $350 per unit annually into escrow for ongoing capital replacements (roofs, HVACs, and parking lots) to arrive at underwritten net cash flow.'}
              </li>
            </ul>
            <p className="pt-2">
              {isZh ? (
                <>
                  核定出真实的标准化 NOI 后，下一步是将其放入市场整体环境中对比。请参考我们的{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    全美主要商业物业 Cap Rate 基准参考表
                  </Link>
                  ，查看多户住宅、工业物流、零售及医疗地产的最新平均收益率区间。
                </>
              ) : locale === 'es' ? (
                <>
                  Una vez normalizado el NOI, evalúe si el rendimiento del activo es competitivo consultando nuestra{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    Tabla Maestra de Cap Rates Nacionales por Tipo de Activo
                  </Link>
                  .
                </>
              ) : locale === 'pt' ? (
                <>
                  Após normalizar o NOI, compare o retorno com os parâmetros de mercado em nossa{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    Tabela Mestra de Cap Rates Nacionais por Categoria de Ativo
                  </Link>
                  .
                </>
              ) : (
                <>
                  Once you have calculated a defensible, normalized NOI, evaluate whether the implied yield matches prevailing market expectations using our{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    National Cap Rate Benchmarks Master Reference Table
                  </Link>
                  , which compiles target yields across multifamily, industrial, retail, office, self-storage, hotel, and single-tenant NNN properties.
                </>
              )}
            </p>
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
