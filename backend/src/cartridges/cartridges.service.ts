import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cartridge } from './cartridge.entity';
import { CreateCartridgeDto } from './dto/create-cartridge.dto';
import { UpdateCartridgeDto } from './dto/update-cartridge.dto';

@Injectable()
export class CartridgesService {
  constructor(
    @InjectRepository(Cartridge)
    private readonly cartridgesRepo: Repository<Cartridge>,
  ) {}

  findAll(): Promise<Cartridge[]> {
    return this.cartridgesRepo.find();
  }

  findOne(id: number): Promise<Cartridge | null> {
    return this.cartridgesRepo.findOne({ where: { id } });
  }

  create(dto: CreateCartridgeDto): Promise<Cartridge> {
    const cartridge = this.cartridgesRepo.create(dto);
    return this.cartridgesRepo.save(cartridge);
  }

  async update(id: number, dto: UpdateCartridgeDto): Promise<Cartridge> {
    const cartridge = await this.cartridgesRepo.findOne({ where: { id } });
    if (!cartridge) throw new Error('Cartridge not found');
    Object.assign(cartridge, dto);
    return this.cartridgesRepo.save(cartridge);
  }

  async remove(id: number): Promise<void> {
    await this.cartridgesRepo.delete(id);
  }
}
