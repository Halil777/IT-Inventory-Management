import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintersService } from './printers.service';
import { PrintersController } from './printers.controller';
import { Printer } from './printer.entity';
import { Department } from '../departments/department.entity';
import { Employee } from '../employees/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Printer, Department, Employee])],
  controllers: [PrintersController],
  providers: [PrintersService],
})
export class PrintersModule {}
