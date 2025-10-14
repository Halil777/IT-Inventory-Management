import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { DeviceType } from '../interfaces/DeviceType';
import { getDeviceTypes } from '../services/deviceTypes';

const DeviceTypesScreen = () => (
  <DataList<DeviceType>
    fetcher={getDeviceTypes}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading device types..."
    errorMessage="Error loading device types:"
    emptyMessage="No device types available."
    renderItem={({ item }) => <ListItem title={item.name} />}
  />
);

export default DeviceTypesScreen;

