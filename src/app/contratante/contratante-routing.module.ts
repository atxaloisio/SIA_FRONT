import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ContratanteListComponent } from './contratante-list.component';
import { ContratanteFormComponent } from './contratante-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'contratantes',
    component: ContratanteListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contratantes/contratante',
    component: ContratanteFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'contratantes/contratante/:id',
    component: ContratanteFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratanteRoutingModule {}
