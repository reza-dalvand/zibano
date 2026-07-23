// src/context/MaintenanceContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { MMKV } from 'react-native-mmkv';

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

const MaintenanceContext = createContext(null);

// ═══════════════════════════════════════════════════
//       🎯 داده‌های موقت (بعداً از API می‌آید)
// ═══════════════════════════════════════════════════
//
// ✅ برای تست مدال تعمیرات:
//   - isMaintenance = true  → مدال نمایش داده می‌شود (غیرقابل بستن)
//   - isMaintenance = false → مدال بسته می‌شود (تعمیرات تمام شده)
//
// ⚠️ توجه: مدال تعمیرات کاملاً اجباری است و کاربر نمی‌تواند آن را ببندد.
// فقط زمانی بسته می‌شود که سرور isMaintenance را false کند.
//
const MOCK_REMOTE_CONFIG = {
  isMaintenance: true,              // ⚠️ true = حالت تعمیرات فعال (اجباری)
  title: 'در حال بروزرسانی هستیم 🔧',
  message: 'برای ارائه خدمات بهتر و رفع مشکلات، اپلیکیشن به‌صورت موقت در دست تعمیر است. لطفاً کمی بعد مجدداً مراجعه کنید.',
  estimatedEnd: '۱۴۰۳/۰۵/۲۰ - ساعت ۱۸:۰۰',
  reason: 'بروزرسانی سرورها و بهبود عملکرد',
  supportPhone: '۰۲۱-۹۱۰۰۱۲۳۴',
  supportEmail: 'support@zibano.app',
};

export function MaintenanceProvider({ children }) {
  const [maintenanceInfo, setMaintenanceInfo] = useState(null);
  const [checking, setChecking] = useState(false);

  // ═══════════ بررسی وضعیت تعمیرات ═══════════
  const checkMaintenance = useCallback(async () => {
    setChecking(true);
    try {
      // ⏱️ شبیه‌سازی تاخیر API
      await new Promise((r) => setTimeout(r, 600));

      const config = MOCK_REMOTE_CONFIG;

      // اگر تعمیرات فعال نباشد → مدال بسته می‌شود
      if (!config.isMaintenance) {
        setMaintenanceInfo(null);
        return;
      }

      // تعمیرات فعال است → مدال نمایش داده می‌شود
      setMaintenanceInfo({
        title: config.title,
        message: config.message,
        estimatedEnd: config.estimatedEnd,
        reason: config.reason,
        supportPhone: config.supportPhone,
        supportEmail: config.supportEmail,
      });
    } catch (error) {
      console.log('❌ Maintenance check failed:', error);
    } finally {
      setChecking(false);
    }
  }, []);

  // ═══════════ بررسی اولیه هنگام لود ═══════════
  useEffect(() => {
    checkMaintenance();
  }, [checkMaintenance]);

  // ═══════════ بررسی مجدد هنگام بازگشت به اپ ═══════════
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkMaintenance();
      }
    });
    return () => sub.remove();
  }, [checkMaintenance]);

  return (
    <MaintenanceContext.Provider
      value={{
        maintenanceInfo,
        checking,
        checkMaintenance,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}

export const useMaintenance = () => {
  const ctx = useContext(MaintenanceContext);
  if (!ctx)
    throw new Error('useMaintenance باید داخل MaintenanceProvider استفاده شود');
  return ctx;
};