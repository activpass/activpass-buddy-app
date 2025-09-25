import type { CLIENT_MEMBERSHIP_TENURE } from '@/constants/client/membership.constant';
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

/**
 * Retrieves the keys of an object.
 * @param obj - The object from which to retrieve the keys.
 * @returns An array of keys from the object.
 */
export const getObjectKeys = <T extends Record<string, unknown>>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};

/**
 * Calculates the due date based on the given start date and membership plan tenure.
 *
 * @param {Date} startDate - The start date from which the due date is calculated.
 * @param {MembershipPlan["tenure"]} tenure - The tenure of the membership plan.
 *        It can be "MONTHLY", "QUARTERLY", "HALF_YEARLY", or "YEARLY".
 */
export const getDueDate = (
  tenure: keyof typeof CLIENT_MEMBERSHIP_TENURE | undefined,
  startDate: Date = new Date()
) => {
  const dueDate = new Date(startDate);
  if (tenure === 'MONTHLY') {
    dueDate.setMonth(dueDate.getMonth() + 1); // Next month
  } else if (tenure === 'YEARLY') {
    dueDate.setFullYear(dueDate.getFullYear() + 1); // Next year
  } else if (tenure === 'QUARTERLY') {
    dueDate.setMonth(dueDate.getMonth() + 3); // Next quarter
  } else if (tenure === 'HALF_YEARLY') {
    dueDate.setMonth(dueDate.getMonth() + 6); // Next half year
  }
  return dueDate;
};

// Helper function to convert numbers less than 1000
const convertHundreds = (numValue: number): string => {
  // Number to words mapping
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  let result = '';
  let n = numValue;

  if (n >= 100) {
    result += `${ones[Math.floor(n / 100)]} Hundred`;
    n %= 100;
    if (n > 0) result += ' And ';
  }

  if (n >= 20) {
    result += tens[Math.floor(n / 10)];
    n %= 10;
    if (n > 0) result += `-${ones[n]}`;
  } else if (n > 0) {
    result += ones[n];
  }

  return result;
};

/**
 * Converts a number into words following the Indian numbering system.
 * Supports numbers up to 99,99,99,999 (nine crores, ninety-nine lakhs, ninety-nine thousand, nine hundred and ninety-nine).
 *
 * @param {number | string} amount - The amount to convert to words. Can be a number or string with commas.
 * @returns {string} The amount in words.
 *
 * @example
 * convertAmountToWords(1299222) // "twelve lakh ninety-nine thousand two hundred and twenty-two"
 * convertAmountToWords("12,99,222") // "twelve lakh ninety-nine thousand two hundred and twenty-two"
 * convertAmountToWords(0) // "zero"
 * convertAmountToWords(1) // "one"
 */
export const convertAmountToWords = (amount: number | string): string => {
  // Convert string input to number by removing commas
  let num = typeof amount === 'string' ? parseInt(amount.replace(/,/g, ''), 10) : amount || 0;

  // Handle edge cases
  if (Number.isNaN(num)) {
    throw new Error('Invalid input: not a valid number');
  }

  if (num === 0) return 'Zero';
  if (num < 0) return `Minus ${convertAmountToWords(-num)}`;
  if (num > 999999999) {
    throw new Error('Number too large: maximum supported is 99,99,99,999');
  }

  let result = '';

  // Handle crores (10,000,000)
  if (num >= 10000000) {
    const crores = Math.floor(num / 10000000);
    result += `${convertHundreds(crores)} Crore`;
    num %= 10000000;
    if (num > 0) result += ' ';
  }

  // Handle lakhs (100,000)
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    result += `${convertHundreds(lakhs)} Lakh`;
    num %= 100000;
    if (num > 0) result += ' ';
  }

  // Handle thousands (1,000)
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    result += `${convertHundreds(thousands)} Thousand`;
    num %= 1000;
    if (num > 0) result += ' ';
  }

  // Handle remaining hundreds, tens, and ones
  if (num > 0) {
    result += convertHundreds(num);
  }

  return result.trim();
};
