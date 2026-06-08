// src/navigation/HomeStackNavigator.js

import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import CategoryBusinessesScreen from '../screens/home/CategoryBusinessesScreen';
// ۱. امپورت کردن صفحه جزئیات کسب و کار که ساختیم
import BusinessDetailsScreen from '../screens/home/BusinessDetailsScreen'; 
import BookingScreen from '../screens/home/BookingScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left', // انیمیشن ورود صفحات از چپ به راست (مناسب برای RTL)
      }}
    >
      {/* صفحه اصلی خانه */}
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      
      {/* صفحه لیست کسب و کارهای یک دسته بندی */}
      <Stack.Screen
        name="CategoryBusinesses"
        component={CategoryBusinessesScreen}
      />

      {/* ۲. اضافه کردن صفحه جزئیات به استک نویگیشن خانه */}
      <Stack.Screen 
        name="BusinessDetails" 
        component={BusinessDetailsScreen} 
      />
      {/* ۲. اضافه کردن صفحه رزرو نوبت*/}
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen} 
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