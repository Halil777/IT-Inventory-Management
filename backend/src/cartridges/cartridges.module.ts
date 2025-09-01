import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartridgesService } from './cartridges.service';
import { CartridgesController } from './cartridges.controller';
import { Cartridge } from './cartridge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cartridge])],
  controllers: [CartridgesController],
  providers: [CartridgesService],
})
export class CartridgesModule {}
