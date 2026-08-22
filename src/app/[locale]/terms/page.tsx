import React from 'react';
import { Metadata } from 'next';
import { LOCALES } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { FileText, AlertTriangle } from 'lucide-react';

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
    path: 'terms',
    locale,
    title: isZh ? '服务条款 | CRE Calculators' : 'Terms of Use | CRE Calculators',
    description: isZh
      ? '使用 CRE Calculators 网站工具与服务的相关条款、计算免责声明及知识产权说明。'
      : 'Terms of Use and financial disclaimers for using CRE Calculators tools and services.',
    noindex: true,
  });
}

export default async function TermsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';

  return (
    <article className="max-w-4xl mx-auto space-y-8 py-4">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>{isZh ? '服务条款' : 'Terms of Use'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isZh ? '服务条款与财务免责声明' : 'Terms of Use & Financial Disclaimer'}
        </h1>
        <p className="text-xs text-slate-500">
          {isZh ? '生效日期：2026年8月' : 'Effective Date: August 2026'}
        </p>
      </header>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-amber-950">
            {isZh ? '重要财务与法律免责声明' : 'Important Financial & Legal Disclaimer'}
          </h3>
          <p className="text-xs text-amber-900 leading-relaxed">
            {isZh
              ? '本网站提供的所有商业地产计算器、公式推导、数据模型及指南文章仅供财务估算与参考，不构成任何形式的法律、税务（如 1031 Exchange 资格判断）或注册投资顾问建议。在做任何真实交易决策前，请务必咨询你的 CPA、执业律师及专业商业地产经纪。'
              : 'All tools, financial models, and market guidelines provided on this website are for educational and estimation purposes only. They do not constitute legal, CPA tax advice, or formal underwriting commitments. Always consult a qualified professional before executing real estate transactions.'}
          </p>
        </div>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{isZh ? '1. 允许的使用规范' : '1. Permitted Use'}</h2>
          <p className="text-slate-600">
            {isZh
              ? '你可以将本站计算器、导出生成的 PDF 摘要及分析图表用于个人交易评估、团队内部研讨、客户展示及商业地产提案。'
              : 'You are free to use our online calculators and exported PDF deal summaries for personal, team, or professional underwriting and client presentations.'}
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{isZh ? '2. 计算精度与免责' : '2. Accuracy & Limitation of Liability'}</h2>
          <p className="text-slate-600">
            {isZh
              ? '尽管我们致力于确保计算逻辑与全美基准数据的准确性，但真实商业地产尽调受特定城市法规、租约细节、加息波动等复杂变量影响。本站不对因使用本计算器导致的任何直接或间接投资损失承担法律责任。'
              : 'While we strive for accuracy, real estate market conditions and loan underwriting guidelines vary dynamically. We assume no liability for investment decisions made using calculations from this website.'}
          </p>
        </section>
      </div>
    </article>
  );
}
