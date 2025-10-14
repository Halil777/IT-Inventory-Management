
import { Department } from './Department';
import { DeviceType } from './DeviceType';
import { Employee } from './Employee';

export interface Device {
  id: number;
  type: DeviceType;
  user: Employee;
  department: Department;
  serialNumber?: string;
  model?: string;
  status: string;
}
