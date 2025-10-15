import React, { useCallback } from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { useTranslation } from '../context/LanguageContext';
import { Notification } from '../interfaces/Notification';
import { getNotifications } from '../services/notifications';
import { normalizeKey, toTitleCase } from '@/utils/text';

const NotificationsScreen = () => {
  const { t } = useTranslation();

  const translateType = useCallback(
    (type?: string | null) => {
      if (!type) {
        return t('common.general.unknown');
      }

      const normalized = normalizeKey(type);
      const typeKey = `screens.notifications.types.${normalized}`;
      const translated = t(typeKey);

      if (translated !== typeKey) {
        return translated;
      }

      return toTitleCase(type);
    },
    [t],
  );

  const translateStatus = useCallback(
    (status?: string | null) => {
      if (!status) {
        return t('common.general.notAvailable');
      }

      const normalized = normalizeKey(status);
      const statusKey = `screens.notifications.statuses.${normalized}`;
      const translated = t(statusKey);

      if (translated !== statusKey) {
        return translated;
      }

      const commonStatusKey = `common.status.${normalized}`;
      const commonStatus = t(commonStatusKey);

      if (commonStatus !== commonStatusKey) {
        return commonStatus;
      }

      return toTitleCase(status);
    },
    [t],
  );

  return (
    <DataList<Notification>
      fetcher={getNotifications}
      keyExtractor={(item) => item.id.toString()}
      loadingMessage={t('screens.notifications.loading')}
      errorMessage={t('screens.notifications.error')}
      emptyMessage={t('screens.notifications.empty')}
      renderItem={({ item }) => (
        <ListItem
          title={item.message}
          subtitle={t('screens.notifications.subtitle', {
            type: translateType(item.type),
            status: translateStatus(item.status),
            user: item.user?.name ?? t('screens.notifications.unknownUser'),
          })}
        />
      )}
    />
  );
};

export default NotificationsScreen;

