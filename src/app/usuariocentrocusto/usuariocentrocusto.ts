export interface UsuarioCentroCustoFilter {
  id: string;
  descricao: string;
  id_usuario: number;
}
export class UsuarioCentroCusto {
  constructor(
    public id: number = null,
    public id_usuario: number = null,
    public id_centro_custo: number = null,
    public centro_custo: string = '',
    public selecionado: boolean = false
  ) {}
}
