// App.js
import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, ActivityIndicator, StyleSheet } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import OfflineBanner from './src/components/common/OfflineBanner';

import { useAuthStore } from './src/stores/useAuthStore';
import { useNetworkStore } from './src/stores/useNetworkStore';
import { useMaintenanceStore } from './src/stores/useMaintenanceStore';
import { useAppVersionStore } from './src/stores/useAppVersionStore';
import { useThemeStore } from './src/stores/useThemeStore';

function RootNavigator() {
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
  // 🎯 منتظر hydrate شدن theme store می‌مونیم
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 🎯 چک کن که theme از AsyncStorage لود شده
    const unsub = useThemeStore.persist.onFinishHydration(() => {
      console.log('✅ Theme hydrated from AsyncStorage');
      setIsReady(true);
    });

    // اگه از قبل hydrate شده
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

  // 🎯 تا وقتی hydrate نشده، splash یا loader نشون بده
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
          <RootNavigator />
          <OfflineBanner />
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