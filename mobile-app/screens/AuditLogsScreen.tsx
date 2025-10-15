import React, { useCallback } from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { useTranslation } from '../context/LanguageContext';
import { AuditLog } from '../interfaces/AuditLog';
import { getAuditLogs } from '../services/auditLogs';
import { normalizeKey, toTitleCase } from '@/utils/text';

const entityTranslationMap: Record<string, string> = {
  department: 'entities.department.singular',
  departments: 'entities.department.plural',
  employee: 'entities.employee.singular',
  employees: 'entities.employee.plural',
  device: 'entities.device.singular',
  devices: 'entities.device.plural',
  credential: 'entities.credential.singular',
  credentials: 'entities.credential.plural',
  cartridge: 'entities.cartridge.singular',
  cartridges: 'entities.cartridge.plural',
  printer: 'entities.printer.singular',
  printers: 'entities.printer.plural',
  consumable: 'entities.consumable.singular',
  consumables: 'entities.consumable.plural',
  notification: 'entities.notification.singular',
  notifications: 'entities.notification.plural',
  auditlog: 'entities.auditLog.singular',
  auditlogs: 'entities.auditLog.plural',
  devicetype: 'entities.deviceType.singular',
  devicetypes: 'entities.deviceType.plural',
  cartridgeusage: 'entities.cartridgeUsage.singular',
  cartridgeusages: 'entities.cartridgeUsage.plural',
  report: 'entities.report.singular',
  reports: 'entities.report.plural',
};

const AuditLogsScreen = () => {
  const { t } = useTranslation();

  const translateAction = useCallback(
    (action?: string | null) => {
      if (!action) {
        return t('common.general.unknown');
      }

      const normalized = normalizeKey(action);
      const key = `screens.auditLogs.actions.${normalized}`;
      const translated = t(key);

      if (translated !== key) {
        return translated;
      }

      return toTitleCase(action);
    },
    [t],
  );

  const translateEntity = useCallback(
    (entity?: string | null) => {
      if (!entity) {
        return t('common.general.unknown');
      }

      const normalized = normalizeKey(entity);
      const dictionaryKey = entityTranslationMap[normalized];

      if (dictionaryKey) {
        const translated = t(dictionaryKey);
        if (translated !== dictionaryKey) {
          return translated;
        }
      }

      return toTitleCase(entity);
    },
    [t],
  );

  return (
    <DataList<AuditLog>
      fetcher={getAuditLogs}
      keyExtractor={(item) => item.id.toString()}
      loadingMessage={t('screens.auditLogs.loading')}
      errorMessage={t('screens.auditLogs.error')}
      emptyMessage={t('screens.auditLogs.empty')}
      renderItem={({ item }) => (
        <ListItem
          title={t('screens.auditLogs.entryTitle', {
            action: translateAction(item.action),
            entity: translateEntity(item.entity),
          })}
          subtitle={t('screens.auditLogs.subtitle', {
            user: item.user?.name ?? t('common.general.system'),
            timestamp: new Date(item.timestamp).toLocaleString(),
          })}
        />
      )}
    />
  );
};

export default AuditLogsScreen;

