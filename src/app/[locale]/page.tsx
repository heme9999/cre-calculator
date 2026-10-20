import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { JsonLd, getWebSiteJsonLd } from '@/components/seo/JsonLd';
import { Calculator, ArrowRight, TrendingUp, ShieldCheck, Zap, Workflow, BookOpen, Layers } from 'lucide-react';
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
  const locale = resolveLocale(resolvedParams.locale);
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
  const locale = resolveLocale(resolvedParams.locale);
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
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl mt-2">
              {isZh ? '正在分析加杠杆后的真实回报？直接使用我们的 ' : 'Looking to measure your leveraged equity return? Jump straight to our '}
              <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-medium">
                {isZh ? 'Cash-on-Cash 现金回报率计算器' : 'Cash-on-Cash Return Calculator'}
              </Link>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={`/${locale}/tools/deal-analyzer/`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-[background-color,box-shadow,transform] duration-150 ease-out shadow-[0_4px_14px_rgba(5,150,105,0.35)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.45)] active-press"
              >
                <span>{isZh ? '免费分析一笔交易' : 'Run a Free Deal Analysis'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/calculators/cap-rate/`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-[background-color,border-color,transform] duration-150 ease-out border border-slate-200/90 shadow-xs hover:border-slate-300 active-press"
              >
                <span>{isZh ? 'Cap Rate 计算器' : 'Cap Rate Calculator'}</span>
              </Link>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isZh ? '免费使用 · 无需注册 · 数据在浏览器本地计算 · 支持 PDF 与 CSV 导出' : 'Free · No signup · Calculations run in your browser · PDF & CSV export'}
            </p>

            {/* New to CRE Onboarding Block */}
            <nav
              aria-label={isZh ? '商业地产新手入门路径' : 'New to CRE starter path'}
              data-testid="new-to-cre-start-here"
              className="bg-slate-50/80 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-left space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>{isZh ? '商业地产新手？从这里开始 (New to CRE? Start here)' : 'New to CRE? Start here'}</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {isZh ? '3 步看懂第一笔商业地产交易' : '3 steps to analyze your first deal'}
                </span>
              </div>

              <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <li className="bg-white border border-slate-200/90 hover:border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between gap-1.5 transition-[border-color,box-shadow] duration-150 shadow-xs">
                  <div>
                    <Link
                      href={`/${locale}/calculators/noi/`}
                      className="font-bold text-slate-900 hover:text-emerald-600 inline-flex items-center gap-1 transition-colors duration-150"
                    >
                      <span>{isZh ? '1. 先认识 NOI' : '1. Understand NOI'}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" aria-hidden="true" />
                    </Link>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                      {isZh
                        ? '净营业收入 (Net Operating Income)：租金扣除空置与日常运营支出后、还房贷前的真实物业年收入。'
                        : 'Net Operating Income: property rent minus vacancy and operating expenses, before any loan payments.'}
                    </p>
                  </div>
                </li>

                <li className="bg-white border border-slate-200/90 hover:border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between gap-1.5 transition-[border-color,box-shadow] duration-150 shadow-xs">
                  <div>
                    <Link
                      href={`/${locale}/calculators/cap-rate/`}
                      className="font-bold text-slate-900 hover:text-emerald-600 inline-flex items-center gap-1 transition-colors duration-150"
                    >
                      <span>{isZh ? '2. 用 Cap Rate 比价格与收益' : '2. Compare with Cap Rate'}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" aria-hidden="true" />
                    </Link>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                      {isZh
                        ? '资本化率 (Capitalization Rate = NOI ÷ 购买价)：假设全款买下时的无杠杆年收益率，横向对比价格与收益。'
                        : 'Capitalization Rate (NOI ÷ Price): unleveraged all-cash annual yield to compare price and return across deals.'}
                    </p>
                  </div>
                </li>

                <li className="bg-white border border-slate-200/90 hover:border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between gap-1.5 transition-[border-color,box-shadow] duration-150 shadow-xs">
                  <div>
                    <Link
                      href={`/${locale}/tools/deal-analyzer/`}
                      className="font-bold text-slate-900 hover:text-emerald-600 inline-flex items-center gap-1 transition-colors duration-150"
                    >
                      <span>{isZh ? '3. 用 Deal Analyzer 看融资与压力情景' : '3. Test Financing in Deal Analyzer'}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" aria-hidden="true" />
                    </Link>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                      {isZh
                        ? '加入贷款与压力情景，检验 DSCR（偿债覆盖率，Debt Service Coverage Ratio：NOI 够付几倍年房贷）与 BER（收支平衡比率，Break-Even Ratio：运营支出加房贷占有效毛收入的比例）。'
                        : 'Model loan terms and stress scenarios to check DSCR (Debt Service Coverage Ratio: how many times NOI covers annual loan payments) and BER (Break-Even Ratio: share of effective gross income consumed by operating expenses and debt service).'}
                    </p>
                  </div>
                </li>
              </ol>
            </nav>
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
              className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.08)] active:scale-[0.99] transition-[border-color,box-shadow,transform] duration-200 ease-out flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors duration-150">
                    {calc.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-150 mb-2">
                  {calc.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {calc.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform duration-150 ease-out">
                <span>{isZh ? '立即开始计算' : 'Launch Calculator'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Semantic Internal Linking Hub: Underwriting Pipeline & Framework Links */}
            {/* Dynamic Underwriting Hub */}
      <section className="space-y-8 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <Layers className="w-3.5 h-3.5" />
            <span>{home.underwritingHub.label}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {home.underwritingHub.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            {home.underwritingHub.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {home.underwritingHub.calculators.map((calc) => (
            <div key={calc.key} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xs transition-[border-color,box-shadow] duration-150 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  <Link href={`/${locale}/calculators/${calc.key}/`} className="hover:text-emerald-600 transition-colors duration-150">
                    {calc.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {calc.desc}
                </p>
              </div>
              <Link href={`/${locale}/calculators/${calc.key}/`} className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:gap-1.5 transition-[gap] duration-150 ease-out active-press">
                <span>{calc.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 mb-2">
                <Workflow className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">
                <Link href={`/${locale}/tools/deal-analyzer/`} className="hover:text-emerald-300 transition-colors duration-150">
                  {isZh ? '综合交易分析' : 'Comprehensive Deal Analyzer'}
                </Link>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isZh ? '在一个工具中合并所有测算并进行压力测试。' : 'Combine all calculations into one master view with stress testing.'}
              </p>
            </div>
            <Link href={`/${locale}/tools/deal-analyzer/`} className="text-xs font-bold text-emerald-300 inline-flex items-center gap-1 hover:gap-1.5 transition-[gap] duration-150 ease-out active-press">
              <span>{isZh ? '运行分析' : 'Run Analysis'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {home.underwritingHub.guides.length > 0 && (
        <section className="space-y-8 bg-slate-50/50 rounded-3xl p-8 md:p-10 border border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{home.underwritingHub.guidesLabel}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {home.underwritingHub.guidesTitle}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                {home.underwritingHub.guidesDesc}
              </p>
            </div>
            <Link href={`/${locale}/guides/`} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 active-press">
              <span>{isZh ? '查看所有指南' : 'View All Guides'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {home.underwritingHub.guides.map((guide) => (
              <Link
                key={guide.key}
                href={`/${locale}/guides/${guide.key}/`}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-emerald-500/50 hover:bg-slate-50 hover:shadow-xs transition-[border-color,background-color,box-shadow] duration-150 ease-out block group bg-white active-press"
              >
                <span className="text-xs font-bold text-emerald-600 group-hover:underline">{guide.label}</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1">{guide.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {guide.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why Us / Value Proposition */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 space-y-8 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.5)] cv-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">{home.whyUsTitle}</h2>
          <p className="text-xs text-slate-400">
            {isZh ? '不写泛泛攻略，只做专业可执行的判断工具' : 'Built around numbers, transparent calculations, and market clarity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {home.whyUsItems.map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 space-y-3 hover:border-slate-600/80 transition-colors duration-150">
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
