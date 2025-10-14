import { Form, Input, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

const CartridgeForm = ({ form, isEditing = false }) => {
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
      <Form.Item name="description" label={t('Description')}>
        <TextArea rows={3} />
      </Form.Item>
      {!isEditing && (
        <Form.Item
          name="quantity"
          label={t('Quantity')}
          rules={[{ required: true, message: t('Please input the quantity!') }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      )}
    </Form>
  );
};

export default CartridgeForm;
