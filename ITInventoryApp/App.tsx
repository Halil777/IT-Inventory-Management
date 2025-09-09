import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import DepartmentsScreen from './src/screens/DepartmentsScreen';
import EmployeesScreen from './src/screens/EmployeesScreen';
import DevicesScreen from './src/screens/DevicesScreen';
import BottomNav from './src/components/BottomNav';

type Tab =
  | 'dashboard'
  | 'devices'
  | 'departments'
  | 'employees';

export default function App(): JSX.Element {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');

  const renderScreen = (): JSX.Element => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'devices':
        return <DevicesScreen />;
      case 'departments':
        return <DepartmentsScreen />;
      case 'employees':
        return <EmployeesScreen />;
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
});
