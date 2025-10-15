import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../context/LanguageContext';
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
  const { t } = useTranslation();

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
          setError(err instanceof Error ? err : new Error(String(err)));
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
        <Text>{t('screens.reports.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>
          {t('screens.reports.error')} {error.message}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {reports && (
        <>
          {renderReportSection(
            t('screens.reports.sections.devicesByDepartment'),
            reports.devicesByDepartment,
            t('screens.reports.empty'),
          )}
          {renderReportSection(
            t('screens.reports.sections.printersStats'),
            reports.printersStats,
            t('screens.reports.empty'),
          )}
          {renderReportSection(
            t('screens.reports.sections.consumablesStats'),
            reports.consumablesStats,
            t('screens.reports.empty'),
          )}
          {renderReportSection(
            t('screens.reports.sections.devicesByEmployee'),
            reports.devicesByEmployee,
            t('screens.reports.empty'),
          )}
        </>
      )}
    </ScrollView>
  );
};

const renderReportSection = (title: string, items: ReportItem[], emptyLabel: string) => (
  <View key={title} style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {items.length === 0 ? (
      <Text style={styles.emptyText}>{emptyLabel}</Text>
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

