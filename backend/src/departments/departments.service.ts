import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepo: Repository<Department>,
  ) {}

  private createDepartmentsQuery() {
    return this.departmentsRepo
      .createQueryBuilder('department')
      .loadRelationCountAndMap('department.employeesCount', 'department.employees');
  }

  findAll(): Promise<Department[]> {
    return this.createDepartmentsQuery().getMany();
  }

  findOne(id: number): Promise<Department | null> {
    return this.createDepartmentsQuery().where('department.id = :id', { id }).getOne();
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentsRepo.create(dto);
    const saved = await this.departmentsRepo.save(department);
    return (await this.findOne(saved.id))!;
  }

  async update(id: number, dto: UpdateDepartmentDto): Promise<Department> {
    const department = this.departmentsRepo.create({ id, ...dto });
    const saved = await this.departmentsRepo.save(department);
    return (await this.findOne(saved.id))!;
  }

  async remove(id: number): Promise<void> {
    await this.departmentsRepo.delete(id);
  }
}
