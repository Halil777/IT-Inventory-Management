import { getCartridges } from './cartridges';
import { getCredentials } from './credentials';
import { getDepartments } from './departments';
import { getDevices } from './devices';
import { getEmployees } from './employees';
import { getPrinters } from './printers';

export type OverviewMetricKey =
  | 'departments'
  | 'employees'
  | 'cartridges'
  | 'devices'
  | 'credentials'
  | 'printers';

export type OverviewMetrics = Record<OverviewMetricKey, number>;

const emptyMetrics: OverviewMetrics = {
  departments: 0,
  employees: 0,
  cartridges: 0,
  devices: 0,
  credentials: 0,
  printers: 0,
};

export const getOverviewMetrics = async (): Promise<OverviewMetrics> => {
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
      : new Error('Unable to load overview metrics. Please try again later.');
  }
};

export const createEmptyMetrics = (): OverviewMetrics => ({ ...emptyMetrics });

