import api from './api';
import { ReportItem } from '../interfaces/Report';

export const getDevicesByDepartmentReport = async (): Promise<ReportItem[]> => {
  const response = await api.get<ReportItem[]>('/reports/devices');
  return response.data;
};

export const getPrintersStatsReport = async (): Promise<ReportItem[]> => {
  const response = await api.get<ReportItem[]>('/reports/printers');
  return response.data;
};

export const getConsumablesStatsReport = async (): Promise<ReportItem[]> => {
  const response = await api.get<ReportItem[]>('/reports/consumables');
  return response.data;
};

export const getDevicesByEmployeeReport = async (): Promise<ReportItem[]> => {
  const response = await api.get<ReportItem[]>('/reports/employees');
  return response.data;
};

