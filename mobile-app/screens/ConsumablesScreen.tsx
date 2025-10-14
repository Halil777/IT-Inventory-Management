import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { Consumable } from '../interfaces/Consumable';
import { getConsumables } from '../services/consumables';

const ConsumablesScreen = () => (
  <DataList<Consumable>
    fetcher={getConsumables}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading consumables..."
    errorMessage="Error loading consumables:"
    emptyMessage="No consumables available."
    renderItem={({ item }) => (
      <ListItem
        title={item.type}
        subtitle={`Quantity: ${item.quantity} • Status: ${item.status} • Department: ${item.department?.name ?? 'Unassigned'}`}
      />
    )}
  />
);

export default ConsumablesScreen;

