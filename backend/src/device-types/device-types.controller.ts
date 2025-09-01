import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DeviceTypesService } from './device-types.service';
import { DeviceType } from './device-type.entity';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';

@Controller('device-types')
export class DeviceTypesController {
  constructor(private readonly deviceTypesService: DeviceTypesService) {}

  @Get()
  findAll(): Promise<DeviceType[]> {
    return this.deviceTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DeviceType | null> {
    return this.deviceTypesService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateDeviceTypeDto): Promise<DeviceType> {
    return this.deviceTypesService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDeviceTypeDto,
  ): Promise<DeviceType> {
    return this.deviceTypesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.deviceTypesService.remove(+id);
  }
}
