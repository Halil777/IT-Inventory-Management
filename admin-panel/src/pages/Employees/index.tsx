import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../services/employees';
import { getDepartments } from '../../services/departments';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Card,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Typography,
  Statistic,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import EmployeeForm from './EmployeeForm';
import ExcelExportButton from '../../components/ExcelExportButton';

const Employees = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data, isLoading } = useQuery({ queryKey: ['employees'], queryFn: getEmployees });
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

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
    form.setFieldsValue({
      ...record,
      departmentId: record.department?.id,
    });
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
    setEditingEmployee(null);
    form.resetFields();
  };

  const normalizedStatus = (status?: string | null) => {
    if (!status) {
      return '';
    }
    const lower = status.toLowerCase();
    if (lower === 'active') {
      return t('Active');
    }
    if (lower === 'inactive') {
      return t('Inactive');
    }
    return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDepartmentFilter('all');
    setRoleFilter('all');
  };

  const departmentOptions = useMemo(
    () =>
      departments?.map((department) => ({
        label: department.name,
        value: String(department.id),
      })) ?? [],
    [departments],
  );

  const roleOptions = useMemo(() => {
    if (!data) {
      return [] as { label: string; value: string }[];
    }
    const uniqueRoles = Array.from(
      new Set(
        data
          .map((employee) => employee.role)
          .filter((role): role is string => Boolean(role))
          .map((role) => role!.trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
    return uniqueRoles.map((role) => ({ label: role, value: role }));
  }, [data]);

  const filteredEmployees = useMemo(() => {
    if (!data) {
      return [];
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedStatusFilter = statusFilter.toLowerCase();
    const normalizedRoleFilter = roleFilter.toLowerCase();

    return data.filter((employee) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          employee.name,
          employee.email,
          employee.phone,
          employee.civilNumber,
          employee.role,
          employee.department?.name,
        ]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesStatus =
        normalizedStatusFilter === 'all' || (employee.status ?? '').toLowerCase() === normalizedStatusFilter;

      const matchesDepartment =
        departmentFilter === 'all' || String(employee.department?.id ?? '') === departmentFilter;

      const matchesRole =
        normalizedRoleFilter === 'all' || (employee.role ?? '').toLowerCase() === normalizedRoleFilter;

      return matchesSearch && matchesStatus && matchesDepartment && matchesRole;
    });
  }, [data, departmentFilter, roleFilter, searchTerm, statusFilter]);

  const columns = useMemo(
    () => [
      {
        title: t('Name'),
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: t('Email'),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: t('Phone'),
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: t('Civil Number'),
        dataIndex: 'civilNumber',
        key: 'civilNumber',
      },
      {
        title: t('Role'),
        dataIndex: 'role',
        key: 'role',
        render: (value: string | null) => value ?? t('Unassigned'),
      },
      {
        title: t('Department'),
        dataIndex: 'departmentName',
        key: 'departmentName',
      },
      {
        title: t('Status'),
        dataIndex: 'statusLabel',
        key: 'statusLabel',
        render: (_: string, record: { statusLabel: string; statusValue: string }) => {
          const status = record.statusValue.toLowerCase();
          const color = status === 'active' ? 'green' : status === 'inactive' ? 'volcano' : 'blue';
          return <Tag color={color}>{record.statusLabel}</Tag>;
        },
      },
      {
        title: t('Actions'),
        key: 'actions',
        render: (text: unknown, record: (typeof filteredEmployees)[number]) => (
          <Space size="middle">
            <Button type="link" onClick={() => handleEdit(record)}>
              {t('Edit')}
            </Button>
            <Button danger type="link" onClick={() => handleDelete(record.id)}>
              {t('Delete')}
            </Button>
          </Space>
        ),
      },
    ],
    [filteredEmployees, t],
  );

  const tableData = useMemo(
    () =>
      filteredEmployees.map((employee) => ({
        ...employee,
        key: employee.id,
        departmentName: employee.department?.name ?? t('Unassigned'),
        statusLabel: normalizedStatus(employee.status),
        statusValue: employee.status ?? '',
      })),
    [filteredEmployees, t],
  );

  const totalEmployees = data?.length ?? 0;
  const activeEmployees = data?.filter((employee) => employee.status?.toLowerCase() === 'active').length ?? 0;
  const inactiveEmployees = data?.filter((employee) => employee.status?.toLowerCase() === 'inactive').length ?? 0;

  const { Title, Text } = Typography;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title={t('Total Employees')} value={totalEmployees} loading={isLoading} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title={t('Active Employees')} value={activeEmployees} loading={isLoading} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title={t('Inactive Employees')} value={inactiveEmployees} loading={isLoading} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Title level={2} style={{ margin: 0 }}>
              {t('Employees')}
            </Title>
            <Space>
              <ExcelExportButton data={tableData} columns={columns} fileName="employees" isLoading={isLoading} />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                {t('Add Employee')}
              </Button>
            </Space>
          </Space>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Input.Search
              allowClear
              placeholder={t('Search employees...')}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{ maxWidth: 400 }}
            />
            <Space wrap>
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                options={[
                  { label: t('All statuses'), value: 'all' },
                  { label: t('Active'), value: 'active' },
                  { label: t('Inactive'), value: 'inactive' },
                ]}
                style={{ minWidth: 180 }}
              />
              <Select
                loading={isLoadingDepartments}
                value={departmentFilter}
                onChange={(value) => setDepartmentFilter(value)}
                options={[
                  { label: t('All departments'), value: 'all' },
                  ...departmentOptions,
                ]}
                style={{ minWidth: 220 }}
              />
              <Select
                value={roleFilter}
                onChange={(value) => setRoleFilter(value)}
                options={[
                  { label: t('All roles'), value: 'all' },
                  ...roleOptions,
                ]}
                style={{ minWidth: 200 }}
                disabled={!roleOptions.length}
              />
              <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                {t('Reset Filters')}
              </Button>
            </Space>
            <Text type="secondary">
              {t('Showing employees', { count: tableData.length, total: totalEmployees })}
            </Text>
          </Space>

          <Table
            columns={columns}
            dataSource={tableData}
            loading={isLoading}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: true }}
          />
        </Space>
      </Card>

      <Modal
        title={editingEmployee ? t('Edit Employee') : t('Add Employee')}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
        destroyOnClose
      >
        <EmployeeForm form={form} />
      </Modal>
    </Space>
  );
};

export default Employees;
