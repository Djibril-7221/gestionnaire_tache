import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CommentaireCreateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const rolesAutorises = ['MANAGER', 'COLLABORATEUR'];

    if (!rolesAutorises.includes(user.role)) {
      throw new ForbiddenException(
        'Seul un manager ou un collaborateur peut ajouter un commentaire',
      );
    }

    return true;
  }
}