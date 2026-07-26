import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent {
  errorMessage = '';
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', Validators.required],
      se_souvenir_de_moi: [false]
    });
  }


onSubmit() {
  if (this.form.invalid) return;

  this.loading = true;
  this.errorMessage = '';

  const { email, mot_de_passe, se_souvenir_de_moi } = this.form.value;

  this.authService.login({
    email: email!,
    mot_de_passe: mot_de_passe!,
    se_souvenir_de_moi: se_souvenir_de_moi ?? false
  }).subscribe({
    next: (res) => {
      this.loading = false;
      this.redirectSelonRole(res.utilisateur.role);
    },
    error: (err) => {
      this.loading = false;
      this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
    }
  });
}

  private redirectSelonRole(role: string) {
    if (role === 'ADMINISTRATEUR') this.router.navigate(['/admin']);
    else this.router.navigate(['/mes-taches']);
  }

  etapes = [
  { label: 'Brouillon' },
  { label: 'Soumise' },
  { label: 'Validée' },
];
}