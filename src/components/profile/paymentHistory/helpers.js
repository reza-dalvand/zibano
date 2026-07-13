// src/screens/profile/paymentHistory/helpers.js

/**
 * تبدیل اعداد انگلیسی به فارسی
 */
export const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

/**
 * فرمت قیمت با تومان
 */
export const formatPrice = (num) =>
  `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;