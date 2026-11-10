import React from 'react';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, resolveLocale } from '@/lib/constants';
import { ArticleGuideView } from '@/components/guides/ArticleGuideView';
import { buildSeoMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).cashOnCashVsIrrGuide;

  return buildSeoMetadata({
    path: 'guides/cash-on-cash-vs-irr',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function CashOnCashVsIrrGuidePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).cashOnCashVsIrrGuide;

  return (
    <ArticleGuideView
      content={content}
      locale={locale}
      guideSlug="cash-on-cash-vs-irr"
    />
  );
}
