import React, { ReactNode } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTranslation } from '../context/LanguageContext';
import { useFetchList } from '../hooks/useFetchList';

interface DataListHeaderState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

interface DataListProps<T> {
  fetcher: () => Promise<T[]>;
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  header?: (state: DataListHeaderState<T>) => ReactNode;
}

const DataList = <T,>({
  fetcher,
  renderItem,
  keyExtractor,
  loadingMessage,
  errorMessage,
  emptyMessage,
  header,
}: DataListProps<T>) => {
  const { t } = useTranslation();
  const { data, loading, error, refresh } = useFetchList<T>(fetcher);

  const loadingLabel = loadingMessage ?? t('components.dataList.loading');
  const errorLabel = errorMessage ?? t('components.dataList.error');
  const emptyLabel = emptyMessage ?? t('components.dataList.empty');

  const headerContent = header
    ? header({ data, loading, error, refresh })
    : null;

  const renderStateWrapper = (content: ReactNode) => (
    <View style={styles.wrapper}>
      {headerContent}
      <View style={styles.centered}>{content}</View>
    </View>
  );

  if (loading && !data.length) {
    return renderStateWrapper(<Text style={styles.stateLabel}>{loadingLabel}</Text>);
  }

  if (error && !data.length) {
    return renderStateWrapper(
      <View style={styles.centered}>
        <Text style={[styles.stateLabel, styles.errorLabel]}>
          {errorLabel}
          {error.message ? ` ${error.message}` : ''}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonLabel}>{t('common.actions.retry')}</Text>
        </TouchableOpacity>
      </View>,
    );
  }

  if (!loading && !data.length) {
    return renderStateWrapper(<Text style={styles.stateLabel}>{emptyLabel}</Text>);
  }

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={headerContent ? () => <View style={styles.header}>{headerContent}</View> : undefined}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateLabel: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  errorLabel: {
    color: '#c53030',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1677ff',
    borderRadius: 999,
  },
  retryButtonLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  header: {
    marginBottom: 16,
  },
  listContent: {
    padding: 16,
  },
});

export default DataList;
