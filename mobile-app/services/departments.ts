import api from './api';
import { Department } from '../interfaces/Department';

export interface DepartmentInput {
  name: string;
  head?: string;
  description?: string;
}

export type DepartmentUpdateInput = Partial<DepartmentInput>;

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get<Department[]>('/departments');
  return response.data;
};

export const createDepartment = async (
  payload: DepartmentInput,
): Promise<Department> => {
  const response = await api.post<Department>('/departments', payload);
  return response.data;
};

export const updateDepartment = async (
  id: number,
  payload: DepartmentUpdateInput,
): Promise<Department> => {
  const response = await api.put<Department>(`/departments/${id}`, payload);
  return response.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await api.delete(`/departments/${id}`);
};

