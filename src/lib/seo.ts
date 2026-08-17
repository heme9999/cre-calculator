import { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

interface SeoMetadataOptions {
  path: string; // e.g. "calculators/cap-rate" or "" for home
  locale: 'en' | 'zh';
  title: string;
  description: string;
}

export function buildSeoMetadata({
  path,
  locale,
  title,
  description,
}: SeoMetadataOptions): Metadata {
  const cleanPath = path ? (path.startsWith('/') ? path.slice(1) : path) : '';
  const normalizedPath = cleanPath ? (cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`) : '';

  const enUrl = `${SITE_URL}/en/${normalizedPath}`;
  const zhUrl = `${SITE_URL}/zh/${normalizedPath}`;
  const currentUrl = locale === 'zh' ? zhUrl : enUrl;

  return {
    title,
    description,
    alternates: {
      canonical: currentUrl,
      languages: {
        'en-US': enUrl,
        'zh-Hans-US': zhUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: 'CRE Calculators',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
