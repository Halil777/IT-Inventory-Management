import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import DeviceCard from '../components/DeviceCard.js';

const mockDevices = [
  { id: '1', name: 'Laptop A', type: 'Laptop' },
  { id: '2', name: 'Monitor B', type: 'Monitor' },
  { id: '3', name: 'Printer C', type: 'Printer' },
];

export default function DeviceListScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeviceCard device={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
