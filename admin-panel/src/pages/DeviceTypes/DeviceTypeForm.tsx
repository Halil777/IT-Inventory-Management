import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';

interface DeviceTypeFormProps {
  form: FormInstance;
}

const DeviceTypeForm = ({ form }: DeviceTypeFormProps) => {
  const { t } = useTranslation();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label={t('Name')}
        rules={[{ required: true, message: t('Please input the device type name!') }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default DeviceTypeForm;
