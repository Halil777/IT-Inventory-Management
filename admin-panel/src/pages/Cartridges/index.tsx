import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCartridges, createCartridge, updateCartridge, deleteCartridge } from '../../services/cartridges';
import { Table, Button, Space, Modal, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import CartridgeForm from './CartridgeForm';
import ExcelExportButton from '../../components/ExcelExportButton';

const Cartridges = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCartridge, setEditingCartridge] = useState(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({ queryKey: ['cartridges'], queryFn: getCartridges });

  const createMutation = useMutation({ mutationFn: createCartridge, onSuccess: () => { 
    queryClient.invalidateQueries(['cartridges']);
    setIsModalVisible(false);
    form.resetFields();
  } });

  const updateMutation = useMutation({ mutationFn: (variables) => updateCartridge(variables.id, variables.data), onSuccess: () => { 
    queryClient.invalidateQueries(['cartridges']);
    setIsModalVisible(false);
    setEditingCartridge(null);
    form.resetFields();
  } });

  const deleteMutation = useMutation({ mutationFn: deleteCartridge, onSuccess: () => { 
    queryClient.invalidateQueries(['cartridges']);
  } });

  const handleAdd = () => {
    setEditingCartridge(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCartridge(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingCartridge) {
        updateMutation.mutate({ id: editingCartridge.id, data: values });
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
      title: t('Model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('SKU'),
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: t('Stock'),
      dataIndex: 'stock',
      key: 'stock',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>{t('Cartridges')}</h1>
        <Space>
          <ExcelExportButton data={data} columns={columns} fileName="cartridges" isLoading={isLoading} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add Cartridge')}
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} loading={isLoading} rowKey="id" />
      <Modal
        title={editingCartridge ? t('Edit Cartridge') : t('Add Cartridge')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
      >
        <CartridgeForm form={form} />
      </Modal>
    </div>
  );
};

export default Cartridges;
