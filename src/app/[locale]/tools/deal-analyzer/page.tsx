import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
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
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).dealAnalyzer;

  return buildSeoMetadata({
    path: 'tools/deal-analyzer',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
    noindex: locale === 'zh',
  });
}

export default async function DealAnalyzerPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).dealAnalyzer;
  const isZh = locale === 'zh';

  const calculatorSchema = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/tools/deal-analyzer/`,
    locale
  );

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isZh ? '首页' : 'Home', url: `${SITE_URL}/${locale}/` },
    { name: content.h1, url: `${SITE_URL}/${locale}/tools/deal-analyzer/` },
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
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full shadow-xs">
            {locale === 'zh' ? '全流程综合尽调工具' : 'Full Underwriting Suite'}
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
            <span className="font-semibold text-slate-700">{isZh ? '支持单项测算：' : 'Explore Standalone Modules:'}</span>
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
              {isZh ? '商业地产 6 步承销法' : 'Deal Underwriting Guide'}
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

        {/* Real Example */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{isZh ? '商业地产分析案例 (Illustrative Example)' : 'Worked Commercial Property Example'}</h2>
          <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-xl text-sm text-slate-700 leading-relaxed space-y-4">
            <p>
              {isZh ? '假设您正在评估一处 24 单元的多户住宅物业（24-unit multifamily），基础数据如下：' : 'Consider a hypothetical 24-unit multifamily property with the following acquisition and operational assumptions:'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{isZh ? '购买价格: $2,800,000' : 'Purchase price: $2,800,000'}</li>
              <li>{isZh ? '年潜在毛收入: $336,000' : 'Gross potential income: $336,000'}</li>
              <li>{isZh ? '空置率: 5%' : 'Vacancy: 5%'}</li>
              <li>{isZh ? '年度运营费用: $92,000' : 'Operating expenses: $92,000'}</li>
              <li>{isZh ? '首付比例: 25% ($700,000)' : 'Down payment: 25% ($700,000)'}</li>
              <li>{isZh ? '交易过户费: 2% ($56,000)' : 'Closing costs: 2% ($56,000)'}</li>
              <li>{isZh ? '商业贷款: 6.5% 利率，25年摊销期' : 'Commercial loan: 6.5% interest rate, 25-year amortization'}</li>
            </ul>
            
            <div>
              <strong className="text-slate-900">{isZh ? '步骤 1：分析物业现金流 (NOI 与 Cap Rate)' : 'Step 1: Property-Level Cash Flow (NOI & Cap Rate)'}</strong>
              <p className="mt-1">
                {isZh ? '首先扣除空置损失得到有效总收入 (EGI) $319,200。减去运营费用后，我们可以 ' : 'First, deducting vacancy gives an Effective Gross Income (EGI) of $319,200. After subtracting operating expenses, we can '}
                <Link href={`/${locale}/calculators/noi/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? '计算该物业的 NOI' : 'calculate the property\'s NOI'}</Link>
                {isZh ? ' 为 $227,200。基于购买价，这相当于 8.11% 的 ' : ' at $227,200. Based on the purchase price, this translates to an 8.11% '}
                <Link href={`/${locale}/calculators/cap-rate/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? '无杠杆 Cap Rate' : 'unleveraged Cap Rate'}</Link>.
              </p>
            </div>

            <div>
              <strong className="text-slate-900">{isZh ? '步骤 2：债务与股权回报 (DSCR 与 Cash-on-Cash)' : 'Step 2: Debt Coverage & Equity Return (DSCR & Cash-on-Cash)'}</strong>
              <p className="mt-1">
                {isZh ? '按上述条款，年还本付息额 (Annual Debt Service) 为 $170,152。将 NOI 除以债务，我们以此来 ' : 'Based on the loan terms, the annual debt service is $170,152. By dividing the NOI by the debt service, we '}
                <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? '测试贷款方的 DSCR 阈值' : 'test the lender\'s DSCR threshold'}</Link>
                {isZh ? '，结果为健康水平的 1.34x。扣除债务后的税前现金流为 $57,048，对比 $756,000 的总现金投入（首付+过户费），我们可以 ' : ', resulting in a healthy 1.34x coverage. The pre-tax cash flow after debt is $57,048. Compared against the $756,000 total cash invested (down payment + closing costs), we '}
                <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? '衡量投入股权的现金回报率 (Cash-on-Cash Return)' : 'measure cash return on invested equity'}</Link>
                {isZh ? ' 为 7.55%。此交易目前的 ' : ', which yields 7.55%. Currently, the '}
                <Link href={`/${locale}/calculators/break-even-ratio/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? '盈亏平衡点 (Break-Even Ratio)' : 'Break-Even Ratio'}</Link>
                {isZh ? ' 为 82.13%。' : ' is 82.13%.'}
              </p>
            </div>

            <div>
              <strong className="text-amber-700">{isZh ? '步骤 3：压力测试 (Stress Testing)' : 'Step 3: Stress Testing'}</strong>
              <p className="mt-1">
                {isZh ? '基础情景看似健康，但如果你将空置率上调至 10%，并将利率上调至 7.5% 呢？' : 'The base case appears healthy, but what happens if vacancy rises to 10% and interest rates climb to 7.5%?'}
                <br />
                {isZh ? '年还款额上升至 $186,225，而 NOI 下降至 $210,400。此时，DSCR 骤降至 1.13x（可能触发贷款违约条款），且 Cash-on-Cash Return 暴跌至 3.20%。盈亏平衡点也攀升至 82.80% 的危险区域。这就是为什么全面 ' : 'Annual debt service climbs to $186,225, while NOI drops to $210,400. In this scenario, the DSCR plummets to 1.13x (entering the warning zone for many lenders), and the Cash-on-Cash Return shrinks to 3.20%. The Break-Even Ratio also rises to a risky 82.80%. This demonstrates why it is crucial to fully '}
                <Link href={`/${locale}/guides/how-to-underwrite-a-deal/`} className="text-emerald-600 hover:underline font-semibold">{isZh ? '承销商业地产交易' : 'underwrite a commercial real estate deal'}</Link>
                {isZh ? ' 时必须包含下行风险。' : ' incorporating downside risk.'}
              </p>
            </div>
          </div>
        </section>

        {/* Pitfalls & Limitations */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {isZh ? '商业地产全案尽调常见误区' : 'Institutional Underwriting Pitfalls & Common Mistakes'}
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
            <p>
              {isZh
                ? '1. 忽视压力测试：仅看基准情景 (Base Case) 往往过于乐观。必须施加 +5% 空置与 +100 bps 利率压力，检验 DSCR 是否跌破 1.0x 违约警戒线。'
                : '1. Overlooking Stress Testing: Underwriting only base-case pro-formas is dangerous. Always apply +5 percentage points vacancy and +100 bps interest rate stress to test debt coverage resilience.'}
            </p>
            <p>
              {isZh
                ? '2. 低估物业重置准备金：未能足额计提屋顶、HVAC 及外墙维护的资本储备金，会导致账面现金流虚高。'
                : '2. Under-budgeting Replacement Reserves: Omitting capital expenditure reserves (e.g., $250-$350/unit/yr) creates artificially inflated initial cash flow.'}
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
