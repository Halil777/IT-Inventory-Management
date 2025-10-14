import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDevices, createDevice, updateDevice, deleteDevice } from '../../services/devices';
import { Table, Button, Space, Modal, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import DeviceForm from './DeviceForm';
import ExcelExportButton from '../../components/ExcelExportButton';

const Devices = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({ queryKey: ['devices'], queryFn: getDevices });

  const tableData = useMemo(
    () =>
      data?.map((device) => ({
        ...device,
        typeName: device.type?.name ?? '',
        userName: device.user?.name ?? '',
        departmentName: device.department?.name ?? '',
      })) ?? [],
    [data],
  );

  const createMutation = useMutation({ mutationFn: createDevice, onSuccess: () => { 
    queryClient.invalidateQueries(['devices']);
    setIsModalVisible(false);
    form.resetFields();
  } });

  const updateMutation = useMutation({ mutationFn: (variables) => updateDevice(variables.id, variables.data), onSuccess: () => { 
    queryClient.invalidateQueries(['devices']);
    setIsModalVisible(false);
    setEditingDevice(null);
    form.resetFields();
  } });

  const deleteMutation = useMutation({ mutationFn: deleteDevice, onSuccess: () => { 
    queryClient.invalidateQueries(['devices']);
  } });

  const handleAdd = () => {
    setEditingDevice(null);
    form.resetFields();
    form.setFieldsValue({ status: 'active' });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingDevice(record);
    form.setFieldsValue({
      typeId: record.type?.id ?? undefined,
      status: record.status,
      serialNumber: record.serialNumber,
      model: record.model,
      userId: record.user?.id ?? undefined,
      departmentId: record.department?.id ?? undefined,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingDevice) {
        updateMutation.mutate({ id: editingDevice.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingDevice(null);
    form.resetFields();
  };

  const columns = [
    {
      title: t('Type'),
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: t('Assigned User'),
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: t('Department'),
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: t('Serial Number'),
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: t('Model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
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
        <h1>{t('Devices')}</h1>
        <Space>
          <ExcelExportButton data={tableData} columns={columns} fileName="devices" isLoading={isLoading} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add Device')}
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={tableData} loading={isLoading} rowKey="id" />
      <Modal
        title={editingDevice ? t('Edit Device') : t('Add Device')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
      >
        <DeviceForm form={form} />
      </Modal>
    </div>
  );
};

export default Devices;
