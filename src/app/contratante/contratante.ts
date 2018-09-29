export interface ContratanteFilter {
  id: string;
  descricao: string;
}
export class Contratante {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
