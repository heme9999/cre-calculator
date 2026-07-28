'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getContent } from '@/content';
import { Building2, Globe, ChevronRight } from 'lucide-react';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const content = getContent(locale);
  const nav = content.nav;

  // Determine target language URL while preserving exact route path
  let targetPath = '/en/';
  if (locale === 'en') {
    // Switch to Chinese
    targetPath = pathname ? pathname.replace(/^\/en/, '/zh') : '/zh/';
  } else {
    // Switch to English
    targetPath = pathname ? pathname.replace(/^\/zh/, '/en') : '/en/';
  }

  // Ensure trailing slash for static export compatibility
  if (!targetPath.endsWith('/')) {
    targetPath += '/';
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={`/${locale}/`} className="flex items-center gap-2.5 font-bold text-lg text-white hover:text-emerald-400 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="tracking-tight">{nav.brandName}</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link
            href={`/${locale}/`}
            className={`hover:text-white transition-colors ${
              pathname === `/${locale}/` || pathname === `/${locale}` ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            {nav.calculators}
          </Link>
          <Link
            href={`/${locale}/calculators/cap-rate/`}
            className={`hover:text-white transition-colors ${
              pathname?.includes('/cap-rate/') ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Cap Rate
          </Link>
          <Link
            href={`/${locale}/calculators/noi/`}
            className={`hover:text-white transition-colors ${
              pathname?.includes('/noi/') ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            NOI
          </Link>
          <Link
            href={`/${locale}/calculators/cash-on-cash/`}
            className={`hover:text-white transition-colors ${
              pathname?.includes('/cash-on-cash/') ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Cash-on-Cash
          </Link>
          <Link
            href={`/${locale}/calculators/dscr/`}
            className={`hover:text-white transition-colors ${
              pathname?.includes('/dscr/') ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            DSCR
          </Link>
          <Link
            href={`/${locale}/calculators/loan-payment/`}
            className={`hover:text-white transition-colors ${
              pathname?.includes('/loan-payment/') ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Loan Payment
          </Link>
        </nav>

        {/* Right Section: Language Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href={targetPath}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{nav.switchLangLabel}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>
    </header>
  );
}
