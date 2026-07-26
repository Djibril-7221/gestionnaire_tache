import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { CreerTacheModalComponent } from '../creer-tache-modal/creer-tache-modal';
import { Utilisateur } from '../../../types/utilisateur.type';
import { SidebarAppComponent } from '../../../utilitaire/sideBar/sidebar-app.component';

@Component({
  selector: 'app-collaborateurs',
  standalone: true,
  imports: [CommonModule, CreerTacheModalComponent , SidebarAppComponent ],
  templateUrl: './collaborateurs.html'
})
export class CollaborateursComponent implements OnInit {
  private utilisateurService = inject(UtilisateurService);

  collaborateurs = signal<Utilisateur[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  modalOuvert = signal(false);
  collaborateurSelectionne = signal<Utilisateur | null>(null);

  ngOnInit() {
    this.utilisateurService.findAllCollaborateur().subscribe({
      next: (data) => {
        this.collaborateurs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur de chargement');
      }
    });
  }

  ouvrirModal(collaborateur: Utilisateur) {
    this.collaborateurSelectionne.set(collaborateur);
    this.modalOuvert.set(true);
  }

  fermerModal() {
    this.modalOuvert.set(false);
    this.collaborateurSelectionne.set(null);
  }

  onTacheCreee() {}
}