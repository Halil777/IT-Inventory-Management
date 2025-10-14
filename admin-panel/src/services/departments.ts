import api from './api';

export const getDepartments = async () => {
  const { data } = await api.get('/departments');
  return data;
};

export const getDepartment = async (id) => {
  const { data } = await api.get(`/departments/${id}`);
  return data;
};

export const createDepartment = async (payload) => {
  const { data } = await api.post('/departments', payload);
  return data;
};

export const updateDepartment = async (id, payload) => {
  const { data } = await api.put(`/departments/${id}`, payload);
  return data;
};

export const deleteDepartment = async (id) => {
  const { data } = await api.delete(`/departments/${id}`);
  return data;
};
