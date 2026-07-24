// App.js
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';

// 🎯 فقط import کردن store ها برای initialization
import { useAuthStore } from './src/stores/useAuthStore';
import { useNetworkStore } from './src/stores/useNetworkStore';
import { useMaintenanceStore } from './src/stores/useMaintenanceStore';
import { useAppVersionStore } from './src/stores/useAppVersionStore';
import { useThemeStore } from './src/stores/useThemeStore';

// 🎯 حذف شده - نیازی به OfflineBanner و UpdateModal و MaintenanceModal نیست
// چون خودشون مستقیماً از store استفاده می‌کنن
import OfflineBanner from './src/components/common/OfflineBanner';

function RootNavigator() {
  // 🎯 دسترسی مستقیم به store
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showAuth, setShowAuth] = React.useState(!isAuthenticated);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowAuth(!isAuthenticated);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [isAuthenticated]);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {showAuth ? <AppNavigator /> : <AuthNavigator />}
    </Animated.View>
  );
}

export default function App() {
  // 🎯 Initialization یک‌باره
  useEffect(() => {
    const netSub = useNetworkStore.getState().init();
    const themeSub = useThemeStore.getState().initSystemListener();
    const appSub1 = useMaintenanceStore.getState().initAppStateListener();
    const appSub2 = useAppVersionStore.getState().initAppStateListener();

    useMaintenanceStore.getState().checkMaintenance();
    useAppVersionStore.getState().checkForUpdate();

    const init = async () => {};
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });

    return () => {
      netSub?.remove?.();
      themeSub?.();
      appSub1?.remove?.();
      appSub2?.remove?.();
    };
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        {/* 🎯 بدون هیچ Provider ای! */}
        <NavigationContainer>
          <RootNavigator />
          <OfflineBanner />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}