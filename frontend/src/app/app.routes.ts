import { Routes } from '@angular/router';
import { TableauDeBordComponent } from './pages/tableau-de-bord/tableau-de-bord.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'connexion', pathMatch: 'full' },
    { path: 'connexion', component: ConnexionComponent },
    
    { path: 'accueil', component: AccueilComponent, canActivate: [AuthGuard] },
    { path: 'tableauDeBord', component: TableauDeBordComponent, canActivate: [AuthGuard] }
];
