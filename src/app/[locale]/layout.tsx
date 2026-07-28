import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { getContent } from '@/content';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale);

  // Derive canonical & hreflang URLs
  const enUrl = `${SITE_URL}/en/`;
  const zhUrl = `${SITE_URL}/zh/`;

  return (
    <html lang={locale === 'zh' ? 'zh-Hans' : 'en'} className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="alternate" hrefLang="en-US" href={enUrl} />
        <link rel="alternate" hrefLang="zh-Hans-US" href={zhUrl} />
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <Header locale={locale} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
