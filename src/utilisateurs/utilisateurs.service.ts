import { Injectable } from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from "crypto";
import { Utilitaire } from '../common/services/utilitaire';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from './dto/create-utilisateur.dto';

@Injectable()
export class UtilisateursService {
  constructor(   
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}


async create(createUtilisateurDto: CreateUtilisateurDto) {
  try {
    const resultat = await this.prisma.$transaction(async (tx) => {

      const motDePasseHash = await bcrypt.hash(createUtilisateurDto.mot_de_passe, 10);

      const utilisateur = await tx.utilisateur.create({
        data: {
          ...createUtilisateurDto,
          mot_de_passe: motDePasseHash,
        },
      });


    });

    return resultat;
  } catch (error) {
    console.error('Erreur:', error);
    throw new InternalServerErrorException('Une erreur est survenue lors de la création');
  }
} 

  async findAll() {
    return this.prisma.utilisateur.findMany({
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  findAllCollaborateur() {
    return this.prisma.utilisateur.findMany({
      where: {role: Role.COLLABORATEUR},
      orderBy: { created_at: 'desc' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} utilisateur`;
  }

  update(id: number, updateUtilisateurDto: UpdateUtilisateurDto) {
    return `This action updates a #${id} utilisateur`;
  }

  remove(id: number) {
    return `This action removes a #${id} utilisateur`;
  }


}
