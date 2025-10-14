import api from './api';
import { CartridgeHistoryEntry, CartridgeStatistic } from '../interfaces/CartridgeHistory';

export const getCartridgeHistory = async (
  type: 'received' | 'issued',
): Promise<CartridgeHistoryEntry[]> => {
  const response = await api.get<CartridgeHistoryEntry[]>('/cartridges/history', {
    params: { type },
  });
  return response.data;
};

export const getCartridgeStatistics = async (): Promise<CartridgeStatistic[]> => {
  const response = await api.get<CartridgeStatistic[]>('/cartridges/statistics/usage');
  return response.data;
};
