import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { UsuarioEmpresaListComponent } from './usuarioempresa-list.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'usuarioempresas',
    component: UsuarioEmpresaListComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioEmpresaRoutingModule {}
