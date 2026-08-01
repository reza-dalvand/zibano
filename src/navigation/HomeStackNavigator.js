// src/navigation/HomeStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// صفحات موجود
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/home/SearchScreen';
import CategoryBusinessesScreen from '../screens/home/CategoryBusinessesScreen';
import BusinessDetailsScreen from '../screens/home/BusinessDetailsScreen';
import AllAdsScreen from '../screens/home/AllAdsScreen';
import AllModelRequestsScreen from '../screens/home/AllModelRequestsScreen';
import ModelRequestDetailScreen from '../screens/home/ModelRequestDetailScreen';
import AllLineRentalsScreen from '../screens/home/AllLineRentalsScreen';
import LineRentalDetailScreen from '../screens/home/LineRentalDetailScreen';
import BusinessMapScreen from '../screens/home/BusinessMapScreen';

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

      <Stack.Screen name="SearchScreen" component={SearchScreen} />

      <Stack.Screen
        name="CategoryBusinesses"
        component={CategoryBusinessesScreen}
      />
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetailsScreen}
      />
      <Stack.Screen name="AllAds" component={AllAdsScreen} />
      <Stack.Screen
        name="AllModelRequests"
        component={AllModelRequestsScreen}
      />
      <Stack.Screen
        name="ModelRequestDetail"
        component={ModelRequestDetailScreen}
      />
      <Stack.Screen
        name="AllLineRentals"
        component={AllLineRentalsScreen}
      />
      <Stack.Screen
        name="LineRentalDetail"
        component={LineRentalDetailScreen}
      />
      <Stack.Screen
        name="BusinessMap"
        component={BusinessMapScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}