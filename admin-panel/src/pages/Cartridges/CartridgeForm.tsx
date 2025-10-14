import { Form, Input, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

const CartridgeForm = ({ form }) => {
  const { t } = useTranslation();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="model"
        label={t('Model')}
        rules={[{ required: true, message: t('Please input the model!') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="sku"
        label={t('SKU')}
        rules={[{ required: true, message: t('Please input the SKU!') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="stock"
        label={t('Stock')}
        rules={[{ required: true, message: t('Please input the stock!') }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
};

export default CartridgeForm;
