import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CartridgesService } from './cartridges.service';
import { Cartridge } from './cartridge.entity';
import { CreateCartridgeDto } from './dto/create-cartridge.dto';
import { UpdateCartridgeDto } from './dto/update-cartridge.dto';
import { IssueCartridgeDto } from './dto/issue-cartridge.dto';
import { CartridgeHistory, CartridgeHistoryType } from './cartridge-history.entity';

@Controller('cartridges')
export class CartridgesController {
  constructor(private readonly cartridgesService: CartridgesService) {}

  @Get()
  findAll(): Promise<Cartridge[]> {
    return this.cartridgesService.findAll();
  }

  @Get('history/all')
  historyAll(): Promise<CartridgeHistory[]> {
    return this.cartridgesService.getHistory();
  }

  @Get('history')
  historyByType(
    @Query('type') type?: CartridgeHistoryType,
  ): Promise<CartridgeHistory[]> {
    return this.cartridgesService.getHistory(type);
  }

  @Get('statistics/usage')
  statistics() {
    return this.cartridgesService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cartridge | null> {
    return this.cartridgesService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateCartridgeDto): Promise<Cartridge> {
    return this.cartridgesService.create(dto);
  }

  @Post('issue')
  issue(@Body() dto: IssueCartridgeDto): Promise<Cartridge> {
    return this.cartridgesService.issue(dto);
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
