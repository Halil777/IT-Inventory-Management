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

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  role: string;

  @ManyToOne(() => Department, (department) => department.employees, { eager: true })
  department: Department;

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => Consumable, (consumable) => consumable.user)
  consumables: Consumable[];

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
}
