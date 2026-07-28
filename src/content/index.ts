import { enContent } from './en';
import { zhContent } from './zh';
import { LocaleContent } from './types';

export function getContent(locale: string): LocaleContent {
  if (locale === 'zh') {
    return zhContent;
  }
  return enContent;
}

export { enContent, zhContent };
export type { LocaleContent };
