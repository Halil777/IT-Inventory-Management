import { Card, Col, Row, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';
import { DesktopOutlined, UserOutlined, PrinterOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('Dashboard')}</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('Devices')}
              value={1128}
              prefix={<DesktopOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('Users')}
              value={93}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('Printers')}
              value={23}
              prefix={<PrinterOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('Consumables')}
              value={500}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
