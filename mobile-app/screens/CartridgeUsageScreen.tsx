import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { CartridgeUsage } from '../interfaces/CartridgeUsage';
import { getCartridgeUsage } from '../services/cartridgeUsage';

const CartridgeUsageScreen = () => (
  <DataList<CartridgeUsage>
    fetcher={getCartridgeUsage}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading cartridge usage..."
    errorMessage="Error loading cartridge usage:"
    emptyMessage="No cartridge usage records."
    renderItem={({ item }) => (
      <ListItem
        title={`${item.cartridge?.type ?? 'Unknown cartridge'} • Count: ${item.count}`}
        subtitle={`Printer: ${item.printer?.model ?? 'Unknown'} • User: ${item.user?.name ?? 'N/A'} • ${new Date(item.date).toLocaleString()}`}
      />
    )}
  />
);

export default CartridgeUsageScreen;

