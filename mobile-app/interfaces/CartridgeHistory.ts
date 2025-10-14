import { Cartridge } from './Cartridge';

export interface CartridgeHistoryEntry {
  id: number;
  cartridge: Cartridge;
  type: 'received' | 'issued';
  quantity: number;
  note?: string | null;
  createdAt: string;
}

export interface CartridgeStatistic {
  cartridgeId: number;
  model: string;
  totalIssued: number;
  issueCount: number;
}
