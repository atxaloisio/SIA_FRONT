export interface OrdemPagamentoFilter {
  id: string;
  descricao: string;
  servico: string;
  centrocusto: string;
  fornecedor: string;
  contratante: string;
}
export class OrdemPagamento {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public nota_fiscal: string = '',
    public recibo: string = '',
    public parcela: number = null,
    public id_servico: number = null,
    public id_centro_custo: number = null,
    public id_fornecedor: number = null,
    public valor_parcela: number = null,
    public valor_total: number = null,
    public vencimento: Date = null,
    public usuario_contratante: string = '',
    public inclusao: Date = null,
    public usuario_inclusao: string = '',
    public alteracao: Date = null,
    public usuario_alteracao: string = '',
    public aprovacao: Date = null,
    public usuario_aprovacao: string = '',
    public reprovacao: Date = null,
    public usuario_reprovacao: string = '',
    public servico: string = '',
    public centrocusto: string = '',
    public fornecedor: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
