import api from './api';

export const getPrinters = async () => {
  const { data } = await api.get('/printers');
  return data;
};

export const getPrinter = async (id) => {
  const { data } = await api.get(`/printers/${id}`);
  return data;
};

export const createPrinter = async (printer) => {
  const { data } = await api.post('/printers', printer);
  return data;
};

export const updatePrinter = async (id, printer) => {
  const { data } = await api.put(`/printers/${id}`, printer);
  return data;
};

export const deletePrinter = async (id) => {
  const { data } = await api.delete(`/printers/${id}`);
  return data;
};
