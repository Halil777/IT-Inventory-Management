import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/Loader';
import AnimatedPage from '../components/AnimatedPage';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Cartridges = lazy(() => import('../pages/Cartridges'));
const Devices = lazy(() => import('../pages/Devices'));
const Employees = lazy(() => import('../pages/Employees'));
const Printers = lazy(() => import('../pages/Printers'));
const Reports = lazy(() => import('../pages/Reports'));
const NotFound = lazy(() => import('../pages/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loader />}><AnimatedPage><Dashboard /></AnimatedPage></Suspense>,
      },
      {
        path: 'cartridges',
        element: <Suspense fallback={<Loader />}><AnimatedPage><Cartridges /></AnimatedPage></Suspense>,
      },
      {
        path: 'devices',
        element: <Suspense fallback={<Loader />}><AnimatedPage><Devices /></AnimatedPage></Suspense>,
      },
      {
        path: 'employees',
        element: <Suspense fallback={<Loader />}><AnimatedPage><Employees /></AnimatedPage></Suspense>,
      },
      {
        path: 'printers',
        element: <Suspense fallback={<Loader />}><AnimatedPage><Printers /></AnimatedPage></Suspense>,
      },
      {
        path: 'reports',
        element: <Suspense fallback={<Loader />}><AnimatedPage><Reports /></AnimatedPage></Suspense>,
      },
    ],
  },
  {
    path: '*',
    element: <Suspense fallback={<Loader />}><AnimatedPage><NotFound /></AnimatedPage></Suspense>,
  },
]);

export default router;
