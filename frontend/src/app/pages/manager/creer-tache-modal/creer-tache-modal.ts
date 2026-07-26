import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TacheService } from '../../../services/tache.service';
import { SidebarAppComponent } from '../../../utilitaire/sideBar/sidebar-app.component';


@Component({
  selector: 'app-creer-tache-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ] ,
  templateUrl: './creer-tache-modal.html'
})
export class CreerTacheModalComponent {
  @Input({ required: true }) destinataireId!: number;
  @Input({ required: true }) destinataireNom = '';
  @Output() fermer = new EventEmitter<void>();
  @Output() tacheCreee = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private tacheService = inject(TacheService);

  loading = false;
  errorMessage = '';

  form = this.fb.group({
    titre: ['', Validators.required],
    description: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { titre, description } = this.form.value;

    this.tacheService.create(this.destinataireId, {
      titre: titre!,
      description: description!
    }).subscribe({
      next: () => {
        this.loading = false;
        this.tacheCreee.emit();
        this.fermer.emit();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création';
      }
    });
  }

  onFermer() {
    this.fermer.emit();
  }
}