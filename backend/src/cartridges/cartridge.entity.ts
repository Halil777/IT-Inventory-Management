import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartridgeUsage } from '../cartridge-usage/cartridge-usage.entity';

@Entity()
export class Cartridge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  status: string;

  @OneToMany(() => CartridgeUsage, (usage) => usage.cartridge)
  usages: CartridgeUsage[];
}
