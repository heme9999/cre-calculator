import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getContent } from '@/content';
import { SITE_URL } from '@/lib/constants';
import { ArticleGuideView } from '@/components/guides/ArticleGuideView';

export function generateStaticParams() {
  return [{ locale: 'zh' }];
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  if (locale !== 'zh') {
    return {
      title: 'DSCR Calculator — Commercial Real Estate',
    };
  }
  const content = getContent('zh').dscrLoanGuideChineseInvestorsGuide!;

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/zh/guides/dscr-loan-guide-chinese-investors/`,
    },
  };
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
