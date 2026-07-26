import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TacheMAnagerCollaborateurGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role !== 'MANAGER' &&  user.role !== 'COLLABORATEUR' ) {
      throw new ForbiddenException('Seul un manager et le collaborateur peuveut passer');
    }

    return true;
  }
}