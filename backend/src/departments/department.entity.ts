import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../employees/employee.entity';
import { Device } from '../devices/device.entity';
import { Printer } from '../printers/printer.entity';
import { Consumable } from '../consumables/consumable.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];

  @OneToMany(() => Device, (device) => device.department)
  devices: Device[];

  @OneToMany(() => Printer, (printer) => printer.department)
  printers: Printer[];

  @OneToMany(() => Consumable, (consumable) => consumable.department)
  consumables: Consumable[];
}
