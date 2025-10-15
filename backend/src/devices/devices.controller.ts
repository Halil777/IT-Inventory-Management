import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { Device } from './device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  findAll(
    @Query('typeId') typeId?: string,
    @Query('status') status?: string,
    @Query('departmentId') departmentId?: string,
    @Query('search') search?: string,
  ): Promise<Device[]> {
    return this.devicesService.findAll({
      typeId: typeId ? +typeId : undefined,
      status,
      departmentId: departmentId ? +departmentId : undefined,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Device | null> {
    return this.devicesService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateDeviceDto): Promise<Device> {
    return this.devicesService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDeviceDto,
  ): Promise<Device> {
    return this.devicesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.devicesService.remove(+id);
  }
}
