import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCartridges,
  createCartridge,
  updateCartridge,
  deleteCartridge,
  issueCartridge,
} from '../../services/cartridges';
import { Table, Button, Space, Modal, Form, InputNumber, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PlusOutlined, HistoryOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CartridgeForm from './CartridgeForm';
import ExcelExportButton from '../../components/ExcelExportButton';

const Cartridges = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isIssueModalVisible, setIsIssueModalVisible] = useState(false);
  const [editingCartridge, setEditingCartridge] = useState(null);
  const [selectedCartridge, setSelectedCartridge] = useState(null);
  const [form] = Form.useForm();
  const [issueForm] = Form.useForm();

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
  }, onError: (error) => {
    message.error(error?.response?.data?.message || t('Unable to delete cartridge.'));
  } });

  const issueMutation = useMutation({ mutationFn: issueCartridge, onSuccess: () => {
    queryClient.invalidateQueries(['cartridges']);
    setIsIssueModalVisible(false);
    issueForm.resetFields();
    setSelectedCartridge(null);
  }, onError: (error) => {
    message.error(error?.response?.data?.message || t('Unable to issue cartridge.'));
  } });

  const handleAdd = () => {
    setEditingCartridge(null);
    form.resetFields();
    form.setFieldsValue({ quantity: 1 });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCartridge(record);
    form.setFieldsValue({
      model: record.model,
      description: record.description ?? '',
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: t('Delete Cartridge'),
      icon: <ExclamationCircleOutlined />,
      content: t('Are you sure you want to delete this cartridge?'),
      okText: t('Delete'),
      okType: 'danger',
      cancelText: t('Cancel'),
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const handleIssue = (record) => {
    setSelectedCartridge(record);
    issueForm.setFieldsValue({ quantity: 1, note: '' });
    setIsIssueModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingCartridge) {
        const description = values.description ? values.description.trim() : '';
        const payload = {
          model: values.model.trim(),
          description: description ? description : null,
        };
        updateMutation.mutate({ id: editingCartridge.id, data: payload });
      } else {
        const description = values.description ? values.description.trim() : '';
        createMutation.mutate({
          model: values.model.trim(),
          description: description ? description : null,
          quantity: values.quantity,
        });
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCartridge(null);
  };

  const handleIssueOk = () => {
    issueForm.validateFields().then(values => {
      issueMutation.mutate({
        cartridgeId: selectedCartridge.id,
        quantity: values.quantity,
        note: values.note,
      });
    });
  };

  const handleIssueCancel = () => {
    setIsIssueModalVisible(false);
    setSelectedCartridge(null);
  };

  const columns = [
    {
      title: t('Model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
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
          <a onClick={() => handleIssue(record)}>{t('Issue')}</a>
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
          <Link to="/cartridges/history">
            <Button icon={<HistoryOutlined />}>
              {t('View History')}
            </Button>
          </Link>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add Cartridge')}
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data || []} loading={isLoading} rowKey="id" />
      <Modal
        title={editingCartridge ? t('Edit Cartridge') : t('Add Cartridge')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
      >
        <CartridgeForm form={form} isEditing={!!editingCartridge} />
      </Modal>
      <Modal
        title={selectedCartridge ? `${t('Issue Cartridge')}: ${selectedCartridge.model}` : t('Issue Cartridge')}
        visible={isIssueModalVisible}
        onOk={handleIssueOk}
        onCancel={handleIssueCancel}
        confirmLoading={issueMutation.isLoading}
      >
        <Form form={issueForm} layout="vertical">
          <Form.Item
            name="quantity"
            label={t('Quantity')}
            rules={[{ required: true, message: t('Please input the quantity!') }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="note"
            label={t('Reason or Recipient')}
            rules={[{ required: true, message: t('Please provide the reason or recipient!') }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cartridges;
