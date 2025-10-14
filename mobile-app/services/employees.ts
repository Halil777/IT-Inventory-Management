
import api from './api';
import { Employee } from '../interfaces/Employee';

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get('/employees');
  return response.data;
};
