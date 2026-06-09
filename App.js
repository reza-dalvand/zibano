// App.js
import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';

// ✅ RootNavigator بدون Stack — فقط conditional render
// این روش توصیه‌شده React Navigation برای auth flow است
function RootNavigator() {
  const { isAuthenticated } = useAuth();
  console.log('🔐 RootNavigator — isAuthenticated:', isAuthenticated);

  // وقتی isAuthenticated تغییر میکنه، React کامپوننت جدید mount و قدیم unmount میشه
  // NavigationContainer این switch رو مدیریت میکنه بدون هیچ مشکلی
  if (isAuthenticated) {
    return <AppNavigator />;
  }
  return <AppNavigator />;
  // return <AuthNavigator />;
}

export default function App() {
  useEffect(() => {
    const init = async () => {};
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);

  return (
  <ErrorBoundary>
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  </ErrorBoundary>
  );
}
