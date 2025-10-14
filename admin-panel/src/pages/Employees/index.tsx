import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../services/employees';
import { Table, Button, Space, Modal, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import EmployeeForm from './EmployeeForm';
import ExcelExportButton from '../../components/ExcelExportButton';

const Employees = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({ queryKey: ['employees'], queryFn: getEmployees });

  const createMutation = useMutation({ mutationFn: createEmployee, onSuccess: () => { 
    queryClient.invalidateQueries(['employees']);
    setIsModalVisible(false);
    form.resetFields();
  } });

  const updateMutation = useMutation({ mutationFn: (variables) => updateEmployee(variables.id, variables.data), onSuccess: () => { 
    queryClient.invalidateQueries(['employees']);
    setIsModalVisible(false);
    setEditingEmployee(null);
    form.resetFields();
  } });

  const deleteMutation = useMutation({ mutationFn: deleteEmployee, onSuccess: () => { 
    queryClient.invalidateQueries(['employees']);
  } });

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingEmployee(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingEmployee) {
        updateMutation.mutate({ id: editingEmployee.id, data: values });
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
      title: t('Email'),
      dataIndex: 'email',
      key: 'email',
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
        <h1>{t('Employees')}</h1>
        <Space>
          <ExcelExportButton data={data} columns={columns} fileName="employees" isLoading={isLoading} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add Employee')}
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} loading={isLoading} rowKey="id" />
      <Modal
        title={editingEmployee ? t('Edit Employee') : t('Add Employee')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
      >
        <EmployeeForm form={form} />
      </Modal>
    </div>
  );
};

export default Employees;
