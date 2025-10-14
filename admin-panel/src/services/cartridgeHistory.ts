import api from './api';

export const getCartridgeHistory = async (type?: string) => {
  const { data } = await api.get('/cartridges/history', { params: { type } });
  return data;
};

export const getCartridgeStatistics = async () => {
  const { data } = await api.get('/cartridges/statistics/usage');
  return data;
};
