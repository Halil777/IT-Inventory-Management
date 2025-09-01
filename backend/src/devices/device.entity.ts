import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DeviceType } from '../device-types/device-type.entity';
import { Employee } from '../employees/employee.entity';
import { Department } from '../departments/department.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DeviceType, (type) => type.devices, { eager: true })
  type: DeviceType;

  @ManyToOne(() => Employee, (employee) => employee.devices, {
    eager: true,
    nullable: true,
  })
  user: Employee;

  @ManyToOne(() => Department, (department) => department.devices, {
    eager: true,
    nullable: true,
  })
  department: Department;

  @Column()
  status: string;
}
