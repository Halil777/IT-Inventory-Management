import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import { Printer } from '../interfaces/Printer';
import { useFetchList } from '../hooks/useFetchList';
import { getPrinters } from '../services/printers';

const PrintersScreen = () => {
  const {
    data: printers,
    loading,
    error,
  } = useFetchList<Printer>(getPrinters);

  if (loading) {
    return (
      <View>
        <Text>Loading printers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading printers: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={printers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.model}
          subtitle={`Department: ${item.department?.name ?? 'Unassigned'}`}
        />
      )}
    />
  );
};

export default PrintersScreen;

