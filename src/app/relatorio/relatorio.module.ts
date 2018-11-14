import { EscolaridadeModule } from './../Escolaridade/escolaridade.module';
import { RacaModule } from './../Raca/raca.module';
import { EstadoCivilModule } from './../EstadoCivil/estado-civil.module';
import { UtilitarioModule } from './../utilitario/utilitario.module';
import { UpperCaseModule } from './../uppercase/uppercase.module';
import { RelatorioOrdemFormComponent } from './ordempagamento/relatorioordem-form.component';
import { DatepipeModule } from './../datepipe/datepipe.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RelatorioService } from './relatorio.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RelatorioRoutingModule } from './relatorio-routing.module';
import { FiltroOrdemPagamentoListComponent } from './ordempagamento/filtroordempagamento-list.component';
import { FiltroListagemOrdemPagamentoListComponent } from './ordempagamento/filtrolistagemordempagamento-list.component';
import { RelatorioListagemOrdemFormComponent } from './ordempagamento/relatoriolistagemordem-form.component';
import { FiltroFornecedorListComponent } from './fornecedor/filtrofornecedor-list.component';
import { RelatorioFornecedorFormComponent } from './fornecedor/relatoriofornecedor-form.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MyMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    DatepipeModule,
    EstadoCivilModule,
    RacaModule,
    EscolaridadeModule,
    UtilitarioModule,
    RelatorioRoutingModule,
    UpperCaseModule
  ],
  declarations: [
    RelatorioOrdemFormComponent,
    FiltroOrdemPagamentoListComponent,
    FiltroListagemOrdemPagamentoListComponent,
    RelatorioListagemOrdemFormComponent,
    FiltroFornecedorListComponent,
    RelatorioFornecedorFormComponent
  ],
  providers: [RelatorioService]
})
export class RelatorioModule { }
