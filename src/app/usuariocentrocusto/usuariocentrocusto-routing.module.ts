import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { UsuarioCentroCustoListComponent } from './usuariocentrocusto-list.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'usuariocentrocustos',
    component: UsuarioCentroCustoListComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioCentroCustoRoutingModule {}
