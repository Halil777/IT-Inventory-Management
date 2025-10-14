import api from './api';
import { Cartridge } from '../interfaces/Cartridge';

export const getCartridges = async (): Promise<Cartridge[]> => {
  const response = await api.get<Cartridge[]>('/cartridges');
  return response.data;
};

