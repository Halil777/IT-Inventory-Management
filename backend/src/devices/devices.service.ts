import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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
    search?: string;
  }): Promise<Device[]> {
    const qb = this.devicesRepo
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.type', 'type')
      .leftJoinAndSelect('device.user', 'user')
      .leftJoinAndSelect('device.department', 'department');

    if (query.typeId) {
      qb.andWhere('type.id = :typeId', { typeId: query.typeId });
    }

    if (query.status) {
      qb.andWhere('LOWER(device.status) = LOWER(:status)', {
        status: query.status,
      });
    }

    if (query.departmentId) {
      qb.andWhere('department.id = :departmentId', {
        departmentId: query.departmentId,
      });
    }

    const normalizedSearch = query.search?.trim();
    if (normalizedSearch) {
      const searchTerm = `%${normalizedSearch.toLowerCase()}%`;
      qb.andWhere(
        new Brackets((searchQb) => {
          searchQb
            .where('LOWER(device.serialNumber) LIKE :search', {
              search: searchTerm,
            })
            .orWhere('LOWER(device.model) LIKE :search', {
              search: searchTerm,
            })
            .orWhere('LOWER(type.name) LIKE :search', {
              search: searchTerm,
            })
            .orWhere('LOWER(user.name) LIKE :search', {
              search: searchTerm,
            })
            .orWhere('LOWER(department.name) LIKE :search', {
              search: searchTerm,
            });
        }),
      );
    }

    return qb.orderBy('device.id', 'DESC').getMany();
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
