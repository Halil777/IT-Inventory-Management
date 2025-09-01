import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Department } from '../departments/department.entity';
import { CartridgeUsage } from '../cartridge-usage/cartridge-usage.entity';

@Entity()
export class Printer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @ManyToOne(() => Department, (department) => department.printers, { eager: true })
  department: Department;

  @OneToMany(() => CartridgeUsage, (usage) => usage.printer)
  usages: CartridgeUsage[];
}
