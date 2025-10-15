
import api from './api';
import { Device } from '../interfaces/Device';

export interface DeviceFilters {
  search?: string;
  status?: string;
  typeId?: number;
  departmentId?: number;
}

export const getDevices = async (filters: DeviceFilters = {}): Promise<Device[]> => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
  const response = await api.get('/devices', { params });
  return response.data;
};
