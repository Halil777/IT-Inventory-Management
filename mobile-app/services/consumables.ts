import api from './api';
import { Consumable } from '../interfaces/Consumable';

export const getConsumables = async (): Promise<Consumable[]> => {
  const response = await api.get<Consumable[]>('/consumables');
  return response.data;
};

