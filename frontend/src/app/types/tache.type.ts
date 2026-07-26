import { Commentaire } from "./commentaire.type";
import { Utilisateur } from "./utilisateur.type";

export interface Tache {
  id: number;
  titre: string;
  description?: string;
  statut: string;
  createur_id: number;
  destinataire_id: number;
  createur: Utilisateur;
  destinataire: Utilisateur;
  commentaires?: Commentaire[];
  created_at: string;
}

export interface CreateTacheDto {
  titre: string;
  description?: string;
}

export interface UpdateTacheDto {
  titre?: string;
  description?: string;
  statut?: string;
  destinataire_id?: number;
}