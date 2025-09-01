import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumable } from './consumable.entity';
import { CreateConsumableDto } from './dto/create-consumable.dto';
import { UpdateConsumableDto } from './dto/update-consumable.dto';
import { AssignConsumableDto } from './dto/assign-consumable.dto';
import { Department } from '../departments/department.entity';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class ConsumablesService {
  constructor(
    @InjectRepository(Consumable)
    private readonly consumablesRepo: Repository<Consumable>,
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,
  ) {}

  findAll(): Promise<Consumable[]> {
    return this.consumablesRepo.find();
  }

  findOne(id: number): Promise<Consumable | null> {
    return this.consumablesRepo.findOne({ where: { id } });
  }

  async create(dto: CreateConsumableDto): Promise<Consumable> {
    const department = dto.departmentId
      ? await this.departmentsRepo.findOne({ where: { id: dto.departmentId } })
      : undefined;
    const user = dto.userId
      ? await this.employeesRepo.findOne({ where: { id: dto.userId } })
      : undefined;
    const consumable = this.consumablesRepo.create({ ...dto, department, user });
    return this.consumablesRepo.save(consumable);
  }

  async update(id: number, dto: UpdateConsumableDto): Promise<Consumable> {
    const consumable = await this.consumablesRepo.findOne({ where: { id } });
    if (!consumable) throw new Error('Consumable not found');
    if (dto.departmentId !== undefined) {
      consumable.department = await this.departmentsRepo.findOne({ where: { id: dto.departmentId } });
    }
    if (dto.userId !== undefined) {
      consumable.user = await this.employeesRepo.findOne({ where: { id: dto.userId } });
    }
    Object.assign(consumable, dto);
    return this.consumablesRepo.save(consumable);
  }

  async remove(id: number): Promise<void> {
    await this.consumablesRepo.delete(id);
  }

  async assign(dto: AssignConsumableDto): Promise<Consumable> {
    const consumable = await this.consumablesRepo.findOne({ where: { id: dto.consumableId } });
    if (!consumable) throw new Error('Consumable not found');
    consumable.user = await this.employeesRepo.findOne({ where: { id: dto.userId } });
    return this.consumablesRepo.save(consumable);
  }
}
