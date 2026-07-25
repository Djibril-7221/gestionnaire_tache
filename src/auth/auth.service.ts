import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Utilitaire } from '../common/services/utilitaire';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

async login(createAuthDto: CreateAuthDto) {
  const utilisateur = await this.prisma.utilisateur.findUnique({
    where: { email: createAuthDto.email },
  });
  if (!utilisateur) {
    throw new UnauthorizedException('Identifiants invalides');
  }


  const passwordValid = await bcrypt.compare(
    createAuthDto.mot_de_passe,
    utilisateur.mot_de_passe,
  );
  if (!passwordValid) {
    throw new UnauthorizedException('Mot de passe in');
  }

  const payload = { sub: utilisateur.id, email: utilisateur.email, role: utilisateur.role };
  const accessToken = this.jwtService.sign(payload, {
    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
  });

  const refreshToken = Utilitaire.genererToken(60);
  const coutHash = 10;
  const refreshTokenHash = await bcrypt.hash(refreshToken, coutHash);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);
  if (createAuthDto.se_souvenir_de_moi) {
    expiresAt.setDate(expiresAt.getDate() + 29);
  }

  await this.prisma.refreshToken.create({
    data: {
      token: refreshTokenHash,
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
}
}
