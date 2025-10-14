import api from './api';

export const getCredentials = async () => {
  const { data } = await api.get('/credentials');
  return data;
};

export const getCredential = async (id) => {
  const { data } = await api.get(`/credentials/${id}`);
  return data;
};

export const createCredential = async (payload) => {
  const { data } = await api.post('/credentials', payload);
  return data;
};

export const updateCredential = async (id, payload) => {
  const { data } = await api.put(`/credentials/${id}`, payload);
  return data;
};

export const deleteCredential = async (id) => {
  const { data } = await api.delete(`/credentials/${id}`);
  return data;
};
