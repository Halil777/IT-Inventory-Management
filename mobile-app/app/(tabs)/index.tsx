import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const resources = [
  { title: 'Audit Logs', href: '/audit-logs' },
  { title: 'Cartridge Usage', href: '/cartridge-usage' },
  { title: 'Cartridges', href: '/cartridges' },
  { title: 'Consumables', href: '/consumables' },
  { title: 'Credentials', href: '/credentials' },
  { title: 'Departments', href: '/departments' },
  { title: 'Device Types', href: '/device-types' },
  { title: 'Notifications', href: '/notifications' },
  { title: 'Printers', href: '/printers' },
  { title: 'Reports', href: '/reports' },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>
        IT Inventory Overview
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Choose a resource to explore real-time data from the backend services.
      </ThemedText>
      <ThemedView style={styles.grid}>
        {resources.map((resource) => (
          <Link key={resource.href} href={resource.href} asChild>
            <TouchableOpacity style={styles.card}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                {resource.title}
              </ThemedText>
            </TouchableOpacity>
          </Link>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  heading: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    flexBasis: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    textAlign: 'center',
  },
});
