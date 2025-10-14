import api from './api';
import { DeviceType } from '../interfaces/DeviceType';

export const getDeviceTypes = async (): Promise<DeviceType[]> => {
  const response = await api.get<DeviceType[]>('/device-types');
  return response.data;
};

