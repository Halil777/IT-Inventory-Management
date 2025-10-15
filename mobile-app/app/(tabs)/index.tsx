import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { StatCard, StatCardProps } from '@/components/StatCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  createEmptyMetrics,
  getOverviewMetrics,
  OverviewMetricKey,
  OverviewMetrics,
} from '@/services/overview';

const metricConfigs = [
  {
    key: 'departments' as const,
    label: 'Departments',
    icon: 'apartment',
    accentColor: '#6366f1',
    accentBackground: 'rgba(99, 102, 241, 0.12)',
    href: '/departments',
  },
  {
    key: 'employees' as const,
    label: 'Employees',
    icon: 'groups',
    accentColor: '#f97316',
    accentBackground: 'rgba(249, 115, 22, 0.12)',
    href: '/employees',
  },
  {
    key: 'cartridges' as const,
    label: 'Cartridges',
    icon: 'inventory',
    accentColor: '#10b981',
    accentBackground: 'rgba(16, 185, 129, 0.12)',
    href: '/cartridges',
  },
  {
    key: 'devices' as const,
    label: 'Devices',
    icon: 'devices',
    accentColor: '#2563eb',
    accentBackground: 'rgba(37, 99, 235, 0.12)',
    href: '/devices',
  },
  {
    key: 'credentials' as const,
    label: 'Credentials',
    icon: 'badge',
    accentColor: '#a855f7',
    accentBackground: 'rgba(168, 85, 247, 0.12)',
    href: '/credentials',
  },
  {
    key: 'printers' as const,
    label: 'Printers',
    icon: 'print',
    accentColor: '#0ea5e9',
    accentBackground: 'rgba(14, 165, 233, 0.12)',
    href: '/printers',
  },
] as const satisfies Array<{
  key: OverviewMetricKey;
  label: string;
  icon: StatCardProps['icon'];
  accentColor: string;
  accentBackground: string;
  href: `/${string}`;
}>;

export default function HomeScreen() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<OverviewMetrics>(() => createEmptyMetrics());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const data = await getOverviewMetrics();
        setMetrics(data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load statistics.';
        setError(message);
      } finally {
        if (silent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void fetchMetrics();
  }, [fetchMetrics]);

  const handleRefresh = useCallback(() => {
    void fetchMetrics({ silent: true });
  }, [fetchMetrics]);

  const totalRecords = useMemo(
    () => Object.values(metrics).reduce((total, value) => total + value, 0),
    [metrics],
  );

  const handleNavigate = useCallback(
    (href: string) => {
      router.navigate(href);
    },
    [router],
  );

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        <ThemedText type="title" style={styles.heading}>
          Inventory Snapshot
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Track every department, device, and credential in one beautiful overview.
        </ThemedText>

        {lastUpdated && !loading ? (
          <ThemedText
            lightColor="#475569"
            darkColor="#94a3b8"
            style={styles.updatedAt}>
            Updated {lastUpdated.toLocaleString()}
          </ThemedText>
        ) : null}

        {error ? (
          <ThemedText style={styles.error}>{error}</ThemedText>
        ) : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <ThemedText style={styles.loadingLabel}>
              Loading latest statistics…
            </ThemedText>
          </View>
        ) : (
          <>
            <ThemedView lightColor="#1d4ed8" darkColor="#1e3a8a" style={styles.summaryCard}>
              <ThemedText
                type="defaultSemiBold"
                lightColor="rgba(226, 232, 240, 0.85)"
                darkColor="rgba(191, 219, 254, 0.9)"
                style={styles.summaryLabel}>
                Total records tracked
              </ThemedText>
              <ThemedText lightColor="#ffffff" darkColor="#ffffff" style={styles.summaryValue}>
                {totalRecords.toLocaleString()}
              </ThemedText>
              <ThemedText
                lightColor="rgba(226, 232, 240, 0.8)"
                darkColor="rgba(191, 219, 254, 0.75)"
                style={styles.summaryHelper}>
                Combined count of departments, employees, cartridges, devices, credentials, and
                printers.
              </ThemedText>
            </ThemedView>

            <View style={styles.grid}>
              {metricConfigs.map(({ key, label, icon, accentColor, accentBackground, href }) => (
                <StatCard
                  key={key}
                  label={label}
                  value={metrics[key]}
                  icon={icon}
                  accentColor={accentColor}
                  accentBackground={accentBackground}
                  onPress={() => handleNavigate(href)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 28,
  },
  heading: {
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 24,
  },
  updatedAt: {
    marginBottom: 18,
    fontSize: 14,
  },
  error: {
    color: '#dc2626',
    marginBottom: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingLabel: {
    marginTop: 12,
    fontSize: 16,
    color: '#1e40af',
  },
  summaryCard: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#1e3a8a',
    shadowOpacity: 0.3,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 18 },
    elevation: 8,
  },
  summaryLabel: {
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  summaryHelper: {
    fontSize: 15,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

