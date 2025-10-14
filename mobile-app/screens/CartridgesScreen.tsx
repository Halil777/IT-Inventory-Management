import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import { Cartridge } from '../interfaces/Cartridge';
import { useFetchList } from '../hooks/useFetchList';
import { getCartridges } from '../services/cartridges';

const CartridgesScreen = () => {
  const {
    data: cartridges,
    loading,
    error,
  } = useFetchList<Cartridge>(getCartridges);

  if (loading) {
    return (
      <View>
        <Text>Loading cartridges...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading cartridges: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cartridges}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem title={item.type} subtitle={`Status: ${item.status}`} />
      )}
    />
  );
};

export default CartridgesScreen;

