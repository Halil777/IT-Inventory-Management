import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AxiosError } from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  createCredential,
  deleteCredential,
  getCredentials,
  updateCredential,
} from '../../services/credentials';
import CredentialForm from './CredentialForm';
import ExcelExportButton from '../../components/ExcelExportButton';

interface Credential {
  id: number;
  fullName: string;
  login: string;
  password: string;
}

type ApiError = AxiosError<{ message?: string }>;

const Credentials = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [form] = Form.useForm();

  const { data: credentials = [], isLoading } = useQuery<Credential[]>({
    queryKey: ['credentials'],
    queryFn: getCredentials,
  });

  const createMutation = useMutation<unknown, ApiError, Omit<Credential, 'id'>>({
    mutationFn: createCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const updateMutation = useMutation<unknown, ApiError, { id: number; data: Omit<Credential, 'id'> }>({
    mutationFn: ({ id, data }) => updateCredential(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
      setIsModalVisible(false);
      setEditingCredential(null);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation<unknown, ApiError, number>({
    mutationFn: deleteCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });

  const handleAdd = () => {
    setEditingCredential(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Credential) => {
    setEditingCredential(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingCredential) {
        updateMutation.mutate({ id: editingCredential.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<Credential> = [
    {
      title: t('Full Name'),
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: t('Login'),
      dataIndex: 'login',
      key: 'login',
    },
    {
      title: t('Password'),
      dataIndex: 'password',
      key: 'password',
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
        <h1>{t('Credentials')}</h1>
        <Space>
          <ExcelExportButton data={credentials} columns={columns} fileName="credentials" isLoading={isLoading} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add Credential')}
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={credentials} loading={isLoading} rowKey="id" />
      <Modal
        title={editingCredential ? t('Edit Credential') : t('Add Credential')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <CredentialForm form={form} />
      </Modal>
    </div>
  );
};

export default Credentials;
