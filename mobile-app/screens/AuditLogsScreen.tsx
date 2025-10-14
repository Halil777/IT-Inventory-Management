import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import { AuditLog } from '../interfaces/AuditLog';
import { useFetchList } from '../hooks/useFetchList';
import { getAuditLogs } from '../services/auditLogs';

const AuditLogsScreen = () => {
  const {
    data: auditLogs,
    loading,
    error,
  } = useFetchList<AuditLog>(getAuditLogs);

  if (loading) {
    return (
      <View>
        <Text>Loading audit logs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading audit logs: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={auditLogs}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={`${item.action} • ${item.entity}`}
          subtitle={`User: ${item.user?.name ?? 'System'} • ${new Date(item.timestamp).toLocaleString()}`}
        />
      )}
    />
  );
};

export default AuditLogsScreen;

