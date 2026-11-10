import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { BreakEvenRatioCalculator } from '@/components/calculators/BreakEvenRatioCalculator';
import { JsonLd, getCalculatorJsonLd, getFaqPageJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, BookOpen, TrendingUp, ShieldCheck } from 'lucide-react';

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
  const content = getContent(locale).breakEvenRatio;

  return buildSeoMetadata({
    path: 'calculators/break-even-ratio',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function BreakEvenRatioPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).breakEvenRatio;
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const homeLabel = isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home';

  const jsonLdData = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/break-even-ratio/`,
    locale
  );

  return (
    <article className="space-y-10 py-4">
      <JsonLd data={jsonLdData} />
      {content.faqs && content.faqs.length > 0 && <JsonLd data={getFaqPageJsonLd(content.faqs)} />}

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
        <BreakEvenRatioCalculator locale={locale} />
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

        {/* Worked Example 1 */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            {isZh ? '商业地产分析案例 1：48 单元花园公寓社区 (Multifamily)' : locale === 'es' ? 'Caso Práctico 1: Complejo Residencial de 48 Unidades' : locale === 'pt' ? 'Exemplo Prático 1: Condomínio Residencial de 48 Unidades' : 'Worked Example 1: 48-Unit Garden Apartment Community'}
          </h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              {isZh
                ? '评估一处位于成熟次级市场的 48 单元花园公寓社区（收购价 $4,600,000）：'
                : locale === 'es'
                ? 'Evaluación de una comunidad multifamiliar de 48 unidades adquirida por $4,600,000:'
                : locale === 'pt'
                ? 'Avaliação de um empreendimento multifamiliar de 48 unidades adquirido por $4,600,000:'
                : 'Consider a 48-unit garden apartment community acquired for $4,600,000 in a stabilized secondary submarket:'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {isZh
                  ? '潜在总收入 (GPI): $576,000 (48 单元 × $1,000/月 × 12) | 5% 空置后有效毛收入 (EGI): $547,200'
                  : locale === 'es'
                  ? 'Ingreso Potencial Bruto (GPI): $576,000 (48 u. × $1,000/mes × 12) | EGI tras 5% vacancia: $547,200'
                  : locale === 'pt'
                  ? 'Receita Bruta Potencial (GPI): $576,000 (48 un. × $1,000/mês × 12) | EGI após 5% vacância: $547,200'
                  : 'Gross Potential Income (GPI): $576,000 (48 units × $1,000/mo × 12) | Effective Gross Income (EGI at 5% vacancy): $547,200'}
              </li>
              <li>
                {isZh
                  ? '年度运营费用 (OpEx): $168,000 (房产税、保险、管理与日常维修)'
                  : locale === 'es'
                  ? 'Gastos operativos anuales (OpEx): $168,000 (impuestos, seguros y mantenimiento)'
                  : locale === 'pt'
                  ? 'Despesas operacionais anuais (OpEx): $168,000 (impostos, seguro e gestão)'
                  : 'Annual Operating Expenses (OpEx): $168,000 (taxes, insurance, management, maintenance)'}
              </li>
              <li>
                {isZh ? (
                  <>
                    年还本付息额 (Annual Debt Service): $279,536（基于 75% LTV 贷款 $3,450,000，利率 6.50%，25 年摊销；详见{' '}
                    <Link href={`/${locale}/calculators/loan-payment/`} className="text-emerald-600 hover:underline">
                      商业贷款月供计算
                    </Link>
                    ）
                  </>
                ) : (
                  <>
                    Annual Debt Service: $279,536 (sized at 75% LTV = $3,450,000 senior debt at 6.50% interest, 25-year amortization; see{' '}
                    <Link href={`/${locale}/calculators/loan-payment/`} className="text-emerald-600 hover:underline">
                      loan payment calculations
                    </Link>
                    )
                  </>
                )}
              </li>
              <li>
                {isZh
                  ? '固定支出总额 (Total Outlays) = $168,000 + $279,536 = $447,536'
                  : 'Total Fixed Annual Outlays = $168,000 (OpEx) + $279,536 (Debt Service) = $447,536'}
              </li>
            </ul>
            <p className="font-semibold text-slate-900 mt-2 whitespace-pre-line">
              {isZh
                ? '计算 Break-Even Ratio (BER) = $447,536 ÷ $547,200 (EGI) = 81.79%\n计算 Break-Even Occupancy (BEO) = $447,536 ÷ $576,000 (GPI) = 77.70%'
                : locale === 'es'
                ? 'Cálculo: Break-Even Ratio (BER) = $447,536 ÷ $547,200 (EGI) = 81.79%\nBreak-Even Occupancy (BEO) = $447,536 ÷ $576,000 (GPI) = 77.70%'
                : locale === 'pt'
                ? 'Cálculo: Break-Even Ratio (BER) = $447,536 ÷ $547,200 (EGI) = 81.79%\nBreak-Even Occupancy (BEO) = $447,536 ÷ $576,000 (GPI) = 77.70%'
                : 'Calculation: Break-Even Ratio (BER) = $447,536 ÷ $547,200 (EGI) = 81.79%\nBreak-Even Occupancy (BEO) = $447,536 ÷ $576,000 (GPI) = 77.70%'}
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              {isZh
                ? '【解读】：BEO 为 77.70%，表明该公寓只需保持约 78% 的实际物理出租率即可覆盖全部营运开支与房贷；而 BER 为 81.79%，处于商业银行普遍认可的 80%–85% 安全承销区间内。'
                : 'Interpretation: A BEO of 77.70% confirms the property only needs ~78% physical occupancy to service debt and cover operating bills. A BER of 81.79% satisfies institutional lender guidelines (typical <=85% hurdle).'}
            </p>
          </div>
        </section>

        {/* Worked Example 2: Industrial Flex Park under Rate Stress */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            {isZh
              ? '商业地产分析案例 2：30,000 平方英尺工业园区 (加息环境下的承销压力测试)'
              : locale === 'es'
              ? 'Caso Práctico 2: Parque Industrial de 30,000 sq ft (Estrés Financiero)'
              : locale === 'pt'
              ? 'Exemplo Prático 2: Parque Industrial de 30,000 sq ft (Estresse Financeiro)'
              : 'Worked Example 2: 30,000 Sq Ft Industrial Flex Park Under Rate Stress'}
          </h2>
          <div className="bg-slate-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              {isZh
                ? '评估一处总买价为 $3,200,000 的工业物流园区，在高利率环境（7.25% 固定贷款）下的盈亏平衡临界点：'
                : 'Evaluate a $3,200,000 multi-tenant light industrial flex park sized during an elevated interest rate environment (7.25% debt):'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {isZh ? '年潜在总租金 (GPI): $360,000 | 7% 结构性空置后 EGI: $334,800' : 'Gross Potential Income: $360,000 | EGI at 7% vacancy: $334,800'}
              </li>
              <li>
                {isZh ? '年度运营费用 (OpEx): $85,000 | 贷款年本息还款 ($2,240,000 贷款按 7.25% 利率，25年摊销): $194,290' : 'Annual Operating Expenses: $85,000 | Annual Debt Service ($2,240,000 loan at 7.25%, 25-yr amort): $194,290'}
              </li>
              <li>
                {isZh ? '年度必须支付总现金 (Total Outlays) = $85,000 + $194,290 = $279,290' : 'Total Required Fixed Outlays: $85,000 + $194,290 = $279,290'}
              </li>
            </ul>
            <p className="font-semibold text-slate-900 mt-2 whitespace-pre-line">
              {isZh
                ? '计算 Break-Even Ratio (BER) = $279,290 ÷ $334,800 (EGI) = 83.42%\n计算 Break-Even Occupancy (BEO) = $279,290 ÷ $360,000 (GPI) = 77.58%'
                : 'Calculation: Break-Even Ratio (BER) = $279,290 ÷ $334,800 (EGI) = 83.42%\nBreak-Even Occupancy (BEO) = $279,290 ÷ $360,000 (GPI) = 77.58%'}
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              {isZh
                ? '【压力测试启示】：当借贷利率上升 75 bps 时，年还贷额增至 $194,290，导致 BER 上升至 83.42%，逼近贷方 85% 的黄色警示线。若遭遇主力租户退租或再招商免租期延长，现金流将快速面临亏损风险。'
                : 'Stress Testing Takeaway: Higher debt costs ($194,290 annual ADS) push the BER up to 83.42%, approaching the 85% lender threshold. Any unexpected leasing vacancy or insurance premium escalation would rapidly jeopardize operational cash flow.'}
            </p>
          </div>
        </section>

        {/* How to Interpret Break-Even Results */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            {isZh
              ? '结果深度解读：放贷机构的三级风险警戒线与承销准则'
              : locale === 'es'
              ? 'Cómo Interpretar el Resultado: Umbrales Bancarios y Zonas de Riesgo'
              : locale === 'pt'
              ? 'Como Interpretar o Resultado: Critérios Bancários e Zonas de Risco'
              : 'How to Interpret Break-Even Results (Lender Underwriting Tiers)'}
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              {isZh
                ? '商业地产放贷机构与机构投资人评估 Break-Even 指标时，通常将结果划分为三个核心风险区间：'
                : 'Commercial mortgage lenders (including Fannie Mae, Freddie Mac, and life companies) categorize break-even metrics into three primary underwriting safety zones:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  {isZh ? '绿色安全区 (BER < 80%)' : 'Green Safe Tier (BER < 80%)'}
                </span>
                <p className="text-emerald-950">
                  {isZh
                    ? '资产具备极其坚实的抗跌缓冲垫层。即使遭遇宏观衰退或局部租户退租，营业收入仍有 20% 以上的下降空间才触及违约线。此类资产最容易获得优厚贷款利率与高 LTV。'
                    : 'The property has an exceptional cash flow cushion. Physical occupancy can drop significantly before the asset faces debt distress. Lenders readily approve optimal interest spreads and maximum leverage.'}
                </p>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  {isZh ? '黄色警示区 (BER 80%–85%)' : 'Yellow Caution Tier (BER 80%–85%)'}
                </span>
                <p className="text-amber-950">
                  {isZh
                    ? '符合大多数成熟商业银行的进场基准，但风险缓冲偏薄。若遇地税重估、财产险大幅涨价或单个大租户违约，现金流易转负。银行常要求设立 3–6 个月的偿债专项准备金 (Debt Service Escrow)。'
                    : 'Acceptable for stabilized properties in primary submarkets, but safety margins are thin. Property tax reassessments or insurance spikes can push the deal into deficit. Lenders often require 3–6 months P&I escrows.'}
                </p>
              </div>

              <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-900 block flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  {isZh ? '红色高危区 (BER > 85%)' : 'Red High-Risk Tier (BER > 85%)'}
                </span>
                <p className="text-rose-950">
                  {isZh
                    ? '高杠杆或高营运成本资产的危险状态。轻微的空置率上升即可引发房贷断供。商业贷方通常会直接拒贷，或强制要求买方追加 10%–15% 的首付款以压缩贷款本金。'
                    : 'Severe default vulnerability. A 5% dip in physical occupancy immediately wipes out operating cash flow. Conventional lenders will decline financing or require additional equity down payment to de-leverage.'}
                </p>
              </div>
            </div>

            {/* In-depth Conceptual Difference: BER vs. BEO */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 mt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>{isZh ? '核心辨析：Break-Even Ratio (BER) 与 Break-Even Occupancy (BEO) 的本质差异' : 'Critical Distinction: Break-Even Ratio (BER) vs. Break-Even Occupancy (BEO)'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {isZh
                  ? '虽然两个指标均衡量违约缓冲，但二者的分母与业务视角有着严格的承销分工：'
                  : 'Although both metrics evaluate safety margins against mortgage default, their denominators address distinct analytical questions:'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block">
                    {isZh ? 'Break-Even Ratio (BER = 固定支出 ÷ EGI)' : 'Break-Even Ratio (BER = Outlays ÷ EGI)'}
                  </span>
                  <p>
                    {isZh
                      ? '分母为有效总收入 (Effective Gross Income)。它反映在当前实际空置率与坏账损失下，物业流入的净现金中有百分之多少已被运营账单与月供刚性锁定。BER 是衡量日常营运脆弱性的“现金流压力计”。'
                      : 'Uses Effective Gross Income (EGI) after current physical vacancy and credit concessions. It measures what percentage of collected actual cash flow is rigidly consumed by required expenses and debt payments.'}
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block">
                    {isZh ? 'Break-Even Occupancy (BEO = 固定支出 ÷ GPI)' : 'Break-Even Occupancy (BEO = Outlays ÷ GPI)'}
                  </span>
                  <p>
                    {isZh
                      ? '分母为潜在毛收入 (Gross Potential Income)。它将所有刚性支出折算为物理出租单元的及格线（例如 100 间公寓中必须租出 78 间）。BEO 是资产管理团队在招商、免租与续约谈判中最直观的“物理安全底线”。'
                      : 'Uses Gross Potential Income (GPI) assuming 100% occupancy at full market rent. It translates fixed annual obligations into the minimum physical occupancy required to avoid operating in the red.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 5 Practical Levers to Lower Break-Even Hurdles */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 mt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isZh ? '实战指南：借款人压降盈亏平衡比率 (BER) 的 5 大有效杠杆' : 'Actionable Strategies: 5 Proven Levers to Lower Break-Even Hurdles'}</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li>
                  <strong>{isZh ? '延长贷款本息摊销期 (Amortization Extension)' : 'Extend Amortization Period'}:</strong>{' '}
                  {isZh
                    ? '将商业贷款摊销期限由 25 年拉长至 30 年，可直接削减约 8% 的年度债务本息支出，瞬间降低 BER 约 3–5 个百分点。'
                    : 'Negotiating a 30-year amortization schedule instead of 25 years reduces annual debt service by approximately 7%–9%, instantly lowering your BER by 300 to 500 basis points.'}
                </li>
                <li>
                  <strong>{isZh ? '争取前期只还息期 (Interest-Only Period)' : 'Secure Initial Interest-Only (IO) Terms'}:</strong>{' '}
                  {isZh
                    ? '在并购后的前 2–3 年争取只还息待遇。免除本金摊销可使年偿债支出下降 20% 以上，为物业装修改造与租金重定价提供极佳的缓冲安全区。'
                    : 'Securing 2 to 3 years of initial IO eliminates principal amortization during the capital improvement or repositioning phase, creating substantial temporary cash flow cushions.'}
                </li>
                <li>
                  <strong>{isZh ? '发起地方房产税复议申诉 (Property Tax Appeal)' : 'Proactively Appeal Property Tax Assessments'}:</strong>{' '}
                  {isZh
                    ? '房产税通常占多户型与零售商业 OpEx 的 30%–45%。聘请专业税务顾问对过高评估发起申诉，一旦成功减免可永久降低固定运营开支。'
                    : 'Property taxes typically comprise 30% to 45% of total operating expenses. Challenging an inflated post-sale reassessment permanently lowers your operating cost baseline.'}
                </li>
                <li>
                  <strong>{isZh ? '推行公用事业分摊制度 (RUBS / Submetering)' : 'Implement Utility Submetering (RUBS)'}:</strong>{' '}
                  {isZh
                    ? '通过水电独立分表或比例分摊制度 (Ratio Utility Billing System)，将水暖电等能源杂费转移由实际租户负担，大幅压缩房东净营运支出。'
                    : 'Passing water, sewer, and trash expenses through to tenants via a Ratio Utility Billing System shifts variable utility inflation off the landlord balance sheet.'}
                </li>
                <li>
                  <strong>{isZh ? '提高首付追加自持权益 (Strategic De-Leveraging)' : 'Increase Equity Down Payment'}:</strong>{' '}
                  {isZh
                    ? '若资产初始 BER 超过 85%，追加 5%–10% 的股权首付以压缩贷款本金，能显著缩减借款规模，直接解除银行拒贷警报。'
                    : 'If an acquisition models above 85% BER, injecting an additional 5% equity down payment reduces debt principal and brings debt service back into conventional bank compliance.'}
                </li>
              </ul>
            </div>

            <p className="pt-2">
              {isZh ? (
                <>
                  在测试物业盈亏平衡缓冲的同时，建议横向对比其资本化率是否在行业健康合理范畴内。请查阅我们的{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    全美主要商业物业 Cap Rate 基准参考表
                  </Link>
                  ，核对目标资产的无杠杆回报水平与市场均值。同时使用{' '}
                  <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-semibold">
                    Deal Analyzer 综合尽调工具
                  </Link>
                  {' '}对空置率与利率进行联动压力测试。
                </>
              ) : (
                <>
                  When testing your break-even margin against market distress, compare the asset&apos;s unlevered yield against peer sectors in our{' '}
                  <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/#national-benchmarks`} className="text-emerald-600 hover:underline font-semibold">
                    National Cap Rate Benchmarks Master Reference Table
                  </Link>
                  , or run multidimensional stress tests in our{' '}
                  <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-semibold">
                    Deal Analyzer Tool
                  </Link>.
                </>
              )}
            </p>
          </div>
        </section>

        {/* Guide Banner */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {isZh
                  ? '专业承销清单'
                  : isEs
                  ? 'Lista de Verificación de Suscripción'
                  : isPt
                  ? 'Checklist de Subscrição'
                  : 'Underwriting Best Practices'}
              </span>
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              {isZh
                ? '商业地产尽调与承销实用核对清单'
                : isEs
                ? 'Lista de Verificación para Evaluación de Bienes Raíces Comerciales'
                : isPt
                ? 'Checklist de Avaliação para Imóveis Comerciais'
                : 'Commercial Real Estate Underwriting Checklist'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isZh
                ? '涵盖实地物业核查、租约审查、债务覆盖压力测试与盈亏平衡出租率标准的完整尽调指引。'
                : isEs
                ? 'Una lista completa que abarca inspección física, auditoría de contratos, pruebas de estrés y ocupación de equilibrio.'
                : isPt
                ? 'Um guia completo cobrindo vistoria do imóvel, auditoria de contratos, estresse de dívida e taxa de equilíbrio.'
                : 'A comprehensive checklist covering property inspections, lease audits, debt service stress tests, and break-even occupancy targets.'}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/commercial-real-estate-underwriting-checklist/`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shrink-0 transition-all shadow-xs"
          >
            <span>
              {isZh
                ? '阅读尽调清单'
                : isEs
                ? 'Leer Lista de Verificación'
                : isPt
                ? 'Ler Checklist'
                : 'Read Underwriting Checklist'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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

        {/* Deal Analyzer Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isZh ? '综合分析工具' : isEs ? 'Herramienta Integral de Evaluación' : isPt ? 'Ferramenta Completa de Avaliação' : 'Full Underwriting Tool'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {isZh
                  ? '用 Deal Analyzer 测算 Break-Even Ratio 与全套尽调指标'
                  : isEs
                  ? 'Evalúe el Break-Even Ratio y Todas las Métricas en Deal Analyzer'
                  : isPt
                  ? 'Avalie o Break-Even Ratio e Todas as Métricas no Deal Analyzer'
                  : 'Evaluate Break-Even Ratio & Full Metrics in Deal Analyzer'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isZh
                  ? '一次输入同步算出 Cap Rate、Cash-on-Cash、DSCR、Break-Even Ratio，支持压力测试与 PDF 导出。'
                  : isEs
                  ? 'Calcule Cap Rate, Cash-on-Cash, DSCR y Break-Even Ratio simultáneamente con pruebas de estrés.'
                  : isPt
                  ? 'Calcule Cap Rate, Cash-on-Cash, DSCR e Break-Even Ratio simultaneamente com testes de estresse.'
                  : 'Calculate Cap Rate, Cash-on-Cash, DSCR, and BER simultaneously with stress testing.'}
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
      </div>
    </article>
  );
}
