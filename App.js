import React, { useEffect } from 'react';
import { ThemeProvider } from './src/theme/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from "react-native-bootsplash";
import AppNavigator from './src/navigation/AppNavigator'; // اضافه شدن ناوبری اصلی

export default function App() {
  useEffect(() => {
    const init = async () => {
      // در اینجا می‌توانید تنظیمات اولیه، لود کردن دیتابیس یا API را انجام دهید
    };

    init().finally(async () => {
      // مخفی کردن اسپلش با انیمیشن
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* رندر ناوبری ۵ صفحه‌ای به همراه تم و سِیف‌اریا */}
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}