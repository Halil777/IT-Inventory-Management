import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Device } from '../devices/device.entity';

@Entity()
export class DeviceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Device, (device) => device.type)
  devices: Device[];
}
