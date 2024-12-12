import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'perfil', component: UsuariosComponent },
];