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
    inLanguage: locale === 'zh' ? 'zh-Hans' : 'en-US',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
