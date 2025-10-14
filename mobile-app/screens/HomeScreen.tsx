
import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Devices"
        onPress={() => navigation.navigate('Devices')}
      />
      <Button
        title="Go to Employees"
        onPress={() => navigation.navigate('Employees')}
      />
    </View>
  );
};

export default HomeScreen;
