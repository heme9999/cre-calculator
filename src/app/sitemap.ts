import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Phase 1 High-Value Indexable URLs: 15 English + 4 Chinese (19 URLs total)
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
  ];

  return approvedUrls.map((url) => ({
    url,
  }));
}
