import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TacheService } from '../../../services/tache.service';
import { AuthService } from '../../../services/auth.service';
import { Tache } from '../../../types/tache.type';
import { RouterLink } from '@angular/router';
import { SidebarAppComponent } from '../../../utilitaire/sideBar/sidebar-app.component';

@Component({
  selector: 'app-tache-manager-collaborateur',
  standalone: true,
  imports: [CommonModule , RouterLink , SidebarAppComponent],
  templateUrl: './tache-manager-collaborateur.html'
})
export class TacheManagerCollaborateurComponent implements OnInit {
  private tacheService = inject(TacheService);
  private authService = inject(AuthService);
  private router = inject(Router);

  taches = signal<Tache[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.tacheService.mesTaches().subscribe({
      next: (data) => {
        this.taches.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur de chargement');
      }
    });
  }

  get estManager(): boolean {
    return this.authService.getRole() === 'MANAGER';
  }

voirTache(id: number) {
  this.router.navigate(['/tache', id]);
}

  couleurStatut(statut: string): string {
    switch (statut) {
      case 'BROUILLON': return 'bg-gray-200 text-gray-700';
      case 'SOUMISE': return 'bg-yellow-200 text-yellow-800';
      case 'VALIDEE': return 'bg-green-200 text-green-800';
      case 'REJETEE': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-700';
    }
  }
}