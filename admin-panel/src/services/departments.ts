import api from './api';

export const getDepartments = async () => {
  const { data } = await api.get('/departments');
  return data;
};
