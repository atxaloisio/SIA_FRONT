export class CategoriaRequest {
  pagina: number;
  registro_por_pagina: number;
  apenas_importado_api: string;
  ordenar_por: string;
  ordem_descrescente: string;
}
export class Categoria {
  constructor(
    public id: number = null,
    public codigo: number = null,
    public descricao: string = '',
    public descricao_padrao: string = '',
    public conta_inativa: string = '',
    public definida_pelo_usuario: string = '',
    public id_conta_contabil: number = null,
    public tag_conta_contabil: string = '',
    public conta_despesa: string = '',
    public nao_exibir: string = '',
    public natureza: string = '',
    public conta_receita = '',
    public totalizadora = '',
    public transferencia = ''
  ) {}
}

export class CategoriaResponse {
  pagina: number;
  total_de_paginas: number;
  registros: number;
  total_de_registros: number;
  categoria_cadastro: Categoria[];
}

