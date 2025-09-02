import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
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

  findOne(id: number): Promise<Employee | null> {
    return this.employeesRepo.findOne({ where: { id } });
  }


  create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeesRepo.create(dto);
    return this.employeesRepo.save(employee);
  }

  update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = this.employeesRepo.create({ id, ...dto });
    return this.employeesRepo.save(employee);
  }

  async remove(id: number): Promise<void> {
    await this.employeesRepo.delete(id);
  }
}
