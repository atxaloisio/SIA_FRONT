import { EstadoCivil } from './estado-civil';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoCivilPipe'
})
export class EstadoCivilPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    const ret = EstadoCivil.EnumToString(value);
    return ret;
  }

}
