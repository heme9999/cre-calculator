import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { CashOnCashCalculator } from '@/components/calculators/CashOnCashCalculator';
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
  const content = getContent(locale).cashOnCash;

  return buildSeoMetadata({
    path: 'calculators/cash-on-cash',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function CashOnCashPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).cashOnCash;
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const homeLabel = isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home';

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/cash-on-cash/`,
    locale
  );

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: homeLabel, url: `${SITE_URL}/${locale}/` },
    { name: content.h1, url: `${SITE_URL}/${locale}/calculators/cash-on-cash/` },
  ]);

  const faqSchema = getFaqPageJsonLd(content.faqs);

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
        <CashOnCashCalculator locale={locale} />
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
              {isZh ? '杠杆与承销链路：' : isEs ? 'Flujo de Evaluación con Apalancamiento:' : isPt ? 'Fluxo de Avaliação com Alavancagem:' : 'Leveraged Underwriting Pipeline:'}
            </span>
            <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'Cap Rate 无杠杆率' : isEs ? 'Calculadora de Cap Rate' : isPt ? 'Calculadora de Cap Rate' : 'Cap Rate Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/loan-payment/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? '贷款月供测算' : isEs ? 'Calculadora de Préstamo Comercial' : isPt ? 'Calculadora de Financiamento Comercial' : 'Loan Payment Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'DSCR 偿债覆盖率' : isEs ? 'Calculadora de DSCR' : isPt ? 'Calculadora de DSCR' : 'DSCR Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'Deal Analyzer 综合尽调' : isEs ? 'Deal Analyzer (Evaluación Completa)' : isPt ? 'Deal Analyzer (Avaliação Completa)' : 'Deal Analyzer'}
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
          <h2 className="text-xl font-bold text-slate-900">
            {isZh ? '商业地产分析案例 (Illustrative Example)' : isEs ? 'Ejemplo Práctico en Propiedad Comercial' : isPt ? 'Exemplo Prático em Imóvel Comercial' : 'Worked Commercial Property Example'}
          </h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-4">
            <p>
              {isZh
                ? '假设您正在评估一处挂牌买入价为 $3,200,000 的多商户商业混合物业（Suburban Commercial Property）：'
                : isEs
                ? 'Considere la adquisición de una propiedad comercial mixta valorada en $3,200,000:'
                : isPt
                ? 'Considere a aquisição de um imóvel comercial misto avaliado em $3,200,000:'
                : 'Consider a suburban commercial multi-tenant property acquired for $3,200,000:'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {isZh
                  ? '实际投入总现金: $864,000（25% 首付 $800,000，加 2% 交易过户税费 $64,000）'
                  : isEs
                  ? 'Capital total invertido: $864,000 (25% de anticipo de $800,000, más 2% de costos de cierre de $64,000)'
                  : isPt
                  ? 'Capital total investido: $864,000 (25% de entrada de $800,000, mais 2% de custos de fechamento de $64,000)'
                  : 'Total cash invested: $864,000 (25% down payment of $800,000, plus 2% closing costs of $64,000)'}
              </li>
              <li>
                {isZh
                  ? '年有效毛收入 (EGI): $360,000（潜在总租金扣除常规空置与减免损失后）'
                  : isEs
                  ? 'Ingreso bruto efectivo (EGI): $360,000 (ingreso potencial tras vacancia normalizada)'
                  : isPt
                  ? 'Receita bruta efetiva (EGI): $360,000 (receita potencial após vacância normalizada)'
                  : 'Effective gross income (EGI): $360,000 (after normalized market vacancy allowance)'}
              </li>
              <li>
                {isZh
                  ? '年度运营费用 (OpEx): $125,000 (房产税、保险、物管与日常修缮)'
                  : isEs
                  ? 'Gastos operativos anuales (OpEx): $125,000 (impuestos, seguros y gestión)'
                  : isPt
                  ? 'Despesas operacionais anuais (OpEx): $125,000 (impostos, seguro e gestão)'
                  : 'Operating expenses (OpEx): $125,000 (property taxes, insurance, management, maintenance)'}
              </li>
              <li>
                {isZh
                  ? '商业贷款条件: 75% LTV 贷款 $2,400,000，6.50% 利率，25年摊销期'
                  : isEs
                  ? 'Condiciones del préstamo: $2,400,000 al 6.50% de interés, amortización a 25 años'
                  : isPt
                  ? 'Condições do financiamento: $2,400,000 a 6,50% de juros, amortização em 25 anos'
                  : 'Loan terms: $2,400,000 at 6.50% interest, 25-year amortization'}
              </li>
            </ul>
            
            <div>
              <strong className="text-slate-900">
                {isZh ? '步骤 1：从 NOI 到税前现金流' : isEs ? 'Paso 1: Del NOI al Flujo de Caja Antes de Impuestos' : isPt ? 'Passo 1: Do NOI ao Fluxo de Caixa Antes dos Impostos' : 'Step 1: From NOI to Pre-Tax Cash Flow'}
              </strong>
              <p className="mt-1">
                {isZh ? (
                  <>
                    首先扣除运营费用，我们可以{' '}
                    <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-semibold">计算该物业的 NOI</Link>
                    {' '}为 $235,000（相当于 7.34% 的{' '}
                    <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-semibold">无杠杆 Cap Rate</Link>
                    ）。接着，基于贷款条件计算出每年 $194,460 的还本付息额 (Annual Debt Service)。扣除房贷后，您的年税前净现金流 (Annual Pre-Tax Cash Flow) 为 $40,540。
                  </>
                ) : isEs ? (
                  <>
                    Al deducir los gastos operativos,{' '}
                    <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-semibold">calculamos el NOI de la propiedad</Link>
                    {' '}en $235,000 (un{' '}
                    <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-semibold">Cap Rate sin apalancamiento</Link>
                    {' '}del 7.34%). A continuación, calculamos el servicio anual de la deuda en $194,460. Restando la hipoteca, se obtiene un Flujo de Caja Antes de Impuestos de $40,540.
                  </>
                ) : isPt ? (
                  <>
                    Ao deduzir as despesas operacionais,{' '}
                    <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-semibold">calculamos o NOI do imóvel</Link>
                    {' '}em $235,000 (um{' '}
                    <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-semibold">Cap Rate sem alavancagem</Link>
                    {' '}de 7.34%). Em seguida, calculamos o serviço anual da dívida em $194,460. Subtraindo a dívida, obtém-se um Fluxo de Caixa Antes dos Impostos de $40,540.
                  </>
                ) : (
                  <>
                    By deducting operating expenses, we{' '}
                    <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-semibold">calculate the property&apos;s NOI</Link>
                    {' '}at $235,000 (a 7.34%{' '}
                    <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-semibold">unleveraged Cap Rate</Link>
                    ). Next, we calculate the annual debt service at $194,460. Subtracting debt service yields an Annual Pre-Tax Cash Flow of $40,540.
                  </>
                )}
              </p>
            </div>

            <div>
              <strong className="text-slate-900">
                {isZh ? '步骤 2：计算 Cash-on-Cash Return' : isEs ? 'Paso 2: Calcular el Rendimiento Cash-on-Cash' : isPt ? 'Passo 2: Calcular o Retorno Cash-on-Cash' : 'Step 2: Calculate Cash-on-Cash Return'}
              </strong>
              <p className="mt-1">
                {isZh
                  ? '将您的 $40,540 年税前现金流除以 $864,000 的实际现金总投入，首年现金回报率为 4.69%（公式：CoC = 净现金流 ÷ 总现金投入）。尽管名义贷款利率 6.50% 低于 7.34% 的 Cap Rate，但由于 25 年等额本息还贷包含本金还款（首年本金摊销达 $39,944），压缩了当期到手现金。如果将首年本金偿还视为股东权益积累，综合真实股权回报率实际上达到了 9.32% (($40,540 + $39,944) ÷ $864,000)。'
                  : isEs
                  ? 'Al dividir el flujo de caja anual antes de impuestos de $40,540 entre los $864,000 de capital total invertido, se obtiene un Rendimiento Cash-on-Cash del 4.69%. Aunque la tasa hipotecaria del 6.50% es inferior al Cap Rate del 7.34%, la amortización de principal del primer año ($39,944) absorbe liquidez corriente. Al sumar la reducción de deuda como acumulación patrimonial, el retorno global sobre capital propio alcanza el 9.32% (($40,540 + $39,944) ÷ $864,000).'
                  : isPt
                  ? 'Ao dividir o fluxo de caixa anual de $40,540 pelo capital total investido de $864,000, apura-se um Retorno Cash-on-Cash de 4,69%. Embora a taxa de 6,50% seja inferior ao Cap Rate de 7,34%, a amortização de principal no primeiro ano ($39,944) reduz a liquidez imediata. Somando o abatimento de dívida como acúmulo de patrimônio, o retorno total sobre o capital atinge 9,32% (($40,540 + $39,944) ÷ $864,000).'
                  : 'Dividing your $40,540 annual pre-tax cash flow by your $864,000 total cash invested yields a first-year Cash-on-Cash Return of 4.69% (formula: CoC = Pre-Tax Cash Flow / Total Cash Invested). Although the 6.50% loan interest rate is lower than the 7.34% Cap Rate, standard 25-year mortgage payments include significant principal amortization ($39,944 in Year 1), which consumes in-pocket cash flow. When factoring in this first-year debt paydown as equity buildup, the combined total return on invested equity is 9.32% (($40,540 + $39,944) ÷ $864,000).'}
              </p>
            </div>

            <div>
              <strong className="text-amber-700">
                {isZh ? '步骤 3：压力测试 (Stress Testing)' : isEs ? 'Paso 3: Prueba de Estrés (Stress Testing)' : isPt ? 'Passo 3: Teste de Estresse (Stress Testing)' : 'Step 3: Stress Testing'}
              </strong>
              <p className="mt-1">
                {isZh ? (
                  <>
                    如果贷款利率上升到 7.5%，且空置率恶化至 10% 会怎样？
                    <br />
                    年还贷本息升至 $186,226，而 NOI 缩水至 $210,400。此时年税前现金流骤降至 $24,174。这意味着在压力情景下，Cash-on-Cash Return 会暴跌至 3.20%。同时，{' '}
                    <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">DSCR 偿债覆盖率</Link>
                    {' '}将降至 1.13x（这已接近部分商业贷款合同约定的警戒阈值）。要一次性测试这些风险，建议使用完整的{' '}
                    <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-semibold">Deal Analyzer 综合尽调工具</Link>。
                  </>
                ) : isEs ? (
                  <>
                    ¿Qué sucede si las tasas del préstamo suben al 7.5% y la desocupación empeora al 10%?
                    <br />
                    El servicio anual de la deuda aumenta a $186,226, mientras que el NOI se reduce a $210,400. El flujo de caja antes de impuestos cae a $24,174. Bajo este escenario de estrés, su Rendimiento Cash-on-Cash se reduce a solo el 3.20%. Además, su{' '}
                    <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">DSCR (Cobertura del Servicio de la Deuda)</Link>
                    {' '}desciende a 1.13x (acercándose a los umbrales típicos de convenios crediticios según el contrato de préstamo). Para modelar estos riesgos de forma simultánea, utilice la herramienta integral{' '}
                    <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-semibold">Deal Analyzer</Link>.
                  </>
                ) : isPt ? (
                  <>
                    E se os juros subirem para 7,5% e a vacância piorar para 10%?
                    <br />
                    O serviço anual da dívida sobe para $186,226, enquanto o NOI cai para $210,400. O fluxo de caixa antes dos impostos despenca para $24,174. Sob esse cenário de estresse, seu Retorno Cash-on-Cash cai para apenas 3,20%. Além disso, seu{' '}
                    <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">DSCR (Índice de Cobertura do Serviço da Dívida)</Link>
                    {' '}cai para 1,13x (aproximando-se dos limites exigidos por credores conforme o contrato de financiamento). Para modelar esses riscos simultaneamente, utilize a ferramenta completa{' '}
                    <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-semibold">Deal Analyzer</Link>.
                  </>
                ) : (
                  <>
                    What if loan rates rise to 7.5% and vacancy worsens to 10%?
                    <br />
                    Annual debt service jumps to $186,226, while NOI shrinks to $210,400. Pre-tax cash flow plummets to $24,174. Under this stress scenario, your Cash-on-Cash Return collapses to just 3.20%. Additionally, your{' '}
                    <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">DSCR (Debt Service Coverage Ratio)</Link>
                    {' '}drops to 1.13x (approaching common lender covenant thresholds depending on the loan agreement). To model these risks simultaneously, use the full{' '}
                    <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-semibold">Deal Analyzer underwriting tool</Link>.
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            {isZh ? '指标对比：Cash-on-Cash vs. Cap Rate vs. IRR' : isEs ? 'Comparación: Cash-on-Cash vs. Cap Rate vs. TIR (IRR)' : isPt ? 'Comparação: Cash-on-Cash vs. Cap Rate vs. TIR (IRR)' : 'Comparison: Cash-on-Cash vs. Cap Rate vs. IRR'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600 border-collapse">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {isZh ? '财务指标' : isEs || isPt ? 'Métrica' : 'Metric'}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {isZh ? '核心意义' : isEs ? 'Qué Mide' : isPt ? 'O Que Mede' : 'What It Measures'}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {isZh ? '是否包含债务' : isEs ? '¿Incluye Deuda?' : isPt ? 'Inclui Dívida?' : 'Includes Debt?'}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {isZh ? '是否包含升值' : isEs ? '¿Incluye Plusvalía?' : isPt ? 'Inclui Valorização?' : 'Includes Appreciation?'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-bold text-slate-900">Cap Rate</td>
                  <td className="px-4 py-3">
                    {isZh
                      ? '物业本身的无杠杆当前收益率'
                      : isEs
                      ? 'Rendimiento a nivel de propiedad sin apalancamiento basado en el precio de compra'
                      : isPt
                      ? 'Rendimento a nível de imóvel sem alavancagem com base no preço de compra'
                      : 'Unleveraged property-level yield based on purchase price'}
                  </td>
                  <td className="px-4 py-3 text-rose-600">{isZh ? '否 (No)' : isEs ? 'No' : isPt ? 'Não' : 'No'}</td>
                  <td className="px-4 py-3 text-rose-600">{isZh ? '否 (No)' : isEs ? 'No' : isPt ? 'Não' : 'No'}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-emerald-50/30">
                  <td className="px-4 py-3 font-bold text-emerald-800">Cash-on-Cash</td>
                  <td className="px-4 py-3 text-emerald-900">
                    {isZh
                      ? '股权现金投入的单期杠杆现金回报'
                      : isEs
                      ? 'Rendimiento de caja apalancado en el primer año sobre el capital real invertido'
                      : isPt
                      ? 'Rendimento de caixa alavancado no primeiro ano sobre o capital real investido'
                      : 'Leveraged year-one cash yield on actual equity invested'}
                  </td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">{isZh ? '是 (Yes)' : isEs ? 'Sí' : isPt ? 'Sim' : 'Yes'}</td>
                  <td className="px-4 py-3 text-rose-600">{isZh ? '否 (No)' : isEs ? 'No' : isPt ? 'Não' : 'No'}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-bold text-slate-900">IRR</td>
                  <td className="px-4 py-3">
                    {isZh
                      ? '资金加权年化内部收益率，即使全周期各期净现金流与期末退出价值折现后净现值 (NPV) 为零的折现率'
                      : isEs
                      ? 'Tasa Interna de Retorno (anualizada y ponderada por dinero) que descuenta los flujos de caja y el valor de salida a VAN cero'
                      : isPt
                      ? 'Taxa Interna de Retorno (anualizada e ponderada pelo dinheiro) que desconta os fluxos de caixa e o valor de saída a VPL zero'
                      : 'Money-weighted annualized rate of return (Internal Rate of Return) discounting periodic cash flows and terminal value to zero NPV'}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {isZh ? '取决于模型 (杠杆/无杠杆)' : isEs ? 'Depende del modelo' : isPt ? 'Depende do modelo' : 'Depends on model'}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {isZh ? '取决于模型 (若含退出价值)' : isEs ? 'Depende del modelo' : isPt ? 'Depende do modelo' : 'Depends on model'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pitfalls & Limitations */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {isZh
              ? 'Cash-on-Cash 的常见误区与杠杆效应分析'
              : isEs
              ? 'Limitaciones de Cash-on-Cash y Análisis de Apalancamiento'
              : isPt
              ? 'Limitações do Cash-on-Cash e Análise de Alavancagem'
              : 'Cash-on-Cash Pitfalls & Leverage Analysis'}
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
            <p>
              {isZh
                ? '1. 区分首年现金收益与全周期回报：不可仅凭名义利率与 Cap Rate 对比来判断回报高低。根据计算公式 CoC = (NOI - 年度还贷总额) / (首付 + 过户费用 + 即时 CapEx)，年度还贷总额中的本金摊销会减少现金流分子，而前期费用与改造支出会增加投入分母，两者均会拉低首年现金回报。本金偿还积累的权益以及物业远期升值需结合全周期内部收益率 (IRR) 进行综合评估，它们与首年现金到账收益不是同一指标。'
                : isEs
                ? '1. Distinga el rendimiento de caja del primer año del retorno total a largo plazo: No se debe juzgar si los rendimientos mejoran comparando únicamente la tasa de interés nominal con el Cap Rate. Según la fórmula CoC = (NOI - Servicio Anual de Deuda) / (Pago Inicial + Costos de Cierre + Mejoras Iniciales), la amortización del principal en el servicio de deuda reduce el numerador del flujo de caja, mientras que los costos iniciales aumentan el denominador de capital invertido. La acumulación de capital por amortización y la plusvalía futura deben analizarse mediante la TIR (IRR), que no equivale al efectivo recibido en mano en el año 1.'
                : isPt
                ? '1. Diferencie o retorno em caixa do primeiro ano do retorno total plurianual: Não se deve avaliar se o retorno é superior comparando unicamente a taxa nominal de juros com o Cap Rate. Pela fórmula CoC = (NOI - Serviço Anual da Dívida) / (Entrada + Custos de Fechamento + Reformas Iniciais), a amortização de principal no serviço da dívida reduz o numerador do fluxo de caixa, enquanto custos iniciais e despesas de fechamento elevam o denominador do capital investido. O acúmulo de patrimônio via amortização e a valorização futura devem ser mensurados pela TIR (IRR), que não é o mesmo indicador que o dinheiro em mãos no primeiro ano.'
                : '1. Distinguish Year-One Cash Yield from Total Multi-Year Return: Do not judge whether returns improve simply by comparing the nominal loan interest rate to Cap Rate. Based on the formula CoC = (NOI - Annual Debt Service) / (Down Payment + Closing Costs + Upfront Capex), principal amortization within debt service reduces the cash flow numerator, while upfront fees and capital expenditures expand the cash invested denominator. Both factors compress first-year cash return. Equity buildup from principal paydown and long-term appreciation must be evaluated via whole-life metrics like IRR, which are distinct from first-year cash received.'}
            </p>
            <p>
              {isZh
                ? '2. 不反映本金偿还与资产增值：Cash-on-Cash 仅反映第 1 年税前真实现金流，不包含每月的本金积累、折旧抵税 (Cost Segregation) 及远期出售升值。'
                : isEs
                ? '2. Ignora la Amortización del Principal y la Plusvalía: El rendimiento CoC solo mide el efectivo en mano del primer año. No refleja la acumulación de capital por amortización, escudos fiscales por depreciación ni la plusvalía en la venta futura.'
                : isPt
                ? '2. Ignora a Amortização do Principal e a Valorização: O retorno CoC mede apenas o fluxo de caixa no bolso no primeiro ano. Não reflete a criação de patrimônio por amortização, benefícios fiscais de depreciação nem a valorização futura na saída.'
                : '2. Ignores Principal Paydown & Appreciation: CoC return only measures year-one cash-in-pocket. It ignores equity buildup from loan amortization, depreciation tax shields, and exit appreciation.'}
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

        {/* In-Depth Guide Feature Banner */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {isZh
                  ? '深度回报指南'
                  : isEs
                  ? 'Guía Integral de Retornos'
                  : isPt
                  ? 'Guia Completo de Retornos'
                  : 'In-Depth Returns Guide'}
              </span>
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              {isZh
                ? 'Cash-on-Cash vs IRR：两个核心回报指标的本质区别与实战运用'
                : isEs
                ? 'Retorno sobre Efectivo (CoC) vs TIR (IRR): ¿Cuál Usar y Cuándo?'
                : isPt
                ? 'Retorno sobre Caixa (CoC) vs TIR (IRR): Qual Métrica Usar?'
                : 'Cash-on-Cash Return vs IRR: Which Metric Matters When?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isZh
                ? '详解首年现金流分红与 5 年全周期内部收益率的区别，揭示本金偿还如何推升最终股权倍数，以及专业投资人评估杠杆风险的决策底线。'
                : isEs
                ? 'Comprenda por qué un alto rendimiento en efectivo en el año 1 puede enmascarar una salida débil, cómo la amortización impulsa la TIR y qué métrica priorizan los inversores institucionales.'
                : isPt
                ? 'Entenda por que um alto dividendo no primeiro ano pode mascarar uma saída fraca, como a amortização impulsiona a TIR e o que os investidores institucionais realmente exigem.'
                : 'Understand why a high Cash-on-Cash yield can mask a weak exit, how debt paydown shapes IRR over a 5-year hold, and which metric institutional equity investors actually rely upon.'}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/cash-on-cash-vs-irr/`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shrink-0 transition-all shadow-xs"
          >
            <span>
              {isZh
                ? '阅读完整指南'
                : isEs
                ? 'Leer la Guía Completa'
                : isPt
                ? 'Ler o Guia Completo'
                : 'Read Complete Guide'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Deal Analyzer Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isZh ? '综合分析工具' : isEs ? 'Herramienta Integral de Evaluación' : isPt ? 'Ferramenta Completa de Avaliação' : 'Full Underwriting Tool'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {isZh
                  ? '想同时计算 Cap Rate、NOI、DSCR 和 Cash-on-Cash？'
                  : isEs
                  ? '¿Desea calcular Cap Rate, NOI, DSCR y Cash-on-Cash a la vez?'
                  : isPt
                  ? 'Deseja calcular Cap Rate, NOI, DSCR e Cash-on-Cash juntos?'
                  : 'Need Cap Rate, NOI, DSCR, and Cash-on-Cash all together?'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isZh
                  ? '使用 Deal Analyzer 综合尽调工具，一次输入算出全部核心指标，支持压力测试与 PDF 导出。'
                  : isEs
                  ? 'Utilice Deal Analyzer para calcular todas las métricas inmobiliarias esenciales con una sola entrada y pruebas de estrés.'
                  : isPt
                  ? 'Utilize o Deal Analyzer para calcular todas as principais métricas imobiliárias com uma única entrada e testes de estresse.'
                  : 'Use the Deal Analyzer tool to run all core CRE metrics from a single set of inputs with stress testing.'}
              </p>
            </div>
            <Link
              href={`/${locale}/tools/deal-analyzer/`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              <span>{isZh ? '打开 Deal Analyzer' : isEs ? 'Abrir Deal Analyzer' : isPt ? 'Abrir Deal Analyzer' : 'Launch Deal Analyzer'}</span>
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
