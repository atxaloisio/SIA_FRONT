import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoCivilPipe } from './estado-civil.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EstadoCivilPipe
  ],
  exports: [
    EstadoCivilPipe
  ]
})
export class EstadoCivilModule { }
