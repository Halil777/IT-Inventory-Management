import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  DashboardOutlined, 
  ShoppingCartOutlined, 
  DesktopOutlined, 
  UserOutlined, 
  PrinterOutlined, 
  BarChartOutlined 
} from '@ant-design/icons';

const { Sider } = Layout;

const AppSidebar = () => {
  const { t } = useTranslation();

  return (
    <Sider collapsible>
      <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.3)' }} />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/">{t('Dashboard')}</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
          <Link to="/cartridges">{t('Cartridges')}</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<DesktopOutlined />}>
          <Link to="/devices">{t('Devices')}</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<UserOutlined />}>
          <Link to="/employees">{t('Employees')}</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<PrinterOutlined />}>
          <Link to="/printers">{t('Printers')}</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<BarChartOutlined />}>
          <Link to="/reports">{t('Reports')}</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AppSidebar;
