import api from './api';

export const getCredentials = async () => {
  const { data } = await api.get('/credentials');
  return data;
};

export const getCredential = async (id: number) => {
  const { data } = await api.get(`/credentials/${id}`);
  return data;
};

export const createCredential = async (payload: Record<string, unknown>) => {
  const { data } = await api.post('/credentials', payload);
  return data;
};

export const updateCredential = async (id: number, payload: Record<string, unknown>) => {
  const { data } = await api.put(`/credentials/${id}`, payload);
  return data;
};

export const deleteCredential = async (id: number) => {
  const { data } = await api.delete(`/credentials/${id}`);
  return data;
};
