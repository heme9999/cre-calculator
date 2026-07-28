import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    'calculators/cap-rate',
    'calculators/noi',
    'calculators/cash-on-cash',
    'calculators/loan-payment',
    'calculators/dscr',
    'calculators/1031-exchange',
  ];
  const locales = ['en', 'zh'];

  const items: MetadataRoute.Sitemap = [];

  for (const loc of locales) {
    for (const route of routes) {
      const path = route ? `${loc}/${route}/` : `${loc}/`;
      items.push({
        url: `${SITE_URL}/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.9,
      });
    }
  }

  return items;
}
