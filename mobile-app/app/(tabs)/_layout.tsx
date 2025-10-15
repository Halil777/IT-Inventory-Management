import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
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
          title: 'Overview',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="departments"
        options={{
          title: 'Departments',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="apartment" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: 'Employees',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="groups" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cartridges"
        options={{
          title: 'Cartridges',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="inventory" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: 'Devices',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="devices" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="credentials"
        options={{
          title: 'Credentials',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="badge" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="printers"
        options={{
          title: 'Printers',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="print" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
