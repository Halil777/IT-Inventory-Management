import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { useTranslation } from '../context/LanguageContext';
import { Device } from '../interfaces/Device';
import { getDevices } from '../services/devices';

const statusOrder = ['active', 'inactive', 'in_repair', 'retired'];

const DevicesScreen = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filters = useMemo(() => {
    const params: Record<string, string> = {};
    if (appliedSearch) {
      params.search = appliedSearch;
    }
    if (selectedStatus) {
      params.status = selectedStatus;
    }
    return params;
  }, [appliedSearch, selectedStatus]);

  const fetchDevices = useCallback(() => getDevices(filters), [filters]);

  const handleSearchSubmit = useCallback(() => {
    setAppliedSearch(searchValue.trim());
  }, [searchValue]);

  const handleStatusChange = useCallback(
    (status: string | null) => {
      setSelectedStatus((current) => (current === status ? null : status));
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setSearchValue('');
    setAppliedSearch('');
    setSelectedStatus(null);
  }, []);

  const filtersApplied = Boolean(appliedSearch || selectedStatus);

  const getStatusLabel = useCallback(
    (status: string) => {
      const normalized = status.toLowerCase();
      const commonKey = `common.status.${normalized}`;
      const translatedCommon = t(commonKey);
      if (translatedCommon !== commonKey) {
        return translatedCommon;
      }
      const specificKey = `screens.devices.statuses.${normalized}`;
      const translatedSpecific = t(specificKey);
      if (translatedSpecific !== specificKey) {
        return translatedSpecific;
      }
      return status.replace(/_/g, ' ');
    },
    [t],
  );

  const statusOptions = useMemo(() => {
    const uniqueStatuses = new Set<string>(statusOrder);
    return Array.from(uniqueStatuses);
  }, []);

  return (
    <DataList<Device>
      fetcher={fetchDevices}
      keyExtractor={(item) => item.id.toString()}
      loadingMessage={t('screens.devices.loading')}
      errorMessage={t('screens.devices.error')}
      emptyMessage={t('screens.devices.empty')}
      header={({ data, loading }) => (
        <View>
          <Text style={styles.title}>{t('entities.device.plural')}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('screens.devices.searchPlaceholder')}
            value={searchValue}
            onChangeText={(value) => {
              setSearchValue(value);
              if (!value.trim()) {
                setAppliedSearch('');
              }
            }}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChips}
          >
            {statusOptions.map((status) => {
              const isSelected = selectedStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => handleStatusChange(status)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                    {getStatusLabel(status)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.headerFooter}>
            <Text style={styles.resultLabel}>
              {loading
                ? t('common.general.loading')
                : t('screens.devices.results', { count: data.length })}
            </Text>
            {filtersApplied && (
              <TouchableOpacity onPress={handleClearFilters}>
                <Text style={styles.resetLink}>{t('screens.devices.clearFilters')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      renderItem={({ item }) => {
        const fallbackName = item.model ?? item.type?.name ?? t('screens.devices.unnamed');
        const serial = t('screens.devices.serial', {
          serial: item.serialNumber ?? t('common.general.notAvailable'),
        });

        let statusLabel = item.status ?? t('common.general.notAvailable');
        const normalizedStatus = item.status?.toLowerCase();
        if (normalizedStatus) {
          statusLabel = getStatusLabel(normalizedStatus);
        }

        const departmentLabel = item.department?.name
          ? t('common.labels.department') + `: ${item.department.name}`
          : null;
        const userLabel = item.user?.name
          ? t('common.labels.user') + `: ${item.user.name}`
          : null;

        const status = t('screens.devices.status', { status: statusLabel });

        const details = [serial, status, departmentLabel, userLabel].filter(Boolean) as string[];

        return <ListItem title={fallbackName} details={details} />;
      }}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e6f4ff',
    marginRight: 8,
    marginBottom: 4,
  },
  chipSelected: {
    backgroundColor: '#1677ff',
  },
  chipLabel: {
    fontSize: 14,
    color: '#1677ff',
    fontWeight: '600',
  },
  chipLabelSelected: {
    color: '#fff',
  },
  headerFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#555',
  },
  resetLink: {
    fontSize: 14,
    color: '#1677ff',
    fontWeight: '600',
  },
});

export default DevicesScreen;
