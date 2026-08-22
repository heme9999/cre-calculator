import { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

interface SeoMetadataOptions {
  path: string; // e.g. "calculators/cap-rate" or "" for home
  locale: 'en' | 'zh';
  title: string;
  description: string;
  noindex?: boolean;
}

// Strictly define bilingual routes that have fully developed, indexable counterparts
const BILINGUAL_PAIRED_ROUTES = new Set([
  '',
  'calculators/cap-rate',
  'calculators/noi',
  'calculators/dscr',
]);

function getOgImageInfo(path: string, locale: 'en' | 'zh', title: string) {
  const isZh = locale === 'zh';
  const clean = path.replace(/^\/+|\/+$/g, '');

  if (clean === '' || clean === 'en' || clean === 'zh') {
    return {
      url: `${SITE_URL}/og/cre-calculators-default${isZh ? '-zh' : ''}.png`,
      alt: isZh ? 'CRE Calculators - 美国商业地产投资决策工具包' : 'CRE Calculators - Commercial Real Estate Decision Tools',
    };
  }

  if (clean.includes('deal-analyzer')) {
    return {
      url: `${SITE_URL}/og/deal-analyzer${isZh ? '-zh' : ''}.png`,
      alt: isZh ? 'Deal Analyzer - 商业地产全流程综合尽调与压力测试工具' : 'Deal Analyzer - Commercial Real Estate Underwriting Suite',
    };
  }

  if (clean.includes('cap-rate')) {
    return {
      url: `${SITE_URL}/og/cap-rate-calculator${isZh ? '-zh' : ''}.png`,
      alt: isZh ? 'Cap Rate 资本化率计算器 - 商业地产估值与反向定价工具' : 'Cap Rate Calculator - Commercial Real Estate Valuation Tool',
    };
  }

  if (clean.includes('dscr')) {
    return {
      url: `${SITE_URL}/og/dscr-calculator${isZh ? '-zh' : ''}.png`,
      alt: isZh ? 'DSCR 偿债覆盖率计算器 - 商业银行贷款门槛测算' : 'DSCR Calculator - Debt Service Coverage Ratio Tool',
    };
  }

  if (clean.includes('1031-exchange')) {
    return {
      url: `${SITE_URL}/og/1031-exchange${isZh ? '-zh' : ''}.png`,
      alt: isZh ? '1031 Exchange 延税计算器 - 商业地产资本利得与置换规则' : '1031 Exchange Tax Deferral Calculator',
    };
  }

  if (clean.startsWith('guides')) {
    return {
      url: `${SITE_URL}/og/cre-guides${isZh ? '-zh' : ''}.png`,
      alt: isZh ? 'CRE 商业地产投资实战与承销指南' : 'Commercial Real Estate Underwriting Guides',
    };
  }

  return {
    url: `${SITE_URL}/og/cre-calculators-default${isZh ? '-zh' : ''}.png`,
    alt: isZh ? `${title} - CRE Calculators 商业地产计算器` : `${title} - CRE Calculators`,
  };
}

export function buildSeoMetadata({
  path,
  locale,
  title,
  description,
  noindex = false,
}: SeoMetadataOptions): Metadata {
  const cleanPath = path ? (path.startsWith('/') ? path.slice(1) : path).replace(/\/+$/, '') : '';
  const normalizedPath = cleanPath ? `${cleanPath}/` : '';

  const enUrl = `${SITE_URL}/en/${normalizedPath}`;
  const zhUrl = `${SITE_URL}/zh/${normalizedPath}`;
  const currentUrl = locale === 'zh' ? zhUrl : enUrl;

  const ogImage = getOgImageInfo(cleanPath, locale, title);

  // Build hreflang alternates
  const languages: Record<string, string> = {};

  if (!noindex) {
    if (BILINGUAL_PAIRED_ROUTES.has(cleanPath)) {
      languages['en-US'] = enUrl;
      languages['zh-Hans'] = zhUrl;
      languages['x-default'] = enUrl;
    } else {
      // English-only indexable page
      languages['en-US'] = enUrl;
      languages['x-default'] = enUrl;
    }
  }

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: currentUrl,
      ...(Object.keys(languages).length > 0 ? { languages } : {}),
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: 'CRE Calculators',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage.url,
          width: 1200,
          height: 630,
          alt: ogImage.alt,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
    verification: {
      google: 'wMz2VDeMwD8R6yiCgJIqFD_wM2wSzrSEauzvCtzKHyw',
    },
  };

  if (noindex) {
    metadata.robots = {
      index: false,
      follow: true,
    };
  }

  return metadata;
}
