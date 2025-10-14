import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cartridge } from './cartridge.entity';
import { CreateCartridgeDto } from './dto/create-cartridge.dto';
import { UpdateCartridgeDto } from './dto/update-cartridge.dto';
import { IssueCartridgeDto } from './dto/issue-cartridge.dto';
import {
  CartridgeHistory,
  CartridgeHistoryType,
} from './cartridge-history.entity';

@Injectable()
export class CartridgesService {
  constructor(
    @InjectRepository(Cartridge)
    private readonly cartridgesRepo: Repository<Cartridge>,
    @InjectRepository(CartridgeHistory)
    private readonly historyRepo: Repository<CartridgeHistory>,
  ) {}

  findAll(): Promise<Cartridge[]> {
    return this.cartridgesRepo.find({ order: { model: 'ASC' } });
  }

  findOne(id: number): Promise<Cartridge | null> {
    return this.cartridgesRepo.findOne({ where: { id } });
  }

  async create(dto: CreateCartridgeDto): Promise<Cartridge> {
    if (!dto.model || !dto.model.trim()) {
      throw new BadRequestException('Model is required');
    }

    if (dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const normalizedModel = dto.model.trim();

    let cartridge = await this.cartridgesRepo.findOne({
      where: { model: normalizedModel },
    });

    const trimmedDescription = dto.description?.trim();

    if (cartridge) {
      cartridge.stock += dto.quantity;
      if (dto.description !== undefined) {
        cartridge.description = trimmedDescription ? trimmedDescription : null;
      }
    } else {
      cartridge = this.cartridgesRepo.create({
        model: normalizedModel,
        description: trimmedDescription ? trimmedDescription : null,
        stock: dto.quantity,
      });
    }

    const saved = await this.cartridgesRepo.save(cartridge);
    await this.createHistoryEntry(saved, 'received', dto.quantity, null);
    return saved;
  }

  async update(id: number, dto: UpdateCartridgeDto): Promise<Cartridge> {
    const cartridge = await this.cartridgesRepo.findOne({ where: { id } });
    if (!cartridge) {
      throw new NotFoundException('Cartridge not found');
    }

    if (dto.model !== undefined) {
      const trimmedModel = dto.model.trim();
      if (!trimmedModel) {
        throw new BadRequestException('Model is required');
      }
      cartridge.model = trimmedModel;
    }

    if (dto.description !== undefined) {
      const trimmedDescription = dto.description?.trim();
      cartridge.description = trimmedDescription ? trimmedDescription : null;
    }

    return this.cartridgesRepo.save(cartridge);
  }

  async remove(id: number): Promise<void> {
    const cartridge = await this.cartridgesRepo.findOne({ where: { id } });
    if (!cartridge) {
      throw new NotFoundException('Cartridge not found');
    }

    if (cartridge.stock !== 0) {
      throw new BadRequestException('Only cartridges with zero stock can be deleted');
    }

    await this.cartridgesRepo.delete(id);
  }

  async issue(dto: IssueCartridgeDto): Promise<Cartridge> {
    if (dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const cartridge = await this.cartridgesRepo.findOne({ where: { id: dto.cartridgeId } });
    if (!cartridge) {
      throw new NotFoundException('Cartridge not found');
    }

    if (!dto.note || !dto.note.trim()) {
      throw new BadRequestException('Reason or recipient is required');
    }

    if (cartridge.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock to issue');
    }

    cartridge.stock -= dto.quantity;
    const saved = await this.cartridgesRepo.save(cartridge);
    await this.createHistoryEntry(saved, 'issued', dto.quantity, dto.note.trim());
    return saved;
  }

  async getHistory(type?: CartridgeHistoryType): Promise<CartridgeHistory[]> {
    const where = type ? { type } : {};
    return this.historyRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async getStatistics(): Promise<
    { cartridgeId: number; model: string; totalIssued: number; issueCount: number }[]
  > {
    const raw = await this.historyRepo
      .createQueryBuilder('history')
      .leftJoin('history.cartridge', 'cartridge')
      .select('cartridge.id', 'cartridgeId')
      .addSelect('cartridge.model', 'model')
      .addSelect('SUM(history.quantity)', 'totalIssued')
      .addSelect('COUNT(history.id)', 'issueCount')
      .where('history.type = :type', { type: 'issued' })
      .groupBy('cartridge.id')
      .addGroupBy('cartridge.model')
      .orderBy('totalIssued', 'DESC')
      .getRawMany();

    return raw.map((entry) => ({
      cartridgeId: Number(entry.cartridgeId),
      model: entry.model,
      totalIssued: Number(entry.totalIssued ?? 0),
      issueCount: Number(entry.issueCount ?? 0),
    }));
  }

  private async createHistoryEntry(
    cartridge: Cartridge,
    type: CartridgeHistoryType,
    quantity: number,
    note: string | null,
  ): Promise<void> {
    const history = this.historyRepo.create({
      cartridge,
      type,
      quantity,
      note,
    });
    await this.historyRepo.save(history);
  }
}
