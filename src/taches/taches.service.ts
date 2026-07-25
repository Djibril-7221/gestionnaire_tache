import { Injectable } from '@nestjs/common';
import { CreateTachDto } from './dto/create-tach.dto';
import { UpdateTachDto } from './dto/update-tach.dto';

@Injectable()
export class TachesService {
  create(createTachDto: CreateTachDto) {
    return 'This action adds a new tach';
  }

  findAll() {
    return `This action returns all taches`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tach`;
  }

  update(id: number, updateTachDto: UpdateTachDto) {
    return `This action updates a #${id} tach`;
  }

  remove(id: number) {
    return `This action removes a #${id} tach`;
  }
}
