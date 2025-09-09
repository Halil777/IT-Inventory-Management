import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DeviceCard({ device }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{device.name}</Text>
      <Text style={styles.type}>{device.type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  type: {
    color: '#666',
  },
});
