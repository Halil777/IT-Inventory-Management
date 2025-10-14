import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import { CartridgeUsage } from '../interfaces/CartridgeUsage';
import { useFetchList } from '../hooks/useFetchList';
import { getCartridgeUsage } from '../services/cartridgeUsage';

const CartridgeUsageScreen = () => {
  const {
    data: usages,
    loading,
    error,
  } = useFetchList<CartridgeUsage>(getCartridgeUsage);

  if (loading) {
    return (
      <View>
        <Text>Loading cartridge usage...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading cartridge usage: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={usages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={`${item.cartridge?.type ?? 'Unknown cartridge'} • Count: ${item.count}`}
          subtitle={`Printer: ${item.printer?.model ?? 'Unknown'} • User: ${item.user?.name ?? 'N/A'} • ${new Date(item.date).toLocaleString()}`}
        />
      )}
    />
  );
};

export default CartridgeUsageScreen;

