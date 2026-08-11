import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { getContent } from '@/content';
import { Building2, ArrowRight, Sparkles } from 'lucide-react';

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

  return {
    title: isZh ? '商业地产分析工具包 | CRE Tools' : 'Commercial Real Estate Analysis Tools | CRE Tools',
    description: isZh
      ? '综合型商业地产尽调与测算分析工具，支持单次输入计算全部指标、压力测试与一页纸PDF摘要导出。'
      : 'Comprehensive commercial real estate deal analysis tools featuring single-input underwriting, stress testing, and one-page PDF export.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/tools/`,
    },
  };
}

export default async function ToolsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isZh ? '商业地产综合分析工具包' : 'CRE Analysis Tools Suite'}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {isZh
            ? '针对复杂交易场景的综合判断与尽调分析工具，一次输入完成多指标同步测算。'
            : 'Comprehensive analysis tools designed for multi-metric CRE underwriting and deal screening.'}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Link
          href={`/${locale}/tools/deal-analyzer/`}
          className="group bg-slate-900 text-white rounded-2xl p-6 md:p-8 hover:bg-slate-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-md"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isZh ? '核心综合工具' : 'Featured Suite'}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold group-hover:text-emerald-400 transition-colors">
              Deal Analyzer — {isZh ? '一次输入，完整尽调' : 'Full Underwriting, One Input Set'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {isZh
                ? '同时算出 Cap Rate、Cash-on-Cash Return、DSCR、Break-Even Ratio，支持空置/利率压力测试与 PDF 一页纸摘要导出。'
                : 'Calculate Cap Rate, Cash-on-Cash Return, DSCR, and Break-Even Ratio simultaneously. Stress-test against vacancy/interest rate shocks and export a PDF summary.'}
            </p>
          </div>

          <div className="flex items-center text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0">
            <span>{isZh ? '立即进入分析' : 'Launch Deal Analyzer'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
