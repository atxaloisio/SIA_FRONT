import { UpperCaseModule } from './../uppercase/uppercase.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UnidadeListComponent } from './unidade-list.component';
import { UnidadeFormComponent } from './unidade-form.component';
import { UnidadeService } from './unidade.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnidadeRoutingModule } from './unidade-routing.module';

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
    UnidadeRoutingModule
  ],
  declarations: [
    UnidadeListComponent,
    UnidadeFormComponent
  ],
  providers: [UnidadeService]
})
export class UnidadeModule { }
