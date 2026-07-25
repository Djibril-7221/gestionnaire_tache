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
      const refreshToken = Utilitaire.genererToken(60);
      const coutHash = 10;
      const tokenHash = await bcrypt.hash(refreshToken, coutHash);
      const motDePasseHash = await bcrypt.hash(createUtilisateurDto.mot_de_passe, 10);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1);

      const utilisateur = await tx.utilisateur.create({
        data: {
          ...createUtilisateurDto,
          mot_de_passe: motDePasseHash,
        },
      });

      const payload = { sub: utilisateur.id, email: utilisateur.email, role: utilisateur.role };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
      });

      await tx.refreshToken.create({
        data: {
          token: tokenHash, 
          expiresAt,
          utilisateur: { connect: { id: utilisateur.id } },
        },
      });
      
      const { mot_de_passe, ...utilisateurSansMdp } = utilisateur;

      return {
        utilisateur,
        access_token: accessToken,
        refresh_token: refreshToken, 
      };
    });

    return resultat;
  } catch (error) {
    console.error('Erreur:', error);
    throw new InternalServerErrorException('Une erreur est survenue lors de la création');
  }
} 

  findAll() {
    return `This action returns all utilisateurs`;
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

  

generateRandomPassword(length = 12): string {
  return randomBytes(length)
    .toString("base64")
    .slice(0, length);
}
}
