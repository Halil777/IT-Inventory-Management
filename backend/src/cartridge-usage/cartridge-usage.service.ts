import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartridgeUsage } from './cartridge-usage.entity';
import { CreateCartridgeUsageDto } from './dto/create-cartridge-usage.dto';
import { Cartridge } from '../cartridges/cartridge.entity';
import { Printer } from '../printers/printer.entity';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class CartridgeUsageService {
  constructor(
    @InjectRepository(CartridgeUsage)
    private readonly usageRepo: Repository<CartridgeUsage>,
    @InjectRepository(Cartridge)
    private readonly cartridgesRepo: Repository<Cartridge>,
    @InjectRepository(Printer)
    private readonly printersRepo: Repository<Printer>,
    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,
  ) {}

  findAll(): Promise<CartridgeUsage[]> {
    return this.usageRepo.find();
  }

  async create(dto: CreateCartridgeUsageDto): Promise<CartridgeUsage> {
    const cartridge = await this.cartridgesRepo.findOne({ where: { id: dto.cartridgeId } });
    const printer = await this.printersRepo.findOne({ where: { id: dto.printerId } });
    const user = dto.userId
      ? await this.employeesRepo.findOne({ where: { id: dto.userId } })
      : undefined;
    const usage = this.usageRepo.create({ cartridge, printer, user, count: dto.count });
    return this.usageRepo.save(usage);
  }
}
