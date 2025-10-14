import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import { DeviceType } from '../interfaces/DeviceType';
import { useFetchList } from '../hooks/useFetchList';
import { getDeviceTypes } from '../services/deviceTypes';

const DeviceTypesScreen = () => {
  const {
    data: deviceTypes,
    loading,
    error,
  } = useFetchList<DeviceType>(getDeviceTypes);

  if (loading) {
    return (
      <View>
        <Text>Loading device types...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading device types: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={deviceTypes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ListItem title={item.name} />}
    />
  );
};

export default DeviceTypesScreen;

