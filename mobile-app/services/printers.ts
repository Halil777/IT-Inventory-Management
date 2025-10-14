import api from './api';
import { Printer } from '../interfaces/Printer';

export const getPrinters = async (): Promise<Printer[]> => {
  const response = await api.get<Printer[]>('/printers');
  return response.data;
};

