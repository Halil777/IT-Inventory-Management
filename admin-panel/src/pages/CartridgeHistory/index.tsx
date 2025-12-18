import { useState } from 'react';
import { Tabs, Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  getCartridgeHistory,
  getCartridgeStatistics,
} from '../../services/cartridgeHistory';

interface CartridgeHistoryEntry {
  id: number;
  quantity: number;
  createdAt: string;
  note?: string | null;
  cartridge?: {
    model?: string;
  } | null;
}

interface CartridgeUsageStat {
  cartridgeId: number;
  model: string;
  totalIssued: number;
  issueCount: number;
}

const formatDateTime = (value: string) => new Date(value).toLocaleString();

const CartridgeHistory = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('received');

  const receivedQuery = useQuery({
    queryKey: ['cartridge-history', 'received'],
    queryFn: () => getCartridgeHistory('received'),
    enabled: activeTab === 'received',
  });

  const issuedQuery = useQuery({
    queryKey: ['cartridge-history', 'issued'],
    queryFn: () => getCartridgeHistory('issued'),
    enabled: activeTab === 'issued',
  });

  const statsQuery = useQuery({
    queryKey: ['cartridge-history', 'statistics'],
    queryFn: () => getCartridgeStatistics(),
    enabled: activeTab === 'statistics',
  });

  const receivedColumns: ColumnsType<CartridgeHistoryEntry> = [
    {
      title: t('Model'),
      dataIndex: ['cartridge', 'model'],
      key: 'model',
    },
    {
      title: t('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number | undefined) => `+${value ?? 0}`,
    },
    {
      title: t('Date & Time'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => formatDateTime(value),
    },
  ];

  const issuedColumns: ColumnsType<CartridgeHistoryEntry> = [
    {
      title: t('Model'),
      dataIndex: ['cartridge', 'model'],
      key: 'model',
    },
    {
      title: t('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number | undefined) => `-${value ?? 0}`,
    },
    {
      title: t('Reason or Recipient'),
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: t('Date & Time'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => formatDateTime(value),
    },
  ];

  const statisticsColumns: ColumnsType<CartridgeUsageStat> = [
    {
      title: t('Model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('Total Issued'),
      dataIndex: 'totalIssued',
      key: 'totalIssued',
    },
    {
      title: t('Times Issued'),
      dataIndex: 'issueCount',
      key: 'issueCount',
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Link to="/cartridges">
          <Button icon={<ArrowLeftOutlined />}>{t('Back to Cartridges')}</Button>
        </Link>
        <h1 style={{ marginBottom: 0 }}>{t('Cartridge History')}</h1>
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'received',
            label: t('Received'),
            children: (
              <Table
                columns={receivedColumns}
                dataSource={receivedQuery.data || []}
                loading={receivedQuery.isLoading}
                rowKey="id"
              />
            ),
          },
          {
            key: 'issued',
            label: t('Issued'),
            children: (
              <Table
                columns={issuedColumns}
                dataSource={issuedQuery.data || []}
                loading={issuedQuery.isLoading}
                rowKey="id"
              />
            ),
          },
          {
            key: 'statistics',
            label: t('Statistics'),
            children: (
              <Table
                columns={statisticsColumns}
                dataSource={statsQuery.data || []}
                loading={statsQuery.isLoading}
                rowKey="cartridgeId"
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default CartridgeHistory;
