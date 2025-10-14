import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, Space, Table } from 'antd';
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

const Credentials = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({ queryKey: ['credentials'], queryFn: getCredentials });

  const createMutation = useMutation({
    mutationFn: createCredential,
    onSuccess: () => {
      queryClient.invalidateQueries(['credentials']);
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables) => updateCredential(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['credentials']);
      setIsModalVisible(false);
      setEditingCredential(null);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      queryClient.invalidateQueries(['credentials']);
    },
  });

  const handleAdd = () => {
    setEditingCredential(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCredential(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
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

  const columns = [
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
      render: (text, record) => (
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
          <ExcelExportButton data={data} columns={columns} fileName="credentials" isLoading={isLoading} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add Credential')}
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} loading={isLoading} rowKey="id" />
      <Modal
        title={editingCredential ? t('Edit Credential') : t('Add Credential')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
      >
        <CredentialForm form={form} />
      </Modal>
    </div>
  );
};

export default Credentials;
