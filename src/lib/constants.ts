export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crecalculators.com';

export const LOCALES = ['en', 'zh', 'es', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function resolveLocale(raw: string | undefined): Locale {
  if (raw === 'zh' || raw === 'es' || raw === 'pt') return raw;
  return 'en';
}

export function getFullUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
