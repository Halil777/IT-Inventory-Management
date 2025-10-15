import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { useTranslation } from '../context/LanguageContext';
import { CartridgeUsage } from '../interfaces/CartridgeUsage';
import { getCartridgeUsage } from '../services/cartridgeUsage';

const CartridgeUsageScreen = () => {
  const { t } = useTranslation();

  return (
    <DataList<CartridgeUsage>
      fetcher={getCartridgeUsage}
      keyExtractor={(item) => item.id.toString()}
      loadingMessage={t('screens.cartridgeUsage.loading')}
      errorMessage={t('screens.cartridgeUsage.error')}
      emptyMessage={t('screens.cartridgeUsage.empty')}
      renderItem={({ item }) => {
        const model = item.cartridge?.model ?? t('screens.cartridgeUsage.unknownCartridge');
        const title = t('screens.cartridgeUsage.title', { model, count: item.count });
        const printerName = item.printer?.name ?? item.printer?.model ?? t('screens.cartridgeUsage.unknownPrinter');
        const subtitle = t('screens.cartridgeUsage.subtitle', {
          printer: printerName,
          printerModel: item.printer?.model ?? t('common.general.notAvailable'),
          user: item.user?.name ?? t('screens.cartridgeUsage.unknownUser'),
          timestamp: new Date(item.date).toLocaleString(),
        });

        return <ListItem title={title} subtitle={subtitle} />;
      }}
    />
  );
};

export default CartridgeUsageScreen;

