import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { Credential } from './credential.entity';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly service: CredentialsService) {}

  @Get()
  findAll(): Promise<Credential[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Credential | null> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateCredentialDto): Promise<Credential> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCredentialDto): Promise<Credential> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}

