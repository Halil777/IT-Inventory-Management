import api from './api';
import { Printer } from '../interfaces/Printer';

export interface PrinterInput {
  name: string;
  model: string;
  description?: string | null;
  departmentId?: number | null;
  userId?: number | null;
}

export type PrinterUpdateInput = Partial<PrinterInput>;

export const getPrinters = async (): Promise<Printer[]> => {
  const response = await api.get<Printer[]>('/printers');
  return response.data;
};

export const createPrinter = async (payload: PrinterInput): Promise<Printer> => {
  const response = await api.post<Printer>('/printers', payload);
  return response.data;
};

export const updatePrinter = async (
  id: number,
  payload: PrinterUpdateInput,
): Promise<Printer> => {
  const response = await api.put<Printer>(`/printers/${id}`, payload);
  return response.data;
};

export const deletePrinter = async (id: number): Promise<void> => {
  await api.delete(`/printers/${id}`);
};

