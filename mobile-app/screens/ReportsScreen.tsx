import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ReportItem, ReportsData } from '../interfaces/Report';
import {
  getConsumablesStatsReport,
  getDevicesByDepartmentReport,
  getDevicesByEmployeeReport,
  getPrintersStatsReport,
} from '../services/reports';

const ReportsScreen = () => {
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        const [devicesByDepartment, printersStats, consumablesStats, devicesByEmployee] = await Promise.all([
          getDevicesByDepartmentReport(),
          getPrintersStatsReport(),
          getConsumablesStatsReport(),
          getDevicesByEmployeeReport(),
        ]);

        if (isMounted) {
          setReports({
            devicesByDepartment,
            printersStats,
            consumablesStats,
            devicesByEmployee,
          });
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading reports...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading reports: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {reports && (
        <>
          {renderReportSection('Devices by Department', reports.devicesByDepartment)}
          {renderReportSection('Printers Stats', reports.printersStats)}
          {renderReportSection('Consumables Stats', reports.consumablesStats)}
          {renderReportSection('Devices by Employee', reports.devicesByEmployee)}
        </>
      )}
    </ScrollView>
  );
};

const renderReportSection = (title: string, items: ReportItem[]) => (
  <View key={title} style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {items.length === 0 ? (
      <Text style={styles.emptyText}>No data available.</Text>
    ) : (
      items.map((item, index) => (
        <View key={`${title}-${index}`} style={styles.reportCard}>
          {Object.entries(item).map(([key, value]) => (
            <Text key={key} style={styles.reportText}>
              {`${key}: ${String(value)}`}
            </Text>
          ))}
        </View>
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reportCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    gap: 4,
  },
  reportText: {
    fontSize: 14,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#666',
  },
});

export default ReportsScreen;

