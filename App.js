// App.js
import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { BusinessProvider } from './src/context/BusinessContext'; // 🆕 اضافه شد
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';

function RootNavigator() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <AppNavigator />;
  }
  return <AppNavigator />;
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
            <BusinessProvider> 
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </BusinessProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}