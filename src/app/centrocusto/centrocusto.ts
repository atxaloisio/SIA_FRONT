export interface CentroCustoFilter {
  id: string;
  descricao: string;
}
export class CentroCusto {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public categoria: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
