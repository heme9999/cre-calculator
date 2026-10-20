import { Metadata } from 'next';
import { LOCALES, resolveLocale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { propertyCapRatesContent } from '@/content/propertyCapRates';
import { PropertyCapRatePageTemplate } from '@/components/calculators/PropertyCapRatePageTemplate';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = (propertyCapRatesContent[locale] || propertyCapRatesContent.en)['self-storage-cap-rate'];

  return buildSeoMetadata({
    path: 'calculators/self-storage-cap-rate',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
    noindex: locale !== 'en',
  });
}

export default async function SelfStorageCapRatePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = (propertyCapRatesContent[locale] || propertyCapRatesContent.en)['self-storage-cap-rate'];

  return <PropertyCapRatePageTemplate content={content} locale={locale} />;
}
