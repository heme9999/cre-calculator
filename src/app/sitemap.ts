import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

function getLastModified(url: string): Date {
  // Freshly updated in latest overhaul (Nov 10, 2026)
  if (
    url.endsWith('/') && (url.endsWith('/en/') || url.endsWith('/zh/') || url.endsWith('/es/') || url.endsWith('/pt/')) ||
    url.includes('/calculators/1031-exchange/') ||
    url.includes('/calculators/dscr/') ||
    url.includes('/calculators/cap-rate/') ||
    url.includes('/calculators/break-even-ratio/') ||
    url.includes('/calculators/apartment-building-mortgage/') ||
    url.includes('/guides/dscr-complete-guide/') ||
    url.includes('/guides/loan-amortization-and-balloon-loans/') ||
    url.includes('/guides/cash-on-cash-vs-irr/') ||
    url.includes('/guides/buy-vs-lease-decision-framework/') ||
    url.includes('/guides/commercial-real-estate-underwriting-checklist/') ||
    url.includes('/guides/cap-rate-benchmarks-by-city/') && !url.includes('-cap-rates/') ||
    url.includes('/about/') ||
    url.includes('/contact/') ||
    url.includes('/privacy/') ||
    url.includes('/glossary/irr/') ||
    url.includes('/glossary/grm/')
  ) {
    return new Date('2026-11-10T08:00:00.000Z');
  }

  // Refined calculation tools & core workflows (Nov 9, 2026)
  if (
    url.includes('/calculators/cash-on-cash/') ||
    url.includes('/calculators/loan-payment/') ||
    url.includes('/calculators/noi/') ||
    url.includes('/calculators/lease-vs-buy/') ||
    url.includes('/calculators/free-rental-property-calculator/') ||
    url.includes('/tools/deal-analyzer/') ||
    url.includes('/terms/')
  ) {
    return new Date('2026-11-09T12:00:00.000Z');
  }

  // Niche property cap rate calculators & editorial guidelines (Nov 8, 2026)
  if (
    url.includes('/calculators/multifamily-cap-rate/') ||
    url.includes('/calculators/industrial-cap-rate/') ||
    url.includes('/calculators/self-storage-cap-rate/') ||
    url.includes('/calculators/nnn-lease-cap-rate/') ||
    url.includes('/editorial/') ||
    url.includes('/guides/how-to-underwrite-a-deal/')
  ) {
    return new Date('2026-11-08T10:00:00.000Z');
  }

  // City cap rate benchmark guides & reference guides (Nov 7, 2026)
  if (
    url.includes('-cap-rates/') ||
    url.includes('/guides/how-to-estimate-noi/') ||
    url.includes('/guides/1031-exchange-process/') ||
    url.endsWith('/guides/')
  ) {
    return new Date('2026-11-07T14:00:00.000Z');
  }

  // Baseline glossary definitions & index (Nov 6, 2026)
  return new Date('2026-11-06T09:00:00.000Z');
}

