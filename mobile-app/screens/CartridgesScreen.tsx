import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { Cartridge } from '../interfaces/Cartridge';
import { getCartridges } from '../services/cartridges';

const CartridgesScreen = () => (
  <DataList<Cartridge>
    fetcher={getCartridges}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading cartridges..."
    errorMessage="Error loading cartridges:"
    emptyMessage="No cartridges available."
    renderItem={({ item }) => (
      <ListItem title={item.type} subtitle={`Status: ${item.status}`} />
    )}
  />
);

export default CartridgesScreen;

