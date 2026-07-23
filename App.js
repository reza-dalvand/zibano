// App.js
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { BusinessProvider } from './src/context/BusinessContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator'; // ✅ import شده
import ErrorBoundary from './src/components/common/ErrorBoundary';

function RootNavigator() {
  const { isAuthenticated } = useAuth();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showAuth, setShowAuth] = React.useState(!isAuthenticated);

  useEffect(() => {
    // fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowAuth(!isAuthenticated);
      // fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [isAuthenticated]);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {showAuth ? <AuthNavigator /> : <AppNavigator />}
    </Animated.View>
  );
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