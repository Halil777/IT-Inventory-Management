import api from './api';
import { Credential } from '../interfaces/Credential';

export interface CredentialInput {
  fullName: string;
  login: string;
  password: string;
}

export type CredentialUpdateInput = Partial<CredentialInput>;

export const getCredentials = async (): Promise<Credential[]> => {
  const response = await api.get<Credential[]>('/credentials');
  return response.data;
};

export const createCredential = async (
  payload: CredentialInput,
): Promise<Credential> => {
  const response = await api.post<Credential>('/credentials', payload);
  return response.data;
};

export const updateCredential = async (
  id: number,
  payload: CredentialUpdateInput,
): Promise<Credential> => {
  const response = await api.put<Credential>(`/credentials/${id}`, payload);
  return response.data;
};

export const deleteCredential = async (id: number): Promise<void> => {
  await api.delete(`/credentials/${id}`);
};

