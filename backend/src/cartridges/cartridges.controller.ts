import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CartridgesService } from './cartridges.service';
import { Cartridge } from './cartridge.entity';
import { CreateCartridgeDto } from './dto/create-cartridge.dto';
import { UpdateCartridgeDto } from './dto/update-cartridge.dto';

@Controller('cartridges')
export class CartridgesController {
  constructor(private readonly cartridgesService: CartridgesService) {}

  @Get()
  findAll(): Promise<Cartridge[]> {
    return this.cartridgesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cartridge | null> {
    return this.cartridgesService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateCartridgeDto): Promise<Cartridge> {
    return this.cartridgesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCartridgeDto): Promise<Cartridge> {
    return this.cartridgesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.cartridgesService.remove(+id);
  }
}
