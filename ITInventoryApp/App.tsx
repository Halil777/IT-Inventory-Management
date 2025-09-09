import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import DepartmentsScreen from './src/screens/DepartmentsScreen';
import EmployeesScreen from './src/screens/EmployeesScreen';
import BottomNav from './src/components/BottomNav';

type Tab =
  | 'dashboard'
  | 'devices'
  | 'departments'
  | 'employees'
  | 'notifications'
  | 'profile';

export default function App(): JSX.Element {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');

  const renderScreen = (): JSX.Element => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'devices':
        return (
          <View style={styles.placeholder}>
            <Text>Devices screen</Text>
          </View>
        );
      case 'departments':
        return <DepartmentsScreen />;
      case 'employees':
        return <EmployeesScreen />;
      case 'notifications':
        return (
          <View style={styles.placeholder}>
            <Text>Notifications screen</Text>
          </View>
        );
      case 'profile':
        return <LoginScreen />;
      default:
        return <View />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
