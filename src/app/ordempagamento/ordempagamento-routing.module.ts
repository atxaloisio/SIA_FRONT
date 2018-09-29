import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { OrdemPagamentoListComponent } from './ordempagamento-list.component';
import { OrdemPagamentoFormComponent } from './ordempagamento-form.component';
import { Routes, RouterModule } from '@angular/router';
import { AprovacaoPagamentoListComponent } from './aprovacaopagamento-list.component';

const routes: Routes = [
  {
    path: 'aprovacaopagamentos',
    component: AprovacaoPagamentoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ordempagamentos',
    component: OrdemPagamentoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ordempagamentos/ordempagamento',
    component: OrdemPagamentoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'ordempagamentos/ordempagamento/:id',
    component: OrdemPagamentoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdemPagamentoRoutingModule {}
