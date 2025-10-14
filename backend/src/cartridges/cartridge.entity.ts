import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartridgeUsage } from '../cartridge-usage/cartridge-usage.entity';
import { CartridgeHistory } from './cartridge-history.entity';

@Entity()
export class Cartridge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  model: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => CartridgeUsage, (usage) => usage.cartridge)
  usages: CartridgeUsage[];

  @OneToMany(() => CartridgeHistory, (history) => history.cartridge)
  history: CartridgeHistory[];
}
