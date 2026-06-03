// ThemeTestScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useAppTheme } from './src/theme/useAppTheme';

const ThemeTestScreen = () => {
  const { colors, themeMode, isDark, setThemeMode } = useAppTheme();

  // تولید داینامیک استایل دکمه‌ها با استفاده از رنگ‌های جدید شما
  const getButtonStyle = (mode) => [
    styles.button,
    { 
      backgroundColor: colors.cardBackground,
      borderColor: themeMode === mode ? colors.primary : colors.border,
      borderWidth: themeMode === mode ? 2 : 1
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textMain }]}>
          تنظیمات تم اپلیکیشن
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          تم فعال در حال حاضر: {isDark ? 'Dark 🌙' : 'Light ☀️'}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={getButtonStyle('system')}
            onPress={() => setThemeMode('system')}
          >
            <Text style={[styles.buttonText, { color: colors.textMain }]}>
              📱 دیفالت سیستم
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={getButtonStyle('light')}
            onPress={() => setThemeMode('light')}
          >
            <Text style={[styles.buttonText, { color: colors.textMain }]}>
              ☀️ لایت (Light)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={getButtonStyle('dark')}
            onPress={() => setThemeMode('dark')}
          >
            <Text style={[styles.buttonText, { color: colors.textMain }]}>
              🌙 دارک (Dark)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ThemeTestScreen;