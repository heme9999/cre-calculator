import Link from 'next/link';
import './globals.css';
import { Building2, Home, Calculator, BookOpen, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/en/" className="flex items-center gap-2 font-bold text-slate-900 text-lg tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <span>CRE Calculators</span>
            </Link>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <Link href="/en/" className="text-slate-600 hover:text-emerald-600 transition-colors">English</Link>
              <span className="text-slate-300">|</span>
              <Link href="/zh/" className="text-slate-600 hover:text-emerald-600 transition-colors">中文</Link>
              <span className="text-slate-300">|</span>
              <Link href="/es/" className="text-slate-600 hover:text-emerald-600 transition-colors">Español</Link>
              <span className="text-slate-300">|</span>
              <Link href="/pt/" className="text-slate-600 hover:text-emerald-600 transition-colors">Português</Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-6 border border-emerald-100 shadow-xs">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            404 — Page Not Found
          </h1>
          <p className="text-base text-slate-600 max-w-md mx-auto mb-10 leading-relaxed">
            The page you are looking for doesn’t exist, has been moved, or the link may be outdated.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto mb-10">
            <Link
              href="/en/"
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all group flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Home</span>
                <span className="block text-xs text-slate-500">Overview & primary tools</span>
              </div>
            </Link>

            <Link
              href="/en/calculators/cap-rate/"
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all group flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Cap Rate Calculator</span>
                <span className="block text-xs text-slate-500">Calculate capitalization rates</span>
              </div>
            </Link>

            <Link
              href="/en/tools/deal-analyzer/"
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all group flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Deal Analyzer</span>
                <span className="block text-xs text-slate-500">Full CRE underwriting suite</span>
              </div>
            </Link>

            <Link
              href="/en/guides/"
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all group flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Guides & Glossary</span>
                <span className="block text-xs text-slate-500">Institutional CRE tutorials</span>
              </div>
            </Link>
          </div>

          <div className="text-xs text-slate-500">
            Need assistance? Contact us at{' '}
            <a href="mailto:mayday0064@gmail.com" className="text-emerald-600 underline hover:text-emerald-500">
              mayday0064@gmail.com
            </a>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CRE Calculators. The Independent Underwriting Suite.</p>
        </footer>
      </body>
    </html>
  );
}
