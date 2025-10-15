import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPrinters, createPrinter, updatePrinter, deletePrinter } from '../../services/printers';
import { Table, Button, Space, Modal, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import PrinterForm from './PrinterForm';
import ExcelExportButton from '../../components/ExcelExportButton';
import PrinterFilters from './PrinterFilters';

const Printers = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({ queryKey: ['printers'], queryFn: getPrinters });

  const tableData = useMemo(
    () =>
      data?.map((printer) => ({
        ...printer,
        departmentName: printer.department?.name ?? t('Unassigned'),
        userName: printer.user?.name ?? t('Unassigned'),
      })) ?? [],
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

  const filteredData = useMemo(() => {
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
    form.setFieldsValue({
      name: record.name,
      model: record.model,
      description: record.description ?? undefined,
      departmentId: record.department?.id ?? undefined,
      userId: record.user?.id ?? undefined,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
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

  const columns = [
    {
      title: t('Printer Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      render: (value) => value || '—',
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
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
      >
        <PrinterForm form={form} />
      </Modal>
    </div>
  );
};

export default Printers;
