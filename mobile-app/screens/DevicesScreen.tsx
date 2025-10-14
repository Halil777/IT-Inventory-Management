
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getDevices } from '../services/devices';
import { Device } from '../interfaces/Device';
import ListItem from '../components/ListItem';

const DevicesScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getDevices();
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <FlatList
      data={devices}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.model || 'N/A'}
          subtitle={`Serial: ${item.serialNumber || 'N/A'}`}
        />
      )}
    />
  );
};

export default DevicesScreen;
