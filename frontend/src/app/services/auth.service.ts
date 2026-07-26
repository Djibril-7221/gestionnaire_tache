
import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  utilisateur: { id: string; email: string; role: string;nom: string; prenom: string; };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AuthResponse['utilisateur'] | null>(null);

constructor(private api: ApiService, private router: Router) {
  const stored = localStorage.getItem('utilisateur');
  if (stored && stored !== 'undefined') {
    try {
      this.currentUser.set(JSON.parse(stored));
    } catch {
      localStorage.removeItem('utilisateur');
    }
  }
}

  register(data: { email: string; mot_de_passe: string; nom: string; prenom: string; role: string }) {
    return this.api.post<AuthResponse>('utilisateurs/register', data);
  }

  login(data : {email: string, mot_de_passe: string, se_souvenir_de_moi: boolean }) {
    return this.api.post<AuthResponse>('auth/login', data)
      .pipe(tap(res => this.saveSession(res)));
  }

  refresh() {
    const refresh_token = localStorage.getItem('refresh_token');
    return this.api.post<AuthResponse>('auth/refresh', { refresh_token })
      .pipe(tap(res => this.saveSession(res)));
  }

  logout() {
    const refresh_token = localStorage.getItem('refresh_token');
    this.api.post('auth/logout', { refresh_token })
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('utilisateur');
    this.currentUser.set(null);
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('refresh_token', res.refresh_token);
    localStorage.setItem('utilisateur', JSON.stringify(res.utilisateur));
    this.currentUser.set(res.utilisateur);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getRole(): string | null {
    return this.currentUser()?.role ?? null;
  }
}