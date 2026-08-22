import React from 'react';
import { Metadata } from 'next';
import { LOCALES } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { Mail, Building2, HelpCircle } from 'lucide-react';

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
    path: 'contact',
    locale,
    title: isZh ? '联系我们 | CRE Calculators' : 'Contact Us | CRE Calculators',
    description: isZh
      ? '欢迎通过邮件与建议表单联系 CRE Calculators 团队，提出计算器需求、功能改进建议或商业合作。'
      : 'Get in touch with the CRE Calculators team for feature requests, calculator suggestions, or business inquiries.',
    noindex: true,
  });
}

export default async function ContactPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';

  return (
    <article className="max-w-3xl mx-auto space-y-10 py-4">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <Mail className="w-4 h-4 text-emerald-600" />
          <span>{isZh ? '联系与反馈' : 'Contact Us'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isZh ? '有任何建议或计算需求？与我们联系' : 'We’d Love to Hear Your Feedback'}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {isZh
            ? '不管是计算逻辑疑问、新计算器需求建议，还是数据合作，请随时与我们的产品团队联系。'
            : 'Have questions about calculation formulas or feature requests? Contact our team anytime.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{isZh ? '电子邮件' : 'Direct Email'}</h3>
            <p className="text-xs text-slate-500 mt-1">{isZh ? '一般反馈与数据问题咨询' : 'General inquiries and support'}</p>
          </div>
          <a
            href="mailto:support@crecalculators.com"
            className="inline-block text-emerald-600 font-bold text-sm hover:underline"
          >
            support@crecalculators.com
          </a>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{isZh ? '商业与合作' : 'Partnership & Media'}</h3>
            <p className="text-xs text-slate-500 mt-1">{isZh ? '机构白标、定制工具与数据合作' : 'White-label reports & API access'}</p>
          </div>
          <a
            href="mailto:contact@crecalculators.com"
            className="inline-block text-emerald-600 font-bold text-sm hover:underline"
          >
            contact@crecalculators.com
          </a>
        </div>
      </div>

      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          {isZh ? '常见问题与答复时间' : 'Response Times'}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {isZh
            ? '我们会在 1-2 个工作日内回复所有关于计算精度、公式假设或功能需求的邮件。如果是定制需求，请在邮件中包含具体指标说明。'
            : 'We typically respond to all feedback within 1-2 business days.'}
        </p>
      </section>
    </article>
  );
}
