import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('devices')
  devicesByDepartment() {
    return this.reportsService.devicesByDepartment();
  }

  @Get('printers')
  printersStats() {
    return this.reportsService.printersStats();
  }

  @Get('consumables')
  consumablesStats() {
    return this.reportsService.consumablesStats();
  }

  @Get('employees')
  devicesByEmployee() {
    return this.reportsService.devicesByEmployee();
  }
}
