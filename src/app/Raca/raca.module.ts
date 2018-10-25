import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RacaPipe } from './raca.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RacaPipe
  ],
  exports: [
    RacaPipe
  ]
})
export class RacaModule { }
