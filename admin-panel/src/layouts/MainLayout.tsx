import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppHeader from './components/Header';
import AppSidebar from './components/Sidebar';
import AppFooter from './components/Footer';

const { Content } = Layout;

const MainLayout = () => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ margin: '24px 16px 0' }}>
          <AnimatePresence mode="wait">
            <div key={location.pathname} style={{ padding: 24, minHeight: 360, background: '#fff' }}>
              <Outlet />
            </div>
          </AnimatePresence>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
