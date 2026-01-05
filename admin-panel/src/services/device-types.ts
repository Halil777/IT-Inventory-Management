import api from './api';

export const getDeviceTypes = async () => {
  const { data } = await api.get('/device-types');
  return data;
};

export const createDeviceType = async (deviceType: { name: string }) => {
  const { data } = await api.post('/device-types', deviceType);
  return data;
};

export const updateDeviceType = async (id: number, deviceType: { name?: string }) => {
  const { data } = await api.put(`/device-types/${id}`, deviceType);
  return data;
};

export const deleteDeviceType = async (id: number) => {
  const { data } = await api.delete(`/device-types/${id}`);
  return data;
};
