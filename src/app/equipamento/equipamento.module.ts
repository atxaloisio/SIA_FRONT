import { UpperCaseModule } from './../uppercase/uppercase.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EquipamentoListComponent } from './equipamento-list.component';
import { EquipamentoFormComponent } from './equipamento-form.component';
import { EquipamentoService } from './equipamento.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipamentoRoutingModule } from './equipamento-routing.module';

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
    EquipamentoRoutingModule
  ],
  declarations: [
    EquipamentoListComponent,
    EquipamentoFormComponent
  ],
  providers: [EquipamentoService]
})
export class EquipamentoModule { }
