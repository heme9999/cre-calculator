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

function resolveSchemaLanguage(locale: string): string {
  if (locale === 'zh') return 'zh-Hans';
  if (locale === 'es') return 'es';
  if (locale === 'pt') return 'pt-BR';
  return 'en-US';
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
    inLanguage: resolveSchemaLanguage(locale),
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
    inLanguage: resolveSchemaLanguage(locale),
  };
}

export function getGuidesHubJsonLd(url: string, locale: string) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isZh
      ? '商业地产投资与承销实战指南 | CRE Guides'
      : isEs
      ? 'Guías de Inversión y Evaluación Comercial | CRE Guides'
      : isPt
      ? 'Guias de Investimento e Análise Comercial | CRE Guides'
      : 'Commercial Real Estate Underwriting Guides | CRE Guides',
    description: isZh
      ? '系统掌握净营业收入 NOI 重构、全美主流城市 Cap Rate 示意区间、DSCR 审贷流程与 6 步标准尽调方法论。'
      : isEs
      ? 'Marcos prácticos para estimar NOI, rangos ilustrativos de Cap Rate, financiación DSCR y debida diligencia inmobiliaria comercial.'
      : isPt
      ? 'Diretrizes práticas para estimar NOI, faixas ilustrativas de Cap Rate, financiamento DSCR e due diligence imobiliária comercial.'
      : 'Practical frameworks for NOI estimation, illustrative cap rate ranges, DSCR financing standards, and deal underwriting due diligence.',
    url,
    inLanguage: resolveSchemaLanguage(locale),
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
    inLanguage: resolveSchemaLanguage(locale),
  };

  if (dateModified) {
    articleSchema.dateModified = dateModified;
  }

  return articleSchema;
}

export function getEditorialWebPageJsonLd(url: string, locale: string) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: isZh
      ? '计算公式与方法论假设 | CRE Methodologies'
      : isEs
      ? 'Metodología de Cálculo y Estándares de Evaluación | CRE Methodologies'
      : isPt
      ? 'Metodologia de Cálculo e Padrões de Avaliação | CRE Methodologies'
      : 'Calculation Methodology & Underwriting Standards | CRE Methodologies',
    description: isZh
      ? '详细了解 CRE Calculators 的计算公式推导逻辑、假设定义与公开研究参考来源。'
      : isEs
      ? 'Conozca nuestras fórmulas transparentes de evaluación inmobiliaria comercial, definiciones de variables y fuentes de referencia.'
      : isPt
      ? 'Conheça nossas fórmulas transparentes de análise imobiliária comercial, definições de variáveis e fontes de referência.'
      : 'Explore our transparent underwriting formulas, variable definitions, and educational reference sources.',
    url,
    inLanguage: resolveSchemaLanguage(locale),
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
      : isEs
      ? [
          'Evaluación inmobiliaria comercial',
          'Tasa de capitalización (Cap Rate)',
          'Ingreso operativo neto (NOI)',
          'Ratio de cobertura del servicio de la deuda (DSCR)',
        ]
      : isPt
      ? [
          'Avaliação imobiliária comercial',
          'Taxa de capitalização (Cap Rate)',
          'Receita operacional líquida (NOI)',
          'Índice de cobertura do serviço da dívida (DSCR)',
        ]
      : [
          'Commercial real estate underwriting',
          'Cap rate',
          'Net operating income',
          'Debt service coverage ratio',
        ],
  };
}
