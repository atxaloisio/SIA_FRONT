import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { PerfilListComponent } from './perfil-list.component';
import { PerfilFormComponent } from './perfil-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'perfis', component: PerfilListComponent, canActivate: [AuthGuard] },
  { path: 'perfis/perfil', component: PerfilFormComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'perfis/perfil/:id', component: PerfilFormComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
