import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTachDto } from './dto/create-tach.dto';
import { UpdateTachDto } from './dto/update-tach.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class TachesService {
  constructor(private prisma: PrismaService) {}

  async create(createTachDto: CreateTachDto , utilisateur , destinataire_id) {
    const donnee = {... createTachDto , createur_id : utilisateur.id , destinataire_id }
    return this.prisma.tache.create({
      data: donnee,
      include: {
        createur: { select: { id: true, nom: true, prenom: true } },
        destinataire: { select: { id: true, nom: true, prenom: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.tache.findMany({
      include: {
        createur: { select: { id: true, nom: true, prenom: true } },
        destinataire: { select: { id: true, nom: true, prenom: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findAllForManagerOrCollaborateur(id: number, isManager: boolean) {
    const where = isManager
      ? { createur_id: id }
      : { destinataire_id: id };

    return this.prisma.tache.findMany({
      where,
      include: {
        createur: { select: { id: true, nom: true, prenom: true } },
        destinataire: { select: { id: true, nom: true, prenom: true } },
        commentaires: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

async findOne(id: number) {
  const tache = await this.prisma.tache.findUnique({
    where: { id },
    include: {
      createur: { select: { id: true, nom: true, prenom: true } },
      destinataire: { select: { id: true, nom: true, prenom: true } },
      commentaires: {
        include: {
          auteur: { select: { id: true, nom: true, prenom: true } },
        },
      },
    },
  });
  if (!tache) {
    throw new NotFoundException(`Tâche #${id} introuvable`);
  }
  return tache;
}

  async update(id: number, updateTachDto: UpdateTachDto) {
    await this.findOne(id);
    return this.prisma.tache.update({
      where: { id },
      data: updateTachDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.tache.delete({ where: { id } });
  }
}