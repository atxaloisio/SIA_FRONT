import { Raca } from './raca';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'racaPipe'
})
export class RacaPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    const ret = Raca.EnumToString(value);
    return ret;
  }

}
