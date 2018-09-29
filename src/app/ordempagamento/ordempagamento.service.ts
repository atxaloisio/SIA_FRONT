import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { OrdemPagamento, OrdemPagamentoFilter } from './ordempagamento';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { User } from '../user';
import * as moment from 'moment';

@Injectable()
export class OrdemPagamentoService {
  private ordempagamentoUrl = environment.urlbase + '/api/ordempagamentos';

  constructor(private _http: Http) {}

  addOrdemPagamento(accessToken: string, _ordempagamento: OrdemPagamento): Observable<any> {
    let usuario: User;
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    if (sessionStorage.getItem('Logado')) {
      usuario = JSON.parse(localStorage.getItem('currentUser'));
    }

    // const _params: HttpParams = new HttpParams();
    const _body = {
      descricao: _ordempagamento.descricao,
      nota_fiscal: _ordempagamento.nota_fiscal,
      recibo: _ordempagamento.recibo,
      parcela: _ordempagamento.parcela,
      id_servico: _ordempagamento.id_servico,
      id_centro_custo: _ordempagamento.id_centro_custo,
      id_fornecedor: _ordempagamento.id_fornecedor,
      valor_parcela: _ordempagamento.valor_parcela,
      valor_total: _ordempagamento.valor_total,
      vencimento: _ordempagamento.vencimento,
      usuario_contratante: _ordempagamento.usuario_contratante,
      inclusao: moment(Date.now()).format('YYYY-MM-DD'),
      usuario_inclusao: usuario.name
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.ordempagamentoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editOrdemPagamento(accessToken: string, _ordempagamento: OrdemPagamento): Observable<any> {
    let usuario: User;
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    if (sessionStorage.getItem('Logado')) {
      usuario = JSON.parse(localStorage.getItem('currentUser'));
    }

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _ordempagamento.id,
      descricao: _ordempagamento.descricao,
      nota_fiscal: _ordempagamento.nota_fiscal,
      recibo: _ordempagamento.recibo,
      parcela: _ordempagamento.parcela,
      id_servico: _ordempagamento.id_servico,
      id_centro_custo: _ordempagamento.id_centro_custo,
      id_fornecedor: _ordempagamento.id_fornecedor,
      valor_parcela: _ordempagamento.valor_parcela,
      valor_total: _ordempagamento.valor_total,
      vencimento: _ordempagamento.vencimento,
      usuario_contratante: _ordempagamento.usuario_contratante,
      alteracao: moment(Date.now()).format('YYYY-MM-DD') ,
      usuario_alteracao: usuario.name
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.ordempagamentoUrl + '/' + _ordempagamento.id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  aprovarOrdemPagamento(accessToken: string, _id: number): Observable<any> {
    let usuario: User;
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    if (sessionStorage.getItem('Logado')) {
      usuario = JSON.parse(localStorage.getItem('currentUser'));
    }

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      aprovacao: moment(Date.now()).format('YYYY-MM-DD') ,
      usuario_aprovacao: usuario.name
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.ordempagamentoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteOrdemPagamento(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.ordempagamentoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getOrdemPagamento(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.ordempagamentoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de ordempagamentos
   *  parametro: acessToken: string
  */
  getOrdemPagamentos(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: OrdemPagamentoFilter) {
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
      .get(this.ordempagamentoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de ordempagamentos
   *  parametro: acessToken: string
  */
 getAprovacaoPagamentos(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: OrdemPagamentoFilter) {
  const listUrl = environment.urlbase + '/api/listaprovacaopagamentos';
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
    .get(listUrl, { headers: headers, search: search })
    .map((res: Response) => res.json())
    .catch((error: any) =>
      Observable.throw(error.json() || 'Server error')
    );
}

  getListOrdemPagamento(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listordempagamentos';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(listUrl, { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }
}
