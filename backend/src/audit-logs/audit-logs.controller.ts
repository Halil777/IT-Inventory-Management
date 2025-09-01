import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLog } from './audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly logsService: AuditLogsService) {}

  @Get()
  findAll(): Promise<AuditLog[]> {
    return this.logsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAuditLogDto): Promise<AuditLog> {
    return this.logsService.create(dto);
  }
}
