import api from './api';

export const getPrinters = async () => {
  const { data } = await api.get('/printers');
  return data;
};

export const getPrinter = async (id: number) => {
  const { data } = await api.get(`/printers/${id}`);
  return data;
};

export const createPrinter = async (printer: Record<string, unknown>) => {
  const { data } = await api.post('/printers', printer);
  return data;
};

export const updatePrinter = async (id: number, printer: Record<string, unknown>) => {
  const { data } = await api.put(`/printers/${id}`, printer);
  return data;
};

export const deletePrinter = async (id: number) => {
  const { data } = await api.delete(`/printers/${id}`);
  return data;
};
