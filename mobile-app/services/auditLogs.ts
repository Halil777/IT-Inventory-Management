import api from './api';
import { AuditLog } from '../interfaces/AuditLog';

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const response = await api.get<AuditLog[]>('/audit-logs');
  return response.data;
};

