import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { DealAnalyzerTool } from '@/components/tools/DealAnalyzerTool';
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
  const content = getContent(locale).dealAnalyzer;

  return buildSeoMetadata({
    path: 'tools/deal-analyzer',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
    noindex: locale !== 'en',
  });
}

export default async function DealAnalyzerPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).dealAnalyzer;
  const isZh = locale === 'zh';
  const homeText = locale === 'zh' ? '首页' : locale === 'es' ? 'Inicio' : locale === 'pt' ? 'Início' : 'Home';

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/tools/deal-analyzer/`,
    locale
  );

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: homeText, url: `${SITE_URL}/${locale}/` },
    { name: content.h1, url: `${SITE_URL}/${locale}/tools/deal-analyzer/` },
  ]);

  const faqSchema = getFaqPageJsonLd(content.faqs);

  const workedExampleByLocale = {
    en: {
      title: 'Worked Commercial Property Example',
      intro: 'Consider a hypothetical 24-unit multifamily property with the following acquisition and operational assumptions:',
      p1: 'Purchase price: $2,800,000',
      p2: 'Gross potential income: $336,000',
      p3: 'Vacancy: 5%',
      p4: 'Operating expenses: $92,000',
      p5: 'Down payment: 25% ($700,000)',
      p6: 'Closing costs: 2% ($56,000)',
      p7: 'Commercial loan: 6.5% interest rate, 25-year amortization',
      step1Title: 'Step 1: Property-Level Cash Flow (NOI & Cap Rate)',
      step1Desc1: 'First, deducting vacancy gives an Effective Gross Income (EGI) of $319,200. After subtracting operating expenses, we can ',
      step1LinkNoi: "calculate the property's NOI",
      step1Desc2: ' at $227,200. Based on the purchase price, this translates to an 8.11% ',
      step1LinkCap: 'unleveraged Cap Rate',
      step2Title: 'Step 2: Debt Coverage & Equity Return (DSCR & Cash-on-Cash)',
      step2Desc1: 'Based on the loan terms, the annual debt service is $170,152. By dividing the NOI by the debt service, we ',
      step2LinkDscr: "test the lender's DSCR threshold",
      step2Desc2: ', resulting in a healthy 1.34x coverage. The pre-tax cash flow after debt is $57,048. Compared against the $756,000 total cash invested (down payment + closing costs), we ',
      step2LinkCoc: 'measure cash return on invested equity',
      step2Desc3: ' which yields 7.55%. Currently, the ',
      step2LinkBer: 'Break-Even Ratio (BER)',
      step2Desc4: ' is 82.13% (with a simplified Break-Even Occupancy of 78.02%).',
      step3Title: 'Step 3: Stress Testing',
      step3Desc1: 'The base case appears healthy, but what happens if vacancy rises to 10% and interest rates climb to 7.5%?',
      step3Desc2: 'Annual debt service climbs to $186,226, while NOI drops to $210,400. In this scenario, the DSCR plummets to 1.13x (which, depending on the specific loan agreement covenants, may trigger lender watchlists, cash sweeps, or technical default discussions), and the Cash-on-Cash Return shrinks to 3.20%. The Break-Even Ratio rises to 92.01% (with Break-Even Occupancy reaching 82.81%), pushing into the high-risk zone. This demonstrates why comprehensive ',
      step3LinkUnderwrite: 'underwrite a commercial real estate deal',
      step3Desc3: ' must evaluate downside resilience across multiple scenarios.',
    },
    zh: {
      title: '商业地产分析案例 (Illustrative Example)',
      intro: '假设您正在评估一处 24 单元的多户住宅物业（24-unit multifamily），基础数据如下：',
      p1: '购买价格: $2,800,000',
      p2: '年潜在毛收入: $336,000',
      p3: '空置率: 5%',
      p4: '年度运营费用: $92,000',
      p5: '首付比例: 25% ($700,000)',
      p6: '交易过户费: 2% ($56,000)',
      p7: '商业贷款: 6.5% 利率，25年摊销期',
      step1Title: '步骤 1：分析物业现金流 (NOI 与 Cap Rate)',
      step1Desc1: '首先扣除空置损失得到有效总收入 (EGI) $319,200。减去运营费用后，我们可以 ',
      step1LinkNoi: '计算该物业的 NOI',
      step1Desc2: ' 为 $227,200。基于购买价，这相当于 8.11% 的 ',
      step1LinkCap: '无杠杆 Cap Rate',
      step2Title: '步骤 2：债务与股权回报 (DSCR 与 Cash-on-Cash)',
      step2Desc1: '按上述条款，年还本付息额 (Annual Debt Service) 为 $170,152。将 NOI 除以债务，我们以此来 ',
      step2LinkDscr: '测试贷款方的 DSCR 阈值',
      step2Desc2: '，结果为健康水平的 1.34x。扣除债务后的税前现金流为 $57,048，对比 $756,000 的总现金投入（首付+过户费），我们可以 ',
      step2LinkCoc: '衡量投入股权的现金回报率 (Cash-on-Cash Return)',
      step2Desc3: ' 为 7.55%。此交易目前的 ',
      step2LinkBer: '收支平衡比率 (Break-Even Ratio)',
      step2Desc4: ' 为 82.13%（对应的简化盈亏入住率 Break-Even Occupancy 为 78.02%）。',
      step3Title: '步骤 3：压力测试 (Stress Testing)',
      step3Desc1: '基础情景看似健康，但如果你将空置率上调至 10%，并将利率上调至 7.5% 呢？',
      step3Desc2: '年还款额上升至 $186,226，而 NOI 下降至 $210,400。此时，DSCR 骤降至 1.13x（是否构成违约取决于具体贷款合同约定的契约条款与指标阈值，但通常已接近或触及贷方警戒线），且 Cash-on-Cash Return 暴跌至 3.20%。收支平衡比率 (BER) 亦攀升至 92.01%（盈亏入住率 BEO 达 82.81%），进入高风险区间。这就是为什么全面 ',
      step3LinkUnderwrite: '承销商业地产交易',
      step3Desc3: ' 时应结合下行压力场景审慎评估。',
    },
    es: {
      title: 'Ejemplo Práctico en Bienes Raíces Comerciales',
      intro: 'Considere una propiedad multifamiliar hipotética de 24 unidades con los siguientes supuestos de adquisición y operación:',
      p1: 'Precio de compra: $2,800,000',
      p2: 'Ingreso potencial bruto (GPI): $336,000',
      p3: 'Tasa de vacancia: 5%',
      p4: 'Gastos operativos anuales: $92,000',
      p5: 'Pago inicial / Entrada: 25% ($700,000)',
      p6: 'Costos de cierre: 2% ($56,000)',
      p7: 'Préstamo comercial: tasa de interés del 6.5%, amortización a 25 años',
      step1Title: 'Paso 1: Flujo de Caja Operativo del Inmueble (NOI y Cap Rate)',
      step1Desc1: 'Primero, deducir la vacancia arroja un Ingreso Bruto Efectivo (EGI) de $319,200. Tras restar los gastos operativos, podemos ',
      step1LinkNoi: 'calcular el NOI del inmueble',
      step1Desc2: ' en $227,200. Con respecto al precio de compra, esto equivale a un ',
      step1LinkCap: 'Cap Rate no apalancado del 8.11%',
      step2Title: 'Paso 2: Cobertura de Deuda y Rendimiento del Capital (DSCR y Cash-on-Cash)',
      step2Desc1: 'Conforme a los términos del préstamo, el servicio anual de la deuda es de $170,152. Al dividir el NOI entre el servicio de la deuda, ',
      step2LinkDscr: 'evaluamos el umbral de DSCR del banco',
      step2Desc2: ', obteniendo una cobertura saludable de 1.34x. El flujo de caja antes de impuestos tras el servicio de la deuda es de $57,048. Frente a una inversión total en efectivo de $756,000 (pago inicial + costos de cierre), ',
      step2LinkCoc: 'medimos el retorno de efectivo sobre el capital (Cash-on-Cash)',
      step2Desc3: ' que alcanza un 7.55%. Actualmente, el ',
      step2LinkBer: 'Ratio de Equilibrio (Break-Even Ratio - BER)',
      step2Desc4: ' se sitúa en 82.13% (con una ocupación de equilibrio simplificada del 78.02%).',
      step3Title: 'Paso 3: Prueba de Estrés Financiero (Stress Testing)',
      step3Desc1: 'El escenario base parece solvente, pero ¿qué sucede si la vacancia sube al 10% y las tasas de interés aumentan al 7.5%?',
      step3Desc2: 'El servicio anual de la deuda se eleva a $186,226, mientras que el NOI disminuye a $210,400. En este escenario, el DSCR cae a 1.13x (lo que, según las cláusulas del contrato de préstamo, podría activar supervisiones bancarias o reservas obligatorias), y el Cash-on-Cash se reduce a 3.20%. El Break-Even Ratio se dispara a 92.01% (con una ocupación de equilibrio que alcanza el 82.81%), entrando en zona de riesgo. Esto demuestra por qué una completa ',
      step3LinkUnderwrite: 'evaluación de una inversión inmobiliaria',
      step3Desc3: ' debe verificar la solvencia ante escenarios adversos de mercado.',
    },
    pt: {
      title: 'Exemplo Prático em Imóveis Comerciais',
      intro: 'Considere um imóvel multifamiliar hipotético de 24 unidades com as seguintes premissas de aquisição e operação:',
      p1: 'Preço de compra: $2,800,000',
      p2: 'Receita potencial bruta (GPI): $336,000',
      p3: 'Taxa de vacância: 5%',
      p4: 'Despesas operacionais anuais: $92,000',
      p5: 'Entrada: 25% ($700,000)',
      p6: 'Custos de fechamento: 2% ($56,000)',
      p7: 'Financiamento comercial: taxa de juros de 6,5%, amortização de 25 anos',
      step1Title: 'Passo 1: Fluxo de Caixa Operacional do Imóvel (NOI e Cap Rate)',
      step1Desc1: 'Primeiro, deduzindo a vacância, obtemos uma Receita Bruta Efetiva (EGI) de $319,200. Após subtrair as despesas operacionais, podemos ',
      step1LinkNoi: 'calcular o NOI do imóvel',
      step1Desc2: ' em $227,200. Com base no preço de compra, isso equivale a um ',
      step1LinkCap: 'Cap Rate desalavancado de 8.11%',
      step2Title: 'Passo 2: Cobertura da Dívida e Retorno sobre o Capital (DSCR e Cash-on-Cash)',
      step2Desc1: 'Com base nos termos do financiamento, o serviço anual da dívida é de $170,152. Dividindo o NOI pelo serviço da dívida, ',
      step2LinkDscr: 'avaliamos o limite de DSCR do credor',
      step2Desc2: ', resultando em uma cobertura saudável de 1.34x. O fluxo de caixa antes dos impostos após a dívida é de $57,048. Comparado ao total de $756,000 investidos em dinheiro (entrada + custos de fechamento), ',
      step2LinkCoc: 'medimos o retorno sobre o capital próprio (Cash-on-Cash)',
      step2Desc3: ' que atinge 7.55%. Atualmente, o ',
      step2LinkBer: 'Ponto de Equilíbrio (Break-Even Ratio - BER)',
      step2Desc4: ' é de 82.13% (com uma ocupação de equilíbrio simplificada de 78.02%).',
      step3Title: 'Passo 3: Teste de Estresse Financeiro (Stress Testing)',
      step3Desc1: 'O cenário base parece saudável, mas o que acontece se a vacância subir para 10% e a taxa de juros atingir 7,5%?',
      step3Desc2: 'O serviço anual da dívida salta para $186,226, enquanto o NOI cai para $210,400. Nesse cenário, o DSCR despenca para 1.13x (o que, dependendo das cláusulas específicas do contrato de empréstimo, pode acionar mecanismos de retenção de caixa ou revisão bancária), e o Cash-on-Cash cai para 3.20%. O Break-Even Ratio sobe para 92.01% (com a ocupação de equilíbrio atingindo 82.81%), entrando em zona de alto risco. Isso demonstra por que uma abrangente ',
      step3LinkUnderwrite: 'análise de investimento imobiliário',
      step3Desc3: ' deve testar a resiliência operacional sob múltiplos cenários de estresse.',
    },
  };

  const ex = workedExampleByLocale[locale as keyof typeof workedExampleByLocale] || workedExampleByLocale.en;

  const pitfallsByLocale = {
    en: {
      title: 'Institutional Underwriting Pitfalls & Common Mistakes',
      item1: '1. Overlooking Stress Testing: Underwriting only base-case pro-formas is dangerous. It is prudent to model sensible downside scenarios (such as +5 percentage points vacancy or +100 bps interest rate increases) to evaluate debt coverage cushion, rather than assuming a single static projection applies to every deal.',
      item2: '2. Under-budgeting Replacement Reserves: Omitting capital expenditure reserves (e.g., $250-$350/unit/yr) creates artificially inflated initial cash flow.',
    },
    zh: {
      title: '商业地产全案尽调常见误区',
      item1: '1. 忽视压力测试：仅看基准情景 (Base Case) 往往过于乐观。建议结合市场下行假设（例如将空置率调高5个百分点或利率上浮100个基点）进行压力测试，检验物业在不利环境下的偿债安全垫，而非僵化套用单一标准。',
      item2: '2. 低估物业重置准备金：未能足额计提屋顶、HVAC 及外墙维护的资本储备金，会导致账面现金流虚高。',
    },
    es: {
      title: 'Errores Críticos en la Evaluación Inmobiliaria Comercial',
      item1: '1. Omitir las pruebas de estrés: Evaluar operaciones basándose únicamente en proyecciones base optimistas es riesgoso. Es fundamental modelar escenarios a la baja (como un aumento de 5 puntos porcentuales de vacancia o 100 puntos básicos en la tasa de interés) para medir el colchón de solvencia ante el servicio de la deuda.',
      item2: '2. Subestimar las reservas de reposición de capital: Omitir fondos para gastos de capital (CapEx de $250 a $350/unidad/año) genera un flujo de caja inicial artificialmente inflado.',
    },
    pt: {
      title: 'Erros Críticos na Análise de Imóveis Comerciais',
      item1: '1. Negligenciar testes de estresse: Avaliar investimentos apenas com projeções base otimistas é arriscado. É essencial modelar cenários de retração (como aumento de 5 pontos percentuais na vacância ou 100 bps nos juros) para mensurar a margem de segurança do serviço da dívida.',
      item2: '2. Subestimar reservas para reposição de capital: Omitir reservas de capital (CapEx de $250 a $350/unidade/ano) gera fluxos de caixa iniciais artificialmente inflacionados.',
    },
  };

  const pit = pitfallsByLocale[locale as keyof typeof pitfallsByLocale] || pitfallsByLocale.en;

  return (
    <article className="space-y-10 py-4">
      <JsonLd data={[calculatorSchema, breadcrumbSchema, faqSchema]} />

      {/* Page Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">{homeText}</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{content.h1}</span>
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full shadow-xs">
            {locale === 'zh'
              ? '全流程综合尽调工具'
              : locale === 'es'
              ? 'Suite Integral de Evaluación y Análisis'
              : locale === 'pt'
              ? 'Suite Completa de Análise'
              : 'Full Underwriting Suite'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {content.h1}
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          {content.subtitle}
        </p>
      </header>

      {/* Interactive Tool Component */}
      <section id="tool">
        <DealAnalyzerTool locale={locale} />
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
            <span className="font-semibold text-slate-700">
              {isZh
                ? '支持单项测算：'
                : locale === 'es'
                ? 'Explorar Módulos Individuales:'
                : locale === 'pt'
                ? 'Explorar Módulos Individuais:'
                : 'Explore Standalone Modules:'}
            </span>
            <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'Cap Rate' : 'Cap Rate'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'NOI' : 'NOI'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'Cash-on-Cash' : 'Cash-on-Cash'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'DSCR' : 'DSCR'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/guides/how-to-underwrite-a-deal/`} className="text-emerald-600 hover:underline font-medium">
              {isZh
                ? '商业地产 6 步承销法'
                : locale === 'es'
                ? 'Guía de Evaluación en 6 Pasos'
                : locale === 'pt'
                ? 'Guia de Análise em 6 Passos'
                : 'Deal Underwriting Guide'}
            </Link>
          </div>
        </section>

        {/* Formula */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.formulaTitle}</h2>
          <div className="bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm p-4 rounded-xl shadow-inner whitespace-pre-line leading-relaxed">
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
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4" data-testid="worked-example-section">
          <h2 className="text-xl font-bold text-slate-900">{ex.title}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-4">
            <p>{ex.intro}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{ex.p1}</li>
              <li>{ex.p2}</li>
              <li>{ex.p3}</li>
              <li>{ex.p4}</li>
              <li>{ex.p5}</li>
              <li>{ex.p6}</li>
              <li>{ex.p7}</li>
            </ul>

            <div data-testid="worked-example-step-1">
              <strong className="text-slate-900">{ex.step1Title}</strong>
              <p className="mt-1">
                {ex.step1Desc1}
                <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-semibold">{ex.step1LinkNoi}</Link>
                {ex.step1Desc2}
                <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-semibold">{ex.step1LinkCap}</Link>.
              </p>
            </div>

            <div data-testid="worked-example-step-2">
              <strong className="text-slate-900">{ex.step2Title}</strong>
              <p className="mt-1">
                {ex.step2Desc1}
                <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">{ex.step2LinkDscr}</Link>
                {ex.step2Desc2}
                <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-semibold">{ex.step2LinkCoc}</Link>
                {ex.step2Desc3}
                <Link href={`/${locale}/calculators/break-even-ratio/`} className="text-emerald-600 hover:underline font-semibold">{ex.step2LinkBer}</Link>
                {ex.step2Desc4}
              </p>
            </div>

            <div data-testid="worked-example-step-3">
              <strong className="text-amber-700">{ex.step3Title}</strong>
              <p className="mt-1">
                {ex.step3Desc1}
                <br />
                {ex.step3Desc2}
                <Link href={`/${locale}/guides/how-to-underwrite-a-deal/`} className="text-emerald-600 hover:underline font-semibold">{ex.step3LinkUnderwrite}</Link>
                {ex.step3Desc3}
              </p>
            </div>
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
          <div className="space-y-6 divide-y divide-slate-100" data-testid="faq-list">
            {content.faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-6' : ''} data-testid="faq-item">
                <h3 className="text-base font-bold text-slate-900 mb-2" data-testid="faq-question">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed" data-testid="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white">{content.relatedTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.relatedCalculators.map((rel) => (
              <Link
                key={rel.slug}
                href={rel.slug.startsWith('..') ? `/${locale}/guides/how-to-underwrite-a-deal/` : `/${locale}/calculators/${rel.slug}/`}
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
