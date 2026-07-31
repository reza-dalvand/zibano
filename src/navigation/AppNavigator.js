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

const EmptyAuthScreen = () => <View />;

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
            bottom: Math.max(insets.bottom, 30),
            left: 18,
            right: 18,
            backgroundColor: colors.cardBackground,
            borderRadius: 20,
            height: 65,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            paddingHorizontal: 4,
            paddingVertical: 0,
          },
          tabBarLabelStyle: {
            fontFamily: 'Vazir-Medium',
            fontSize: 10,
            margin: 0,
            padding: 0,
            lineHeight: 14,
          },
          tabBarIconStyle: {
            margin: 0,
            padding: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 0,
            marginVertical: 0,
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
            return (
              <Icon 
                name={iconName} 
                size={26} 
                color={color} 
                style={{ margin: 0, padding: 0 }}
              />
            );
          },
        })}
      >
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
        {isAuthenticated ? (
          <>
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
          <Tab.Screen
            name="AuthTab"
            component={EmptyAuthScreen}
            options={{
              tabBarLabel: 'ورود / ثبت‌نام',
            }}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
                setShowAuthModal(true);
              },
            }}
          />
        )}
      </Tab.Navigator>

      <AuthBottomSheet
        visible={showAuthModal}
        onClose={handleCloseAuthModal}
      />
    </>
  );
}