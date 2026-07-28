import React from 'react';
import HomePage, { generateMetadata as generateHomeMetadata } from './[locale]/page';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata({ params: Promise.resolve({ locale: 'en' }) });
}

export default async function RootPage() {
  return <HomePage params={Promise.resolve({ locale: 'en' })} />;
}
