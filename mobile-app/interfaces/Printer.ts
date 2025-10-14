import { Department } from './Department';

export interface Printer {
  id: number;
  model: string;
  department?: Department;
}

