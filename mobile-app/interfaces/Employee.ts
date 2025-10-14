
import { Department } from './Department';

export interface Employee {
  id: number;
  name: string;
  department?: Department;
  phone?: string;
  email: string;
  civilNumber?: string;
  role?: string;
  status: string;
}
