import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PrintersService } from './printers.service';
import { Printer } from './printer.entity';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';

@Controller('printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @Get()
  findAll(): Promise<Printer[]> {
    return this.printersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Printer | null> {
    return this.printersService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreatePrinterDto): Promise<Printer> {
    return this.printersService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePrinterDto): Promise<Printer> {
    return this.printersService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.printersService.remove(+id);
  }
}
