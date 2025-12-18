import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';

interface CredentialFormProps {
  form: FormInstance;
}

const CredentialForm = ({ form }: CredentialFormProps) => {
  const { t } = useTranslation();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="fullName"
        label={t('Full Name')}
        rules={[{ required: true, message: t('Please input the full name!') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="login"
        label={t('Login')}
        rules={[{ required: true, message: t('Please input the login!') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label={t('Password')}
        rules={[{ required: true, message: t('Please input the password!') }]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  );
};

export default CredentialForm;
