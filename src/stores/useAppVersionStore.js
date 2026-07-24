import { create } from 'zustand';
import { Linking, Alert, AppState } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import {
  APP_VERSION,
  compareVersions,
  DEFAULT_STORE_URL,
  DEFAULT_STORE_NAME,
} from '../constants/appVersion';

const DISMISSED_VERSION_KEY = 'dismissed_update_version';
let _storage = null;
const getStorage = () => {
  if (!_storage) _storage = new MMKV();
  return _storage;
};

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

export const useAppVersionStore = create((set, get) => ({
  updateInfo: null,
  checking: false,
  dismissed: false,

  checkForUpdate: async (silent = false) => {
    if (!silent) set({ checking: true });
    try {
      await new Promise((r) => setTimeout(r, 800));
      const config = MOCK_REMOTE_CONFIG;
      const compareLatest = compareVersions(APP_VERSION, config.latestVersion);
      const compareMin = compareVersions(APP_VERSION, config.minRequiredVersion);

      if (compareLatest >= 0) {
        set({ updateInfo: null, checking: false });
        return;
      }

      const isForce = compareMin < 0 || config.isForceUpdate === true;

      if (!isForce) {
        try {
          const dismissedVer = getStorage().getString(DISMISSED_VERSION_KEY);
          if (dismissedVer === config.latestVersion) {
            set({ dismissed: true, updateInfo: null, checking: false });
            return;
          }
        } catch {}
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
    try {
      getStorage().set(DISMISSED_VERSION_KEY, updateInfo.latestVersion);
    } catch {}
    set({ dismissed: true, updateInfo: null });
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
}));