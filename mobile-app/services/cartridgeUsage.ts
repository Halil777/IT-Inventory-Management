import api from './api';
import { CartridgeUsage } from '../interfaces/CartridgeUsage';

export const getCartridgeUsage = async (): Promise<CartridgeUsage[]> => {
  const response = await api.get<CartridgeUsage[]>('/cartridge-usage');
  return response.data;
};

