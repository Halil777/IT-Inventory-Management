import { Cartridge } from './Cartridge';
import { Employee } from './Employee';
import { Printer } from './Printer';

export interface CartridgeUsage {
  id: number;
  cartridge: Cartridge;
  printer: Printer;
  user?: Employee;
  date: string;
  count: number;
}

