import { Employee } from './Employee';

export interface AuditLog {
  id: number;
  action: string;
  entity: string;
  user?: Employee;
  timestamp: string;
}

