import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/Loader';
import AnimatedPage from '../components/AnimatedPage';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Cartridges = lazy(() => import('../pages/Cartridges'));
const CartridgeHistory = lazy(() => import('../pages/CartridgeHistory'));
const Departments = lazy(() => import('../pages/Departments'));
const Devices = lazy(() => import('../pages/Devices'));
const DeviceTypes = lazy(() => import('../pages/DeviceTypes'));
const Employees = lazy(() => import('../pages/Employees'));
const Credentials = lazy(() => import('../pages/Credentials'));
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
        path: 'cartridges/history',
        element: <Suspense fallback={<Loader />}><AnimatedPage><CartridgeHistory /></AnimatedPage></Suspense>,
      },
      {
        path: 'departments',
        element: <Suspense fallback={<Loader />}><AnimatedPage><Departments /></AnimatedPage></Suspense>,
      },
      {
        path: 'devices',
        element: <Suspense fallback={<Loader />}><AnimatedPage><Devices /></AnimatedPage></Suspense>,
      },
      {
        path: 'device-types',
        element: <Suspense fallback={<Loader />}><AnimatedPage><DeviceTypes /></AnimatedPage></Suspense>,
      },
      {
        path: 'employees',
        element: <Suspense fallback={<Loader />}><AnimatedPage><Employees /></AnimatedPage></Suspense>,
      },
      {
        path: 'credentials',
        element: <Suspense fallback={<Loader />}><AnimatedPage><Credentials /></AnimatedPage></Suspense>,
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
