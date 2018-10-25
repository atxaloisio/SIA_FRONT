import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscolaridadePipe } from './escolaridade.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EscolaridadePipe
  ],
  exports: [
    EscolaridadePipe
  ]
})
export class EscolaridadeModule { }
