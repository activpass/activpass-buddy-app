import { z } from 'zod';

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
 * Converts the values of an object into an array for Zod enum.
 *
 * @template T - The type of the object.
 * @param obj - The object to convert.
 * @returns - The converted array of values.
 * @throws - Throws an error if the object is empty.
 */
export const convertObjectValuesForZodEnum = <T extends Record<string, string>>(obj: T) => {
  const values = Object.values(obj);
  if (!values.length) {
    throw new Error('Empty object');
  }
  return [...values] as [T[keyof T], ...T[keyof T][]];
};

/**
 * Converts the keys of an object into an array for Zod enum.
 *
 * @template T - The type of the object.
 * @param obj - The object to convert.
 * @returns - The converted array of values.
 * @throws - Throws an error if the object is empty.
 */
export const convertObjectKeysForZodEnum = <
  T extends Record<string, string>,
  TKey = keyof T extends string ? keyof T : never,
>(
  obj: T
) => {
  const keys = Object.keys(obj);
  if (!keys.length) {
    throw new Error('Empty object');
  }
  return [...keys] as [TKey, ...TKey[]];
};

/**
 * Converts an object's keys into a Zod enum.
 *
 * @param obj - The object containing key-value pairs.
 * @returns A Zod enum representing the keys of the object.
 */
export const convertObjectKeysIntoZodEnum = <T extends Record<string, string>>(obj: T) => {
  return z.enum(convertObjectKeysForZodEnum(obj));
};

/**
 * Converts the values of an object into a Zod enum.
 *
 * @param obj - The object whose values will be converted.
 * @returns A Zod enum with the converted values.
 */
export const convertObjectValuesIntoZodEnum = <T extends Record<string, string>>(obj: T) => {
  return z.enum(convertObjectValuesForZodEnum(obj));
};
