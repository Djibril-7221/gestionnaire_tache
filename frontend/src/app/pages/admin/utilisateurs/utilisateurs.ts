import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { Utilisateur } from '../../../types/utilisateur.type';
import { SidebarAppComponent } from '../../../utilitaire/sideBar/sidebar-app.component';


type FiltreRole = 'TOUS' | 'COLLABORATEUR' | 'MANAGER' | 'ADMINISTRATEUR';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule , SidebarAppComponent ],
  templateUrl: './utilisateurs.html'
})
export class UtilisateursComponent implements OnInit {
  private utilisateurService = inject(UtilisateurService);

  utilisateurs = signal<Utilisateur[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  filtreActif = signal<FiltreRole>('TOUS');

  utilisateursFiltres = computed(() => {
    const filtre = this.filtreActif();
    const liste = this.utilisateurs();
    return filtre === 'TOUS' ? liste : liste.filter(u => u.role === filtre);
  });

  ngOnInit() {
    this.utilisateurService.findAll().subscribe({
      next: (data) => {
        this.utilisateurs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur de chargement');
      }
    });
  }

  changerFiltre(filtre: FiltreRole) {
    this.filtreActif.set(filtre);
  }

  couleurRole(role: string): string {
    switch (role) {
      case 'ADMINISTRATEUR': return 'border-purple-300 text-purple-700 bg-purple-50';
      case 'MANAGER': return 'border-blue-300 text-blue-700 bg-blue-50';
      case 'COLLABORATEUR': return 'border-[#35D68C] text-emerald-700 bg-emerald-50';
      default: return 'border-gray-300 text-gray-600 bg-gray-50';
    }
  }
}