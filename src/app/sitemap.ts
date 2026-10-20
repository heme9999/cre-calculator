import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // High-Value Indexable URLs (43 URLs total: 15 Core EN + 4 Core ZH + 4 Core ES + 4 Core PT + 4 Programmatic Cap Rate + 8 Glossary + 4 City Guides)
  const approvedUrls = [
    // English Core Pages (15)
    `${SITE_URL}/en/`,
    `${SITE_URL}/en/calculators/cap-rate/`,
    `${SITE_URL}/en/calculators/noi/`,
    `${SITE_URL}/en/calculators/cash-on-cash/`,
    `${SITE_URL}/en/calculators/loan-payment/`,
    `${SITE_URL}/en/calculators/dscr/`,
    `${SITE_URL}/en/calculators/1031-exchange/`,
    `${SITE_URL}/en/calculators/lease-vs-buy/`,
    `${SITE_URL}/en/calculators/break-even-ratio/`,
    `${SITE_URL}/en/tools/deal-analyzer/`,
    `${SITE_URL}/en/guides/`,
    `${SITE_URL}/en/guides/cap-rate-benchmarks-by-city/`,
    `${SITE_URL}/en/guides/how-to-estimate-noi/`,
    `${SITE_URL}/en/guides/1031-exchange-process/`,
    `${SITE_URL}/en/guides/how-to-underwrite-a-deal/`,

    // Chinese Core Pages (4)
    `${SITE_URL}/zh/`,
    `${SITE_URL}/zh/calculators/cap-rate/`,
    `${SITE_URL}/zh/calculators/noi/`,
    `${SITE_URL}/zh/calculators/dscr/`,

    // Spanish Core Pages (4)
    `${SITE_URL}/es/`,
    `${SITE_URL}/es/calculators/cap-rate/`,
    `${SITE_URL}/es/calculators/noi/`,
    `${SITE_URL}/es/calculators/dscr/`,

    // Portuguese Core Pages (4)
    `${SITE_URL}/pt/`,
    `${SITE_URL}/pt/calculators/cap-rate/`,
    `${SITE_URL}/pt/calculators/noi/`,
    `${SITE_URL}/pt/calculators/dscr/`,

    // Programmatic Cap Rate Landing Pages (4)
    `${SITE_URL}/en/calculators/multifamily-cap-rate/`,
    `${SITE_URL}/en/calculators/industrial-cap-rate/`,
    `${SITE_URL}/en/calculators/self-storage-cap-rate/`,
    `${SITE_URL}/en/calculators/nnn-lease-cap-rate/`,

    // CRE Glossary Hub & Defined Terms (8)
    `${SITE_URL}/en/glossary/`,
    `${SITE_URL}/en/glossary/noi/`,
    `${SITE_URL}/en/glossary/cap-rate/`,
    `${SITE_URL}/en/glossary/dscr/`,
    `${SITE_URL}/en/glossary/ber/`,
    `${SITE_URL}/en/glossary/beo/`,
    `${SITE_URL}/en/glossary/irr/`,
    `${SITE_URL}/en/glossary/grm/`,

    // City Benchmark Expansion Guides (4)
    `${SITE_URL}/en/guides/cap-rate-benchmarks-by-city/austin-tx-cap-rates/`,
    `${SITE_URL}/en/guides/cap-rate-benchmarks-by-city/miami-fl-cap-rates/`,
    `${SITE_URL}/en/guides/cap-rate-benchmarks-by-city/dallas-tx-cap-rates/`,
    `${SITE_URL}/en/guides/cap-rate-benchmarks-by-city/phoenix-az-cap-rates/`,
  ];

  return approvedUrls.map((url) => ({
    url,
  }));
}
