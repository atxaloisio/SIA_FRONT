import { OmieModule } from './../omie/omie.module';
import { UpperCaseModule } from './../uppercase/uppercase.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CentroCustoListComponent } from './centrocusto-list.component';
import { CentroCustoFormComponent } from './centrocusto-form.component';
import { CentroCustoService } from './centrocusto.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CentroCustoRoutingModule } from './centrocusto-routing.module';

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
    UpperCaseModule,
    OmieModule,
    CentroCustoRoutingModule
  ],
  declarations: [
    CentroCustoListComponent,
    CentroCustoFormComponent
  ],
  providers: [CentroCustoService]
})
export class CentroCustoModule { }
