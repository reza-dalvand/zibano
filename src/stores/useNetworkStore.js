import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStore = create((set) => ({
  isConnected: true,
  isInternetReachable: true,
  connectionType: 'unknown',
  showOfflineBanner: false,

  init: () => {
    const handleNetworkChange = (state) => {
      const connected =
        state.isConnected && state.isInternetReachable !== false;
      const type = state.type || 'unknown';

      set({
        isConnected: state.isConnected ?? true,
        isInternetReachable: state.isInternetReachable ?? true,
        connectionType: type,
      });

      if (!connected) {
        set({ showOfflineBanner: true });
      } else {
        setTimeout(() => set({ showOfflineBanner: false }), 1500);
      }
    };

    NetInfo.fetch().then(handleNetworkChange);
    return NetInfo.addEventListener(handleNetworkChange);
  },

  dismissBanner: () => set({ showOfflineBanner: false }),
}));