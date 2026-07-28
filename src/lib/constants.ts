export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cre-calculator.pages.dev';

export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function getFullUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
