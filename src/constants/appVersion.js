// src/constants/appVersion.js
import { Platform } from 'react-native';

// 🎯 نسخه فعلی اپلیکیشن (در هر release باید به‌روز شود)
export const APP_VERSION = '1.0.0';

// 🎯 شماره نسخه عددی (برای مقایسه راحت‌تر)
export const APP_BUILD_NUMBER = 1;

// 🎯 پلتفرم فعلی
export const PLATFORM = Platform.OS; // 'ios' | 'android'

// 🎯 لینک استور برای آپدیت
export const STORE_URLS = {
  android: {
    cafebazaar: 'https://cafebazaar.ir/app/com.zibano.app',
    myket: 'https://myket.ir/app/com.zibano.app',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.zibano.app',
  },
  ios: {
    appStore: 'https://apps.apple.com/app/zibano/id123456789',
  },
};

// 🎯 لینک پیش‌فرض بر اساس پلتفرم
export const DEFAULT_STORE_URL =
  Platform.OS === 'ios'
    ? STORE_URLS.ios.appStore
    : STORE_URLS.android.cafebazaar;

// 🎯 نام استور پیش‌فرض
export const DEFAULT_STORE_NAME =
  Platform.OS === 'ios' ? 'App Store' : 'کافه‌بازار';

// 🎯 تبدیل "1.2.3" به عدد قابل مقایسه (10203)
export const versionToNumber = (version) => {
  if (!version) return 0;
  const parts = String(version).split('.').map(Number);
  return (
    (parts[0] || 0) * 10000 +
    (parts[1] || 0) * 100 +
    (parts[2] || 0)
  );
};

// 🎯 مقایسه دو نسخه: -1 (a < b), 0 (a = b), 1 (a > b)
export const compareVersions = (a, b) => {
  const numA = versionToNumber(a);
  const numB = versionToNumber(b);
  if (numA < numB) return -1;
  if (numA > numB) return 1;
  return 0;
};