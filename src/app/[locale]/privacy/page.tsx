import React from 'react';
import { Metadata } from 'next';
import { LOCALES } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { ShieldCheck, Lock } from 'lucide-react';

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
    path: 'privacy',
    locale,
    title: isZh ? '隐私政策 | CRE Calculators' : 'Privacy Policy | CRE Calculators',
    description: isZh
      ? 'CRE Calculators 尊重并保护所有用户的隐私。我们的计算器纯客户端运行，不收集或保存你的任何物业财务测算数据。'
      : 'Learn how CRE Calculators protects your privacy. All underwriting calculation inputs run 100% locally in your browser.',
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';

  return (
    <article className="max-w-4xl mx-auto space-y-8 py-4">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isZh ? '隐私声明' : 'Privacy Policy'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isZh ? '隐私政策 (Privacy Policy)' : 'Privacy Policy'}
        </h1>
        <p className="text-xs text-slate-500">
          {isZh ? '生效日期：2026年8月' : 'Effective Date: August 2026'}
        </p>
      </header>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
        <Lock className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-emerald-950">
            {isZh ? '核心隐私承诺：所有测算数据均保存在本地' : 'Core Commitment: 100% Client-Side Processing'}
          </h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            {isZh
              ? '当你在 Cap Rate、NOI、DSCR 或 Deal Analyzer 工具中输入房屋价格、租金、贷款额等物业数据时，所有计算仅在你的浏览器中处理。我们不会将其发送、上传或存储至任何云端服务器。'
              : 'When you enter financial inputs into our calculators, all processing happens locally in your browser session. We do not upload or store your financial numbers.'}
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-6">
        <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{isZh ? '1. 信息收集' : '1. Information Collection'}</h2>
          <p className="text-slate-600">
            {isZh
              ? '我们不强制要求注册账号即可使用全站所有工具。我们仅收集标准的匿名汇总访问分析数据（例如页面浏览量、国家/地区来源），用于改进产品使用体验。'
              : 'We do not require account creation to use any tool. We collect standard aggregated analytical information (e.g., pageviews, general geography) to optimize site performance.'}
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{isZh ? '2. Cookie 与本地存储' : '2. Cookies & Local Storage'}</h2>
          <p className="text-slate-600">
            {isZh
              ? '我们使用 Cookie 或 LocalStorage 仅用于保存你的偏好设置（如当前选中的语言版本、测试历史记录）。你可以随时清除浏览器的缓存与 LocalStorage 记录。'
              : 'We use local storage strictly to remember your preferences (such as selected language and deal analyzer history). You can clear this data anytime.'}
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{isZh ? '3. 第三方服务' : '3. Third-Party Services'}</h2>
          <p className="text-slate-600">
            {isZh
              ? '本站托管于 Cloudflare 边缘节点网络。Cloudflare 可能会收集标准的网络层访问日志（如 IP 地址、浏览器 Request Header），以抵御 DDoS 攻击并提供 CDN 加速。'
              : 'Our website is hosted on Cloudflare network infrastructure. Cloudflare may process network-level request metrics for anti-DDoS and CDN acceleration.'}
          </p>
        </section>
      </div>
    </article>
  );
}
