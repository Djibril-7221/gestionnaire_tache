
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Tache, CreateTacheDto, UpdateTacheDto } from '../types/tache.type';

@Injectable({ providedIn: 'root' })
export class TacheService {
  private endpoint = 'taches';

  constructor(private api: ApiService) {}

  findAll() {
    return this.api.get<Tache[]>(this.endpoint);
  }

  mesTaches() {
    return this.api.get<Tache[]>(`${this.endpoint}/mes-taches`);
  }

  findOne(id: number) {
    return this.api.get<Tache>(`${this.endpoint}/${id}`);
  }

  create(destinataire_id: number , data: CreateTacheDto ) {
    return this.api.post<Tache>(`${this.endpoint}/create/${destinataire_id}`, data);
  }

  update(id: number, data: UpdateTacheDto) {
    return this.api.patch<Tache>(`${this.endpoint}/${id}`, data);
  }

  remove(id: number) {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}