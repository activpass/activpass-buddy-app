import siteConfig from '@/next-helpers/site.config';

import { convertAmountToWords, getI18nPath } from './helpers';

describe('Helpers', () => {
  describe('getI18nPath function', () => {
    it('should not change the path for default language', () => {
      const url = '/random-url';
      const locale = siteConfig.locale.defaultLocale;

      expect(getI18nPath(url, locale)).toBe(url);
    });

    it('should prepend the locale to the path for non-default language', () => {
      const url = '/random-url';
      const locale = 'fr';

      expect(getI18nPath(url, locale)).toMatch(/^\/fr/);
    });
  });

  describe('convertAmountToWords function', () => {
    it('should handle zero', () => {
      expect(convertAmountToWords(0)).toBe('Zero');
    });

    it('should handle single digits', () => {
      expect(convertAmountToWords(1)).toBe('One');
      expect(convertAmountToWords(5)).toBe('Five');
      expect(convertAmountToWords(9)).toBe('Nine');
    });

    it('should handle teens', () => {
      expect(convertAmountToWords(10)).toBe('Ten');
      expect(convertAmountToWords(11)).toBe('Eleven');
      expect(convertAmountToWords(15)).toBe('Fifteen');
      expect(convertAmountToWords(19)).toBe('Nineteen');
    });

    it('should handle tens', () => {
      expect(convertAmountToWords(20)).toBe('Twenty');
      expect(convertAmountToWords(25)).toBe('Twenty-Five');
      expect(convertAmountToWords(90)).toBe('Ninety');
      expect(convertAmountToWords(99)).toBe('Ninety-Nine');
    });

    it('should handle hundreds', () => {
      expect(convertAmountToWords(100)).toBe('One Hundred');
      expect(convertAmountToWords(101)).toBe('One Hundred And One');
      expect(convertAmountToWords(250)).toBe('Two Hundred And Fifty');
      expect(convertAmountToWords(999)).toBe('Nine Hundred And Ninety-Nine');
    });

    it('should handle thousands', () => {
      expect(convertAmountToWords(1000)).toBe('One Thousand');
      expect(convertAmountToWords(1001)).toBe('One Thousand One');
      expect(convertAmountToWords(1100)).toBe('One Thousand One Hundred');
      expect(convertAmountToWords(2500)).toBe('Two Thousand Five Hundred');
      expect(convertAmountToWords(99999)).toBe('Ninety-Nine Thousand Nine Hundred And Ninety-Nine');
    });

    it('should handle lakhs', () => {
      expect(convertAmountToWords(100000)).toBe('One Lakh');
      expect(convertAmountToWords(100001)).toBe('One Lakh One');
      expect(convertAmountToWords(150000)).toBe('One Lakh Fifty Thousand');
      expect(convertAmountToWords(1299222)).toBe(
        'Twelve Lakh Ninety-Nine Thousand Two Hundred And Twenty-Two'
      );
      expect(convertAmountToWords(9999999)).toBe(
        'Ninety-Nine Lakh Ninety-Nine Thousand Nine Hundred And Ninety-Nine'
      );
    });

    it('should handle crores', () => {
      expect(convertAmountToWords(10000000)).toBe('One Crore');
      expect(convertAmountToWords(10000001)).toBe('One Crore One');
      expect(convertAmountToWords(12000000)).toBe('One Crore Twenty Lakh');
      expect(convertAmountToWords(99999999)).toBe(
        'Nine Crore Ninety-Nine Lakh Ninety-Nine Thousand Nine Hundred And Ninety-Nine'
      );
    });

    it('should handle string inputs with commas', () => {
      expect(convertAmountToWords('12,99,222')).toBe(
        'Twelve Lakh Ninety-Nine Thousand Two Hundred And Twenty-Two'
      );
      expect(convertAmountToWords('1,00,000')).toBe('One Lakh');
      expect(convertAmountToWords('1,00,00,000')).toBe('One Crore');
    });

    it('should handle negative numbers', () => {
      expect(convertAmountToWords(-100)).toBe('Minus One Hundred');
      expect(convertAmountToWords(-1299222)).toBe(
        'Minus Twelve Lakh Ninety-Nine Thousand Two Hundred And Twenty-Two'
      );
    });

    it('should throw error for invalid inputs', () => {
      expect(() => convertAmountToWords('invalid')).toThrow('Invalid input: not a valid number');
      expect(() => convertAmountToWords('abc123')).toThrow('Invalid input: not a valid number');
    });

    it('should throw error for numbers too large', () => {
      expect(() => convertAmountToWords(1000000000)).toThrow(
        'Number too large: maximum supported is 99,99,99,999'
      );
    });

    it('should handle edge cases in Indian numbering system', () => {
      expect(convertAmountToWords(12345)).toBe('Twelve Thousand Three Hundred And Forty-Five');
      expect(convertAmountToWords(123456)).toBe(
        'One Lakh Twenty-Three Thousand Four Hundred And Fifty-Six'
      );
      expect(convertAmountToWords(1234567)).toBe(
        'Twelve Lakh Thirty-Four Thousand Five Hundred And Sixty-Seven'
      );
      expect(convertAmountToWords(12345678)).toBe(
        'One Crore Twenty-Three Lakh Forty-Five Thousand Six Hundred And Seventy-Eight'
      );
    });
  });
});
