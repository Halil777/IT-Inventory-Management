import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AxiosError } from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '../../services/departments';
import DepartmentForm from './DepartmentForm';
import ExcelExportButton from '../../components/ExcelExportButton';

interface Department {
  id: number;
  name: string;
  head?: string | null;
  description?: string | null;
  employeesCount?: number | null;
}

type ApiError = AxiosError<{ message?: string }>;

const Departments = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const { data: departments = [], isLoading } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        value: department.id,
        label: `${department.name} (${department.employeesCount ?? 0} ${t('Employees')})`,
      })),
    [departments, t],
  );

  const filteredDepartments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return departments.filter((department) => {
      const matchesSearch = term
        ? [department.name, department.head]
            .filter((value): value is string => Boolean(value))
            .some((value) => value.toLowerCase().includes(term))
        : true;
      const matchesSelection = selectedDepartmentId ? department.id === selectedDepartmentId : true;

      return matchesSearch && matchesSelection;
    });
  }, [departments, searchTerm, selectedDepartmentId]);

  const createMutation = useMutation<unknown, ApiError, Omit<Department, 'id'>>({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const updateMutation = useMutation<unknown, ApiError, { id: number; data: Partial<Department> }>({
    mutationFn: ({ id, data }) => updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setIsModalVisible(false);
      setEditingDepartment(null);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation<unknown, ApiError, number>({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const handleAdd = () => {
    setEditingDepartment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Department) => {
    setEditingDepartment(record);
    form.setFieldsValue({
      name: record.name,
      head: record.head,
      description: record.description,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingDepartment) {
        updateMutation.mutate({ id: editingDepartment.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<Department> = [
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Head'),
      dataIndex: 'head',
      key: 'head',
    },
    {
      title: t('Employees'),
      dataIndex: 'employeesCount',
      key: 'employeesCount',
      render: (count: number | null | undefined) => count ?? 0,
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
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
        <h1>{t('Departments')}</h1>
        <Space>
          <ExcelExportButton data={filteredDepartments} columns={columns} fileName="departments" isLoading={isLoading} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add Department')}
          </Button>
        </Space>
      </div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          allowClear
          placeholder={t('Search by Name or Head')}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{ minWidth: 220 }}
        />
        <Select<number>
          allowClear
          placeholder={t('Departments')}
          options={departmentOptions}
          value={selectedDepartmentId ?? undefined}
          onChange={(value) => setSelectedDepartmentId(value ?? null)}
          style={{ minWidth: 260 }}
          loading={isLoading}
          optionFilterProp="label"
          showSearch
        />
      </Space>
      <Table columns={columns} dataSource={filteredDepartments} loading={isLoading} rowKey="id" />
      <Modal
        title={editingDepartment ? t('Edit Department') : t('Add Department')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <DepartmentForm form={form} />
      </Modal>
    </div>
  );
};

export default Departments;
