import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ConsumablesService } from './consumables.service';
import { Consumable } from './consumable.entity';
import { CreateConsumableDto } from './dto/create-consumable.dto';
import { UpdateConsumableDto } from './dto/update-consumable.dto';
import { AssignConsumableDto } from './dto/assign-consumable.dto';

@Controller('consumables')
export class ConsumablesController {
  constructor(private readonly consumablesService: ConsumablesService) {}

  @Get()
  findAll(): Promise<Consumable[]> {
    return this.consumablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Consumable | null> {
    return this.consumablesService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateConsumableDto): Promise<Consumable> {
    return this.consumablesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateConsumableDto): Promise<Consumable> {
    return this.consumablesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.consumablesService.remove(+id);
  }

  @Post('assign')
  assign(@Body() dto: AssignConsumableDto): Promise<Consumable> {
    return this.consumablesService.assign(dto);
  }
}
