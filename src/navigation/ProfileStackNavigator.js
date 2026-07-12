// src/navigation/ProfileStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../components/common/Header';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AppointmentsScreen from '../screens/profile/AppointmentsScreen';
import FavoritesScreen from '../screens/profile/FavoritesScreen';
import PaymentHistoryScreen from '../screens/profile/PaymentHistoryScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePhoneScreen from '../screens/profile/ChangePhoneScreen';
// 🚫 کامنت شد - در فاز فعلی استفاده نمی‌شود
// import InviteFriendsScreen from '../screens/profile/InviteFriendsScreen';
import SupportScreen from '../screens/profile/SupportScreen';
import ActiveDevicesScreen from '../screens/profile/ActiveDevicesScreen'; // 🆕 اضافه شد

const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />,
        animation: 'slide_from_left',
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{ title: 'نوبت‌های من' }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'علاقه‌مندی‌ها' }}
      />
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{ title: 'سوابق پرداخت' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'ویرایش پروفایل' }}
      />
      <Stack.Screen
        name="ChangePhone"
        component={ChangePhoneScreen}
        options={{ title: 'تغییر شماره موبایل' }}
      />
      {/* 🚫 کامنت شد - در فاز فعلی استفاده نمی‌شود
      <Stack.Screen
        name="InviteFriends"
        component={InviteFriendsScreen}
        options={{ title: 'دعوت از دوستان' }}
      />
      */}
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ title: 'پشتیبانی' }}
      />
      {/* 🆕 صفحه جدید دستگاه‌های فعال */}
      <Stack.Screen
        name="ActiveDevices"
        component={ActiveDevicesScreen}
        options={{ title: 'دستگاه‌های فعال' }}
      />
    </Stack.Navigator>
  );
}