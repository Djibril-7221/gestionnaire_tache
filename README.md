# RH Perspectives

Application de gestion de tâches en entreprise avec workflow de validation par rôle (Administrateur, Manager, Collaborateur).

## Stack technique

- **Backend** : NestJS + Prisma (adapter PostgreSQL) + JWT (access + refresh token)
- **Frontend** : Angular (standalone components, signals) + Tailwind CSS
- **Base de données** : PostgreSQL 16
- **Conteneurisation** : Docker Compose

## Prérequis

- Docker et Docker Compose installés
- (Optionnel, pour une installation manuelle) Node.js 20+ et PostgreSQL 16

## Installation avec Docker (recommandé)

1. **Cloner le dépôt**
```bash
   git clone https://github.com/Djibril-7221/gestionnaire_tache.git
   cd rh_perspectives_project
```

2. **Créer le fichier d'environnement** — copier `.env.example` en `.env` à la racine, et renseigner une valeur pour `JWT_ACCESS_SECRET` , `JWT_REFRESH_SECRET` , `JWT_ACCESS_EXPIRATION` , `JWT_REFRESH_EXPIRATION`  , `DATABASE_URL`:    
```bash
   cp .env.example .env
```

3. **Lancer les conteneurs**
```bash
   docker-compose up --build
```

4. **Appliquer les migrations et peupler la base avec les comptes de démonstration**
```bash
   docker-compose exec backend npx prisma migrate deploy
   docker-compose exec backend npx prisma db seed
```

5. **Accéder à l'application**
   - Frontend : http://localhost:4200
   - Backend (API) : http://localhost:3000

## Comptes de démonstration

Tous les comptes utilisent le mot de passe : **`MotDePasse123!`**

| Rôle | Nom | Email |
|------|-----|-------|
| Administrateur | Fatou Ndiaye | admin@demo.com |
| Manager | Moussa Sow | manager1@demo.com |
| Manager | Aissatou Fall | manager2@demo.com |
| Collaborateur | Awa Diop | collab1@demo.com |
| Collaborateur | Cheikh Ba | collab2@demo.com |
| Collaborateur | Mariama Sarr | collab3@demo.com |
| Collaborateur | Ibrahima Diallo | collab4@demo.com |
| Collaborateur | Khady Gueye | collab5@demo.com |

## Installation manuelle (sans Docker)

### Base de données
Créer une base PostgreSQL nommée `rh_task_db`, puis créer `backend/.env` :
```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/rh_task_db?schema=public"
JWT_SECRET=une_valeur_secrete_a_definir
```

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```
API disponible sur http://localhost:3000

### Frontend
```bash
cd frontend
npm install
ng serve
```
Application disponible sur http://localhost:4200

## Fonctionnalités par rôle

- **Administrateur** — tableau de bord (statistiques + liste de toutes les tâches, lecture seule), gestion des utilisateurs, création de nouveaux comptes
- **Manager** — liste des collaborateurs, assignation de tâches, validation/refus/remise en brouillon des tâches soumises
- **Collaborateur** — consultation de ses tâches assignées, soumission pour validation
- **Commun** — commentaires en temps réel (polling) sur chaque tâche, adaptés selon le rôle et le statut

## Structure du dépôt

```
rh_perspectives_project/
├── backend/          # API NestJS + Prisma
├── frontend/          # Application Angular
├── docker-compose.yml
└── README.md
└── docs/
      └── documentation_du_projet.pdf