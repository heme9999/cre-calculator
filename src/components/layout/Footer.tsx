import React from 'react';
import Link from 'next/link';
import { getContent } from '@/content';
import { Building2, ShieldAlert } from 'lucide-react';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const isZh = locale === 'zh';
  const content = getContent(locale);
  const nav = content.nav;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span>{nav.brandName}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              {isZh
                ? '专注于美国商业地产 (CRE) 投资决策的数字分析与计算工具站，帮助投资者与经纪人快速做数字判断。'
                : 'Commercial real estate investment calculation tools for investors, brokers, and CRE professionals.'}
            </p>
          </div>

          {/* Calculators Nav */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {isZh ? '计算器导航' : 'Calculators'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/calculators/cap-rate/`} className="hover:text-emerald-400 transition-colors">
                  {nav.capRate}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculators/noi/`} className="hover:text-emerald-400 transition-colors">
                  {nav.noi}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculators/cash-on-cash/`} className="hover:text-emerald-400 transition-colors">
                  {nav.cashOnCash}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculators/loan-payment/`} className="hover:text-emerald-400 transition-colors">
                  {nav.loanPayment}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculators/dscr/`} className="hover:text-emerald-400 transition-colors">
                  {nav.dscr}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculators/1031-exchange/`} className="hover:text-emerald-400 transition-colors">
                  {nav.exchange1031}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculators/lease-vs-buy/`} className="hover:text-emerald-400 transition-colors">
                  {nav.leaseVsBuy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculators/break-even-ratio/`} className="hover:text-emerald-400 transition-colors">
                  {nav.breakEvenRatio}
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides Nav */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {isZh ? '实操指南' : 'Guides'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/guides/cap-rate-benchmarks-by-city/`} className="hover:text-emerald-400 transition-colors">
                  {isZh ? 'Cap Rate全美基准' : 'Cap Rate Benchmarks'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/guides/how-to-estimate-noi/`} className="hover:text-emerald-400 transition-colors">
                  {isZh ? '怎么估算NOI' : 'How to Estimate NOI'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/guides/1031-exchange-process/`} className="hover:text-emerald-400 transition-colors">
                  {isZh ? '1031 Exchange流程' : '1031 Exchange Process'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/guides/how-to-underwrite-a-deal/`} className="hover:text-emerald-400 transition-colors">
                  {isZh ? '商业地产交易尽调' : 'How to Underwrite a Deal'}
                </Link>
              </li>
              {isZh && (
                <li>
                  <Link href="/zh/guides/dscr-loan-guide-chinese-investors/" className="hover:text-emerald-400 transition-colors">
                    DSCR华人贷款指南
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Languages */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {isZh ? '语言版本' : 'Language'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/en/" className={`hover:text-emerald-400 transition-colors ${locale === 'en' ? 'text-emerald-400 font-semibold' : ''}`}>
                  English (US)
                </Link>
              </li>
              <li>
                <Link href="/zh/" className={`hover:text-emerald-400 transition-colors ${locale === 'zh' ? 'text-emerald-400 font-semibold' : ''}`}>
                  简体中文 (US Chinese)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="bg-slate-800/60 border border-slate-800 rounded-xl p-4 mb-8 text-xs text-slate-400 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            {isZh
              ? '免责声明：本站所有计算器与示例仅供财务估算与参考，不构成任何法律、税务或专业投资建议。商业地产投资具有风险，决策前请咨询注册会计师（CPA）及专业执业律师。'
              : 'Disclaimer: The tools and information on this site are provided for financial estimation purposes only and do not constitute legal, tax, or professional investment advice. Always consult a qualified CPA or licensed real estate attorney before executing transactions.'}
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {year} {nav.brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
