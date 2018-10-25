import { FiltroFornecedorListComponent } from './fornecedor/filtrofornecedor-list.component';
import { FiltroOrdemPagamentoListComponent } from './ordempagamento/filtroordempagamento-list.component';
import { MapaResiduoFormComponent } from './maparesiduo-form.component';
import { FiltroMapaResiduoFormComponent } from './filtromaparesiduo-form.component';
import { RelatorioFormComponent } from './relatorio-form.component';
import { FiltroRelatorioFormComponent } from './filtrorelatorio-form.component';
import { RelatorioPesagemFormComponent } from './relatoriopesagem-form.component';
import { FiltroPesagemFormComponent } from './filtropesagem-form.component';
import { RelatorioClienteFormComponent } from './relatoriocliente-form.component';
import { DespesaFormComponent } from './despesa-form.component';
import { FiltroClienteFormComponent } from './filtrocliente-form.component';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { ReceitaFormComponent } from './receita-form.component';
import { Routes, RouterModule } from '@angular/router';
import { RelatorioOrdemFormComponent } from './ordempagamento/relatorioordem-form.component';
import { FiltroListagemOrdemPagamentoListComponent } from './ordempagamento/filtrolistagemordempagamento-list.component';
import { RelatorioListagemOrdemFormComponent } from './ordempagamento/relatoriolistagemordem-form.component';
import { RelatorioFornecedorFormComponent } from './fornecedor/relatoriofornecedor-form.component';

const routes: Routes = [
  { path: 'relatorios/gerencial', component: FiltroRelatorioFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/gerencialreport', component: RelatorioFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/cliente', component: FiltroClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/clientereport', component: RelatorioClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/despesa', component: DespesaFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/pesagem', component: FiltroPesagemFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/pesagemreport', component: RelatorioPesagemFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/maparesiduos', component: FiltroMapaResiduoFormComponent, canActivate: [AuthGuard] },
  { path: 'relatorios/relmaparesiduos', component: MapaResiduoFormComponent, canActivate: [AuthGuard] },
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
