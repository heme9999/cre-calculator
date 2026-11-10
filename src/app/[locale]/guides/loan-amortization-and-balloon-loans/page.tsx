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
  const content = getContent(locale).loanAmortizationGuide;

  return buildSeoMetadata({
    path: 'guides/loan-amortization-and-balloon-loans',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function LoanAmortizationGuidePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).loanAmortizationGuide;

  return (
    <ArticleGuideView
      content={content}
      locale={locale}
      guideSlug="loan-amortization-and-balloon-loans"
    />
  );
}
