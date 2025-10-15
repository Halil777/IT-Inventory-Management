import React from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '../context/LanguageContext';
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
  loadingMessage,
  errorMessage,
  emptyMessage,
}: DataListProps<T>) => {
  const { t } = useTranslation();
  const { data, loading, error } = useFetchList<T>(fetcher);

  const loadingLabel = loadingMessage ?? t('components.dataList.loading');
  const errorLabel = errorMessage ?? t('components.dataList.error');
  const emptyLabel = emptyMessage ?? t('components.dataList.empty');

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>{loadingLabel}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>
          {errorLabel}
          {error.message ? ` ${error.message}` : ''}
        </Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.centered}>
        <Text>{emptyLabel}</Text>
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
