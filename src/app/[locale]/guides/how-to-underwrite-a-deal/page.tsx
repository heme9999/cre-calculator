import React from 'react';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES } from '@/lib/constants';
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
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).howToUnderwriteDealGuide;

  return buildSeoMetadata({
    path: 'guides/how-to-underwrite-a-deal',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
    noindex: locale === 'zh',
  });
}

export default async function HowToUnderwriteDealPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).howToUnderwriteDealGuide;

  return (
    <ArticleGuideView
      content={content}
      locale={locale}
      guideSlug="how-to-underwrite-a-deal"
    />
  );
}
