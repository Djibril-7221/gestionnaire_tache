import { PartialType } from '@nestjs/mapped-types';
import { CreateTachDto } from './create-tach.dto';

export class UpdateTachDto extends PartialType(CreateTachDto) {}
