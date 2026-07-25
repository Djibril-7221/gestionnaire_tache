// tache-update-delete.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TacheUpdateDeleteGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 
    const tacheId = Number(request.params.id);

    if (!tacheId || isNaN(tacheId)) {
      throw new NotFoundException('Identifiant de tâche invalide');
    }

    const tache = await this.prisma.tache.findUnique({
      where: { id: tacheId },
    });

    if (!tache) {
      throw new NotFoundException(`Tâche #${tacheId} introuvable`);
    }

    if (tache.createur_id !== user.id && tache.destinataire_id !== user.id ) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier cette tâche');
    }

    return true;
  }
}