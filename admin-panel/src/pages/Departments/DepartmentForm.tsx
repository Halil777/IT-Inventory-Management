import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

interface DepartmentFormProps {
  form: FormInstance;
}

const DepartmentForm = ({ form }: DepartmentFormProps) => {
  const { t } = useTranslation();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label={t('Name')}
        rules={[{ required: true, message: t('Please input the department name!') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="head"
        label={t('Head')}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label={t('Description')}
      >
        <TextArea rows={4} />
      </Form.Item>
    </Form>
  );
};

export default DepartmentForm;
