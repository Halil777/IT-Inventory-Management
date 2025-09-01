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

  findAll(): Promise<Department[]> {
    return this.departmentsRepo.find();
  }

  findOne(id: number): Promise<Department | null> {
    return this.departmentsRepo.findOne({ where: { id } });
  }

  create(dto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentsRepo.create(dto);
    return this.departmentsRepo.save(department);
  }

  update(id: number, dto: UpdateDepartmentDto): Promise<Department> {
    const department = this.departmentsRepo.create({ id, ...dto });
    return this.departmentsRepo.save(department);
  }

  async remove(id: number): Promise<void> {
    await this.departmentsRepo.delete(id);
  }
}
