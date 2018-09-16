import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { TipoTratamentoListComponent } from './tipotratamento-list.component';
import { TipoTratamentoFormComponent } from './tipotratamento-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'tipotratamentos',
    component: TipoTratamentoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tipotratamentos/tipotratamento',
    component: TipoTratamentoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'tipotratamentos/tipotratamento/:id',
    component: TipoTratamentoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoTratamentoRoutingModule {}
