import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '../../services/departments';

const { Option } = Select;

interface DepartmentOption {
  id: number;
  name: string;
}

interface EmployeeFormProps {
  form: FormInstance;
}

const EmployeeForm = ({ form }: EmployeeFormProps) => {
  const { t } = useTranslation();
  const { data: departments, isLoading: isLoadingDepartments } = useQuery<DepartmentOption[]>({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  return (
    <Form form={form} layout="vertical" initialValues={{ status: 'active' }}>
      <Form.Item
        name="name"
        label={t('Name')}
        rules={[{ required: true, message: t('Please input the name!') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label={t('Email')}
        rules={[{ required: true, message: t('Please input the email!'), type: 'email' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="phone" label={t('Phone')}>
        <Input />
      </Form.Item>
      <Form.Item name="civilNumber" label={t('Civil Number')}>
        <Input />
      </Form.Item>
      <Form.Item name="role" label={t('Role')}>
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label={t('Status')}
        rules={[{ required: true, message: t('Please select a status!') }]}
      >
        <Select>
          <Option value="active">{t('Active')}</Option>
          <Option value="inactive">{t('Inactive')}</Option>
        </Select>
      </Form.Item>
      <Form.Item name="departmentId" label={t('Department')}>
        <Select loading={isLoadingDepartments} allowClear>
          {departments?.map((department) => (
            <Option key={department.id} value={department.id}>
              {department.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
