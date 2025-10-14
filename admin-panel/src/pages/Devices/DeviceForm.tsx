import { Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getDeviceTypes } from '../../services/device-types';
import { getDepartments } from '../../services/departments';

const { Option } = Select;

const DeviceForm = ({ form }) => {
  const { t } = useTranslation();
  const { data: deviceTypes, isLoading: isLoadingDeviceTypes } = useQuery({ queryKey: ['device-types'], queryFn: getDeviceTypes });
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({ queryKey: ['departments'], queryFn: getDepartments });

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label={t('Name')}
        rules={[{ required: true, message: t('Please input the name!') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="typeId"
        label={t('Type')}
        rules={[{ required: true, message: t('Please select a type!') }]}
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
        rules={[{ required: true, message: t('Please input the serial number!') }]}
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
        name="departmentId"
        label={t('Department')}
        rules={[{ required: true, message: t('Please select a department!') }]}
      >
        <Select loading={isLoadingDepartments}>
          {departments?.map(department => (
            <Option key={department.id} value={department.id}>{department.name}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default DeviceForm;
