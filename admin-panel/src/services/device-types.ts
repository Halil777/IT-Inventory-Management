import api from './api';

export const getDeviceTypes = async () => {
  const { data } = await api.get('/device-types');
  return data;
};
