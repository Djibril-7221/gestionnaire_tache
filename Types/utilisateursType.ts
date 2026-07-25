export interface Utilisateur {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

export enum Role {
  COLLABORATEUR = "COLLABORATEUR",
  MANAGER = "MANAGER",
  ADMINISTRATEUR = "ADMINISTRATEUR",
}