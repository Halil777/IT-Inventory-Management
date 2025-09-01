import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartridgeUsageService } from './cartridge-usage.service';
import { CartridgeUsageController } from './cartridge-usage.controller';
import { CartridgeUsage } from './cartridge-usage.entity';
import { Cartridge } from '../cartridges/cartridge.entity';
import { Printer } from '../printers/printer.entity';
import { Employee } from '../employees/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartridgeUsage, Cartridge, Printer, Employee]),
  ],
  controllers: [CartridgeUsageController],
  providers: [CartridgeUsageService],
})
export class CartridgeUsageModule {}
