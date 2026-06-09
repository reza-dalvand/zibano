// src/navigation/AppNavigator.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ExploreScreen from '../screens/explore/ExploreScreen';
import CreateBusinessScreen from '../screens/createBusiness/CreateBusinessScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HomeStackNavigator from './HomeStackNavigator';
import ManageStackNavigator from './ManageStackNavigator'; // 🆕 تغییر مهم

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: Math.max(insets.bottom, 12),
          left: 20,
          right: 20,
          backgroundColor: colors.cardBackground,
          borderRadius: 30,
          height: 45 + insets.bottom,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12),
        },
        tabBarLabelStyle: {
          fontFamily: 'Vazir-Medium',
          fontSize: 11,
          marginTop: 4,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'CreateBusiness') iconName = 'add-circle-outline';
          else if (route.name === 'Explore') iconName = 'collections';
          else if (route.name === 'ManageBusiness') iconName = 'dashboard';
          return <Icon name={iconName} size={size + 4} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'پروفایل' }}
      />
      <Tab.Screen
        name="ManageBusiness"
        component={ManageStackNavigator} // 🆕 تغییر: از Stack استفاده شد
        options={{ tabBarLabel: 'مدیریت من' }}
      />
      <Tab.Screen
        name="CreateBusiness"
        component={CreateBusinessScreen}
        options={{ tabBarLabel: 'ثبت سالن' }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarLabel: 'ویترین' }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'خانه' }}
      />
    </Tab.Navigator>
  );
}