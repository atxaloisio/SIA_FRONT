import { UpperCaseModule } from './../uppercase/uppercase.module';
import { RelatorioOrdemFormComponent } from './relatorioordem-form.component';
import { MapaResiduoFormComponent } from './maparesiduo-form.component';
import { FiltroMapaResiduoFormComponent } from './filtromaparesiduo-form.component';
import { RelatorioFormComponent } from './relatorio-form.component';
import { FiltroRelatorioFormComponent } from './filtrorelatorio-form.component';
import { RelatorioPesagemFormComponent } from './relatoriopesagem-form.component';
import { FiltroPesagemFormComponent } from './filtropesagem-form.component';
import { DatepipeModule } from './../datepipe/datepipe.module';
import { FiltroClienteFormComponent } from './filtrocliente-form.component';
import { DespesaFormComponent } from './despesa-form.component';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReceitaFormComponent } from './receita-form.component';
import { RelatorioClienteFormComponent } from './relatoriocliente-form.component';
import { RelatorioService } from './relatorio.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RelatorioRoutingModule } from './relatorio-routing.module';
import { FiltroOrdemPagamentoListComponent } from './filtroordempagamento-list.component';

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
    RelatorioRoutingModule,
    UpperCaseModule
  ],
  declarations: [
    ReceitaFormComponent,
    FiltroClienteFormComponent,
    FiltroRelatorioFormComponent,
    RelatorioFormComponent,
    RelatorioClienteFormComponent,
    DespesaFormComponent,
    FiltroPesagemFormComponent,
    RelatorioPesagemFormComponent,
    FiltroMapaResiduoFormComponent,
    MapaResiduoFormComponent,
    RelatorioOrdemFormComponent,
    FiltroOrdemPagamentoListComponent
  ],
  providers: [RelatorioService]
})
export class RelatorioModule { }
