
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmail,
  IsEnum,
  IsStrongPassword,
  IsBoolean,
} from "class-validator";



export class CreateAuthDto {

  @IsEmail({}, { message: "L'email doit être valide" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email!: string;

  @IsString({ message: "Le mot de passe doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "Le mot de passe est obligatoire" })
  mot_de_passe!: string;

  @IsBoolean({})
  se_souvenir_de_moi!: boolean

}
