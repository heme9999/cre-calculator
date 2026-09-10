import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
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
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).cashOnCash;

  return buildSeoMetadata({
    path: 'calculators/cash-on-cash',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
    noindex: locale === 'zh',
  });
}

export default async function CashOnCashPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).cashOnCash;
  const isZh = locale === 'zh';

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/cash-on-cash/`,
    locale
  );

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isZh ? '首页' : 'Home', url: `${SITE_URL}/${locale}/` },
    { name: content.h1, url: `${SITE_URL}/${locale}/calculators/cash-on-cash/` },
  ]);

  const faqSchema = getFaqPageJsonLd(content.faqs);

  return (
    <article className="space-y-10 py-4">
      <JsonLd data={[calculatorSchema, breadcrumbSchema, faqSchema]} />

      {/* Page Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">Home</Link>
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
            <span className="font-semibold text-slate-700">{isZh ? '杠杆与承销链路：' : 'Leveraged Underwriting Pipeline:'}</span>
            <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'Cap Rate 无杠杆率' : 'Cap Rate Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/loan-payment/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? '贷款月供测算' : 'Loan Payment Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'DSCR 偿债覆盖率' : 'DSCR Calculator'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-medium">
              {isZh ? 'Deal Analyzer 综合尽调' : 'Deal Analyzer'}
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

        {/* Real Example */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{isZh ? '商业地产分析案例 (Illustrative Example)' : 'Worked Commercial Property Example'}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-4">
            <p>
              {isZh ? '假设您正在评估一处 24 单元的多户住宅物业（24-unit multifamily），购买价为 $2,800,000。' : 'Consider a hypothetical 24-unit multifamily property purchased for $2,800,000.'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{isZh ? '实际投入总现金: $756,000（25% 首付 $700k，加 2% 过户费 $56k）' : 'Total cash invested: $756,000 (25% down payment of $700k, plus 2% closing costs of $56k)'}</li>
              <li>{isZh ? '年有效毛收入 (EGI): $319,200（潜在毛收入 $336k，减去 5% 空置率损失）' : 'Effective gross income (EGI): $319,200 ($336k gross, minus 5% vacancy)'}</li>
              <li>{isZh ? '运营费用 (OpEx): $92,000' : 'Operating expenses: $92,000'}</li>
              <li>{isZh ? '贷款条件: $2,100,000，6.5% 利率，25年摊销' : 'Loan terms: $2,100,000 at 6.5% interest, 25-year amortization'}</li>
            </ul>
            
            <div>
              <strong className="text-slate-900">{isZh ? '步骤 1：从 NOI 到税前现金流' : 'Step 1: From NOI to Pre-Tax Cash Flow'}</strong>
              <p className="mt-1">
                {isZh ? '首先扣除运营费用，我们可以 ' : 'By deducting operating expenses, we '}
                <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? '计算该物业的 NOI' : 'calculate the property\'s NOI'}</Link>
                {isZh ? ' 为 $227,200（这也是 ' : ' at $227,200 (which is used to determine the '}
                <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? '无杠杆 Cap Rate' : 'unleveraged Cap Rate'}</Link>
                {isZh ? ' 的基础）。接着，计算出每年 $170,152 的还贷本息 (Debt Service)。扣除房贷后，您的年税前现金流 (Annual Pre-Tax Cash Flow) 为 $57,048。' : '). Next, we calculate the annual debt service at $170,152. Subtracting the debt service gives you an Annual Pre-Tax Cash Flow of $57,048.'}
              </p>
            </div>

            <div>
              <strong className="text-slate-900">{isZh ? '步骤 2：计算 Cash-on-Cash Return' : 'Step 2: Calculate Cash-on-Cash Return'}</strong>
              <p className="mt-1">
                {isZh ? '将您的 $57,048 税前现金流除以 $756,000 的初始现金投入，您的首年杠杆现金回报率为 7.55%。因为贷款成本 (6.5%) 低于物业的自然收益率 (8.11% Cap Rate)，这被称为正杠杆 (Positive Leverage)。' : 'Dividing your $57,048 cash flow by your $756,000 initial cash invested yields a leveraged Cash-on-Cash Return of 7.55%. Because the debt cost (6.5%) is lower than the property\'s natural yield (8.11% Cap Rate), this represents Positive Leverage.'}
              </p>
            </div>

            <div>
              <strong className="text-amber-700">{isZh ? '步骤 3：压力测试 (Stress Testing)' : 'Step 3: Stress Testing'}</strong>
              <p className="mt-1">
                {isZh ? '如果贷款利率上升到 7.5%，且空置率恶化至 10% 会怎样？' : 'What if loan rates rise to 7.5% and vacancy worsens to 10%?'}
                <br />
                {isZh ? '年还贷本息升至 $186,225，而 NOI 缩水至 $210,400。此时年税前现金流骤降至 $24,175。这意味着在压力情景下，Cash-on-Cash Return 会暴跌至 3.20%。同时，' : 'Annual debt service jumps to $186,225, while NOI shrinks to $210,400. Pre-tax cash flow plummets to $24,175. Under this stress scenario, your Cash-on-Cash Return collapses to just 3.20%. Additionally, your '}
                <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? 'DSCR 偿债覆盖率' : 'DSCR (Debt Service Coverage Ratio)'}</Link>
                {isZh ? ' 将跌至 1.13x 的违约边缘。要一次性测试这些风险，建议使用完整的 ' : ' drops to a dangerously thin 1.13x. To model these risks simultaneously, use the full '}
                <Link href={`/${locale}/tools/deal-analyzer/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? 'Deal Analyzer 综合尽调工具' : 'Deal Analyzer underwriting tool'}</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{isZh ? '指标对比：Cash-on-Cash vs. Cap Rate vs. IRR' : 'Comparison: Cash-on-Cash vs. Cap Rate vs. IRR'}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600 border-collapse">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">{isZh ? '财务指标' : 'Metric'}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{isZh ? '核心意义' : 'What It Measures'}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{isZh ? '是否包含债务' : 'Includes Debt?'}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{isZh ? '是否包含升值' : 'Includes Appreciation?'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-bold text-slate-900">Cap Rate</td>
                  <td className="px-4 py-3">{isZh ? '物业本身的无杠杆当前收益率' : 'Unleveraged property-level yield based on purchase price'}</td>
                  <td className="px-4 py-3 text-rose-600">{isZh ? '否 (No)' : 'No'}</td>
                  <td className="px-4 py-3 text-rose-600">{isZh ? '否 (No)' : 'No'}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-emerald-50/30">
                  <td className="px-4 py-3 font-bold text-emerald-800">Cash-on-Cash</td>
                  <td className="px-4 py-3 text-emerald-900">{isZh ? '股权现金投入的单期杠杆现金回报' : 'Leveraged year-one cash yield on actual equity invested'}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">{isZh ? '是 (Yes)' : 'Yes'}</td>
                  <td className="px-4 py-3 text-rose-600">{isZh ? '否 (No)' : 'No'}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-bold text-slate-900">IRR</td>
                  <td className="px-4 py-3">{isZh ? '考虑持有期内所有现金流与最终退出升值的时间加权总回报' : 'Time-weighted total return across the entire holding period'}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">{isZh ? '是 (Yes)' : 'Yes'}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">{isZh ? '是 (Yes)' : 'Yes'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pitfalls & Limitations */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {isZh ? 'Cash-on-Cash 的常见误区与正负杠杆效应' : 'Cash-on-Cash Pitfalls & Positive/Negative Leverage'}
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
            <p>
              {isZh
                ? '1. 警惕负杠杆 (Negative Leverage)：当商业贷款常数 (Loan Constant) 高于物业 Cap Rate 时，借钱反而会拉低你的现金回报率。'
                : '1. Negative Leverage Trap: If the borrowing loan constant exceeds the property Cap Rate, adding debt actually decreases your Cash-on-Cash Return below the unleveraged Cap Rate.'}
            </p>
            <p>
              {isZh
                ? '2. 不反映本金偿还与资产增值：Cash-on-Cash 仅反映第 1 年税前真实现金流，不包含每月的本金积累、折旧抵税 (Cost Segregation) 及远期出售升值。'
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

        {/* Deal Analyzer Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-700 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {locale === 'zh' ? '综合分析工具' : 'Full Underwriting Tool'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {locale === 'zh' ? '想同时计算 Cap Rate、NOI、DSCR 和 Cash-on-Cash？' : 'Need Cap Rate, NOI, DSCR, and Cash-on-Cash all together?'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {locale === 'zh' ? '使用 Deal Analyzer 综合尽调工具，一次输入算出全部核心指标，支持压力测试与 PDF 导出。' : 'Use the Deal Analyzer tool to run all core CRE metrics from a single set of inputs with stress testing.'}
              </p>
            </div>
            <Link
              href={`/${locale}/tools/deal-analyzer/`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              <span>{locale === 'zh' ? '打开 Deal Analyzer' : 'Launch Deal Analyzer'}</span>
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
