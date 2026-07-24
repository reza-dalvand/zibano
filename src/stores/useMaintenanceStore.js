//src/stores/useMaintenanceStore.js

import { create } from 'zustand';
import { AppState } from 'react-native';

const MOCK_REMOTE_CONFIG = {
  isMaintenance: true,
  title: 'در حال بروزرسانی هستیم 🔧',
  message: 'بعد از انجام تغییرات...',
  estimatedEnd: '۱۴۰۳/۰۵/۲۰ - ساعت ۱۸:۰۰',
  reason: 'بروزرسانی سرورها',
  supportPhone: '۰۲۱-۹۱۰۰۱۲۳۴',
};

export const useMaintenanceStore = create((set) => ({
  maintenanceInfo: null,
  checking: false,

  checkMaintenance: async () => {
    set({ checking: true });
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (!MOCK_REMOTE_CONFIG.isMaintenance) {
        set({ maintenanceInfo: null, checking: false });
        return;
      }
      set({
        maintenanceInfo: {
          title: MOCK_REMOTE_CONFIG.title,
          message: MOCK_REMOTE_CONFIG.message,
          estimatedEnd: MOCK_REMOTE_CONFIG.estimatedEnd,
          reason: MOCK_REMOTE_CONFIG.reason,
          supportPhone: MOCK_REMOTE_CONFIG.supportPhone,
        },
        checking: false,
      });
    } catch {
      set({ checking: false });
    }
  },

  initAppStateListener: () => {
    return AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        useMaintenanceStore.getState().checkMaintenance();
      }
    });
  },
}));