import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getCalculatorJsonLd(name: string, description: string, url: string, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    inLanguage: locale === 'zh' ? 'zh-Hans-US' : 'en-US',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function getWebSiteJsonLd(name: string, description: string, url: string, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    inLanguage: locale === 'zh' ? 'zh-Hans-US' : 'en-US',
  };
}

export function getArticleJsonLd(headline: string, description: string, url: string, locale: string, datePublished: string = '2026-07-31') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    inLanguage: locale === 'zh' ? 'zh-Hans-US' : 'en-US',
    datePublished,
    author: {
      '@type': 'Organization',
      name: 'CRE Calculators',
    },
  };
}
