import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentairesService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentaireDto: CreateCommentaireDto , utilisateur) {
    const donnee = {... createCommentaireDto , auteur_id: utilisateur.id}
    return this.prisma.commentaire.create({
      data: donnee,
      include: {
        auteur: { select: { id: true, nom: true, prenom: true } },
      },
    });
  }


  async findOne(id: number) {
    const commentaire = await this.prisma.commentaire.findUnique({
      where: { id },
      include: {
        auteur: { select: { id: true, nom: true, prenom: true } },
      },
    });
    if (!commentaire) {
      throw new NotFoundException(`Commentaire #${id} introuvable`);
    }
    return commentaire;
  }

  async update(id: number, updateCommentaireDto: UpdateCommentaireDto) {
    await this.findOne(id);
    return this.prisma.commentaire.update({
      where: { id },
      data: updateCommentaireDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.commentaire.delete({ where: { id } });
  }
}