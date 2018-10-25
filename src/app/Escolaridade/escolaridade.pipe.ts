import { Escolaridade } from './escolaridade';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'escolaridadePipe'
})
export class EscolaridadePipe implements PipeTransform {

  transform(value: number, args?: any): string {
    const ret = Escolaridade.EnumToString(value);
    return ret;
  }

}
