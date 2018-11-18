export interface PerfilFilter {
  id: string;
  descricao: string;
}
export class Perfil {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public cadastros: string = 'N',
    public cadastros_servico: string = 'N',
    public cadastros_centro_custo: string = 'N',
    public cadastros_funcao: string = 'N',
    public cadastros_fornecedor: string = 'N',
    public processos: string = 'N',
    public processos_ordem_pagamento: string = 'N',
    public processos_aprovacao_pagamento: string = 'N',
    public relatorios: string = 'N',
    public relatorios_gerencial: string = 'N',
    public relatorios_listagem_fornecedores: string = 'N',
    public relatorios_listagem_ordem_pagamento: string = 'N',
    public relatorios_ordem_pagamento: string = 'N',
    public aclcontrol_adicionar_usuario: string = 'N',
    public aclcontrol_redefinir_senha: string = 'N',
    public aclcontrol_alterar_usuario: string = 'N',
    public aclcontrol_usuario_centro_custo: string = 'N',
    public aclcontrol_usuario_empresa: string = 'N',
    public aclcontrol_perfil: string = 'N'
  ) {}
}
