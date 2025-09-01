import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceType } from './device-type.entity';
import { DeviceTypesService } from './device-types.service';
import { DeviceTypesController } from './device-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceType])],
  controllers: [DeviceTypesController],
  providers: [DeviceTypesService],
  exports: [DeviceTypesService],
})
export class DeviceTypesModule {}
