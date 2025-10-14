import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import { Notification } from '../interfaces/Notification';
import { useFetchList } from '../hooks/useFetchList';
import { getNotifications } from '../services/notifications';

const NotificationsScreen = () => {
  const {
    data: notifications,
    loading,
    error,
  } = useFetchList<Notification>(getNotifications);

  if (loading) {
    return (
      <View>
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading notifications: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.message}
          subtitle={`Type: ${item.type} • Status: ${item.status} • User: ${item.user?.name ?? 'N/A'}`}
        />
      )}
    />
  );
};

export default NotificationsScreen;

