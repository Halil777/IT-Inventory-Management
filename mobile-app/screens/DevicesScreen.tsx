
import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { useTranslation } from '../context/LanguageContext';
import { Device } from '../interfaces/Device';
import { getDevices } from '../services/devices';

const DevicesScreen = () => {
  const { t } = useTranslation();

  return (
    <DataList<Device>
      fetcher={getDevices}
      keyExtractor={(item) => item.id.toString()}
      loadingMessage={t('screens.devices.loading')}
      errorMessage={t('screens.devices.error')}
      emptyMessage={t('screens.devices.empty')}
      renderItem={({ item }) => {
        const fallbackName = item.model ?? item.type?.name ?? t('screens.devices.unnamed');
        const serial = t('screens.devices.serial', {
          serial: item.serialNumber ?? t('common.general.notAvailable'),
        });

        let statusLabel = item.status ?? t('common.general.notAvailable');
        const normalizedStatus = item.status?.toLowerCase();
        if (normalizedStatus) {
          const statusKey = `common.status.${normalizedStatus}`;
          const translatedStatus = t(statusKey);
          if (translatedStatus !== statusKey) {
            statusLabel = translatedStatus;
          }
        }

        const status = t('screens.devices.status', { status: statusLabel });

        return <ListItem title={fallbackName} subtitle={`${serial} • ${status}`} />;
      }}
    />
  );
};

export default DevicesScreen;
