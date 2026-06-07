import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import ScreenWrapper from '../components/common/ScreenWrapper';
import HomeScreen from '../screens/home/HomeScreen';
import CategoryBusinessesScreen from '../screens/home/CategoryBusinessesScreen';

const Stack = createNativeStackNavigator();

function PlaceholderScreen({ title, navigation, canGoBack = true }) {
  const { colors } = useTheme();

  return (
    <ScreenWrapper scrollable padding={20}>
      <Text style={[styles.title, { color: colors.textMain }]}>{title}</Text>
      {canGoBack && navigation?.canGoBack?.() ? (
        <TouchableOpacity
          style={[styles.backBtn, { borderColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: colors.primary, fontFamily: 'Vazir-Medium' }}>
            بازگشت
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScreenWrapper>
  );
}

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="CategoryBusinesses"
        component={CategoryBusinessesScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
    marginTop: 20,
  },
  backBtn: {
    marginTop: 24,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 12,
  },
});