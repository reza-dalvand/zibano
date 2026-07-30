// App.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import OfflineBanner from './src/components/common/OfflineBanner';
import AuthBottomSheet from './src/components/common/AuthBottomSheet'; // 🆕
import { useNetworkStore } from './src/stores/useNetworkStore';
import { useMaintenanceStore } from './src/stores/useMaintenanceStore';
import { useAppVersionStore } from './src/stores/useAppVersionStore';
import { useThemeStore } from './src/stores/useThemeStore';
import { useAuthModal } from './src/hooks/useAuth'; // 🆕

export default function App() {
  const [isReady, setIsReady] = useState(false);
  
  // 🎯 مدال auth به صورت global در App.js
  const { showAuthModal, closeAuthModal } = useAuthModal();

  useEffect(() => {
    const unsub = useThemeStore.persist.onFinishHydration(() => {
      console.log('✅ Theme hydrated from AsyncStorage');
      setIsReady(true);
    });
    if (useThemeStore.persist.hasHydrated()) {
      setIsReady(true);
    }
    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const netSub = useNetworkStore.getState().init();
    const themeSub = useThemeStore.getState().initSystemListener();
    const appSub1 = useMaintenanceStore.getState().initAppStateListener();
    const appSub2 = useAppVersionStore.getState().initAppStateListener();
    useMaintenanceStore.getState().checkMaintenance();
    useAppVersionStore.getState().checkForUpdate();
    BootSplash.hide({ fade: true });
    return () => {
      netSub?.remove?.();
      themeSub?.();
      appSub1?.remove?.();
      appSub2?.remove?.();
    };
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#A88B7D" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          <OfflineBanner />
          {/* 🎯 مدال سراسری ثبت‌نام - همیشه در دسترس */}
          <AuthBottomSheet visible={showAuthModal} onClose={closeAuthModal} />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0EC',
  },
});