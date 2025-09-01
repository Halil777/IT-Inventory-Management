import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { Department } from '../departments/department.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepo: Repository<Employee>,
  ) {}

  findAll(): Promise<Employee[]> {
    return this.employeesRepo.find();
  }

  create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeesRepo.create({
      ...dto,
      department: { id: dto.departmentId } as Department,
    });
    return this.employeesRepo.save(employee);
  }

  update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = this.employeesRepo.create({
      ...dto,
      id,
      department: dto.departmentId
        ? ({ id: dto.departmentId } as Department)
        : undefined,
    });
    return this.employeesRepo.save(employee);
  }

  async remove(id: number): Promise<void> {
    await this.employeesRepo.delete(id);
  }
}
