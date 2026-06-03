import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import ScreenWrapper from '../components/common/ScreenWrapper';

const Tab = createBottomTabNavigator();

// --- ۵ صفحه پایه به عنوان نمونه اولیه ---
function HomeScreen() {
  const { colors } = useTheme();
  return (
    <ScreenWrapper scrollable padding={20}>
      <Text style={[styles.title, { color: colors.textMain }]}>صفحه اصلی (هوم)</Text>
    </ScreenWrapper>
  );
}

function ExploreScreen() {
  const { colors } = useTheme();
  return (
    <ScreenWrapper scrollable padding={20}>
      <Text style={[styles.title, { color: colors.textMain }]}>اکسپلور (مشابه اینستاگرام)</Text>
    </ScreenWrapper>
  );
}

function CreateBusinessScreen() {
  const { colors } = useTheme();
  return (
    <ScreenWrapper scrollable padding={20}>
      <Text style={[styles.title, { color: colors.textMain }]}>ایجاد کسب و کار جدید</Text>
    </ScreenWrapper>
  );
}

function ManageBusinessScreen() {
  const { colors } = useTheme();
  return (
    <ScreenWrapper scrollable padding={20}>
      <Text style={[styles.title, { color: colors.textMain }]}>مدیریت کسب و کار</Text>
    </ScreenWrapper>
  );
}

function ProfileScreen() {
  const { colors } = useTheme();
  return (
    <ScreenWrapper scrollable padding={20}>
      <Text style={[styles.title, { color: colors.textMain }]}>پروفایل کاربری</Text>
    </ScreenWrapper>
  );
}

// --- کامپوننت اصلی ناوبری ---
export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarHideOnKeyboard: true, // موقع باز شدن کیبورد تب‌بار مخفی میشه تا مزاحم نباشه
          tabBarStyle: {
            position: 'absolute',
            bottom: 20, // فاصله از پایین صفحه برای حالت شناور
            left: 20, // حاشیه از چپ
            right: 20, // حاشیه از راست
            backgroundColor: colors.cardBackground,
            borderRadius: 24, // گرد کردن گوشه‌های تب‌بار
            height: 70, // ارتفاع تب‌بار
            borderTopWidth: 0, // حذف خط بالای پیش‌فرض
            elevation: 8, // سایه در اندروید
            shadowColor: '#000', // سایه در iOS
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            paddingBottom: 12,
            paddingTop: 12,
          },
          tabBarLabelStyle: {
            fontFamily: 'Vazir-Medium',
            fontSize: 11,
            marginTop: 4,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            // استفاده از آیکون‌های پایه و قطعی MaterialIcons
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Explore') iconName = 'explore';
            else if (route.name === 'CreateBusiness') iconName = 'add-circle-outline';
            else if (route.name === 'ManageBusiness') iconName = 'dashboard';
            else if (route.name === 'Profile') iconName = 'person-outline';

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
          component={ManageBusinessScreen} 
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
          options={{ tabBarLabel: 'اکسپلور' }} 
        />
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ tabBarLabel: 'خانه' }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
    marginTop: 20,
  },
});