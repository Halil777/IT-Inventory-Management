import { Department } from './Department';
import { Employee } from './Employee';

export interface Consumable {
  id: number;
  type: string;
  quantity: number;
  status: string;
  department?: Department;
  user?: Employee;
}

