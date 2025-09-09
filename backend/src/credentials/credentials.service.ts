import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credential } from './credential.entity';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectRepository(Credential)
    private readonly repo: Repository<Credential>,
  ) {}

  findAll(): Promise<Credential[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Credential | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(dto: CreateCredentialDto): Promise<Credential> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  update(id: number, dto: UpdateCredentialDto): Promise<Credential> {
    const entity = this.repo.create({ id, ...dto });
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

