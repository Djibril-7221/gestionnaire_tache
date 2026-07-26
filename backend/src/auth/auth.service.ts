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
    throw new UnauthorizedException('Identifiants invalides');
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
    utilisateurSansMdp,
    access_token: accessToken,
    refresh_token: refreshToken, 
  };
}

async logout(utilisateurId: number, refreshTokenClair: string) {
  if (!refreshTokenClair) {
    await this.prisma.refreshToken.deleteMany({ where: { utilisateur_id: utilisateurId } });
    return { message: 'Déconnexion réussie' };
  }

  const tokens = await this.prisma.refreshToken.findMany({
    where: { utilisateur_id: utilisateurId },
  });

  for (const t of tokens) {
    const match = await bcrypt.compare(refreshTokenClair, t.token);
    if (match) {
      await this.prisma.refreshToken.delete({ where: { id: t.id } });
      return { message: 'Déconnexion réussie sur cet appareil' };
    }
  }

  return { message: 'Déconnexion réussie' };
}

async refresh(refreshTokenRecu: string) {
  if (!refreshTokenRecu) {
    throw new UnauthorizedException('Refresh token manquant');
  }

  const tokens = await this.prisma.refreshToken.findMany({
    where: { expiresAt: { gt: new Date() } },
    include: { utilisateur: true },
  });

  let tokenTrouve: (typeof tokens)[number] | null = null;

  for (const t of tokens) {
    const match = await bcrypt.compare(refreshTokenRecu, t.token);
    if (match) {
      tokenTrouve = t;
      break;
    }
  }

  if (!tokenTrouve) {
    throw new UnauthorizedException('Refresh token invalide ou expiré');
  }

  const utilisateur = tokenTrouve.utilisateur;

  const payload = { sub: utilisateur.id, email: utilisateur.email, role: utilisateur.role };
  const accessToken = this.jwtService.sign(payload, {
    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
  });

  return { access_token: accessToken };
}
}
