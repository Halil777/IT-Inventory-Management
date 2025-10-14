import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPrinters, createPrinter, updatePrinter, deletePrinter } from '../../services/printers';
import { Table, Button, Space, Modal, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import PrinterForm from './PrinterForm';

const Printers = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({ queryKey: ['printers'], queryFn: getPrinters });

  const createMutation = useMutation({ mutationFn: createPrinter, onSuccess: () => { 
    queryClient.invalidateQueries(['printers']);
    setIsModalVisible(false);
    form.resetFields();
  } });

  const updateMutation = useMutation({ mutationFn: (variables) => updatePrinter(variables.id, variables.data), onSuccess: () => { 
    queryClient.invalidateQueries(['printers']);
    setIsModalVisible(false);
    setEditingPrinter(null);
    form.resetFields();
  } });

  const deleteMutation = useMutation({ mutationFn: deletePrinter, onSuccess: () => { 
    queryClient.invalidateQueries(['printers']);
  } });

  const handleAdd = () => {
    setEditingPrinter(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingPrinter(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingPrinter) {
        updateMutation.mutate({ id: editingPrinter.id, data: values });
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
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('IP Address'),
      dataIndex: 'ipAddress',
      key: 'ipAddress',
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
        <h1>{t('Printers')}</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('Add Printer')}
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={isLoading} rowKey="id" />
      <Modal
        title={editingPrinter ? t('Edit Printer') : t('Add Printer')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
      >
        <PrinterForm form={form} />
      </Modal>
    </div>
  );
};

export default Printers;
