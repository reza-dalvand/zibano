export const toPersianDigit = (str) =>
  String(str ?? '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export const toEnglishDigits = (str) =>
  String(str ?? '')
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

export const parseNumber = (str) => {
  const cleaned = toEnglishDigits(str).replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

export const formatPrice = (num) =>
  `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

export const formatPriceShort = (num) => {
  if (num >= 1000000) return `${toPersianDigit((num / 1000000).toFixed(1))}M`;
  if (num >= 1000) return `${toPersianDigit((num / 1000).toFixed(0))}K`;
  return toPersianDigit(num);
};

export const formatPriceInput = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return toPersianDigit(parseInt(cleaned, 10).toLocaleString('en-US'));
};

export const formatPercentInput = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return toPersianDigit(String(Math.min(parseInt(cleaned, 10), 100)));
};