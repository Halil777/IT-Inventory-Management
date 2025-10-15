import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import DeviceForm from './DeviceForm';
import ExcelExportButton from '../../components/ExcelExportButton';
import { getDevices, createDevice, updateDevice, deleteDevice } from '../../services/devices';
import { getDeviceTypes } from '../../services/device-types';
import { getDepartments } from '../../services/departments';

const { Title } = Typography;

const statusColorMap: Record<string, string> = {
  active: 'green',
  inactive: 'default',
  in_repair: 'gold',
  retired: 'red',
};

const Devices = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<any>(null);
  const [form] = Form.useForm();

  const [searchValue, setSearchValue] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedType, setSelectedType] = useState<number | undefined>();
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  const filters = useMemo(
    () => ({
      ...(appliedSearch ? { search: appliedSearch } : {}),
      ...(selectedType ? { typeId: selectedType } : {}),
      ...(selectedDepartment ? { departmentId: selectedDepartment } : {}),
      ...(selectedStatus ? { status: selectedStatus } : {}),
    }),
    [appliedSearch, selectedType, selectedDepartment, selectedStatus],
  );

  const { data, isLoading } = useQuery({
    queryKey: ['devices', filters],
    queryFn: () => getDevices(filters),
  });

  const { data: deviceTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['device-types'],
    queryFn: getDeviceTypes,
  });

  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  const statusLabels = useMemo(
    () => ({
      active: t('Active'),
      inactive: t('Inactive'),
      in_repair: t('In Repair'),
      retired: t('Retired'),
    }),
    [t],
  );

  const tableData = useMemo(
    () =>
      data?.map((device) => {
        const normalizedStatus = device.status?.toLowerCase?.() ?? '';
        const statusLabel = statusLabels[normalizedStatus] ?? device.status ?? '';
        return {
          ...device,
          typeName: device.type?.name ?? t('Unassigned'),
          userName: device.user?.name ?? t('Unassigned'),
          departmentName: device.department?.name ?? t('Unassigned'),
          statusLabel,
          normalizedStatus,
        };
      }) ?? [],
    [data, statusLabels, t],
  );

  const hasFiltersApplied = Boolean(
    appliedSearch || selectedType || selectedDepartment || selectedStatus,
  );

  const statusCounts = useMemo(
    () =>
      tableData.reduce<Record<string, number>>((acc, item) => {
        const key = item.normalizedStatus || 'unknown';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {}),
    [tableData],
  );

  const summaryCards = useMemo(() => {
    const entries = Object.entries(statusCounts)
      .filter(([status]) => status !== 'unknown')
      .map(([status, count]) => ({
        key: status,
        title: statusLabels[status] ?? status,
        value: count,
        color: statusColorMap[status] ?? 'blue',
      }));

    return [
      {
        key: 'total',
        title: t('Total Devices'),
        value: tableData.length,
        color: 'blue',
      },
      ...entries,
    ];
  }, [statusCounts, statusLabels, tableData, t]);

  const typeOptions = useMemo(
    () => deviceTypes?.map((type) => ({ value: type.id, label: type.name })) ?? [],
    [deviceTypes],
  );

  const departmentOptions = useMemo(
    () =>
      departments?.map((department) => ({ value: department.id, label: department.name })) ?? [],
    [departments],
  );

  const statusOptions = useMemo(() => {
    const defaults = ['active', 'inactive', 'in_repair', 'retired'];
    const unique = new Set<string>([...defaults, ...tableData.map((item) => item.normalizedStatus)]);
    return Array.from(unique)
      .filter(Boolean)
      .map((value) => ({
        value,
        label: statusLabels[value] ?? value,
      }));
  }, [statusLabels, tableData]);

  const createMutation = useMutation({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { id: number; data: any }) => updateDevice(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setIsModalVisible(false);
      setEditingDevice(null);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });

  const handleAdd = () => {
    setEditingDevice(null);
    form.resetFields();
    form.setFieldsValue({ status: 'active' });
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
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

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingDevice) {
        updateMutation.mutate({ id: editingDevice.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingDevice(null);
    form.resetFields();
  };

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    setAppliedSearch(trimmed);
  };

  const handleResetFilters = () => {
    setSearchValue('');
    setAppliedSearch('');
    setSelectedType(undefined);
    setSelectedDepartment(undefined);
    setSelectedStatus(undefined);
  };

  const columns = [
    {
      title: t('Type'),
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: t('Model'),
      dataIndex: 'model',
      key: 'model',
      render: (value: string) => value ?? '—',
    },
    {
      title: t('Serial Number'),
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      render: (value: string) => value ?? '—',
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
      title: t('Status'),
      dataIndex: 'statusLabel',
      key: 'status',
      render: (_: string, record: any) => {
        const color = statusColorMap[record.normalizedStatus] ?? 'blue';
        return <Tag color={color}>{record.statusLabel}</Tag>;
      },
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            {t('Edit')}
          </Button>
          <Popconfirm
            title={t('Are you sure you want to delete this device?')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('Delete')}
            cancelText={t('Cancel')}
            okButtonProps={{ loading: deleteMutation.isLoading }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {t('Delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          {t('Devices')}
        </Title>
        <Space wrap size={[8, 8]}>
          <ExcelExportButton data={tableData} columns={columns} fileName="devices" isLoading={isLoading} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add Device')}
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {summaryCards.map((card) => (
          <Col xs={24} sm={12} md={6} key={card.key}>
            <Card>
              <Statistic
                title={card.title}
                value={card.value}
                valueStyle={{ color: card.color === 'default' ? undefined : card.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Space size={[16, 16]} wrap align="center">
          <Input.Search
            allowClear
            value={searchValue}
            onChange={(event) => {
              const value = event.target.value;
              setSearchValue(value);
              if (!value.trim()) {
                setAppliedSearch('');
              }
            }}
            onSearch={handleSearch}
            placeholder={t('Search devices...')}
            enterButton={<SearchOutlined />}
            style={{ minWidth: 220 }}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={t('All types')}
            value={selectedType}
            onChange={(value) => setSelectedType(value)}
            options={typeOptions}
            loading={isLoadingTypes}
            style={{ minWidth: 200 }}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={t('All departments')}
            value={selectedDepartment}
            onChange={(value) => setSelectedDepartment(value)}
            options={departmentOptions}
            loading={isLoadingDepartments}
            style={{ minWidth: 200 }}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={t('All statuses')}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            options={statusOptions}
            style={{ minWidth: 200 }}
          />
          {hasFiltersApplied && (
            <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
              {t('Reset Filters')}
            </Button>
          )}
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={tableData}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: true }}
      />

      <Modal
        title={editingDevice ? t('Edit Device') : t('Add Device')}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
        destroyOnClose
      >
        <DeviceForm form={form} />
      </Modal>
    </div>
  );
};

export default Devices;
