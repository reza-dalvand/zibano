// src/context/AppVersionContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Linking, Alert, AppState } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import {
  APP_VERSION,
  compareVersions,
  DEFAULT_STORE_URL,
  DEFAULT_STORE_NAME,
} from '../constants/appVersion';

let storage = null;
function getStorage() {
  if (!storage) {
    try {
      storage = new MMKV();
    } catch (e) {
      return { set: () => {}, getString: () => null, delete: () => {} };
    }
  }
  return storage;
}

const DISMISSED_VERSION_KEY = 'dismissed_update_version';

const AppVersionContext = createContext(null);

// ═══════════════════════════════════════════════════
//       🎯 داده‌های موقت (بعداً از API می‌آید)
// ═══════════════════════════════════════════════════
//
// ✅ برای تست آپدیت اجباری: isForceUpdate = true قرار دهید
// ✅ برای تست آپدیت اختیاری: isForceUpdate = false قرار دهید
// ✅ برای غیرفعال کردن کامل: latestVersion را برابر APP_VERSION بگذارید
//
const MOCK_REMOTE_CONFIG = {
//   latestVersion: '1.2.0',        // آخرین نسخه منتشر شده
//   minRequiredVersion: '1.1.0',   // حداقل نسخه قابل قبول (زیر این = اجباری)
//   isForceUpdate: true,           // ⚠️ true = اجباری، false = اختیاری
  latestVersion: '1.2.0',
  minRequiredVersion: '1.0.0',  // برابر با APP_VERSION
  isForceUpdate: false,
  
  releaseDate: '۱۴۰۳/۰۵/۱۵',
  title: 'نسخه جدید زیبانو منتشر شد!',
  updateMessage:
    'برای تجربه بهتر و دسترسی به قابلیت‌های جدید، لطفاً اپلیکیشن خود را به‌روزرسانی کنید.',
  changelog: [
    { icon: 'auto-awesome', text: 'افزوده شدن سیستم نظردهی پس از انجام نوبت' },
    { icon: 'bolt', text: 'بهبود سرعت بارگذاری تا ۴۰٪' },
    { icon: 'shield', text: 'افزایش امنیت حساب کاربری' },
    { icon: 'bug-report', text: 'رفع باگ‌های گزارش‌شده توسط کاربران' },
    { icon: 'palette', text: 'طراحی جدید صفحه پروفایل' },
  ],
  storeUrl: DEFAULT_STORE_URL,
  storeName: DEFAULT_STORE_NAME,
  fileSize: '۲۸ مگابایت',
};

export function AppVersionProvider({ children }) {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [checking, setChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // ═══════════ بررسی آپدیت ═══════════
  const checkForUpdate = useCallback(async (silent = false) => {
    if (!silent) setChecking(true);

    try {
      // ⏱️ شبیه‌سازی تاخیر API
      await new Promise((r) => setTimeout(r, 800));

      const config = MOCK_REMOTE_CONFIG;

      // مقایسه نسخه فعلی با آخرین نسخه
      const compareLatest = compareVersions(APP_VERSION, config.latestVersion);
      const compareMin = compareVersions(APP_VERSION, config.minRequiredVersion);

      // 🎯 منطق آپدیت:
      // اگر نسخه فعلی >= latestVersion → نیازی به آپدیت نیست
      if (compareLatest >= 0) {
        setUpdateInfo(null);
        return;
      }

      // 🎯 تعیین نوع آپدیت:
      // اگر نسخه فعلی < minRequiredVersion → اجباری
      // در غیر این صورت → طبق isForceUpdate از config
      const isForce =
        compareMin < 0 || config.isForceUpdate === true;

      // 🎯 اگر اختیاری است و کاربر قبلاً این نسخه را رد کرده، نمایش نده
      if (!isForce) {
        try {
          const dismissedVer = getStorage().getString(DISMISSED_VERSION_KEY);
          if (dismissedVer === config.latestVersion) {
            setDismissed(true);
            setUpdateInfo(null);
            return;
          }
        } catch {}
      }

      setUpdateInfo({
        currentVersion: APP_VERSION,
        latestVersion: config.latestVersion,
        isForceUpdate: isForce,
        title: config.title,
        updateMessage: config.updateMessage,
        changelog: config.changelog || [],
        storeUrl: config.storeUrl || DEFAULT_STORE_URL,
        storeName: config.storeName || DEFAULT_STORE_NAME,
        releaseDate: config.releaseDate,
        fileSize: config.fileSize,
      });
    } catch (error) {
      console.log('❌ Update check failed:', error);
      // در صورت خطا، سکوت اختیار کن و اپ را مختل نکن
    } finally {
      if (!silent) setChecking(false);
    }
  }, []);

  // ═══════════ رد آپدیت اختیاری ═══════════
  const dismissOptionalUpdate = useCallback(() => {
    if (!updateInfo || updateInfo.isForceUpdate) return;

    try {
      getStorage().set(DISMISSED_VERSION_KEY, updateInfo.latestVersion);
    } catch {}

    setDismissed(true);
    setUpdateInfo(null);
  }, [updateInfo]);

  // ═══════════ باز کردن استور ═══════════
  const openStore = useCallback(async () => {
    if (!updateInfo) return;

    try {
      const canOpen = await Linking.canOpenURL(updateInfo.storeUrl);
      if (canOpen) {
        await Linking.openURL(updateInfo.storeUrl);
      } else {
        Alert.alert(
          'خطا در باز کردن استور',
          `لطفاً به صورت دستی به ${updateInfo.storeName} مراجعه کنید و اپلیکیشن زیبانو را به‌روزرسانی کنید.`,
        );
      }
    } catch (error) {
      Alert.alert(
        'خطا',
        'امکان باز کردن استور وجود ندارد. لطفاً دستی به‌روزرسانی کنید.',
      );
    }
  }, [updateInfo]);

  // ═══════════ بررسی اولیه هنگام لود ═══════════
  useEffect(() => {
    checkForUpdate(false);
  }, [checkForUpdate]);

  // ═══════════ بررسی مجدد هنگام بازگشت به اپ ═══════════
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        // اگر قبلاً رد نشده یا اجباری است، دوباره چک کن
        checkForUpdate(true);
      }
    });
    return () => sub.remove();
  }, [checkForUpdate]);

  return (
    <AppVersionContext.Provider
      value={{
        updateInfo,
        checking,
        dismissed,
        checkForUpdate,
        dismissOptionalUpdate,
        openStore,
      }}
    >
      {children}
    </AppVersionContext.Provider>
  );
}

export const useAppVersion = () => {
  const ctx = useContext(AppVersionContext);
  if (!ctx)
    throw new Error('useAppVersion باید داخل AppVersionProvider استفاده شود');
  return ctx;
};