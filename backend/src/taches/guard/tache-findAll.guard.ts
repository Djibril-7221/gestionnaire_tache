import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TacheFindAllGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role !== 'ADMINISTRATEUR') {
      throw new ForbiddenException('Seul un administrateur peut consulter toutes les tâches');
    }

    return true;
  }
}