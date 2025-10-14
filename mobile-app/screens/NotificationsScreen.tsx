import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { Notification } from '../interfaces/Notification';
import { getNotifications } from '../services/notifications';

const NotificationsScreen = () => (
  <DataList<Notification>
    fetcher={getNotifications}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading notifications..."
    errorMessage="Error loading notifications:"
    emptyMessage="No notifications available."
    renderItem={({ item }) => (
      <ListItem
        title={item.message}
        subtitle={`Type: ${item.type} • Status: ${item.status} • User: ${item.user?.name ?? 'N/A'}`}
      />
    )}
  />
);

export default NotificationsScreen;

