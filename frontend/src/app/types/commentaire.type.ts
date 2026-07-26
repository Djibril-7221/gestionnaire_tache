
import { Utilisateur } from "./utilisateur.type";

export interface Commentaire {
  id: number;
  contenu: string;
  auteur_id: number;
  tache_id: number;
  auteur: Utilisateur;
  created_at: string;
}

export interface CreateCommentaireDto {
  contenu: string;
  tache_id: number;
}

export interface UpdateCommentaireDto {
  contenu?: string;
}