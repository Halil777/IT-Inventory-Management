import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Printer } from './printer.entity';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { Department } from '../departments/department.entity';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class PrintersService {
  constructor(
    @InjectRepository(Printer)
    private readonly printersRepo: Repository<Printer>,
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,
  ) {}

  findAll(): Promise<Printer[]> {
    return this.printersRepo.find();
  }

  findOne(id: number): Promise<Printer | null> {
    return this.printersRepo.findOne({ where: { id } });
  }

  async create(dto: CreatePrinterDto): Promise<Printer> {
    const department =
      dto.departmentId !== undefined && dto.departmentId !== null
        ? await this.departmentsRepo.findOne({ where: { id: dto.departmentId } })
        : null;
    const user =
      dto.userId !== undefined && dto.userId !== null
        ? await this.employeesRepo.findOne({ where: { id: dto.userId } })
        : null;

    const printer = this.printersRepo.create({
      name: dto.name,
      model: dto.model,
      description: dto.description ?? null,
      department,
      user,
    });
    return this.printersRepo.save(printer);
  }

  async update(id: number, dto: UpdatePrinterDto): Promise<Printer> {
    const printer = await this.printersRepo.findOne({ where: { id } });
    if (!printer) throw new Error('Printer not found');
    if (dto.name !== undefined) printer.name = dto.name;
    if (dto.model !== undefined) printer.model = dto.model;
    if (dto.description !== undefined) printer.description = dto.description;
    if (dto.departmentId !== undefined) {
      printer.department =
        dto.departmentId === null
          ? null
          : await this.departmentsRepo.findOne({ where: { id: dto.departmentId } });
    }
    if (dto.userId !== undefined) {
      printer.user =
        dto.userId === null
          ? null
          : await this.employeesRepo.findOne({ where: { id: dto.userId } });
    }
    return this.printersRepo.save(printer);
  }

  async remove(id: number): Promise<void> {
    await this.printersRepo.delete(id);
  }
}
