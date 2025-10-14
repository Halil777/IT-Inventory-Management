
import api from './api';
import { Device } from '../interfaces/Device';

export const getDevices = async (): Promise<Device[]> => {
  const response = await api.get('/devices');
  return response.data;
};
