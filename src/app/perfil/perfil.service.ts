import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Perfil, PerfilFilter } from './perfil';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class PerfilService {
  private perfilUrl = environment.urlbase + '/api/perfis';

  constructor(private _http: Http) {}

  addPerfil(accessToken: string, _perfil: Perfil): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      descricao: _perfil.descricao,
      cadastros : _perfil.cadastros,
      cadastros_servico: _perfil.cadastros_servico,
      cadastros_centro_custo: _perfil.cadastros_centro_custo,
      cadastros_funcao: _perfil.cadastros_funcao,
      cadastros_fornecedor: _perfil.cadastros_fornecedor,
      processos: _perfil.processos,
      processos_ordem_pagamento: _perfil.processos_ordem_pagamento,
      processos_aprovacao_pagamento: _perfil.processos_aprovacao_pagamento,
      relatorios: _perfil.relatorios,
      relatorios_listagem_fornecedores: _perfil.relatorios_listagem_fornecedores,
      relatorios_listagem_ordem_pagamento: _perfil.relatorios_listagem_ordem_pagamento,
      relatorios_ordem_pagamento: _perfil.relatorios_ordem_pagamento,
      aclcontrol: _perfil.aclcontrol,
      aclcontrol_adicionar_usuario: _perfil.aclcontrol_adicionar_usuario,
      aclcontrol_redefinir_senha: _perfil.aclcontrol_redefinir_senha,
      aclcontrol_alterar_usuario: _perfil.aclcontrol_alterar_usuario,
      aclcontrol_usuario_centro_custo: _perfil.aclcontrol_usuario_centro_custo,
      aclcontrol_usuario_empresa: _perfil.aclcontrol_usuario_empresa,
      aclcontrol_perfil: _perfil.aclcontrol_perfil
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.perfilUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editPerfil(accessToken: string, _id: number, _perfil: Perfil): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      descricao: _perfil.descricao,
      cadastros : _perfil.cadastros,
      cadastros_servico: _perfil.cadastros_servico,
      cadastros_centro_custo: _perfil.cadastros_centro_custo,
      cadastros_funcao: _perfil.cadastros_funcao,
      cadastros_fornecedor: _perfil.cadastros_fornecedor,
      processos: _perfil.processos,
      processos_ordem_pagamento: _perfil.processos_ordem_pagamento,
      processos_aprovacao_pagamento: _perfil.processos_aprovacao_pagamento,
      relatorios: _perfil.relatorios,
      relatorios_listagem_fornecedores: _perfil.relatorios_listagem_fornecedores,
      relatorios_listagem_ordem_pagamento: _perfil.relatorios_listagem_ordem_pagamento,
      relatorios_ordem_pagamento: _perfil.relatorios_ordem_pagamento,
      aclcontrol: _perfil.aclcontrol,
      aclcontrol_adicionar_usuario: _perfil.aclcontrol_adicionar_usuario,
      aclcontrol_redefinir_senha: _perfil.aclcontrol_redefinir_senha,
      aclcontrol_alterar_usuario: _perfil.aclcontrol_alterar_usuario,
      aclcontrol_usuario_centro_custo: _perfil.aclcontrol_usuario_centro_custo,
      aclcontrol_usuario_empresa: _perfil.aclcontrol_usuario_empresa,
      aclcontrol_perfil: _perfil.aclcontrol_perfil
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.perfilUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deletePerfil(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.perfilUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getPerfil(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.perfilUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de perfils
   *  parametro: acessToken: string
  */
  getPerfils(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: PerfilFilter) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    const params: HttpParams = new HttpParams();
    const search: URLSearchParams =  new URLSearchParams();
    search.set('nrcount', pagesize.toString());
    page++;
    search.set('page', page.toString());

    if ((!isNullOrUndefined(order)) && (order.length > 0)) {
      search.set('order', order);
    } else {
      order = 'asc';
      search.set('order', order);
    }

    if ((!isNullOrUndefined(sort))) {
      search.set('orderkey', sort);
    } else {
      sort = 'id';
      search.set('orderkey', sort);
    }

    if ((!isNullOrUndefined(filter.id)) && (filter.id.toString().length > 0)) {
      search.set('id', filter.id.toString());
    }

    if ((!isNullOrUndefined(filter.descricao)) && (filter.descricao.length > 0)) {
      search.set('descricao', filter.descricao);
    }

    return this._http
      .get(this.perfilUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListPerfils(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listperfis';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(listUrl, { headers: headers })
      .map((res: Response) => res)
      .retry(3)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }
}
