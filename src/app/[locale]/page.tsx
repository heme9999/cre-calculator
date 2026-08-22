import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { JsonLd, getWebSiteJsonLd } from '@/components/seo/JsonLd';
import { Calculator, ArrowRight, TrendingUp, ShieldCheck, Zap, Workflow, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { DealAnalyzerPreview } from '@/components/home/DealAnalyzerPreview';
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
  const content = getContent(locale);

  return buildSeoMetadata({
    path: '',
    locale,
    title: content.home.metaTitle,
    description: content.home.metaDescription,
  });
}

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';
  const content = getContent(locale);
  const home = content.home;

  const jsonLdData = getWebSiteJsonLd(
    content.nav.brandName,
    home.metaDescription,
    `${SITE_URL}/${locale}/`,
    locale
  );

  return (
    <div className="space-y-16 py-4">
      <JsonLd data={jsonLdData} />

      {/* Hero Section */}
      <section className="pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Value Proposition, Primary CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-xs">
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isZh ? '美国商业地产 (CRE) 专业投资决策工具' : 'US Commercial Real Estate Underwriting Suite'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {home.heroH1}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {home.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={`/${locale}/tools/deal-analyzer/`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <span>{isZh ? '免费体验 Deal Analyzer' : 'Try Deal Analyzer Suite'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/calculators/cap-rate/`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors border border-slate-300"
              >
                <span>{isZh ? 'Cap Rate 计算器' : 'Cap Rate Calculator'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Original Deal Analyzer Interactive Preview */}
          <div className="lg:col-span-6">
            <DealAnalyzerPreview locale={locale} />
          </div>
        </div>
      </section>

      {/* Featured Calculators Grid */}
      <section className="space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">{home.featuredTitle}</h2>
          <p className="text-sm text-slate-600 mt-1">{home.featuredDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {home.calculators.map((calc) => (
            <Link
              key={calc.slug}
              href={`/${locale}/calculators/${calc.slug}/`}
              className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    {calc.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
                  {calc.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {calc.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                <span>{isZh ? '立即开始计算' : 'Launch Calculator'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Semantic Internal Linking Hub: Underwriting Pipeline & Framework Links */}
      {!isZh ? (
        <section className="space-y-12 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xs">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <Workflow className="w-3.5 h-3.5" />
              <span>Structured Underwriting Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Connect Every Metric Across the Acquisition Lifecycle
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              Institutional commercial real estate acquisitions require assessing cash flow, asset yield, and debt risk in sequence. Explore our connected calculation pipeline:
            </p>
          </div>

          {/* Underwriting Sequence Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Operating Cash Flow</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  <Link href="/en/calculators/noi/" className="hover:text-emerald-600 hover:underline">
                    NOI Calculator
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reconstruct true Net Operating Income by isolating gross potential revenue, vacancy losses, and operating expenses before debt service. Forms the foundation of all commercial valuation.
                </p>
              </div>
              <Link href="/en/calculators/noi/" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
                <span>Calculate NOI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Unleveraged Property Yield</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  <Link href="/en/calculators/cap-rate/" className="hover:text-emerald-600 hover:underline">
                    Cap Rate Calculator
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Determine unleveraged capitalization rates from NOI and purchase price, or reverse-calculate your maximum offer price to hit a required yield target.
                </p>
              </div>
              <Link href="/en/calculators/cap-rate/" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
                <span>Evaluate Cap Rate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Debt Sizing & Coverage</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  <Link href="/en/calculators/dscr/" className="hover:text-emerald-600 hover:underline">
                    DSCR Calculator
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Test whether property NOI comfortably covers annual mortgage debt service to meet commercial bank underwriting minimums (typically 1.20x to 1.25x).
                </p>
              </div>
              <Link href="/en/calculators/dscr/" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
                <span>Check Debt Coverage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Leveraged Equity Return</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  <Link href="/en/calculators/cash-on-cash/" className="hover:text-emerald-600 hover:underline">
                    Cash-on-Cash Return Calculator
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Calculate annual pre-tax cash flow yielded per dollar of equity invested after mortgage payments, loan origination fees, and upfront closing costs.
                </p>
              </div>
              <Link href="/en/calculators/cash-on-cash/" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
                <span>Calculate Cash-on-Cash</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">5</span>
                  <span>Occupancy Risk Margin</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  <Link href="/en/calculators/break-even-ratio/" className="hover:text-emerald-600 hover:underline">
                    Break-Even Ratio Calculator
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Determine the minimum occupancy rate required to cover all operating costs and mortgage debt payments before property cash flow becomes negative.
                </p>
              </div>
              <Link href="/en/calculators/break-even-ratio/" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
                <span>Analyze Break-Even</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-emerald-900 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All-in-One Underwriting</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  <Link href="/en/tools/deal-analyzer/" className="hover:text-emerald-300 hover:underline">
                    Deal Analyzer Suite
                  </Link>
                </h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Run NOI, Cap Rate, DSCR, Cash-on-Cash, and Break-Even Ratio simultaneously from a single input set, apply +5% vacancy stress tests, and export a clean PDF report.
                </p>
              </div>
              <Link href="/en/tools/deal-analyzer/" className="text-xs font-bold text-emerald-300 inline-flex items-center gap-1 hover:gap-2 transition-all">
                <span>Open Deal Analyzer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Core Underwriting Guides Hub */}
          <div className="pt-6 border-t border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>Practical Underwriting Frameworks & Guides</span>
                </h3>
                <p className="text-xs text-slate-500">
                  In-depth guides on valuation metrics, market tiers, and acquisition due diligence.
                </p>
              </div>
              <Link href="/en/guides/" className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1">
                <span>View All Guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/en/guides/cap-rate-benchmarks-by-city/"
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 transition-all block group"
              >
                <span className="text-xs font-bold text-emerald-600 group-hover:underline">Market Benchmarks</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1">US Cap Rate Benchmarks by City & Property Type</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compare capitalization rate ranges across Tier 1 gateway metros, high-growth Sunbelt markets, and tertiary regions.
                </p>
              </Link>

              <Link
                href="/en/guides/how-to-estimate-noi/"
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 transition-all block group"
              >
                <span className="text-xs font-bold text-emerald-600 group-hover:underline">Cash Flow Due Diligence</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1">How to Estimate NOI from Operating Statements</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A step-by-step methodology to reconstruct genuine Net Operating Income when broker packages contain omissions or pro-forma distortions.
                </p>
              </Link>

              <Link
                href="/en/guides/1031-exchange-process/"
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 transition-all block group"
              >
                <span className="text-xs font-bold text-emerald-600 group-hover:underline">Tax Deferral Strategy</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1">1031 Exchange Process & Replacement Rules</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Master the 45-day identification deadline, 180-day closing rule, and debt replacement criteria for full capital gains tax deferral.
                </p>
              </Link>

              <Link
                href="/en/guides/how-to-underwrite-a-deal/"
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 transition-all block group"
              >
                <span className="text-xs font-bold text-emerald-600 group-hover:underline">Acquisition Methodology</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1">How to Underwrite a Commercial Real Estate Deal</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A structured 6-step framework covering rent roll audits, expense normalization, debt sizing, and stress testing.
                </p>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        /* Chinese Homepage Focused Hub: Limited to Approved Chinese Sitemap Pages */
        <section className="space-y-8 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <Layers className="w-3.5 h-3.5" />
              <span>核心指标承销闭环</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              精准评估商业地产项目投资收益与杠杆安全
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              提供符合美国商业地产机构审贷标准的中文计算工具，无须注册即可直接测算：
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  <Link href="/zh/calculators/cap-rate/" className="hover:text-emerald-600 hover:underline">
                    Cap Rate 资本化率计算器
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  快速计算商业地产无杠杆资产收益率，支持根据目标回报率反向推导最高买入价格。
                </p>
              </div>
              <Link href="/zh/calculators/cap-rate/" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                <span>测算 Cap Rate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  <Link href="/zh/calculators/noi/" className="hover:text-emerald-600 hover:underline">
                    NOI 净营业收入计算器
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  扣除空置损失与日常运营开支，还原物业实际运营创收能力，为所有估值与信贷测算提供基石。
                </p>
              </div>
              <Link href="/zh/calculators/noi/" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                <span>测算 NOI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  <Link href="/zh/calculators/dscr/" className="hover:text-emerald-600 hover:underline">
                    DSCR 偿债覆盖率计算器
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  检验物业 NOI 对商业贷款本息月供的覆盖倍数，对照全美商业银行 1.20x–1.25x 审贷基准。
                </p>
              </div>
              <Link href="/zh/calculators/dscr/" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                <span>测算 DSCR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Us / Value Proposition */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 space-y-8 shadow-md cv-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">{home.whyUsTitle}</h2>
          <p className="text-xs text-slate-400">
            {isZh ? '不写泛泛攻略，只做专业可执行的判断工具' : 'Built around numbers, transparent calculations, and market clarity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {home.whyUsItems.map((item, idx) => (
            <div key={idx} className="bg-slate-800/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                {idx === 0 ? <Zap className="w-4 h-4" /> : idx === 1 ? <TrendingUp className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
