import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from '../departments/department.entity';
import { Employee } from '../employees/employee.entity';

@Entity()
export class Consumable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  quantity: number;

  @Column()
  status: string;

  @ManyToOne(() => Department, (department) => department.consumables, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  department: Department;

  @ManyToOne(() => Employee, (employee) => employee.consumables, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: Employee;
}