export default function sitemap(): MetadataRoute.Sitemap {

  // 172 High-Value Indexable URLs (43 Symmetrical Routes × 4 Locales: en, zh, es, pt)
  const approvedUrls = [
    // English Pages (43)
    `${SITE_URL}/en/`,
    `${SITE_URL}/en/calculators/cap-rate/`,
    `${SITE_URL}/en/calculators/noi/`,
    `${SITE_URL}/en/calculators/cash-on-cash/`,
    `${SITE_URL}/en/calculators/loan-payment/`,
    `${SITE_URL}/en/calculators/apartment-building-mortgage/`,
    `${SITE_URL}/en/calculators/free-rental-property-calculator/`,
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
    `${SITE_URL}/en/guides/dscr-complete-guide/`,
    `${SITE_URL}/en/guides/loan-amortization-and-balloon-loans/`,
    `${SITE_URL}/en/guides/cash-on-cash-vs-irr/`,
    `${SITE_URL}/en/guides/buy-vs-lease-decision-framework/`,
    `${SITE_URL}/en/guides/commercial-real-estate-underwriting-checklist/`,
    `${SITE_URL}/en/calculators/multifamily-cap-rate/`,
    `${SITE_URL}/en/calculators/industrial-cap-rate/`,
    `${SITE_URL}/en/calculators/self-storage-cap-rate/`,
    `${SITE_URL}/en/calculators/nnn-lease-cap-rate/`,
    `${SITE_URL}/en/glossary/`,
    `${SITE_URL}/en/glossary/noi/`,
    `${SITE_URL}/en/glossary/cap-rate/`,
    `${SITE_URL}/en/glossary/dscr/`,
    `${SITE_URL}/en/glossary/ber/`,
    `${SITE_URL}/en/glossary/beo/`,
    `${SITE_URL}/en/glossary/irr/`,
    `${SITE_URL}/en/glossary/grm/`,
    `${SITE_URL}/en/guides/cap-rate-benchmarks-by-city/austin-tx-cap-rates/`,
    `${SITE_URL}/en/guides/cap-rate-benchmarks-by-city/miami-fl-cap-rates/`,
    `${SITE_URL}/en/guides/cap-rate-benchmarks-by-city/dallas-tx-cap-rates/`,
    `${SITE_URL}/en/guides/cap-rate-benchmarks-by-city/phoenix-az-cap-rates/`,
    `${SITE_URL}/en/about/`,
    `${SITE_URL}/en/privacy/`,
    `${SITE_URL}/en/contact/`,
    `${SITE_URL}/en/editorial/`,
    `${SITE_URL}/en/terms/`,

    // Chinese Pages (43)
    `${SITE_URL}/zh/`,
    `${SITE_URL}/zh/calculators/cap-rate/`,
    `${SITE_URL}/zh/calculators/noi/`,
    `${SITE_URL}/zh/calculators/cash-on-cash/`,
    `${SITE_URL}/zh/calculators/loan-payment/`,
    `${SITE_URL}/zh/calculators/apartment-building-mortgage/`,
    `${SITE_URL}/zh/calculators/free-rental-property-calculator/`,
    `${SITE_URL}/zh/calculators/dscr/`,
    `${SITE_URL}/zh/calculators/1031-exchange/`,
    `${SITE_URL}/zh/calculators/lease-vs-buy/`,
    `${SITE_URL}/zh/calculators/break-even-ratio/`,
    `${SITE_URL}/zh/tools/deal-analyzer/`,
    `${SITE_URL}/zh/guides/`,
    `${SITE_URL}/zh/guides/cap-rate-benchmarks-by-city/`,
    `${SITE_URL}/zh/guides/how-to-estimate-noi/`,
    `${SITE_URL}/zh/guides/1031-exchange-process/`,
    `${SITE_URL}/zh/guides/how-to-underwrite-a-deal/`,
    `${SITE_URL}/zh/guides/dscr-complete-guide/`,
    `${SITE_URL}/zh/guides/loan-amortization-and-balloon-loans/`,
    `${SITE_URL}/zh/guides/cash-on-cash-vs-irr/`,
    `${SITE_URL}/zh/guides/buy-vs-lease-decision-framework/`,
    `${SITE_URL}/zh/guides/commercial-real-estate-underwriting-checklist/`,
    `${SITE_URL}/zh/calculators/multifamily-cap-rate/`,
    `${SITE_URL}/zh/calculators/industrial-cap-rate/`,
    `${SITE_URL}/zh/calculators/self-storage-cap-rate/`,
    `${SITE_URL}/zh/calculators/nnn-lease-cap-rate/`,
    `${SITE_URL}/zh/glossary/`,
    `${SITE_URL}/zh/glossary/noi/`,
    `${SITE_URL}/zh/glossary/cap-rate/`,
    `${SITE_URL}/zh/glossary/dscr/`,
    `${SITE_URL}/zh/glossary/ber/`,
    `${SITE_URL}/zh/glossary/beo/`,
    `${SITE_URL}/zh/glossary/irr/`,
    `${SITE_URL}/zh/glossary/grm/`,
    `${SITE_URL}/zh/guides/cap-rate-benchmarks-by-city/austin-tx-cap-rates/`,
    `${SITE_URL}/zh/guides/cap-rate-benchmarks-by-city/miami-fl-cap-rates/`,
    `${SITE_URL}/zh/guides/cap-rate-benchmarks-by-city/dallas-tx-cap-rates/`,
    `${SITE_URL}/zh/guides/cap-rate-benchmarks-by-city/phoenix-az-cap-rates/`,
    `${SITE_URL}/zh/about/`,
    `${SITE_URL}/zh/privacy/`,
    `${SITE_URL}/zh/contact/`,
    `${SITE_URL}/zh/editorial/`,
    `${SITE_URL}/zh/terms/`,

    // Spanish Pages (43)
    `${SITE_URL}/es/`,
    `${SITE_URL}/es/calculators/cap-rate/`,
    `${SITE_URL}/es/calculators/noi/`,
    `${SITE_URL}/es/calculators/cash-on-cash/`,
    `${SITE_URL}/es/calculators/loan-payment/`,
    `${SITE_URL}/es/calculators/apartment-building-mortgage/`,
    `${SITE_URL}/es/calculators/free-rental-property-calculator/`,
    `${SITE_URL}/es/calculators/dscr/`,
    `${SITE_URL}/es/calculators/1031-exchange/`,
    `${SITE_URL}/es/calculators/lease-vs-buy/`,
    `${SITE_URL}/es/calculators/break-even-ratio/`,
    `${SITE_URL}/es/tools/deal-analyzer/`,
    `${SITE_URL}/es/guides/`,
    `${SITE_URL}/es/guides/cap-rate-benchmarks-by-city/`,
    `${SITE_URL}/es/guides/how-to-estimate-noi/`,
    `${SITE_URL}/es/guides/1031-exchange-process/`,
    `${SITE_URL}/es/guides/how-to-underwrite-a-deal/`,
    `${SITE_URL}/es/guides/dscr-complete-guide/`,
    `${SITE_URL}/es/guides/loan-amortization-and-balloon-loans/`,
    `${SITE_URL}/es/guides/cash-on-cash-vs-irr/`,
    `${SITE_URL}/es/guides/buy-vs-lease-decision-framework/`,
    `${SITE_URL}/es/guides/commercial-real-estate-underwriting-checklist/`,
    `${SITE_URL}/es/calculators/multifamily-cap-rate/`,
    `${SITE_URL}/es/calculators/industrial-cap-rate/`,
    `${SITE_URL}/es/calculators/self-storage-cap-rate/`,
    `${SITE_URL}/es/calculators/nnn-lease-cap-rate/`,
    `${SITE_URL}/es/glossary/`,
    `${SITE_URL}/es/glossary/noi/`,
    `${SITE_URL}/es/glossary/cap-rate/`,
    `${SITE_URL}/es/glossary/dscr/`,
    `${SITE_URL}/es/glossary/ber/`,
    `${SITE_URL}/es/glossary/beo/`,
    `${SITE_URL}/es/glossary/irr/`,
    `${SITE_URL}/es/glossary/grm/`,
    `${SITE_URL}/es/guides/cap-rate-benchmarks-by-city/austin-tx-cap-rates/`,
    `${SITE_URL}/es/guides/cap-rate-benchmarks-by-city/miami-fl-cap-rates/`,
    `${SITE_URL}/es/guides/cap-rate-benchmarks-by-city/dallas-tx-cap-rates/`,
    `${SITE_URL}/es/guides/cap-rate-benchmarks-by-city/phoenix-az-cap-rates/`,
    `${SITE_URL}/es/about/`,
    `${SITE_URL}/es/privacy/`,
    `${SITE_URL}/es/contact/`,
    `${SITE_URL}/es/editorial/`,
    `${SITE_URL}/es/terms/`,

    // Portuguese Pages (43)
    `${SITE_URL}/pt/`,
    `${SITE_URL}/pt/calculators/cap-rate/`,
    `${SITE_URL}/pt/calculators/noi/`,
    `${SITE_URL}/pt/calculators/cash-on-cash/`,
    `${SITE_URL}/pt/calculators/loan-payment/`,
    `${SITE_URL}/pt/calculators/apartment-building-mortgage/`,
    `${SITE_URL}/pt/calculators/free-rental-property-calculator/`,
    `${SITE_URL}/pt/calculators/dscr/`,
    `${SITE_URL}/pt/calculators/1031-exchange/`,
    `${SITE_URL}/pt/calculators/lease-vs-buy/`,
    `${SITE_URL}/pt/calculators/break-even-ratio/`,
    `${SITE_URL}/pt/tools/deal-analyzer/`,
    `${SITE_URL}/pt/guides/`,
    `${SITE_URL}/pt/guides/cap-rate-benchmarks-by-city/`,
    `${SITE_URL}/pt/guides/how-to-estimate-noi/`,
    `${SITE_URL}/pt/guides/1031-exchange-process/`,
    `${SITE_URL}/pt/guides/how-to-underwrite-a-deal/`,
    `${SITE_URL}/pt/guides/dscr-complete-guide/`,
    `${SITE_URL}/pt/guides/loan-amortization-and-balloon-loans/`,
    `${SITE_URL}/pt/guides/cash-on-cash-vs-irr/`,
    `${SITE_URL}/pt/guides/buy-vs-lease-decision-framework/`,
    `${SITE_URL}/pt/guides/commercial-real-estate-underwriting-checklist/`,
    `${SITE_URL}/pt/calculators/multifamily-cap-rate/`,
    `${SITE_URL}/pt/calculators/industrial-cap-rate/`,
    `${SITE_URL}/pt/calculators/self-storage-cap-rate/`,
    `${SITE_URL}/pt/calculators/nnn-lease-cap-rate/`,
    `${SITE_URL}/pt/glossary/`,
    `${SITE_URL}/pt/glossary/noi/`,
    `${SITE_URL}/pt/glossary/cap-rate/`,
    `${SITE_URL}/pt/glossary/dscr/`,
    `${SITE_URL}/pt/glossary/ber/`,
    `${SITE_URL}/pt/glossary/beo/`,
    `${SITE_URL}/pt/glossary/irr/`,
    `${SITE_URL}/pt/glossary/grm/`,
    `${SITE_URL}/pt/guides/cap-rate-benchmarks-by-city/austin-tx-cap-rates/`,
    `${SITE_URL}/pt/guides/cap-rate-benchmarks-by-city/miami-fl-cap-rates/`,
    `${SITE_URL}/pt/guides/cap-rate-benchmarks-by-city/dallas-tx-cap-rates/`,
    `${SITE_URL}/pt/guides/cap-rate-benchmarks-by-city/phoenix-az-cap-rates/`,
    `${SITE_URL}/pt/about/`,
    `${SITE_URL}/pt/privacy/`,
    `${SITE_URL}/pt/contact/`,
    `${SITE_URL}/pt/editorial/`,
    `${SITE_URL}/pt/terms/`,
  ];

  return approvedUrls.map((url) => ({
    url,
    lastModified: getLastModified(url),
  }));
}
