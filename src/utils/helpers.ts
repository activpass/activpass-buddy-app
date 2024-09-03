import siteConfig from '@/next-helpers/site.config';

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const getI18nPath = (url: string, locale: string) => {
  if (locale === siteConfig.locale.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};

/**
 * The function `getOptionsFromDisplayConstant` takes an object with string values and returns an array of
 * objects with `value` and `label` properties based on the object's key-value pairs.
 * @param obj - The `obj` parameter in the `getOptionsFromDisplayConstant` function is expected to be an
 * object where the keys are strings and the values are also strings.
 * @returns An array of objects with `value` and `label` properties, where `value` corresponds to the
 * keys of the input object `obj` and `label` corresponds to the values of the input object `obj`.
 */
export const getOptionsFromDisplayConstant = (
  obj: Record<string, { display: string; value: string }>
) => {
  return Object.keys(obj).map(key => ({
    value: obj[key]?.value || key,
    label: obj[key]?.display || '',
  }));
};
