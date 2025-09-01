import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from '../departments/department.entity';

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

  @Column({ nullable: true })
  phone?: string;

  @Column({ unique: true })
  email: string;
}
