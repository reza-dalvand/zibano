// src/navigation/ManageStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import Header from '../components/common/Header';
import ManageBusinessScreen from '../screens/manageBusiness/ManageBusinessScreen';
import AllAppointmentsScreen from '../screens/manageBusiness/AllAppointmentsScreen';
import ManageServicesScreen from '../screens/manageBusiness/ManageServicesScreen';
import ManageTeamScreen from '../screens/manageBusiness/ManageTeamScreen';
import ManageScheduleScreen from '../screens/manageBusiness/ManageScheduleScreen';
import ManagePortfolioScreen from '../screens/manageBusiness/ManagePortfolioScreen';
import BusinessSettingsScreen from '../screens/manageBusiness/BusinessSettingsScreen';
import ReviewsScreen from '../screens/manageBusiness/ReviewsScreen';
// 🆕 صفحه جدید
import EditServiceScreen from '../screens/manageBusiness/EditServiceScreen';
import FinancialManagementScreen from '../screens/manageBusiness/FinancialManagementScreen';

const Stack = createNativeStackNavigator();

export default function ManageStackNavigator() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />,
        animation: 'slide_from_left',
      }}
    >
      <Stack.Screen
        name="ManageDashboard"
        component={ManageBusinessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FinancialManagement"
        component={FinancialManagementScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllAppointments"
        component={AllAppointmentsScreen}
        options={{ title: 'همه نوبت‌ها' }}
      />
      <Stack.Screen
        name="ManageServices"
        component={ManageServicesScreen}
        options={{ headerShown: false }}
      />
      {/* 🆕 صفحه ویرایش خدمت */}
      <Stack.Screen
        name="EditService"
        component={EditServiceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageTeam"
        component={ManageTeamScreen}
        options={{ title: 'مدیریت تیم' }}
      />
      <Stack.Screen
        name="ManageSchedule"
        component={ManageScheduleScreen}
        options={{ title: 'مدیریت زمان‌بندی' }}
      />
      <Stack.Screen
        name="ManagePortfolio"
        component={ManagePortfolioScreen}
        options={{ title: 'نمونه‌کارها' }}
      />
      <Stack.Screen
        name="BusinessSettings"
        component={BusinessSettingsScreen}
        options={{ title: 'تنظیمات سالن' }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ title: 'نظرات و امتیازات' }}
      />
    </Stack.Navigator>
  );
}