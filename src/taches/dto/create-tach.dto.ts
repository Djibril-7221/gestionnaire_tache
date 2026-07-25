import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateTachDto {
  @IsString()
  @IsNotEmpty()
  titre!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  destinataire_id!: number;

  @IsOptional()
  statut?: Statut;
}


export enum Statut {
  BROUILLON = "BROUILLON",
  VALIDEE = "VALIDEE",
  REJETEE = "REJETEE",
  SOUMISE = "SOUMISE",
}