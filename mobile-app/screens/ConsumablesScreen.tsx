import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import { Consumable } from '../interfaces/Consumable';
import { useFetchList } from '../hooks/useFetchList';
import { getConsumables } from '../services/consumables';

const ConsumablesScreen = () => {
  const {
    data: consumables,
    loading,
    error,
  } = useFetchList<Consumable>(getConsumables);

  if (loading) {
    return (
      <View>
        <Text>Loading consumables...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading consumables: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={consumables}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.type}
          subtitle={`Quantity: ${item.quantity} • Status: ${item.status} • Department: ${item.department?.name ?? 'Unassigned'}`}
        />
      )}
    />
  );
};

export default ConsumablesScreen;

