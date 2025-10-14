
import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Inventory Management</Text>
        <Text style={styles.subheading}>Choose a section to manage data.</Text>

        <View style={styles.buttonGroup}>
          <View style={styles.buttonWrapper}>
            <Button title="Devices" onPress={() => navigation.navigate('Devices')} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Employees" onPress={() => navigation.navigate('Employees')} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Departments" onPress={() => navigation.navigate('Departments')} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Credentials" onPress={() => navigation.navigate('Credentials')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  buttonGroup: {
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 12,
  },
});

export default HomeScreen;
