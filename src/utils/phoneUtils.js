import { toEnglishDigits, toPersianDigit } from './numberUtils';

export const validatePhone = (v) => /^09[0-9]{9}$/.test(toEnglishDigits(v));

export const maskPhone = (phone) => {
  if (!phone || phone.length < 11) return phone || '';
  return '\u202A' + phone.slice(0, 4) + '\u200C***\u200C' + phone.slice(-4) + '\u202C';
};

export const cleanPhone = (phone) =>
  toEnglishDigits(phone).replace(/[^0-9+]/g, '');