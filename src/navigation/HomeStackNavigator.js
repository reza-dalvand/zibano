// src/navigation/HomeStackNavigator.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import CategoryBusinessesScreen from '../screens/home/CategoryBusinessesScreen';
import BusinessDetailsScreen from '../screens/home/BusinessDetailsScreen';
import AllAdsScreen from '../screens/home/AllAdsScreen';
// 🆕 صفحات جدید مدلینگ
import AllModelRequestsScreen from '../screens/home/AllModelRequestsScreen';
import ModelRequestDetailScreen from '../screens/home/ModelRequestDetailScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CategoryBusinesses" component={CategoryBusinessesScreen} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} />
      <Stack.Screen name="AllAds" component={AllAdsScreen} />
      {/* 🆕 صفحات جدید */}
      <Stack.Screen name="AllModelRequests" component={AllModelRequestsScreen} />
      <Stack.Screen name="ModelRequestDetail" component={ModelRequestDetailScreen} />
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