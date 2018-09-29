export interface FuncaoFilter {
  id: string;
  descricao: string;
}
export class Funcao {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
