import { Department } from './Department';
import { Employee } from './Employee';

export interface Printer {
  id: number;
  name: string;
  model: string;
  description?: string | null;
  department?: Department;
  user?: Employee;
}

