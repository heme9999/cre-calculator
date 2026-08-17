import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { LOCALES } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { ShieldCheck, Building2, Award, FileSpreadsheet, ArrowRight } from 'lucide-react';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';

  return buildSeoMetadata({
    path: 'about',
    locale,
    title: isZh ? '关于我们与编辑使命 | CRE Calculators' : 'About Us & Mission | CRE Calculators',
    description: isZh
      ? 'CRE Calculators 致力于为商业地产投资者、经纪人及承销人员提供透明、精准的财务计算工具与尽调数据模型。'
      : 'CRE Calculators provides transparent, institutional-grade commercial real estate underwriting tools and financial models for investors and brokers.',
  });
}

export default async function AboutPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';

  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>{isZh ? '关于我们' : 'About CRE Calculators'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isZh ? '打造专业的商业地产投资决策工具' : 'Transparent & Powerful Commercial Real Estate Financial Analytics'}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {isZh
            ? '我们为商业地产 (CRE) 投资者、小组成员、贷款承销员及跨国投资者提供透明、易用、不要求注册即可直接使用的决策分析工具。'
            : 'We build fast, free, transparent underwriting and valuation calculators engineered specifically for commercial real estate professionals.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isZh ? '公式完全透明' : 'Transparent Formulas'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isZh
              ? '不搞“黑盒算法”。每一个指标（Cap Rate、NOI、DSCR、Cash-on-Cash 等）都公开数学逻辑与推导假设。'
              : 'Zero black-box calculations. Every metric provides plain-math formulas, variable definitions, and step-by-step examples.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isZh ? '零门槛，不留隐私' : 'Privacy-First & No Signup'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isZh
              ? '所有计算逻辑 100% 在你的浏览器客户端执行，不强制要求注册账号，更不会将你的交易数据存入云端数据库。'
              : 'All underwriting runs 100% client-side in your browser. We never collect or store your private property financial numbers.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isZh ? '行业基准参考' : 'Market Benchmarks'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isZh
              ? '定期根据全美主要都市圈（Tier 1-4）与银行机构测算标准更新参考范围，确保测算符合市场实操。'
              : 'Regularly updated with Tier 1-4 US metropolitan cap rate benchmarks and DSCR lender underwriting parameters.'}
          </p>
        </div>
      </div>

      <section className="bg-slate-900 text-white rounded-2xl p-8 space-y-4">
        <h2 className="text-xl font-bold">{isZh ? '查看更多说明与指南' : 'Editorial Policy & Calculation Methodology'}</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          {isZh
            ? '你可以阅读我们的编辑方法论、公式假设定义，或通过联系页面向我们提出意见与功能需求。'
            : 'Review our complete methodology guidelines or get in touch with our product team for feedback.'}
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href={`/${locale}/editorial/`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
          >
            <span>{isZh ? '公式与方法论说明' : 'Calculation Methodology'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={`/${locale}/contact/`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700"
          >
            <span>{isZh ? '联系我们' : 'Contact Us'}</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
