import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Department } from '../departments/department.entity';
import { CartridgeUsage } from '../cartridge-usage/cartridge-usage.entity';
import { Employee } from '../employees/employee.entity';

@Entity()
export class Printer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column()
  model: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ManyToOne(() => Department, (department) => department.printers, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  department: Department | null;

  @ManyToOne(() => Employee, (employee) => employee.printers, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: Employee | null;

  @OneToMany(() => CartridgeUsage, (usage) => usage.printer)
  usages: CartridgeUsage[];
}
