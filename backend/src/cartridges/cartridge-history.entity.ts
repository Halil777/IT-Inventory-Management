import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Cartridge } from './cartridge.entity';

export type CartridgeHistoryType = 'received' | 'issued';

@Entity()
export class CartridgeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cartridge, (cartridge) => cartridge.history, { eager: true })
  cartridge: Cartridge;

  @Column({ type: 'varchar' })
  type: CartridgeHistoryType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
