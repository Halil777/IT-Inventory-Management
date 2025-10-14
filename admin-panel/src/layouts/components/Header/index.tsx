import { Layout, Menu, Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Header } = Layout;

const AppHeader = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const menu = (
    <Menu>
      <Menu.Item key="en" onClick={() => changeLanguage('en')}>
        English
      </Menu.Item>
      <Menu.Item key="es" onClick={() => changeLanguage('es')}>
        Español
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div></div>
      <div>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <GlobalOutlined style={{ fontSize: '20px' }} />
          </a>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
