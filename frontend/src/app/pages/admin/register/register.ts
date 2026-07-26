import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SidebarAppComponent } from '../../../utilitaire/sideBar/sidebar-app.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarAppComponent],
  templateUrl: './register.html'
})
export class RegisterComponent {
  errorMessage = signal('');
  loading = signal(false);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      role: ['COLLABORATEUR', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const { nom, prenom, email, mot_de_passe, role } = this.form.value;

    this.authService.register({
      nom: nom!,
      prenom: prenom!,
      email: email!,
      mot_de_passe: mot_de_passe!,
      role: role!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.form.reset({ role: 'COLLABORATEUR' });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de l\'inscription');
      }
    });
  }

  rolesApercu = ['Collaborateur', 'Manager', 'Administrateur'];
}