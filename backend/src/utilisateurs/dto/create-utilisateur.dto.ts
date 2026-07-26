import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmail,
  IsEnum,
  IsStrongPassword,
} from "class-validator";

export enum Role {
  COLLABORATEUR = "COLLABORATEUR",
  MANAGER = "MANAGER",
  ADMINISTRATEUR = "ADMINISTRATEUR",
}

export class CreateUtilisateurDto {
  @IsString({ message: "Le nom doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "Le nom est obligatoire" })
  @MinLength(2, { message: "Le nom doit contenir au moins 2 caractères" })
  nom!: string;

  @IsString({ message: "Le prénom doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "Le prénom est obligatoire" })
  @MinLength(2, { message: "Le prénom doit contenir au moins 2 caractères" })
  prenom!: string;

  @IsEmail({}, { message: "L'email doit être valide" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email!: string;

  @IsString({ message: "Le mot de passe doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "Le mot de passe est obligatoire" })
  @MinLength(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
  @IsStrongPassword({}, { message: "Le mot de passe est trop faible" })
  mot_de_passe!: string;

  @IsEnum(Role, { message: "Le rôle doit être COLLABORATEUR, MANAGER ou ADMINISTRATEUR" })
  @IsNotEmpty({ message: "Le rôle est obligatoire" })
  role!: Role;
}