export interface CentroCustoFilter {
  id: string;
  descricao: string;
}
export class CentroCusto {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public id_categoria: number = null,
    public id_conta_corrente: number = null,
    public categoria: string = '',
    public conta_corrente: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
