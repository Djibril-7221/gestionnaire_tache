// features/comments/commentaire.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Commentaire, CreateCommentaireDto, UpdateCommentaireDto } from '../types/commentaire.type';

@Injectable({ providedIn: 'root' })
export class CommentaireService {
  private endpoint = 'commentaires';

  constructor(private api: ApiService) {}

  findOne(id: number) {
    return this.api.get<Commentaire>(`${this.endpoint}/${id}`);
  }

  create(data: CreateCommentaireDto) {
    return this.api.post<Commentaire>(this.endpoint, data);
  }

  update(id: number, data: UpdateCommentaireDto) {
    return this.api.patch<Commentaire>(`${this.endpoint}/${id}`, data);
  }

  remove(id: number) {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}