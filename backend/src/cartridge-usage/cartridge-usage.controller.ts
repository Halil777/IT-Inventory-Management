import { Controller, Get, Post, Body } from '@nestjs/common';
import { CartridgeUsageService } from './cartridge-usage.service';
import { CartridgeUsage } from './cartridge-usage.entity';
import { CreateCartridgeUsageDto } from './dto/create-cartridge-usage.dto';

@Controller('cartridge-usage')
export class CartridgeUsageController {
  constructor(private readonly usageService: CartridgeUsageService) {}

  @Get()
  findAll(): Promise<CartridgeUsage[]> {
    return this.usageService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCartridgeUsageDto): Promise<CartridgeUsage> {
    return this.usageService.create(dto);
  }
}
