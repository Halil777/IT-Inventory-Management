import { getCartridges } from './cartridges';
import { getCredentials } from './credentials';
import { getDepartments } from './departments';
import { getDevices } from './devices';
import { getEmployees } from './employees';
import { getPrinters } from './printers';

export type DashboardSummaryKey =
  | 'departments'
  | 'employees'
  | 'cartridges'
  | 'devices'
  | 'credentials'
  | 'printers';

export type DashboardSummary = Record<DashboardSummaryKey, number>;

const emptySummary: DashboardSummary = {
  departments: 0,
  employees: 0,
  cartridges: 0,
  devices: 0,
  credentials: 0,
  printers: 0,
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const [departments, employees, cartridges, devices, credentials, printers] = await Promise.all([
      getDepartments(),
      getEmployees(),
      getCartridges(),
      getDevices(),
      getCredentials(),
      getPrinters(),
    ]);

    return {
      departments: departments.length,
      employees: employees.length,
      cartridges: cartridges.length,
      devices: devices.length,
      credentials: credentials.length,
      printers: printers.length,
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Unable to fetch dashboard summary. Please try again later.');
  }
};

export const createEmptyDashboardSummary = (): DashboardSummary => ({ ...emptySummary });

