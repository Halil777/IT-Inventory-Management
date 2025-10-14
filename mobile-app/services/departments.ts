import api from './api';
import { Department } from '../interfaces/Department';

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get<Department[]>('/departments');
  return response.data;
};

