import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Department } from '../departments/department.entity';
import { Device } from '../devices/device.entity';
import { Consumable } from '../consumables/consumable.entity';
import { Notification } from '../notifications/notification.entity';
import { AuditLog } from '../audit-logs/audit-log.entity';
import { CartridgeUsage } from '../cartridge-usage/cartridge-usage.entity';
import { Printer } from '../printers/printer.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Department, (department) => department.employees, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  department?: Department;

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => Consumable, (consumable) => consumable.user)
  consumables: Consumable[];

  @OneToMany(() => Printer, (printer) => printer.user)
  printers: Printer[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => AuditLog, (log) => log.user)
  logs: AuditLog[];

  @OneToMany(() => CartridgeUsage, (usage) => usage.user)
  cartridgeUsages: CartridgeUsage[];

  @Column({ nullable: true })
  phone?: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  civilNumber?: string;

  @Column({ nullable: true })
  role?: string;

  @Column({ default: 'active' })
  status: string;
}
