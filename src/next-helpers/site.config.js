import { availableLocaleCodes, defaultLocale, localePrefix } from './next.locales.js';

/** @type {import('../types/index.js').SiteConfig} */
const site = {
  title: 'Activpass Buddy Dashboard',
  description: 'Activpass Buddy Dashboard',
  favicon: '/favicons/favicon.ico',
  locale: {
    locales: availableLocaleCodes,
    defaultLocale: defaultLocale.code,
    localePrefix: localePrefix,
    timeZone: 'Etc/UTC',
  },
  lightAccentColor: '#333',
  darkAccentColor: '#333',
};

export default site;
