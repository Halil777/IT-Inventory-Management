import React from 'react';
import DataList from '../components/DataList';
import ListItem from '../components/ListItem';
import { AuditLog } from '../interfaces/AuditLog';
import { getAuditLogs } from '../services/auditLogs';

const AuditLogsScreen = () => (
  <DataList<AuditLog>
    fetcher={getAuditLogs}
    keyExtractor={(item) => item.id.toString()}
    loadingMessage="Loading audit logs..."
    errorMessage="Error loading audit logs:"
    emptyMessage="No audit logs recorded."
    renderItem={({ item }) => (
      <ListItem
        title={`${item.action} • ${item.entity}`}
        subtitle={`User: ${item.user?.name ?? 'System'} • ${new Date(item.timestamp).toLocaleString()}`}
      />
    )}
  />
);

export default AuditLogsScreen;

