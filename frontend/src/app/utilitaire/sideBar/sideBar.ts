import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface SidebarLink {
  label: string;
  route: string;
  icon: 'grid' | 'users' | 'tasks' | 'team';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  espace = input.required<string>();
  links = input<SidebarLink[]>([]);

  ouvert = signal(false);

  bascule() {
    this.ouvert.update(v => !v);
  }

  fermer() {
    this.ouvert.set(false);
  }

  deconnexion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}