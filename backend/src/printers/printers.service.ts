import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Printer } from './printer.entity';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { Department } from '../departments/department.entity';

@Injectable()
export class PrintersService {
  constructor(
    @InjectRepository(Printer)
    private readonly printersRepo: Repository<Printer>,
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
  ) {}

  findAll(): Promise<Printer[]> {
    return this.printersRepo.find();
  }

  findOne(id: number): Promise<Printer | null> {
    return this.printersRepo.findOne({ where: { id } });
  }

  async create(dto: CreatePrinterDto): Promise<Printer> {
    const department = await this.departmentsRepo.findOne({ where: { id: dto.departmentId } });
    const printer = this.printersRepo.create({ model: dto.model, department });
    return this.printersRepo.save(printer);
  }

  async update(id: number, dto: UpdatePrinterDto): Promise<Printer> {
    const printer = await this.printersRepo.findOne({ where: { id } });
    if (!printer) throw new Error('Printer not found');
    if (dto.model !== undefined) printer.model = dto.model;
    if (dto.departmentId !== undefined) {
      printer.department = await this.departmentsRepo.findOne({ where: { id: dto.departmentId } });
    }
    return this.printersRepo.save(printer);
  }

  async remove(id: number): Promise<void> {
    await this.printersRepo.delete(id);
  }
}
