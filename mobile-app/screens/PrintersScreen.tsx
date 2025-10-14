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
        title={item.name}
        subtitle={`Model: ${item.model}`}
        details={[
          `Department: ${item.department?.name ?? 'Unassigned'}`,
          `Used By: ${item.user?.name ?? 'Unassigned'}`,
          item.description ? `Description: ${item.description}` : null,
        ].filter(Boolean) as string[]}
      />
    )}
  />
);

export default PrintersScreen;

