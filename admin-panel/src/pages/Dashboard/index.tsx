import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import {
  ApartmentOutlined,
  DesktopOutlined,
  IdcardOutlined,
  InboxOutlined,
  PrinterOutlined,
  ReloadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useMemo, type ComponentType, type CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  createEmptyDashboardSummary,
  DashboardSummary,
  DashboardSummaryKey,
  getDashboardSummary,
} from '@/services/dashboard';

const metricDefinitions: Array<{
  key: DashboardSummaryKey;
  label: string;
  icon: ComponentType<{ style?: CSSProperties }>;
  color: string;
  helper: string;
}> = [
  {
    key: 'departments',
    label: 'Departments',
    icon: ApartmentOutlined,
    color: '#6366f1',
    helper: 'Teams and business units keeping your organization aligned.',
  },
  {
    key: 'employees',
    label: 'Employees',
    icon: TeamOutlined,
    color: '#f97316',
    helper: 'People with access to the inventory ecosystem.',
  },
  {
    key: 'cartridges',
    label: 'Cartridges',
    icon: InboxOutlined,
    color: '#10b981',
    helper: 'Consumables ready for allocation or replenishment.',
  },
  {
    key: 'devices',
    label: 'Devices',
    icon: DesktopOutlined,
    color: '#2563eb',
    helper: 'Laptops, desktops, and peripherals actively tracked.',
  },
  {
    key: 'credentials',
    label: 'Credentials',
    icon: IdcardOutlined,
    color: '#a855f7',
    helper: 'Accounts and secure identities under management.',
  },
  {
    key: 'printers',
    label: 'Printers',
    icon: PrinterOutlined,
    color: '#0ea5e9',
    helper: 'Printing devices available across the organization.',
  },
];

const totalCardStyle: CSSProperties = {
  background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 35%, #1d4ed8 100%)',
  border: 'none',
  borderRadius: 24,
  boxShadow: '0 25px 50px -12px rgba(30, 64, 175, 0.45)',
  color: '#fff',
};

const totalBodyStyle: CSSProperties = {
  padding: 32,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const metricCardStyle: CSSProperties = {
  borderRadius: 20,
  border: '1px solid rgba(148, 163, 184, 0.15)',
  boxShadow: '0 20px 45px -18px rgba(15, 23, 42, 0.25)',
};

const iconContainerStyle = (color: string): CSSProperties => ({
  alignItems: 'center',
  background: `${color}20`,
  borderRadius: 16,
  display: 'flex',
  height: 56,
  justifyContent: 'center',
  width: 56,
});

const Dashboard = () => {
  const { t } = useTranslation();

  const { data, isError, error, isLoading, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: getDashboardSummary,
    staleTime: 1000 * 60 * 5,
  });

  const summary: DashboardSummary = data ?? createEmptyDashboardSummary();
  const showSkeleton = isLoading && !data;

  const totalRecords = useMemo(
    () => Object.values(summary).reduce((total, value) => total + value, 0),
    [summary],
  );

  const lastUpdated = useMemo(() => (dataUpdatedAt ? new Date(dataUpdatedAt) : null), [dataUpdatedAt]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col xs={24} md={16}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Typography.Title level={2} style={{ marginBottom: 0 }}>
              {t('Dashboard')}
            </Typography.Title>
            <Typography.Text type="secondary">
              {t('Stay on top of every inventory category with live insights and beautiful visuals.')}
            </Typography.Text>
            {lastUpdated ? (
              <Typography.Text type="secondary">
                {t('Last updated')}: {lastUpdated.toLocaleString()}
              </Typography.Text>
            ) : null}
          </Space>
        </Col>
        <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isFetching}
            type="primary">
            {t('Refresh')}
          </Button>
        </Col>
      </Row>

      {isError ? (
        <Alert
          type="error"
          showIcon
          message={t('Unable to load dashboard data')}
          description={error instanceof Error ? error.message : t('Please try again later.')}
        />
      ) : null}

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card style={totalCardStyle} bodyStyle={totalBodyStyle}>
            {showSkeleton ? (
              <Skeleton active paragraph={{ rows: 2 }} title={false} />
            ) : (
              <Space direction="vertical" size={4}>
                <Typography.Text style={{ color: 'rgba(226, 232, 240, 0.85)', textTransform: 'uppercase' }}>
                  {t('Total records tracked')}
                </Typography.Text>
                <Typography.Title level={1} style={{ color: '#fff', margin: 0 }}>
                  {totalRecords.toLocaleString()}
                </Typography.Title>
                <Typography.Text style={{ color: 'rgba(226, 232, 240, 0.85)' }}>
                  {t('Combined count of departments, employees, cartridges, devices, credentials, and printers.')}
                </Typography.Text>
              </Space>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {metricDefinitions.map(({ key, label, icon: Icon, color, helper }) => (
          <Col xs={24} sm={12} lg={8} key={key}>
            <Card style={metricCardStyle} bodyStyle={{ padding: 24, minHeight: 160 }}>
              {showSkeleton ? (
                <Skeleton active paragraph={{ rows: 2 }} title={{ width: 140 }} />
              ) : (
                <Space align="start" size={16}>
                  <div style={iconContainerStyle(color)}>
                    <Icon style={{ fontSize: 26, color }} />
                  </div>
                  <Space direction="vertical" size={6} style={{ flex: 1 }}>
                    <Typography.Text type="secondary">{t(label)}</Typography.Text>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                      {summary[key].toLocaleString()}
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {t(helper)}
                    </Typography.Text>
                  </Space>
                </Space>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
};

export default Dashboard;

