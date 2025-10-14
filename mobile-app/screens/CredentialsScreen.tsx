import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import { Credential } from '../interfaces/Credential';
import { useFetchList } from '../hooks/useFetchList';
import { getCredentials } from '../services/credentials';

const CredentialsScreen = () => {
  const {
    data: credentials,
    loading,
    error,
  } = useFetchList<Credential>(getCredentials);

  if (loading) {
    return (
      <View>
        <Text>Loading credentials...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading credentials: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={credentials}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem title={item.fullName} subtitle={`Login: ${item.login}`} />
      )}
    />
  );
};

export default CredentialsScreen;

