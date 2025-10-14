import { Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getDeviceTypes } from '../../services/device-types';
import { getDepartments } from '../../services/departments';
import { getEmployees } from '../../services/employees';

const { Option } = Select;

const DeviceForm = ({ form }) => {
  const { t } = useTranslation();
  const { data: deviceTypes, isLoading: isLoadingDeviceTypes } = useQuery({ queryKey: ['device-types'], queryFn: getDeviceTypes });
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({ queryKey: ['departments'], queryFn: getDepartments });
  const { data: employees, isLoading: isLoadingEmployees } = useQuery({ queryKey: ['employees'], queryFn: getEmployees });

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="typeId"
        label={t('Type')}
        rules={[{ required: true, message: t('Please select a device type!') }]}
      >
        <Select loading={isLoadingDeviceTypes}>
          {deviceTypes?.map(type => (
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
          {employees?.map(employee => (
            <Option key={employee.id} value={employee.id}>{employee.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="departmentId"
        label={t('Department')}
      >
        <Select loading={isLoadingDepartments} allowClear>
          {departments?.map(department => (
            <Option key={department.id} value={department.id}>{department.name}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default DeviceForm;
