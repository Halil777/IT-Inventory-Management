import { Employee } from './Employee';

export interface Notification {
  id: number;
  message: string;
  type: string;
  user?: Employee;
  status: string;
}

