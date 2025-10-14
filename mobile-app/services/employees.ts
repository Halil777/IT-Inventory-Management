import api from './api';
import { Employee } from '../interfaces/Employee';

export interface EmployeeInput {
  name: string;
  email: string;
  status: string;
  phone?: string;
  civilNumber?: string;
  departmentId?: number;
  role?: string;
}

export type EmployeeUpdateInput = Partial<EmployeeInput>;

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<Employee[]>('/employees');
  return response.data;
};

export const createEmployee = async (payload: EmployeeInput): Promise<Employee> => {
  const response = await api.post<Employee>('/employees', payload);
  return response.data;
};

export const updateEmployee = async (
  id: number,
  payload: EmployeeUpdateInput,
): Promise<Employee> => {
  const response = await api.put<Employee>(`/employees/${id}`, payload);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await api.delete(`/employees/${id}`);
};
