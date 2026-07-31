import React from 'react';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL } from '@/lib/constants';
import { ArticleGuideView } from '@/components/guides/ArticleGuideView';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).howToEstimateNoiGuide;

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}/guides/how-to-estimate-noi/`,
    },
  };
}

export default async function HowToEstimateNoiPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === 'zh' ? 'zh' : 'en';
  const content = getContent(locale).howToEstimateNoiGuide;

  return (
    <ArticleGuideView
      content={content}
      locale={locale}
      guideSlug="how-to-estimate-noi"
    />
  );
}
