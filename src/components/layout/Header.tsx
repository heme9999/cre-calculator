'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getContent } from '@/content';
import { Building2, Globe, ChevronDown, Menu, X, Check } from 'lucide-react';

interface HeaderProps {
  locale: string;
}

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '中文', short: '中' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'pt', label: 'Português', short: 'PT' },
] as const;

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const content = getContent(locale);
  const nav = content.nav;
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [calcMenuOpen, setCalcMenuOpen] = useState(false);
  const calcMenuRef = useRef<HTMLDivElement>(null);
  const calcMenuBtnRef = useRef<HTMLButtonElement>(null);

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const langMenuBtnRef = useRef<HTMLButtonElement>(null);

  const calcMenuItems = [
    { href: `/${locale}/calculators/cap-rate/`, label: nav.capRate },
    { href: `/${locale}/calculators/noi/`, label: nav.noi },
    { href: `/${locale}/calculators/cash-on-cash/`, label: nav.cashOnCash },
    { href: `/${locale}/calculators/loan-payment/`, label: nav.loanPayment },
    { href: `/${locale}/calculators/dscr/`, label: nav.dscr },
    { href: `/${locale}/calculators/1031-exchange/`, label: nav.exchange1031 },
    { href: `/${locale}/calculators/lease-vs-buy/`, label: nav.leaseVsBuy },
    { href: `/${locale}/calculators/break-even-ratio/`, label: nav.breakEvenRatio },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calcMenuRef.current && !calcMenuRef.current.contains(event.target as Node)) {
        setCalcMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (calcMenuOpen) {
          setCalcMenuOpen(false);
          calcMenuBtnRef.current?.focus();
        }
        if (langMenuOpen) {
          setLangMenuOpen(false);
          langMenuBtnRef.current?.focus();
        }
      }
    }
    if (calcMenuOpen || langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [calcMenuOpen, langMenuOpen]);

  function handleCalcBlur(event: React.FocusEvent<HTMLDivElement>) {
    const nextFocused = event.relatedTarget as Node | null;
    if (!calcMenuRef.current?.contains(nextFocused)) {
      setCalcMenuOpen(false);
    }
  }

  function handleLangBlur(event: React.FocusEvent<HTMLDivElement>) {
    const nextFocused = event.relatedTarget as Node | null;
    if (!langMenuRef.current?.contains(nextFocused)) {
      setLangMenuOpen(false);
    }
  }

  // Determine target localized path for any locale
  function getLocalizedPath(targetLocale: string) {
    if (!pathname) return `/${targetLocale}/`;
    let newPath = pathname.replace(/^\/(en|zh|es|pt)/, `/${targetLocale}`);
    // If not matching pattern, fallback
    if (!newPath.startsWith(`/${targetLocale}`)) {
      newPath = `/${targetLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
    }
    // Handle single-language guide: redirect to DSCR calculator if switching away from Chinese-only DSCR guide
    if (newPath.includes('dscr-loan-guide-chinese-investors') && targetLocale !== 'zh') {
      newPath = `/${targetLocale}/calculators/dscr/`;
    }
    if (!newPath.endsWith('/')) {
      newPath += '/';
    }
    return newPath;
  }

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  const glossaryLabel = isZh ? '词汇表' : isEs ? 'Glosario' : isPt ? 'Glossário' : 'Glossary';
  const guidesLabel = isZh ? '指南' : isEs ? 'Guías' : isPt ? 'Guias' : 'Guides';

  const navLinks = [
    { href: `/${locale}/tools/deal-analyzer/`, label: nav.dealAnalyzer, key: 'deal-analyzer', isPrimary: true },
    { href: `/${locale}/guides/`, label: guidesLabel, key: 'guides' },
    { href: `/${locale}/glossary/`, label: glossaryLabel, key: 'glossary' },
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
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 text-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={`/${locale}/`} className="active-press flex items-center gap-2 md:gap-2.5 font-bold text-base md:text-lg text-white hover:text-emerald-400 transition-colors shrink min-w-0">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(16,185,129,0.3)] shrink-0">
            <Building2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="tracking-tight whitespace-nowrap">{nav.brandName}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium text-slate-300">
          <Link
            href={`/${locale}/tools/deal-analyzer/`}
            className="active-press hover:text-white transition-colors flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 hover:text-emerald-200 px-3 py-1 rounded-full border border-emerald-500/35 font-semibold text-xs shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <span>{nav.dealAnalyzer}</span>
            <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase">
              {isZh ? '综合' : 'Suite'}
            </span>
          </Link>

          <Link href={`/${locale}/guides/`} className={`hover:text-white transition-colors ${pathname?.includes('/guides/') ? 'text-emerald-400 font-semibold' : ''}`}>
            {guidesLabel}
          </Link>

          <Link href={`/${locale}/glossary/`} className={`hover:text-white transition-colors ${pathname?.includes('/glossary/') ? 'text-emerald-400 font-semibold' : ''}`}>
            {glossaryLabel}
          </Link>

          <div
            className="relative"
            ref={calcMenuRef}
            onBlur={handleCalcBlur}
          >
            <button
              ref={calcMenuBtnRef}
              type="button"
              onClick={() => setCalcMenuOpen((prev) => !prev)}
              aria-expanded={calcMenuOpen}
              aria-controls="calculators-navigation"
              className={`hover:text-white transition-colors flex items-center gap-1.5 py-4 text-xs font-semibold uppercase tracking-wider ${
                pathname === `/${locale}/` || pathname === `/${locale}` ? 'text-emerald-400 font-bold' : ''
              }`}
            >
              <span>{nav.calculators}</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${calcMenuOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              id="calculators-navigation"
              className={`absolute top-full left-1/2 -translate-x-1/2 w-52 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)] border border-slate-700/60 p-1.5 flex flex-col origin-top transition-[opacity,transform] duration-180 ease-out ${calcMenuOpen ? 'opacity-100 scale-100 visible pointer-events-auto' : 'opacity-0 scale-95 invisible pointer-events-none'}`}
            >
              {calcMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={calcMenuOpen ? undefined : -1}
                  onClick={() => setCalcMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-emerald-300 hover:bg-slate-800/80 active:scale-[0.98] transition-[background-color,color,transform] duration-120 ease-out outline-none"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Right Section: Multi-Language Switcher & Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Accessible Language Switcher Dropdown */}
          <div className="relative" ref={langMenuRef} onBlur={handleLangBlur}>
            <button
              ref={langMenuBtnRef}
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              aria-expanded={langMenuOpen}
              aria-controls="languages-navigation"
              aria-label="Select Language"
              className="active-press flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-all shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLang.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${langMenuOpen ? 'rotate-180 text-emerald-400' : ''}`} />
            </button>

            <div
              id="languages-navigation"
              className={`absolute top-full right-0 mt-2 w-40 bg-slate-900/98 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)] border border-slate-700/80 p-1.5 flex flex-col origin-top-right transition-[opacity,transform] duration-150 ease-out z-50 ${
                langMenuOpen ? 'opacity-100 scale-100 visible pointer-events-auto' : 'opacity-0 scale-95 invisible pointer-events-none'
              }`}
            >
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === locale;
                return (
                  <Link
                    key={lang.code}
                    href={getLocalizedPath(lang.code)}
                    tabIndex={langMenuOpen ? undefined : -1}
                    onClick={() => setLangMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors outline-none ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="active-press lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden bg-slate-900/98 backdrop-blur-xl border-b border-slate-800/80 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Language Switcher Row */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === locale;
              return (
                <Link
                  key={lang.code}
                  href={getLocalizedPath(lang.code)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                    isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.short}
                </Link>
              );
            })}
          </div>

          <Link
            href={`/${locale}/`}
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              pathname === `/${locale}/` || pathname === `/${locale}` ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            {nav.calculators}
          </Link>

          {navLinks.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname?.includes(`/${item.key}/`) ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
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
