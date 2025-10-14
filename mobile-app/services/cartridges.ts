import api from './api';
import { Cartridge } from '../interfaces/Cartridge';

export const getCartridges = async (): Promise<Cartridge[]> => {
  const response = await api.get<Cartridge[]>('/cartridges');
  return response.data;
};

export const createCartridge = async (
  payload: { model: string; description?: string | null; quantity: number },
): Promise<Cartridge> => {
  const response = await api.post<Cartridge>('/cartridges', payload);
  return response.data;
};

export const updateCartridge = async (
  id: number,
  payload: { model: string; description?: string | null },
): Promise<Cartridge> => {
  const response = await api.put<Cartridge>(`/cartridges/${id}`, payload);
  return response.data;
};

export const deleteCartridge = async (id: number): Promise<void> => {
  await api.delete(`/cartridges/${id}`);
};

export const issueCartridge = async (
  payload: { cartridgeId: number; quantity: number; note: string },
): Promise<Cartridge> => {
  const response = await api.post<Cartridge>('/cartridges/issue', payload);
  return response.data;
};

