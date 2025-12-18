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
import type { ColumnsType } from 'antd/es/table';
import type { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PlusOutlined, HistoryOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CartridgeForm from './CartridgeForm';
import ExcelExportButton from '../../components/ExcelExportButton';

interface Cartridge {
  id: number;
  model: string;
  description?: string | null;
  stock?: number;
}

interface CartridgeFormValues {
  [key: string]: unknown;
  model: string;
  description?: string | null;
  quantity?: number;
}

interface CartridgeUpdatePayload {
  [key: string]: unknown;
  model: string;
  description: string | null;
}

interface IssuePayload {
  [key: string]: unknown;
  cartridgeId: number;
  quantity: number;
  note: string;
}

type ApiError = AxiosError<{ message?: string }>;

const Cartridges = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isIssueModalVisible, setIsIssueModalVisible] = useState(false);
  const [editingCartridge, setEditingCartridge] = useState<Cartridge | null>(null);
  const [selectedCartridge, setSelectedCartridge] = useState<Cartridge | null>(null);
  const [form] = Form.useForm();
  const [issueForm] = Form.useForm();

  const { data: cartridges = [], isLoading } = useQuery<Cartridge[]>({
    queryKey: ['cartridges'],
    queryFn: getCartridges,
  });

  const createMutation = useMutation<unknown, ApiError, CartridgeFormValues>({
    mutationFn: createCartridge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartridges'] });
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const updateMutation = useMutation<unknown, ApiError, { id: number; data: CartridgeUpdatePayload }>({
    mutationFn: ({ id, data: payload }) => updateCartridge(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartridges'] });
      setIsModalVisible(false);
      setEditingCartridge(null);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation<unknown, ApiError, number>({
    mutationFn: deleteCartridge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartridges'] });
    },
    onError: (error) => {
      message.error(error.response?.data?.message || t('Unable to delete cartridge.'));
    },
  });

  const issueMutation = useMutation<unknown, ApiError, IssuePayload>({
    mutationFn: issueCartridge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartridges'] });
      setIsIssueModalVisible(false);
      issueForm.resetFields();
      setSelectedCartridge(null);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || t('Unable to issue cartridge.'));
    },
  });

  const handleAdd = () => {
    setEditingCartridge(null);
    form.resetFields();
    form.setFieldsValue({ quantity: 1 });
    setIsModalVisible(true);
  };

  const handleEdit = (record: Cartridge) => {
    setEditingCartridge(record);
    form.setFieldsValue({
      model: record.model,
      description: record.description ?? '',
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
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

  const handleIssue = (record: Cartridge) => {
    setSelectedCartridge(record);
    issueForm.setFieldsValue({ quantity: 1, note: '' });
    setIsIssueModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values: CartridgeFormValues) => {
      if (editingCartridge) {
        const description = values.description ? values.description.trim() : '';
        const payload: CartridgeUpdatePayload = {
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
    if (!selectedCartridge) {
      return;
    }

    issueForm.validateFields().then((values: { quantity: number; note: string }) => {
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

  const columns: ColumnsType<Cartridge> = [
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
      render: (_: unknown, record) => (
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
          <ExcelExportButton data={cartridges} columns={columns} fileName="cartridges" isLoading={isLoading} />
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
      <Table columns={columns} dataSource={cartridges} loading={isLoading} rowKey="id" />
      <Modal
        title={editingCartridge ? t('Edit Cartridge') : t('Add Cartridge')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <CartridgeForm form={form} isEditing={!!editingCartridge} />
      </Modal>
      <Modal
        title={selectedCartridge ? `${t('Issue Cartridge')}: ${selectedCartridge.model}` : t('Issue Cartridge')}
        visible={isIssueModalVisible}
        onOk={handleIssueOk}
        onCancel={handleIssueCancel}
        confirmLoading={issueMutation.isPending}
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
