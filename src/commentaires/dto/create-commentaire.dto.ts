// create-commentaire.dto.ts
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateCommentaireDto {
  @IsString()
  @IsNotEmpty()
  contenu!: string;

  @IsInt()
  tache_id!: number;
}