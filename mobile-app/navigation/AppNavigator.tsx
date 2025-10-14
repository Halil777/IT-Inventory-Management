
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import CredentialsScreen from '../screens/CredentialsScreen';
import DepartmentsScreen from '../screens/DepartmentsScreen';
import DevicesScreen from '../screens/DevicesScreen';
import EmployeesScreen from '../screens/EmployeesScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Devices" component={DevicesScreen} />
        <Stack.Screen name="Employees" component={EmployeesScreen} />
        <Stack.Screen name="Departments" component={DepartmentsScreen} />
        <Stack.Screen name="Credentials" component={CredentialsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
