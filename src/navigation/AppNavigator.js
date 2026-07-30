// src/navigation/AppNavigator.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../stores/useThemeStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/useAuthStore';
import AuthBottomSheet from '../components/common/AuthBottomSheet';

// Screens
import ExploreScreen from '../screens/explore/ExploreScreen';
import CreateBusinessScreen from '../screens/createBusiness/CreateBusinessScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import ManageStackNavigator from './ManageStackNavigator';

// 🎯 کامپوننت خالی برای تب ورود (فقط مدال باز می‌شود)
const EmptyAuthScreen = () => <View />;

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  // 🎯 state برای نمایش مدال ورود/ثبت‌نام
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 🎯 هندلر بستن مدال
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: 'absolute',
            bottom: Math.max(insets.bottom, 25),
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
            paddingTop: 5,
            paddingBottom: Math.max(insets.bottom, 12),
          },
          tabBarLabelStyle: {
            fontFamily: 'Vazir-Medium',
            fontSize: 11,
            marginTop: 4,
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Explore':
                iconName = 'collections';
                break;
              case 'CreateBusiness':
                iconName = 'add-circle-outline';
                break;
              case 'ManageBusiness':
                iconName = 'dashboard';
                break;
              case 'Profile':
                iconName = 'person';
                break;
              case 'AuthTab':
                iconName = focused ? 'login' : 'lock-outline';
                break;
              default:
                iconName = 'home';
            }
            
            return <Icon name={iconName} size={size + 4} color={color} />;
          },
        })}
      >
        {/* ═══════ تب‌های مشترک (همیشه نمایش داده می‌شوند) ═══════ */}
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{ tabBarLabel: 'خانه' }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{ tabBarLabel: 'ویترین' }}
        />
        {isAuthenticated && (
          <Tab.Screen
            name="CreateBusiness"
            component={CreateBusinessScreen}
            options={{ tabBarLabel: 'اگهی خدمات' }}
          />
        )} 
        {/* ═══════ تب‌های شرطی بر اساس وضعیت ورود ═══════ */}
        {isAuthenticated ? (
          <>
            {/* کاربر لاگین شده: مدیریت + پروفایل */}
            <Tab.Screen
              name="ManageBusiness"
              component={ManageStackNavigator}
              options={{ tabBarLabel: 'مدیریت من' }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileStackNavigator}
              options={{ tabBarLabel: 'پروفایل' }}
            />
          </>
        ) : (
          /* کاربر مهمان: دکمه ورود/ثبت‌نام (فقط مدال باز می‌شود) */
          <Tab.Screen
            name="AuthTab"
            component={EmptyAuthScreen}
            options={{ 
              tabBarLabel: 'ورود / ثبت‌نام',
            }}
            listeners={{
              tabPress: (e) => {
                // 🎯 جلوگیری از نویگیشن به صفحه خالی
                e.preventDefault();
                // 🎯 باز کردن مدال ورود/ثبت‌نام
                setShowAuthModal(true);
              },
            }}
          />
        )}
      </Tab.Navigator>

      {/* 🎯 مدال سراسری ورود/ثبت‌نام */}
      <AuthBottomSheet 
        visible={showAuthModal} 
        onClose={handleCloseAuthModal} 
      />
    </>
  );
}