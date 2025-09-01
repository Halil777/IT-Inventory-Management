import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceType } from './device-type.entity';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';

@Injectable()
export class DeviceTypesService {
  constructor(
    @InjectRepository(DeviceType)
    private deviceTypesRepo: Repository<DeviceType>,
  ) {}

  findAll(): Promise<DeviceType[]> {
    return this.deviceTypesRepo.find();
  }

  findOne(id: number): Promise<DeviceType | null> {
    return this.deviceTypesRepo.findOne({ where: { id } });
  }

  create(dto: CreateDeviceTypeDto): Promise<DeviceType> {
    const type = this.deviceTypesRepo.create(dto);
    return this.deviceTypesRepo.save(type);
  }

  update(id: number, dto: UpdateDeviceTypeDto): Promise<DeviceType> {
    const type = this.deviceTypesRepo.create({ id, ...dto });
    return this.deviceTypesRepo.save(type);
  }

  async remove(id: number): Promise<void> {
    await this.deviceTypesRepo.delete(id);
  }
}
