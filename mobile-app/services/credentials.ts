import api from './api';
import { Credential } from '../interfaces/Credential';

export const getCredentials = async (): Promise<Credential[]> => {
  const response = await api.get<Credential[]>('/credentials');
  return response.data;
};

