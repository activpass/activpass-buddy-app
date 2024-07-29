import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/routing/types';

export interface SiteConfig {
  title: string;
  description: string;
  favicon: string;
  lightAccentColor: string;
  darkAccentColor: string;
  locale: {
    locales: string[];
    defaultLocale: string;
    localePrefix: LocalePrefix;
    timeZone: string;
  };
}
