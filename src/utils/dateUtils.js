import { toPersianDigit } from './numberUtils';

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
  'مرداد', 'شهریور', 'مهر', 'آبان',
  'آذر', 'دی', 'بهمن', 'اسفند',
];

export const PERSIAN_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export function toJalaali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { jy, jm, jd };
}

export function isLeapJalaaliYear(jy) {
  return [1, 5, 9, 13, 17, 22, 26, 30].includes(jy % 33);
}

export function jalaaliMonthLength(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaaliYear(jy) ? 30 : 29;
}

export const todayJalaali = () => {
  const now = new Date();
  return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
};

export const formatJalaaliDate = (dateStr) => {
  if (!dateStr) return '—';
  
  // حالت ۱: string با فرمت YYYY/MM/DD (مثل "1405/02/02" یا "۱۴۰۵/۰۲/۰۲")
  if (typeof dateStr === 'string') {
    // بررسی فرمت تاریخ شمسی
    const normalizedStr = dateStr.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(normalizedStr)) {
      // تبدیل ارقام فارسی/عربی به انگلیسی
      const eng = normalizedStr
        .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
      const parts = eng.split('/');
      if (parts.length === 3) {
        const jy = parts[0].padStart(4, '0');
        const jm = parts[1].padStart(2, '0');
        const jd = parts[2].padStart(2, '0');
        return toPersianDigit(`${jy}/${jm}/${jd}`);
      }
    }
    // اگر فرمت تاریخ نبود، فقط ارقام را تبدیل کن
    return toPersianDigit(dateStr);
  }
  
  // حالت ۲: object جلالی { jy, jm, jd }
  if (typeof dateStr === 'object' && dateStr.jy) {
    const jy = String(dateStr.jy).padStart(4, '0');
    const jm = String(dateStr.jm).padStart(2, '0');
    const jd = String(dateStr.jd).padStart(2, '0');
    return toPersianDigit(`${jy}/${jm}/${jd}`);
  }
  
  // حالت ۳: سایر مقادیر
  return toPersianDigit(String(dateStr));
};

export const minutesToTime = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const timeToMinutes = (time) => {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/**
 * 🎯 محاسبه روز هفته اولین روز ماه شمسی
 * 
 * @param {number} jy - سال شمسی
 * @param {number} jm - ماه شمسی (۱ تا ۱۲)
 * @returns {number} روز هفته (۰=شنبه، ۱=یک‌شنبه، ... ۶=جمعه)
 * 
 * استفاده شده در:
 * - BookingCalendar.js
 * - ScheduleModal.js
 */
export const getFirstDayOfWeekJalaali = (jy, jm) => {
  // تبدیل شمسی به میلادی
  let gy = (jy <= 979) ? 621 : 1600;
  let tempJy = jy - ((jy <= 979) ? 0 : 979);
  let days = (365 * tempJy) + (Math.floor(tempJy / 33) * 8)
    + Math.floor(((tempJy % 33) + 3) / 4) + 78 + 1
    + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  
  // تبدیل به Date و محاسبه روز هفته
  const gregorianDate = new Date(gy, gm - 1, gd);
  
  // JS getDay: 0=یک‌شنبه → Persian: ش=0, ی=1, د=2, س=3, چ=4, پ=5, ج=6
  return (gregorianDate.getDay() + 1) % 7;
};