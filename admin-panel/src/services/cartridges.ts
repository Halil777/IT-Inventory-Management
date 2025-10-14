import api from './api';

export const getCartridges = async () => {
  const { data } = await api.get('/cartridges');
  return data;
};

export const getCartridge = async (id) => {
  const { data } = await api.get(`/cartridges/${id}`);
  return data;
};

export const createCartridge = async (cartridge) => {
  const { data } = await api.post('/cartridges', cartridge);
  return data;
};

export const updateCartridge = async (id, cartridge) => {
  const { data } = await api.put(`/cartridges/${id}`, cartridge);
  return data;
};

export const deleteCartridge = async (id) => {
  const { data } = await api.delete(`/cartridges/${id}`);
  return data;
};

export const issueCartridge = async (payload) => {
  const { data } = await api.post('/cartridges/issue', payload);
  return data;
};
