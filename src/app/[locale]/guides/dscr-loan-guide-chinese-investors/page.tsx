import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getContent } from '@/content';
import { SITE_URL } from '@/lib/constants';
import { ArticleGuideView } from '@/components/guides/ArticleGuideView';
import { LOCALES } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).dscrLoanGuideChineseInvestorsGuide;

  return buildSeoMetadata({
    path: 'guides/dscr-loan-guide-chinese-investors',
    locale,
    title: content?.metaTitle || 'DSCR Loan Guide',
    description: content?.metaDescription || 'Complete guide to DSCR loans for commercial real estate investors.',
  });
}

export default async function DscrLoanGuideChineseInvestorsPage({ params }: PageProps) {
  const resolvedParams = await params;
  if (resolvedParams.locale !== 'zh') {
    redirect('/en/calculators/dscr/');
  }

  const content = getContent('zh').dscrLoanGuideChineseInvestorsGuide!;

  return (
    <ArticleGuideView
      content={content}
      locale="zh"
      guideSlug="dscr-loan-guide-chinese-investors"
    />
  );
}
