import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AxiosError } from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  createDeviceType,
  deleteDeviceType,
  getDeviceTypes,
  updateDeviceType,
} from '../../services/device-types';
import DeviceTypeForm from './DeviceTypeForm';
import ExcelExportButton from '../../components/ExcelExportButton';

interface DeviceType {
  id: number;
  name: string;
}

type ApiError = AxiosError<{ message?: string }>;

const DeviceTypes = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDeviceType, setEditingDeviceType] = useState<DeviceType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();

  const { data: deviceTypes = [], isLoading } = useQuery<DeviceType[]>({
    queryKey: ['device-types'],
    queryFn: getDeviceTypes,
  });

  const filteredDeviceTypes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return deviceTypes.filter((deviceType) => {
      return term ? deviceType.name.toLowerCase().includes(term) : true;
    });
  }, [deviceTypes, searchTerm]);

  const createMutation = useMutation<unknown, ApiError, Omit<DeviceType, 'id'>>({
    mutationFn: createDeviceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-types'] });
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const updateMutation = useMutation<unknown, ApiError, { id: number; data: Partial<DeviceType> }>({
    mutationFn: ({ id, data }) => updateDeviceType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-types'] });
      setIsModalVisible(false);
      setEditingDeviceType(null);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation<unknown, ApiError, number>({
    mutationFn: deleteDeviceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-types'] });
    },
  });

  const handleAdd = () => {
    setEditingDeviceType(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: DeviceType) => {
    setEditingDeviceType(record);
    form.setFieldsValue({
      name: record.name,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingDeviceType) {
        updateMutation.mutate({ id: editingDeviceType.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<DeviceType> = [
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_: unknown, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>{t('Edit')}</a>
          <a onClick={() => handleDelete(record.id)}>{t('Delete')}</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
      >
        <h1>{t('Device Types')}</h1>
        <Space>
          <ExcelExportButton data={filteredDeviceTypes} columns={columns} fileName="device-types" isLoading={isLoading} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add Device Type')}
          </Button>
        </Space>
      </div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          allowClear
          placeholder={t('Search by Name')}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{ minWidth: 220 }}
        />
      </Space>
      <Table columns={columns} dataSource={filteredDeviceTypes} loading={isLoading} rowKey="id" />
      <Modal
        title={editingDeviceType ? t('Edit Device Type') : t('Add Device Type')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <DeviceTypeForm form={form} />
      </Modal>
    </div>
  );
};

export default DeviceTypes;
