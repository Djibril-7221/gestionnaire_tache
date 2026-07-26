import { Component, computed, inject } from '@angular/core';
import { SidebarComponent, SidebarLink } from './sideBar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar-app',
  standalone: true,
  imports: [SidebarComponent],
  template: `<app-sidebar [espace]="espace()" [links]="links()" />`
})
export class SidebarAppComponent {
  private authService = inject(AuthService);

  private role = computed(() => this.authService.getRole());

espace = computed(() => {
  switch (this.role()) {
    case 'ADMINISTRATEUR': return 'Administration';
    case 'MANAGER': return 'Espace manager';
    case 'COLLABORATEUR': return 'Espace collaborateur';
    default: return '';
  }
});

links = computed<SidebarLink[]>(() => {
  switch (this.role()) {
    case 'ADMINISTRATEUR':
      return [
        { label: 'Tâches', route: '/admin', icon: 'grid' },
        { label: 'Utilisateurs', route: '/utilisateurs', icon: 'users' },
        { label: 'Nouveau compte', route: '/register', icon: 'team' },
      ];
    case 'MANAGER':
      return [
        { label: 'Mes tâches', route: '/mes-taches', icon: 'tasks' },
        { label: 'Collaborateurs', route: '/collaborateurs', icon: 'team' },
      ];
    case 'COLLABORATEUR':
      return [
        { label: 'Mes tâches', route: '/mes-taches', icon: 'tasks' },
      ];
    default:
      return [];
  }
});
}