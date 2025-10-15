import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/context/LanguageContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerTitleAlign: 'center',
        headerRight: () => <LanguageSwitcher />, 
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.overview'),
          tabBarLabel: t('tabs.overview'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="departments"
        options={{
          title: t('tabs.departments'),
          tabBarLabel: t('tabs.departments'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="apartment" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: t('tabs.employees'),
          tabBarLabel: t('tabs.employees'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="groups" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cartridges"
        options={{
          title: t('tabs.cartridges'),
          tabBarLabel: t('tabs.cartridges'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="inventory" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: t('tabs.devices'),
          tabBarLabel: t('tabs.devices'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="devices" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="credentials"
        options={{
          title: t('tabs.credentials'),
          tabBarLabel: t('tabs.credentials'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="badge" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="printers"
        options={{
          title: t('tabs.printers'),
          tabBarLabel: t('tabs.printers'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="print" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
