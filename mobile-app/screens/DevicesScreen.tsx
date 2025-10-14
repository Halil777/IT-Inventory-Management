
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import { Device } from '../interfaces/Device';
import { useFetchList } from '../hooks/useFetchList';
import { getDevices } from '../services/devices';

const DevicesScreen = () => {
  const {
    data: devices,
    loading,
    error,
  } = useFetchList<Device>(getDevices);

  if (loading) {
    return (
      <View>
        <Text>Loading devices...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading devices: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={devices}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.model ?? item.type?.name ?? 'Unnamed Device'}
          subtitle={`Serial: ${item.serialNumber ?? 'N/A'} • Status: ${item.status}`}
        />
      )}
    />
  );
};

export default DevicesScreen;
