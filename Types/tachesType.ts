export interface Tache {

  titre: string;
  description: string;
  createur_id: number;
  destinataire_id: number;
  statut: Statut;
  created_at: Date;
  updated_at: Date;
}

export enum Statut {
  BROUILLON = "BROUILLON",
  VALIDEE = "VALIDEE",
  REJETEE = "REJETEE",
  SOUMISE = "SOUMISE",
}