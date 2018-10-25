export interface UsuarioEmpresaFilter {
  id: string;
  descricao: string;
  id_usuario: number;
}
export class UsuarioEmpresa {
  constructor(
    public id: number = null,
    public id_usuario: number = null,
    public id_empresa: number = null,
    public empresa: string = '',
    public selecionado: boolean = false
  ) {}
}
