// src/context/NetworkContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';

const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  // ═══════════ بررسی وضعیت شبکه ═══════════
  const handleNetworkChange = useCallback((state) => {
    const connected = state.isConnected && state.isInternetReachable !== false;
    const type = state.type || 'unknown';

    setIsConnected(state.isConnected ?? true);
    setIsInternetReachable(state.isInternetReachable ?? true);
    setConnectionType(type);

    // نمایش بنر فقط وقتی اینترنت واقعاً قطع است
    if (!connected) {
      setShowOfflineBanner(true);
    } else {
      // وقتی وصل شد، با تاخیر کوتاه بنر را محو کن (تا کاربر ببیند)
      setTimeout(() => {
        setShowOfflineBanner(false);
      }, 1500);
    }
  }, []);

  // ═══════════ گوش دادن به تغییرات شبکه ═══════════
  useEffect(() => {
    // بررسی اولیه
    NetInfo.fetch().then(handleNetworkChange);

    // Subscribe به تغییرات
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    return () => {
      unsubscribe();
    };
  }, [handleNetworkChange]);

  // ═══════════ بستن دستی بنر ═══════════
  const dismissBanner = useCallback(() => {
    setShowOfflineBanner(false);
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isInternetReachable,
        connectionType,
        showOfflineBanner,
        dismissBanner,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export const useNetwork = () => {
  const ctx = useContext(NetworkContext);
  if (!ctx)
    throw new Error('useNetwork باید داخل NetworkProvider استفاده شود');
  return ctx;
};