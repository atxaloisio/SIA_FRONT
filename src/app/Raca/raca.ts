import { RacaEnum } from './raca.enum';
export class Raca {
  constructor() {}
  public static EnumToString(en: RacaEnum) {
    let retorno = '';
    switch (en) {
      case RacaEnum.Branca:
      retorno = 'Branca';
      break;
      case RacaEnum.Preta:
      retorno = 'Preta';
      break;
      case RacaEnum.Parda:
      retorno = 'Parda';
      break;
      case RacaEnum.Amarela:
      retorno = 'Amarela';
      break;
      case RacaEnum.Indigena:
      retorno = 'Indígena';
      break;
      default:
      retorno = 'Não Informado';
      break;
    }
    return retorno;
  }
}
