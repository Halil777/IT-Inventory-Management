import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from '../employees/employee.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  type: string;

  @ManyToOne(() => Employee, (user) => user.notifications, {
    eager: true,
    nullable: true,
  })
  user: Employee;

  @Column({ default: 'unread' })
  status: string;
}
