import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartridgesService } from './cartridges.service';
import { CartridgesController } from './cartridges.controller';
import { Cartridge } from './cartridge.entity';
import { CartridgeHistory } from './cartridge-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cartridge, CartridgeHistory])],
  controllers: [CartridgesController],
  providers: [CartridgesService],
})
export class CartridgesModule {}
