'use client';

import React, { useState, useEffect, useRef } from 'react';
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

  const [calcMenuOpen, setCalcMenuOpen] = useState(false);
  const calcMenuRef = useRef<HTMLDivElement>(null);
  const calcMenuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calcMenuRef.current && !calcMenuRef.current.contains(event.target as Node)) {
        setCalcMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setCalcMenuOpen(false);
        calcMenuBtnRef.current?.focus();
      }
    }
    if (calcMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [calcMenuOpen]);


  // Determine target language URL while preserving exact route path
  let targetPath = '/en/';
  if (locale === 'en') {
    // Switch to Chinese
    targetPath = pathname ? pathname.replace(/^\/en/, '/zh') : '/zh/';
  } else {
    // Switch to English
    targetPath = pathname ? pathname.replace(/^\/zh/, '/en') : '/en/';
  }

  // Handle single-language guide: redirect to DSCR calculator if switching from Chinese-only DSCR guide
  if (pathname && pathname.includes('dscr-loan-guide-chinese-investors')) {
    targetPath = '/en/calculators/dscr/';
  }

  // Ensure trailing slash for static export compatibility
  if (!targetPath.endsWith('/')) {
    targetPath += '/';
  }

  const navLinks = [
    { href: `/${locale}/tools/deal-analyzer/`, label: nav.dealAnalyzer, key: 'deal-analyzer', isPrimary: true },
    { href: `/${locale}/guides/`, label: locale === 'zh' ? '指南' : 'Guides', key: 'guides' },
    { href: `/${locale}/calculators/cap-rate/`, label: nav.capRate, key: 'cap-rate' },
    { href: `/${locale}/calculators/noi/`, label: nav.noi, key: 'noi' },
    { href: `/${locale}/calculators/cash-on-cash/`, label: nav.cashOnCash, key: 'cash-on-cash' },
    { href: `/${locale}/calculators/loan-payment/`, label: nav.loanPayment, key: 'loan-payment' },
    { href: `/${locale}/calculators/dscr/`, label: nav.dscr, key: 'dscr' },
    { href: `/${locale}/calculators/1031-exchange/`, label: nav.exchange1031, key: '1031-exchange' },
    { href: `/${locale}/calculators/lease-vs-buy/`, label: nav.leaseVsBuy, key: 'lease-vs-buy' },
    { href: `/${locale}/calculators/break-even-ratio/`, label: nav.breakEvenRatio, key: 'break-even-ratio' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={`/${locale}/`} className="flex items-center gap-2 md:gap-2.5 font-bold text-base md:text-lg text-white hover:text-emerald-400 transition-colors shrink min-w-0">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm shrink-0">
            <Building2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="tracking-tight whitespace-nowrap">{nav.brandName}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium text-slate-300">
          <Link
            href={`/${locale}/tools/deal-analyzer/`}
            className={`hover:text-white transition-colors flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 px-3 py-1 rounded-full border border-emerald-500/40 font-bold text-xs`}
          >
            <span>{nav.dealAnalyzer}</span>
            <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase">
              {locale === 'zh' ? '综合' : 'Suite'}
            </span>
          </Link>

          <Link href={`/${locale}/guides/`} className={`hover:text-white transition-colors ${pathname?.includes('/guides/') ? 'text-emerald-400 font-semibold' : ''}`}>
            {locale === 'zh' ? '指南' : 'Guides'}
          </Link>

          <div className="relative" ref={calcMenuRef}>
            <button
              ref={calcMenuBtnRef}
              type="button"
              onClick={() => setCalcMenuOpen(!calcMenuOpen)}
              aria-expanded={calcMenuOpen}
              aria-controls="calculators-navigation"
              className={`hover:text-white transition-colors flex items-center gap-1 py-4 ${
                pathname === `/${locale}/` || pathname === `/${locale}` ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              <span>{nav.calculators}</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${calcMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              id="calculators-navigation"
              className={`absolute top-full left-1/2 -translate-x-1/2 w-48 transition-all bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-2 flex flex-col ${calcMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
            >
              <Link onClick={() => setCalcMenuOpen(false)}  tabIndex={calcMenuOpen ? 0 : -1} href={`/${locale}/calculators/cap-rate/`} className="px-4 py-2 hover:bg-slate-700 hover:text-emerald-400 transition-colors focus:bg-slate-700 outline-none">
                {nav.capRate}
              </Link>
              <Link onClick={() => setCalcMenuOpen(false)}  tabIndex={calcMenuOpen ? 0 : -1} href={`/${locale}/calculators/noi/`} className="px-4 py-2 hover:bg-slate-700 hover:text-emerald-400 transition-colors focus:bg-slate-700 outline-none">
                {nav.noi}
              </Link>
              <Link onClick={() => setCalcMenuOpen(false)}  tabIndex={calcMenuOpen ? 0 : -1} href={`/${locale}/calculators/cash-on-cash/`} className="px-4 py-2 hover:bg-slate-700 hover:text-emerald-400 transition-colors focus:bg-slate-700 outline-none">
                {nav.cashOnCash}
              </Link>
              <Link onClick={() => setCalcMenuOpen(false)}  tabIndex={calcMenuOpen ? 0 : -1} href={`/${locale}/calculators/loan-payment/`} className="px-4 py-2 hover:bg-slate-700 hover:text-emerald-400 transition-colors focus:bg-slate-700 outline-none">
                {nav.loanPayment}
              </Link>
              <Link onClick={() => setCalcMenuOpen(false)}  tabIndex={calcMenuOpen ? 0 : -1} href={`/${locale}/calculators/dscr/`} className="px-4 py-2 hover:bg-slate-700 hover:text-emerald-400 transition-colors focus:bg-slate-700 outline-none">
                {nav.dscr}
              </Link>
              <Link onClick={() => setCalcMenuOpen(false)}  tabIndex={calcMenuOpen ? 0 : -1} href={`/${locale}/calculators/1031-exchange/`} className="px-4 py-2 hover:bg-slate-700 hover:text-emerald-400 transition-colors focus:bg-slate-700 outline-none">
                {nav.exchange1031}
              </Link>
              <Link onClick={() => setCalcMenuOpen(false)}  tabIndex={calcMenuOpen ? 0 : -1} href={`/${locale}/calculators/lease-vs-buy/`} className="px-4 py-2 hover:bg-slate-700 hover:text-emerald-400 transition-colors focus:bg-slate-700 outline-none">
                {nav.leaseVsBuy}
              </Link>
              <Link onClick={() => setCalcMenuOpen(false)}  tabIndex={calcMenuOpen ? 0 : -1} href={`/${locale}/calculators/break-even-ratio/`} className="px-4 py-2 hover:bg-slate-700 hover:text-emerald-400 transition-colors focus:bg-slate-700 outline-none">
                {nav.breakEvenRatio}
              </Link>
            </div>
          </div>
        </nav>

        {/* Right Section: Language Switcher & Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Language Switcher Button (Always Visible) */}
          <Link
            href={targetPath}
            aria-label="Switch Language"
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-[11px] sm:text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-all shadow-xs shrink-0"
          >
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
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
