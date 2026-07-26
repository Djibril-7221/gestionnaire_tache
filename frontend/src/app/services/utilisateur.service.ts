
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Utilisateur } from '../types/utilisateur.type';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {

  constructor(private api: ApiService) {}

  findAllCollaborateur() {
    return this.api.get<Utilisateur[]>('utilisateurs/les-collaborateurs');
  }

 findAll() {
    return this.api.get<Utilisateur[]>('utilisateurs');
  }


}