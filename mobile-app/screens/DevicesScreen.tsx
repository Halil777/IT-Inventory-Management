
import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { Device } from '../interfaces/Device';
import { getDevices } from '../services/devices';

const DevicesScreen = () => (
  <DataList<Device>
    fetcher={getDevices}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading devices..."
    errorMessage="Error loading devices:"
    emptyMessage="No devices available."
    renderItem={({ item }) => (
      <ListItem
        title={item.model ?? item.type?.name ?? 'Unnamed Device'}
        subtitle={`Serial: ${item.serialNumber ?? 'N/A'} • Status: ${item.status}`}
      />
    )}
  />
);

export default DevicesScreen;
