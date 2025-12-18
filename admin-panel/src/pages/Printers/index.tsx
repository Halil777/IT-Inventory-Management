import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPrinters, createPrinter, updatePrinter, deletePrinter } from '../../services/printers';
import { Table, Button, Space, Modal, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import PrinterForm from './PrinterForm';
import ExcelExportButton from '../../components/ExcelExportButton';
import PrinterFilters from './PrinterFilters';

interface Department {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface Printer {
  id: number;
  name: string;
  model?: string | null;
  description?: string | null;
  department?: Department | null;
  user?: User | null;
}

type PrinterPayload = Omit<Printer, 'id' | 'department' | 'user'> & {
  departmentId?: number;
  userId?: number | null;
};

type ApiError = AxiosError<{ message?: string }>;

type PrinterRow = Printer & {
  departmentName: string;
  userName: string;
};

const Printers = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<PrinterRow | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const [form] = Form.useForm();

  const { data = [], isLoading } = useQuery<Printer[]>({ queryKey: ['printers'], queryFn: getPrinters });

  const tableData: PrinterRow[] = useMemo(
    () =>
      data.map((printer) => ({
        ...printer,
        departmentName: printer.department?.name ?? t('Unassigned'),
        userName: printer.user?.name ?? t('Unassigned'),
      })),
    [data, t],
  );

  const departmentOptions = useMemo(() => {
    const uniqueDepartments = new Map<string, string>();
    tableData.forEach((printer) => {
      if (printer.department?.id && printer.department?.name) {
        uniqueDepartments.set(String(printer.department.id), printer.department.name);
      }
    });

    const options = Array.from(uniqueDepartments.entries())
      .map(([value, label]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));

    options.unshift({ label: t('All departments'), value: 'all' });
    options.splice(1, 0, { label: t('Unassigned'), value: 'unassigned' });

    return options;
  }, [tableData, t]);

  const assignmentOptions = useMemo(
    () => [
      { label: t('All statuses'), value: 'all' },
      { label: t('Assigned'), value: 'assigned' },
      { label: t('Unassigned'), value: 'unassigned' },
    ],
    [t],
  );

  const filteredData: PrinterRow[] = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return tableData.filter((printer) => {
      const matchesSearch =
        !normalizedSearch ||
        [printer.name, printer.model, printer.description, printer.departmentName, printer.userName]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesDepartment =
        departmentFilter === 'all' ||
        (departmentFilter === 'unassigned' && !printer.department) ||
        (printer.department?.id && String(printer.department.id) === departmentFilter);

      const matchesAssignment =
        assignmentFilter === 'all' ||
        (assignmentFilter === 'assigned' && !!printer.user) ||
        (assignmentFilter === 'unassigned' && !printer.user);

      return matchesSearch && matchesDepartment && matchesAssignment;
    });
  }, [assignmentFilter, departmentFilter, searchValue, tableData]);

  const handleResetFilters = () => {
    setSearchValue('');
    setDepartmentFilter('all');
    setAssignmentFilter('all');
  };

  const createMutation = useMutation<unknown, ApiError, PrinterPayload>({
    mutationFn: (payload) => createPrinter(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const updateMutation = useMutation<unknown, ApiError, { id: number; data: PrinterPayload }>({
    mutationFn: ({ id, data }) => updatePrinter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
      setIsModalVisible(false);
      setEditingPrinter(null);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation<unknown, ApiError, number>({
    mutationFn: deletePrinter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
    },
  });

  const handleAdd = () => {
    setEditingPrinter(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: PrinterRow) => {
    setEditingPrinter(record);
    form.setFieldsValue({
      name: record.name,
      model: record.model,
      description: record.description ?? undefined,
      departmentId: record.department?.id ?? undefined,
      userId: record.user?.id ?? undefined,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then((values: PrinterPayload) => {
      const payload = {
        ...values,
        userId: values.userId ?? null,
      };
      if (editingPrinter) {
        updateMutation.mutate({ id: editingPrinter.id, data: payload });
      } else {
        createMutation.mutate(payload);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<PrinterRow> = [
    {
      title: t('Printer Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Model'),
      dataIndex: 'model',
      key: 'model',
      render: (value: string | null | undefined) => value ?? '',
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      render: (value: string | null | undefined) => value || 'N/A',
    },
    {
      title: t('Department'),
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: t('Used By'),
      dataIndex: 'userName',
      key: 'userName',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>{t('Printers')}</h1>
        <Space>
          <ExcelExportButton data={filteredData} columns={columns} fileName="printers" isLoading={isLoading} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add Printer')}
          </Button>
        </Space>
      </div>
      <PrinterFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('Search printers...')}
        departmentOptions={departmentOptions}
        departmentValue={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        departmentLabel={t('Filter by department')}
        assignmentOptions={assignmentOptions}
        assignmentValue={assignmentFilter}
        onAssignmentChange={setAssignmentFilter}
        assignmentLabel={t('Filter by assignment')}
        onReset={handleResetFilters}
        resetLabel={t('Reset Filters')}
        disabled={isLoading}
      />
      <Table columns={columns} dataSource={filteredData} loading={isLoading} rowKey="id" />
      <Modal
        title={editingPrinter ? t('Edit Printer') : t('Add Printer')}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <PrinterForm form={form} />
      </Modal>
    </div>
  );
};

export default Printers;
