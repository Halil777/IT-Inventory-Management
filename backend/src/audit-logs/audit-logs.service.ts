import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly logsRepo: Repository<AuditLog>,
    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,
  ) {}

  findAll(): Promise<AuditLog[]> {
    return this.logsRepo.find();
  }

  async create(dto: CreateAuditLogDto): Promise<AuditLog> {
    const user = dto.userId
      ? await this.employeesRepo.findOne({ where: { id: dto.userId } })
      : undefined;
    const log = this.logsRepo.create({ action: dto.action, entity: dto.entity, user });
    return this.logsRepo.save(log);
  }
}
