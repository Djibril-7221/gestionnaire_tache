import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TacheService } from '../../../services/tache.service';
import { Tache } from '../../../types/tache.type';
import { SidebarAppComponent } from '../../../utilitaire/sideBar/sidebar-app.component';
@Component({
  selector: 'app-tache-admin',
  standalone: true,
  imports: [CommonModule, SidebarAppComponent ],
  templateUrl: './tache-admin.html',
})
export class TacheAdminComponent implements OnInit {
  private tacheService = inject(TacheService);
  private router = inject(Router);

  taches = signal<Tache[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.tacheService.findAll().subscribe({
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

  get total(): number {
    return this.taches().length;
  }

  compterParStatut(statut: string): number {
    return this.taches().filter(t => t.statut === statut).length;
  }

  voirTache(id: number) {
    this.router.navigate(['/tache', id]);
  }

  couleurStatut(statut: string): string {
    switch (statut) {
      case 'BROUILLON': return 'border-gray-300 text-gray-600 bg-gray-50';
      case 'SOUMISE': return 'border-amber-300 text-amber-700 bg-amber-50';
      case 'VALIDEE': return 'border-[#35D68C] text-emerald-700 bg-emerald-50';
      case 'REJETEE': return 'border-red-300 text-red-600 bg-red-50';
      default: return 'border-gray-300 text-gray-600 bg-gray-50';
    }
  }
}