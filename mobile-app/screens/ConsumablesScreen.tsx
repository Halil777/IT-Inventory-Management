import React, { useCallback } from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { useTranslation } from '../context/LanguageContext';
import { Consumable } from '../interfaces/Consumable';
import { getConsumables } from '../services/consumables';
import { normalizeKey, toTitleCase } from '@/utils/text';

const ConsumablesScreen = () => {
  const { t } = useTranslation();

  const translateStatus = useCallback(
    (status?: string | null) => {
      if (!status) {
        return t('common.general.notAvailable');
      }

      const normalized = normalizeKey(status);
      const statusKey = `screens.consumables.statuses.${normalized}`;
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
    <DataList<Consumable>
      fetcher={getConsumables}
      keyExtractor={(item) => item.id.toString()}
      loadingMessage={t('screens.consumables.loading')}
      errorMessage={t('screens.consumables.error')}
      emptyMessage={t('screens.consumables.empty')}
      renderItem={({ item }) => (
        <ListItem
          title={item.type}
          subtitle={t('screens.consumables.subtitle', {
            quantity: item.quantity,
            status: translateStatus(item.status),
            department: item.department?.name ?? t('screens.consumables.unassigned'),
          })}
        />
      )}
    />
  );
};

export default ConsumablesScreen;

