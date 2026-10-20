import { enContent } from './en';
import { zhContent } from './zh';
import { esContent } from './es';
import { ptContent } from './pt';
import { LocaleContent } from './types';

export function getContent(locale: string): LocaleContent {
  if (locale === 'zh') {
    return zhContent;
  }
  if (locale === 'es') {
    return esContent;
  }
  if (locale === 'pt') {
    return ptContent;
  }
  return enContent;
}

export { enContent, zhContent, esContent, ptContent };
export type { LocaleContent };
