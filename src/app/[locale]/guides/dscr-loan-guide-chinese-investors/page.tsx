import React from 'react';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { ArticleGuideView } from '@/components/guides/ArticleGuideView';
import { buildSeoMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return [{ locale: 'zh' }];
}

export async function generateMetadata(): Promise<Metadata> {
  const content = getContent('zh').dscrLoanGuideChineseInvestorsGuide!;

  return buildSeoMetadata({
    path: 'guides/dscr-loan-guide-chinese-investors',
    locale: 'zh',
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function DscrLoanGuideChineseInvestorsPage() {
  const content = getContent('zh').dscrLoanGuideChineseInvestorsGuide!;

  return (
    <ArticleGuideView
      content={content}
      locale="zh"
      guideSlug="dscr-loan-guide-chinese-investors"
    />
  );
}
