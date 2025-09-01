import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumablesService } from './consumables.service';
import { ConsumablesController } from './consumables.controller';
import { Consumable } from './consumable.entity';
import { Department } from '../departments/department.entity';
import { Employee } from '../employees/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consumable, Department, Employee])],
  controllers: [ConsumablesController],
  providers: [ConsumablesService],
})
export class ConsumablesModule {}
