import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { Printer } from '../interfaces/Printer';
import { getPrinters } from '../services/printers';

const PrintersScreen = () => (
  <DataList<Printer>
    fetcher={getPrinters}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading printers..."
    errorMessage="Error loading printers:"
    emptyMessage="No printers available."
    renderItem={({ item }) => (
      <ListItem
        title={item.model}
        subtitle={`Department: ${item.department?.name ?? 'Unassigned'}`}
      />
    )}
  />
);

export default PrintersScreen;

