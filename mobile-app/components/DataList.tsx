import React from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { useFetchList } from '../hooks/useFetchList';

interface DataListProps<T> {
  fetcher: () => Promise<T[]>;
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
}

const DataList = <T,>({
  fetcher,
  renderItem,
  keyExtractor,
  loadingMessage = 'Loading...',
  errorMessage = 'Error:',
  emptyMessage = 'No data available.',
}: DataListProps<T>) => {
  const { data, loading, error } = useFetchList<T>(fetcher);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>{loadingMessage}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>
          {errorMessage}
          {error.message ? ` ${error.message}` : ''}
        </Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.centered}>
        <Text>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});

export default DataList;
