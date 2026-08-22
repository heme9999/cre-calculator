import React from 'react';
import { SITE_URL } from '@/lib/constants';

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getCalculatorJsonLd(
  name: string,
  description: string,
  url: string,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': ['SoftwareApplication', 'WebApplication'],
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

export function getBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFaqPageJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getWebSiteJsonLd(
  name: string,
  description: string,
  url: string,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    inLanguage: locale === 'zh' ? 'zh-Hans' : 'en-US',
  };
}

export function getGuidesHubJsonLd(url: string, locale: string) {
  const isZh = locale === 'zh';
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isZh ? '商业地产投资与承销实战指南 | CRE Guides' : 'Commercial Real Estate Underwriting Guides | CRE Guides',
    description: isZh
      ? '系统掌握净营业收入 NOI 重构、全美主流城市 Cap Rate 基准、DSCR 审贷流程与 6 步标准尽调方法论。'
      : 'Practical frameworks for NOI estimation, city cap rate benchmarks, DSCR financing standards, and deal underwriting due diligence.',
    url,
    inLanguage: isZh ? 'zh-Hans' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'CRE Calculators',
      url: `${SITE_URL}/`,
    },
  };
}

export function getArticleJsonLd(
  headline: string,
  description: string,
  url: string,
  locale: string,
  datePublished: string = '2026-07-31',
  dateModified?: string
) {
  const isZh = locale === 'zh';
  const articleSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Organization',
      name: 'CRE Calculators',
      url: `${SITE_URL}/${locale}/about/`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CRE Calculators',
      url: `${SITE_URL}/`,
    },
    datePublished,
    image: [
      `${SITE_URL}/og/cre-guides${isZh ? '-zh' : ''}.png`,
    ],
    inLanguage: isZh ? 'zh-Hans' : 'en-US',
  };

  if (dateModified) {
    articleSchema.dateModified = dateModified;
  }

  return articleSchema;
}

export function getEditorialWebPageJsonLd(url: string, locale: string) {
  const isZh = locale === 'zh';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: isZh ? '计算公式与方法论假设 | CRE Methodologies' : 'Calculation Methodology & Underwriting Standards | CRE Methodologies',
    description: isZh
      ? '详细了解 CRE Calculators 的计算公式推导逻辑、假设定义、数据更新频率与全美主要机构数据来源。'
      : 'Explore our transparent underwriting formulas, variable definitions, market benchmark sources, and audit dates.',
    url,
    inLanguage: isZh ? 'zh-Hans' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'CRE Calculators',
      url: `${SITE_URL}/`,
    },
    about: isZh
      ? [
          '商业地产承销',
          '资本化率 Cap Rate',
          '净营业收入 NOI',
          '偿债备付率 DSCR',
        ]
      : [
          'Commercial real estate underwriting',
          'Cap rate',
          'Net operating income',
          'Debt service coverage ratio',
        ],
  };
}
