import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { UsuarioCentroCusto, UsuarioCentroCustoFilter } from './usuariocentrocusto';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class UsuarioCentroCustoService {
  private usuariocentrocustoUrl = environment.urlbase + '/api/usuariocentrocustos';

  constructor(private _http: Http) {}

  addUsuarioCentroCusto(accessToken: string, _descricao: string): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = { descricao: _descricao };
    // _params.set('codigo', '1');

    return this._http
      .post(this.usuariocentrocustoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  saveAllUsuarioCentroCusto(accessToken: string, _id_usuario: number,  _usuariocentrocustos: UsuarioCentroCusto[]): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id_usuario,
      data: _usuariocentrocustos };
    // _params.set('codigo', '1');

    return this._http
      .post(this.usuariocentrocustoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editUsuarioCentroCusto(accessToken: string, _id: number, _descricao: string): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {id: _id, descricao: _descricao };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.usuariocentrocustoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteUsuarioCentroCusto(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.usuariocentrocustoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getUsuarioCentroCusto(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.usuariocentrocustoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de usuariocentrocustos
   *  parametro: acessToken: string
  */
  getUsuarioCentroCustos(accessToken: string, sort: string, order: string, page: number, pagesize: number,
    filter: UsuarioCentroCustoFilter) {
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

    if ((!isNullOrUndefined(filter.id_usuario)) && (filter.id_usuario.toString().length > 0)) {
      search.set('id_usuario', filter.id_usuario.toString());
    }

    // search.set('id_usuario', '1');

    return this._http
      .get(this.usuariocentrocustoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListUsuarioCentroCusto(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listusuariocentrocustos';
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
