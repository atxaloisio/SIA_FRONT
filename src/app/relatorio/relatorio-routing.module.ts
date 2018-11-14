import { FiltroFornecedorListComponent } from './fornecedor/filtrofornecedor-list.component';
import { FiltroOrdemPagamentoListComponent } from './ordempagamento/filtroordempagamento-list.component';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RelatorioOrdemFormComponent } from './ordempagamento/relatorioordem-form.component';
import { FiltroListagemOrdemPagamentoListComponent } from './ordempagamento/filtrolistagemordempagamento-list.component';
import { RelatorioListagemOrdemFormComponent } from './ordempagamento/relatoriolistagemordem-form.component';
import { RelatorioFornecedorFormComponent } from './fornecedor/relatoriofornecedor-form.component';

const routes: Routes = [
  { path: 'relatorios/ordempagamento', component: RelatorioOrdemFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/filtroordempagamento', component: FiltroOrdemPagamentoListComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/filtrolistagemordempagamento', component: FiltroListagemOrdemPagamentoListComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/listagemordempagamento', component: RelatorioListagemOrdemFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/fornecedor', component: FiltroFornecedorListComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/relatoriofornecedor', component: RelatorioFornecedorFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioRoutingModule { }
