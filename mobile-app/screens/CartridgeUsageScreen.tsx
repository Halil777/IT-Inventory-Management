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
        title={`${item.cartridge?.model ?? 'Unknown cartridge'} • Count: ${item.count}`}
        subtitle={`Printer: ${item.printer?.name ?? item.printer?.model ?? 'Unknown'} (${item.printer?.model ?? 'N/A'}) • User: ${item.user?.name ?? 'N/A'} • ${new Date(item.date).toLocaleString()}`}
      />
    )}
  />
);

export default CartridgeUsageScreen;

