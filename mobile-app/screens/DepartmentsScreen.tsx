import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import { Department } from '../interfaces/Department';
import { useFetchList } from '../hooks/useFetchList';
import { getDepartments } from '../services/departments';

const DepartmentsScreen = () => {
  const {
    data: departments,
    loading,
    error,
  } = useFetchList<Department>(getDepartments);

  if (loading) {
    return (
      <View>
        <Text>Loading departments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading departments: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={departments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.name}
          subtitle={`Head: ${item.head ?? 'N/A'}${item.description ? ` • ${item.description}` : ''}`}
        />
      )}
    />
  );
};

export default DepartmentsScreen;

