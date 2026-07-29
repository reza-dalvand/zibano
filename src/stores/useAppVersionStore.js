// src/stores/useAppVersionStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Alert, AppState } from 'react-native';
import {
  APP_VERSION,
  compareVersions,
  DEFAULT_STORE_URL,
  DEFAULT_STORE_NAME,
} from '../constants/appVersion';

const MOCK_REMOTE_CONFIG = {
  latestVersion: '1.2.0',
  minRequiredVersion: '1.0.0',
  isForceUpdate: false,
  releaseDate: '۱۴۰۳/۰۵/۱۵',
  title: 'نسخه جدید زیبانو منتشر شد!',
  updateMessage: 'برای تجربه بهتر...',
  changelog: [
    { icon: 'auto-awesome', text: 'افزوده شدن سیستم نظردهی' },
    { icon: 'bolt', text: 'بهبود سرعت بارگذاری' },
  ],
  storeUrl: DEFAULT_STORE_URL,
  storeName: DEFAULT_STORE_NAME,
};

export const useAppVersionStore = create(
  persist(
    (set, get) => ({
      updateInfo: null,
      checking: false,
      dismissed: false,
      dismissedVersion: null, // 🆕 به جای MMKV

      checkForUpdate: async (silent = false) => {
        if (!silent) set({ checking: true });
        try {
          await new Promise((r) => setTimeout(r, 800));
          const config = MOCK_REMOTE_CONFIG;
          const compareLatest = compareVersions(
            APP_VERSION,
            config.latestVersion
          );
          const compareMin = compareVersions(
            APP_VERSION,
            config.minRequiredVersion
          );

          if (compareLatest >= 0) {
            set({ updateInfo: null, checking: false });
            return;
          }

          const isForce = compareMin < 0 || config.isForceUpdate === true;

          if (!isForce) {
            const { dismissedVersion } = get();
            if (dismissedVersion === config.latestVersion) {
              set({ dismissed: true, updateInfo: null, checking: false });
              return;
            }
          }

          set({
            updateInfo: {
              currentVersion: APP_VERSION,
              latestVersion: config.latestVersion,
              isForceUpdate: isForce,
              title: config.title,
              updateMessage: config.updateMessage,
              changelog: config.changelog || [],
              storeUrl: config.storeUrl || DEFAULT_STORE_URL,
              storeName: config.storeName || DEFAULT_STORE_NAME,
            },
            checking: false,
          });
        } catch (error) {
          console.log('Update check failed:', error);
          set({ checking: false });
        }
      },

      dismissOptionalUpdate: () => {
        const { updateInfo } = get();
        if (!updateInfo || updateInfo.isForceUpdate) return;
        set({
          dismissed: true,
          updateInfo: null,
          dismissedVersion: updateInfo.latestVersion,
        });
      },

      openStore: async () => {
        const { updateInfo } = get();
        if (!updateInfo) return;
        try {
          const canOpen = await Linking.canOpenURL(updateInfo.storeUrl);
          if (canOpen) {
            await Linking.openURL(updateInfo.storeUrl);
          } else {
            Alert.alert(
              'خطا',
              `لطفاً دستی به ${updateInfo.storeName} مراجعه کنید`
            );
          }
        } catch {
          Alert.alert('خطا', 'امکان باز کردن استور وجود ندارد');
        }
      },

      initAppStateListener: () => {
        return AppState.addEventListener('change', (nextState) => {
          if (nextState === 'active') {
            get().checkForUpdate(true);
          }
        });
      },
    }),
    {
      name: 'app-version-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        dismissedVersion: state.dismissedVersion,
      }),
    }
  )
);