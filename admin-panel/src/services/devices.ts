import api from './api';

export const getDevices = async (params: Record<string, unknown> = {}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
  const { data } = await api.get('/devices', { params: filteredParams });
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
