import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommentaireUpdateDeleteGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const commentaireId = Number(request.params.id);

    if (!commentaireId || isNaN(commentaireId)) {
      throw new NotFoundException('Identifiant de commentaire invalide');
    }

    const commentaire = await this.prisma.commentaire.findUnique({
      where: { id: commentaireId },
    });

    if (!commentaire) {
      throw new NotFoundException(`Commentaire #${commentaireId} introuvable`);
    }

    if (commentaire.auteur_id !== user.id) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à modifier ce commentaire");
    }

    return true;
  }
}