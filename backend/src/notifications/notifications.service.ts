import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,
  ) {}

  findAll(): Promise<Notification[]> {
    return this.notificationsRepo.find();
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const user = dto.userId
      ? await this.employeesRepo.findOne({ where: { id: dto.userId } })
      : undefined;
    const notification = this.notificationsRepo.create({ message: dto.message, type: dto.type, user });
    return this.notificationsRepo.save(notification);
  }

  async update(id: number, dto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.notificationsRepo.findOne({ where: { id } });
    if (!notification) throw new Error('Notification not found');
    if (dto.userId !== undefined) {
      notification.user = await this.employeesRepo.findOne({ where: { id: dto.userId } });
    }
    Object.assign(notification, dto);
    return this.notificationsRepo.save(notification);
  }

  async remove(id: number): Promise<void> {
    await this.notificationsRepo.delete(id);
  }
}
