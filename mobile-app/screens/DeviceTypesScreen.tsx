import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { useTranslation } from '../context/LanguageContext';
import { DeviceType } from '../interfaces/DeviceType';
import { getDeviceTypes } from '../services/deviceTypes';

const DeviceTypesScreen = () => {
  const { t } = useTranslation();

  return (
    <DataList<DeviceType>
      fetcher={getDeviceTypes}
      keyExtractor={(item) => item.id.toString()}
      loadingMessage={t('screens.deviceTypes.loading')}
      errorMessage={t('screens.deviceTypes.error')}
      emptyMessage={t('screens.deviceTypes.empty')}
      renderItem={({ item }) => <ListItem title={item.name} />}
    />
  );
};

export default DeviceTypesScreen;

