import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { FuncaoListComponent } from './funcao-list.component';
import { FuncaoFormComponent } from './funcao-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'funcoes',
    component: FuncaoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'funcoes/funcao',
    component: FuncaoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'funcoes/funcao/:id',
    component: FuncaoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncaoRoutingModule {}
