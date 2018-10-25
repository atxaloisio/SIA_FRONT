import { EstadoCivilEnum } from './estado-civil.enum';
export class EstadoCivil {
  constructor() {}
  public static EnumToString(en: EstadoCivilEnum) {
    let retorno = '';
    switch (en) {
      case EstadoCivilEnum.Casado:
      retorno = 'Casado(a)';
      break;
      case EstadoCivilEnum.Solteiro:
      retorno = 'Solteiro(a)';
      break;
      case EstadoCivilEnum.Divorciado:
      retorno = 'Divorciado(a)';
      break;
      case EstadoCivilEnum.Viuvo:
      retorno = 'Viuvo(a)';
      break;
      default:
      retorno = 'Não Informado';
      break;
    }
    return retorno;
  }
}
