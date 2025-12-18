import api from './api';

export const getDepartments = async () => {
  const { data } = await api.get('/departments');
  return data;
};

export const getDepartment = async (id: number) => {
  const { data } = await api.get(`/departments/${id}`);
  return data;
};

export const createDepartment = async (payload: Record<string, unknown>) => {
  const { data } = await api.post('/departments', payload);
  return data;
};

export const updateDepartment = async (id: number, payload: Record<string, unknown>) => {
  const { data } = await api.put(`/departments/${id}`, payload);
  return data;
};

export const deleteDepartment = async (id: number) => {
  const { data } = await api.delete(`/departments/${id}`);
  return data;
};
