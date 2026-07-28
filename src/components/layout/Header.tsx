'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getContent } from '@/content';
import { Building2, Globe, ChevronRight, Menu, X } from 'lucide-react';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const content = getContent(locale);
  const nav = content.nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { href: `/${locale}/calculators/cap-rate/`, label: nav.capRate, key: 'cap-rate' },
    { href: `/${locale}/calculators/noi/`, label: nav.noi, key: 'noi' },
    { href: `/${locale}/calculators/cash-on-cash/`, label: nav.cashOnCash, key: 'cash-on-cash' },
    { href: `/${locale}/calculators/loan-payment/`, label: nav.loanPayment, key: 'loan-payment' },
  ];

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

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link
            href={`/${locale}/`}
            className={`hover:text-white transition-colors ${
              pathname === `/${locale}/` || pathname === `/${locale}` ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            {nav.calculators}
          </Link>

          {navLinks.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`hover:text-white transition-colors ${
                pathname?.includes(`/${item.key}/`) ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Language Switcher & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {/* Language Switcher Button (Always Visible) */}
          <Link
            href={targetPath}
            aria-label="Switch Language"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-all shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{nav.switchLangLabel}</span>
            <ChevronRight className="w-3 h-3 text-emerald-400" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <Link
            href={`/${locale}/`}
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-sm font-semibold border-b border-slate-800 ${
              pathname === `/${locale}/` || pathname === `/${locale}` ? 'text-emerald-400' : 'text-slate-300'
            }`}
          >
            {nav.calculators}
          </Link>

          {navLinks.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium border-b border-slate-800 last:border-0 ${
                pathname?.includes(`/${item.key}/`) ? 'text-emerald-400 font-bold' : 'text-slate-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
