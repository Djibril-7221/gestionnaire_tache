import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/admin/register/register';
import { TacheComponent } from './pages/tout/tache/tache';
import { TacheAdminComponent } from './pages/admin/tache-admin/tache-admin';
import { TacheManagerCollaborateurComponent } from './pages/manager-collaborateur/tache-manager-collaborateur/tache-manager-collaborateur';
import { UtilisateursComponent } from './pages/admin/utilisateurs/utilisateurs';
import { CollaborateursComponent } from './pages/manager/collaborateurs/collaborateurs';
import { adminGuard } from './guard/admin.guard';
import { authGuard } from './guard/auth.guard';
import { managerGuard } from './guard/manager.guard';
import { managerCollaborateurGuard } from './guard/manager-collaborateur.guard';



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register',canActivate: [authGuard , adminGuard] ,component:  RegisterComponent },
  { path: 'tache/:id', canActivate: [authGuard] , component:  TacheComponent },
  { path: 'admin', canActivate: [authGuard , adminGuard], component:  TacheAdminComponent },
  { path: 'mes-taches', canActivate: [authGuard , managerCollaborateurGuard] , component:  TacheManagerCollaborateurComponent },
  { path: 'utilisateurs', canActivate: [authGuard , adminGuard] ,component:  UtilisateursComponent },
  { path: 'collaborateurs', canActivate: [authGuard , managerGuard],component:  CollaborateursComponent },
];
