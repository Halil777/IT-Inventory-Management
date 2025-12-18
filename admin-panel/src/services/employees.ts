import api from './api';

export const getEmployees = async () => {
  const { data } = await api.get('/employees');
  return data;
};

export const getEmployee = async (id: number) => {
  const { data } = await api.get(`/employees/${id}`);
  return data;
};

export const createEmployee = async (employee: Record<string, unknown>) => {
  const { data } = await api.post('/employees', employee);
  return data;
};

export const updateEmployee = async (id: number, employee: Record<string, unknown>) => {
  const { data } = await api.put(`/employees/${id}`, employee);
  return data;
};

export const deleteEmployee = async (id: number) => {
  const { data } = await api.delete(`/employees/${id}`);
  return data;
};
