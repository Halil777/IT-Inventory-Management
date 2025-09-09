import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  getDevices,
  getPrinters,
  getEmployees,
  getDepartments,
  getConsumables,
  getNotifications,
  getAuditLogs,
} from '../api';

type Counts = {
  devices: number;
  printers: number;
  employees: number;
  departments: number;
  consumables: number;
  alerts: number;
};

export default function DashboardScreen(): JSX.Element {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      getDevices(),
      getPrinters(),
      getEmployees(),
      getDepartments(),
      getConsumables(),
      getNotifications(),
      getAuditLogs(),
    ])
      .then(([
        devices,
        printers,
        employees,
        departments,
        consumables,
        notificationsData,
        auditLogs,
      ]) => {
        setCounts({
          devices: devices.length || 0,
          printers: printers.length || 0,
          employees: employees.length || 0,
          departments: departments.length || 0,
          consumables: consumables.length || 0,
          alerts: notificationsData.length || 0,
        });
        setNotifications(notificationsData || []);
        setLogs(auditLogs || []);
      })
      .catch((err) => console.error('Failed to load dashboard data', err));
  }, []);

  const stats = [
    { key: 'devices', label: 'Total Devices', icon: 'monitor', color: '#2563eb' },
    { key: 'printers', label: 'Active Printers', icon: 'printer', color: '#16a34a' },
    { key: 'employees', label: 'Employees', icon: 'users', color: '#9333ea' },
    { key: 'departments', label: 'Departments', icon: 'building', color: '#f97316' },
    { key: 'consumables', label: 'Consumables', icon: 'package', color: '#06b6d4' },
    { key: 'alerts', label: 'Alerts', icon: 'alert-triangle', color: '#dc2626' },
  ] as const;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {counts ? (
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.key} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{stat.label}</Text>
                <Feather name={stat.icon} size={16} color={stat.color} />
              </View>
              <Text style={styles.cardValue}>{(counts as any)[stat.key]}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {notifications.map((n) => (
          <View key={n.id} style={styles.notification}>
            <Feather name="info" size={16} color="#2563eb" style={styles.notificationIcon} />
            <Text style={styles.notificationText}>{n.message}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {logs.map((log) => (
          <View key={log.id} style={styles.log}>
            <Text style={styles.logText}>
              <Text style={styles.logUser}>{log.user?.name ?? 'System'} </Text>
              {log.action} {log.entity}
            </Text>
            <Text style={styles.logDate}>{new Date(log.timestamp).toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#232323',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#232323',
  },
  loading: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#6b7280',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#232323',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  notificationIcon: {
    marginRight: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#232323',
    flex: 1,
  },
  log: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingBottom: 8,
  },
  logText: {
    fontSize: 14,
    color: '#232323',
  },
  logUser: {
    fontWeight: '600',
  },
  logDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});
