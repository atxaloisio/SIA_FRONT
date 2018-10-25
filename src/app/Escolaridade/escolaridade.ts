import { EscolaridadeEnum } from './escolaridade.enum';
export class Escolaridade {
  constructor() {}
  public static EnumToString(en: EscolaridadeEnum) {
    let retorno = '';
    switch (en) {
      case EscolaridadeEnum.Fundamental_Incompleto:
      retorno = 'Fundamental Incompleto';
      break;
      case EscolaridadeEnum.Fundamental_Completo:
      retorno = 'Fundamental Completo';
      break;
      case EscolaridadeEnum.Medio_Incompleto:
      retorno = 'Medio Incompleto';
      break;
      case EscolaridadeEnum.Medio_Completo:
      retorno = 'Medio Completo';
      break;
      case EscolaridadeEnum.Superior_Incompleto:
      retorno = 'Superior Incompleto';
      break;
      case EscolaridadeEnum.Superior_Completo:
      retorno = 'Superior Completo';
      break;
      default:
      retorno = 'Não Informado';
      break;
    }
    return retorno;
  }
}
