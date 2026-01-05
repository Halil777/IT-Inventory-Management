import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getDeviceTypes } from '../../services/device-types';
import { getDepartments } from '../../services/departments';
import { getEmployees, getEmployee } from '../../services/employees';

const { Option } = Select;

interface DeviceTypeOption {
  id: number;
  name: string;
}

interface DepartmentOption {
  id: number;
  name: string;
}

interface EmployeeOption {
  id: number;
  name: string;
  department?: {
    id: number;
    name: string;
  } | null;
}

interface DeviceFormProps {
  form: FormInstance;
}

const DeviceForm = ({ form }: DeviceFormProps) => {
  const { t } = useTranslation();
  const userId = Form.useWatch('userId', form);

  const { data: deviceTypes, isLoading: isLoadingDeviceTypes } = useQuery<DeviceTypeOption[]>({
    queryKey: ['device-types'],
    queryFn: getDeviceTypes,
  });
  const { data: departments, isLoading: isLoadingDepartments } = useQuery<DepartmentOption[]>({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
  const { data: employees, isLoading: isLoadingEmployees } = useQuery<EmployeeOption[]>({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  // Fetch employee details when userId changes
  const { data: selectedEmployee } = useQuery<EmployeeOption>({
    queryKey: ['employee', userId],
    queryFn: () => getEmployee(userId as number),
    enabled: !!userId,
  });

  // Auto-populate department when user is selected
  useEffect(() => {
    if (selectedEmployee?.department) {
      form.setFieldValue('departmentId', selectedEmployee.department.id);
    } else if (userId === undefined || userId === null) {
      // Clear department when user is deselected
      form.setFieldValue('departmentId', null);
    }
  }, [selectedEmployee, userId, form]);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="typeId"
        label={t('Type')}
        rules={[{ required: true, message: t('Please select a device type!') }]}
      >
        <Select loading={isLoadingDeviceTypes}>
          {deviceTypes?.map((type) => (
            <Option key={type.id} value={type.id}>{type.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="serialNumber"
        label={t('Serial Number')}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="model"
        label={t('Model')}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label={t('Status')}
        rules={[{ required: true, message: t('Please select a status!') }]}
      >
        <Select>
          <Option value="active">{t('Active')}</Option>
          <Option value="in_repair">{t('In Repair')}</Option>
          <Option value="retired">{t('Retired')}</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="userId"
        label={t('Assigned User')}
      >
        <Select loading={isLoadingEmployees} allowClear>
          {employees?.map((employee) => (
            <Option key={employee.id} value={employee.id}>{employee.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="departmentId"
        label={t('Department')}
      >
        <Select
          loading={isLoadingDepartments}
          allowClear
          disabled={!!userId}
        >
          {departments?.map((department) => (
            <Option key={department.id} value={department.id}>{department.name}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default DeviceForm;
