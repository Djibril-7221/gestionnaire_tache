
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const managerCollaborateurGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getRole() === 'MANAGER' || authService.getRole() === 'COLLABORATEUR' ) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};