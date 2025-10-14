import api from './api';

export const getDevices = async () => {
  const { data } = await api.get('/devices');
  return data;
};

export const getDevice = async (id) => {
  const { data } = await api.get(`/devices/${id}`);
  return data;
};

export const createDevice = async (device) => {
  const { data } = await api.post('/devices', device);
  return data;
};

export const updateDevice = async (id, device) => {
  const { data } = await api.put(`/devices/${id}`, device);
  return data;
};

export const deleteDevice = async (id) => {
  const { data } = await api.delete(`/devices/${id}`);
  return data;
};
