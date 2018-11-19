import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { Perfil } from './perfil/perfil';
import { strToBoolean } from './utilitario/utilitarios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private _snackBar: MatSnackBar) { }

     canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //  console.log('verificou login');
        // console.log(this.retornaUrl(state.url));
         if (sessionStorage.getItem('Logado')) {
             // logged in so return true
            return this.validaAcesso(this.retornaUrl(state.url));
            //  return true;
         }
         // not logged in so redirect to login page
        //  this.router.navigate(['/forbidden']);
         return false;
     }

     openSnackBar() {
        this._snackBar.openFromComponent(ForbiddenComponent, {
          duration: 4000,
        });
      // this._snackBar.open(message, action, {
      //   duration: 3000,
      // });
    }

    validaAcesso(url: string): boolean {
      const perfil: Perfil = JSON.parse(localStorage.getItem('Perfil'));
      let retorno: boolean;
      switch (url) {
        case '/servicos':
        case '/servicos/servico': {
          retorno = strToBoolean(perfil.cadastros_servico);
          break;
        }
        case '/fornecedores':
        case '/fornecedores/fornecedor': {
          retorno = strToBoolean(perfil.cadastros_fornecedor);
          break;
        }
        case '/funcoes':
        case '/funcoes/funcao': {
          retorno = strToBoolean(perfil.cadastros_funcao);
          break;
        }
        case '/centrocustos':
        case '/centrocustos/centrocusto': {
          retorno = strToBoolean(perfil.cadastros_centro_custo);
          break;
        }
        case '/ordempagamentos':
        case '/ordempagamentos/ordempagamento': {
          retorno = strToBoolean(perfil.processos_ordem_pagamento);
          break;
        }
        case '/aprovacaopagamentos': {
          retorno = strToBoolean(perfil.processos_ordem_pagamento);
          break;
        }
        case '/relatorios/fornecedor':
        case '/relatorios/relatoriofornecedor': {
          retorno = strToBoolean(perfil.relatorios_listagem_fornecedores);
          break;
        }
        case '/relatorios/filtrolistagemordempagamento':
        case '/relatorios/listagemordempagamento': {
          retorno = strToBoolean(perfil.relatorios_listagem_ordem_pagamento);
          break;
        }
        case '/relatorios/filtroordempagamento':
        case '/relatorios/ordempagamento': {
          retorno = strToBoolean(perfil.relatorios_ordem_pagamento);
          break;
        }
        case '/usuariocentrocustos': {
          retorno = strToBoolean(perfil.aclcontrol_usuario_centro_custo);
          break;
        }
        case '/usuarioempresas': {
          retorno = strToBoolean(perfil.aclcontrol_usuario_empresa);
          break;
        }
        case '/perfis':
        case '/perfis/perfil': {
          retorno = strToBoolean(perfil.aclcontrol_perfil);
          break;
        }
        default: retorno = false;
      }

      if (!retorno) {
        this.openSnackBar();
        this.router.navigate(['/']);
      }

      return retorno;
      // if (url === '/servicos') {
      //   if (strToBoolean(perfil.cadastros_servico)) {
      //     return true;
      //   } else {
      //     this.openSnackBar();
      //     this.router.navigate(['/']);
      //   }
      // }
      // return false;
    }

    retornaUrl(url: string): string {
      const index: number = url.indexOf(';');
      if (index === -1) {
        return url;
      } else {
        return url.substring(0, (index));
      }
    }
}
