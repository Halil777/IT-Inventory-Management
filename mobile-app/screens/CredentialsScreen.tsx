import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { Credential } from '../interfaces/Credential';
import { getCredentials } from '../services/credentials';

const CredentialsScreen = () => (
  <DataList<Credential>
    fetcher={getCredentials}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading credentials..."
    errorMessage="Error loading credentials:"
    emptyMessage="No credentials available."
    renderItem={({ item }) => (
      <ListItem title={item.fullName} subtitle={`Login: ${item.login}`} />
    )}
  />
);

export default CredentialsScreen;

