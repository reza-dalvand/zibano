// src/navigation/HomeStackNavigator.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// صفحات موجود
import HomeScreen from '../screens/home/HomeScreen';
import CategoryBusinessesScreen from '../screens/home/CategoryBusinessesScreen';
import BusinessDetailsScreen from '../screens/home/BusinessDetailsScreen';

// صفحات پیشنهادات ویژه
import AllAdsScreen from '../screens/home/AllAdsScreen';

// صفحات فرصت‌های مدلینگ
import AllModelRequestsScreen from '../screens/home/AllModelRequestsScreen';
import ModelRequestDetailScreen from '../screens/home/ModelRequestDetailScreen';

// 🆕 صفحات فرصت‌های همکاری / اجاره لاین
import AllLineRentalsScreen from '../screens/home/AllLineRentalsScreen';
import LineRentalDetailScreen from '../screens/home/LineRentalDetailScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
      }}
    >
      {/* صفحه اصلی خانه */}
      <Stack.Screen name="HomeMain" component={HomeScreen} />

      {/* صفحه لیست کسب و کارهای یک دسته بندی */}
      <Stack.Screen
        name="CategoryBusinesses"
        component={CategoryBusinessesScreen}
      />

      {/* صفحه جزئیات کسب و کار */}
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetailsScreen}
      />

      {/* صفحه پیشنهادات ویژه */}
      <Stack.Screen name="AllAds" component={AllAdsScreen} />

      {/* صفحات فرصت‌های مدلینگ */}
      <Stack.Screen
        name="AllModelRequests"
        component={AllModelRequestsScreen}
      />
      <Stack.Screen
        name="ModelRequestDetail"
        component={ModelRequestDetailScreen}
      />

      {/* 🆕 صفحات فرصت‌های همکاری / اجاره لاین */}
      <Stack.Screen
        name="AllLineRentals"
        component={AllLineRentalsScreen}
      />
      <Stack.Screen
        name="LineRentalDetail"
        component={LineRentalDetailScreen}
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