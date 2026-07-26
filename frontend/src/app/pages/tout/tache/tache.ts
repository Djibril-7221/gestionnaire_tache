import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Subscription, interval, switchMap, startWith } from 'rxjs';
import { TacheService } from '../../../services/tache.service';
import { CommentaireService } from '../../../services/commentaire.service';
import { AuthService } from '../../../services/auth.service';
import { Tache } from '../../../types/tache.type';
import { SidebarAppComponent } from '../../../utilitaire/sideBar/sidebar-app.component';

@Component({
  selector: 'app-tache',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , SidebarAppComponent],
  templateUrl: './tache.html'
})
export class TacheComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private tacheService = inject(TacheService);
  private commentaireService = inject(CommentaireService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  tache = signal<Tache | null>(null);
  loading = signal(true);
  errorMessage = signal('');
  envoiCommentaire = signal(false);

  private pollingSub?: Subscription;
  private tacheId!: number;

  commentForm = this.fb.group({
    contenu: ['', Validators.required]
  });

  ngOnInit() {
    this.tacheId = Number(this.route.snapshot.paramMap.get('id'));

    this.pollingSub = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.tacheService.findOne(this.tacheId))
      )
      .subscribe({
        next: (data) => {
          this.tache.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message || 'Tâche introuvable');
        }
      });
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  get role(): string | null {
    return this.authService.getRole();
  }

  get estAdmin(): boolean {
    return this.role === 'ADMINISTRATEUR';
  }

  get peutCommenter(): boolean {
    return this.role === 'MANAGER' || this.role === 'COLLABORATEUR';
  }

  get peutSoumettre(): boolean {
    return this.role === 'COLLABORATEUR' &&
      (this.tache()?.statut === 'BROUILLON' || this.tache()?.statut === 'REJETEE');
  }

  get peutValider(): boolean {
    return this.role === 'MANAGER' && this.tache()?.statut === 'SOUMISE';
  }

  get peutRefuser(): boolean {
    return this.role === 'MANAGER' && this.tache()?.statut === 'SOUMISE';
  }

  get peutRemettreBrouillon(): boolean {
    return this.role === 'MANAGER' && this.tache()?.statut === 'SOUMISE';
  }

  changerStatut(statut: 'VALIDEE' | 'REJETEE' | 'BROUILLON' | 'SOUMISE') {
    const t = this.tache();
    if (!t) return;
    this.tacheService.update(t.id, { statut }).subscribe(updated => {
      this.tache.set(updated);
    });
  }

envoyerCommentaire() {
  const t = this.tache();
  if (this.commentForm.invalid || !t) return;

  this.envoiCommentaire.set(true);
  const contenu = this.commentForm.value.contenu!;

  this.commentaireService.create({ contenu, tache_id: t.id }).subscribe({
    next: () => {
      this.envoiCommentaire.set(false);
      this.commentForm.reset();
    },
    error: () => {
      this.envoiCommentaire.set(false);
    }
  });
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