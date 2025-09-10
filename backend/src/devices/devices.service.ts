import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private devicesRepo: Repository<Device>,
  ) {}

  findAll(query: {
    typeId?: number;
    status?: string;
    departmentId?: number;
  }): Promise<Device[]> {
    const where: any = {};
    if (query.typeId) {
      where.type = { id: query.typeId };
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.departmentId) {
      where.department = { id: query.departmentId };
    }
    return this.devicesRepo.find({ where });
  }

  findOne(id: number): Promise<Device | null> {
    return this.devicesRepo.findOne({ where: { id } });
  }

  create(dto: CreateDeviceDto): Promise<Device> {
    const device = this.devicesRepo.create({
      status: dto.status,
      type: { id: dto.typeId } as any,
      user: dto.userId ? ({ id: dto.userId } as any) : undefined,
      department: dto.departmentId
        ? ({ id: dto.departmentId } as any)
        : undefined,
      serialNumber: dto.serialNumber,
      model: dto.model,
    });
    return this.devicesRepo.save(device);
  }

  update(id: number, dto: UpdateDeviceDto): Promise<Device> {
    const device = this.devicesRepo.create({
      id,
      status: dto.status,
      type: dto.typeId ? ({ id: dto.typeId } as any) : undefined,
      user: dto.userId ? ({ id: dto.userId } as any) : undefined,
      department: dto.departmentId
        ? ({ id: dto.departmentId } as any)
        : undefined,
      serialNumber: dto.serialNumber,
      model: dto.model,
    });
    return this.devicesRepo.save(device);
  }

  async remove(id: number): Promise<void> {
    await this.devicesRepo.delete(id);
  }
}
