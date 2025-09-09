import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Tab =
  | 'dashboard'
  | 'devices'
  | 'departments'
  | 'employees';

interface BottomNavProps {
  currentTab: Tab;
  onChange(tab: Tab): void;
}

export default function BottomNav({ currentTab, onChange }: BottomNavProps): JSX.Element {
  const items: { key: Tab; label: string; icon: any }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'home' },
    { key: 'devices', label: 'Devices', icon: 'monitor' },
    { key: 'departments', label: 'Departments', icon: 'grid' },
    { key: 'employees', label: 'Employees', icon: 'users' },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.item}
          onPress={() => onChange(item.key)}
        >
          <Feather
            name={item.icon}
            size={20}
            color={currentTab === item.key ? '#343434' : '#6b7280'}
          />
          <Text style={[styles.label, currentTab === item.key && styles.labelActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  item: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  labelActive: {
    color: '#343434',
    fontWeight: '600',
  },
});
