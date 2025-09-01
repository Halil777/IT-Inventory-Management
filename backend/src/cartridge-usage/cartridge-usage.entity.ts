import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cartridge } from '../cartridges/cartridge.entity';
import { Printer } from '../printers/printer.entity';
import { Employee } from '../employees/employee.entity';

@Entity()
export class CartridgeUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cartridge, (cartridge) => cartridge.usages, { eager: true })
  cartridge: Cartridge;

  @ManyToOne(() => Printer, (printer) => printer.usages, { eager: true })
  printer: Printer;

  @ManyToOne(() => Employee, { eager: true, nullable: true })
  user: Employee;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  count: number;
}
