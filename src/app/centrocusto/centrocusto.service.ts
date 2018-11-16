import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { CentroCusto, CentroCustoFilter } from './centrocusto';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class CentroCustoService {
  private centrocustoUrl = environment.urlbase + '/api/centrocustos';

  constructor(private _http: Http) {}

  addCentroCusto(accessToken: string, _CentroCusto: CentroCusto): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      descricao: _CentroCusto.descricao,
      id_categoria: _CentroCusto.id_categoria,
      id_conta_corrente: _CentroCusto.id_conta_corrente
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.centrocustoUrl, _body, { headers: headers})
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  editCentroCusto(accessToken: string, _CentroCusto: CentroCusto): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _CentroCusto.id,
      descricao: _CentroCusto.descricao,
      id_categoria: _CentroCusto.id_categoria,
      id_conta_corrente: _CentroCusto.id_conta_corrente
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.centrocustoUrl + '/' + _CentroCusto.id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );

  }

  deleteCentroCusto(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.centrocustoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getCentroCusto(accessToken: string, _id: number)  {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.centrocustoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  /** Metodo que retorna um observable com dados da listagem de centrocustos
   *  parametro: acessToken: string
  */
  getCentroCustos(accessToken: string, sort: string, order: string, page: number, pagesize: number, filter: CentroCustoFilter) {
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
      .get(this.centrocustoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

  getListCentroCusto(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listcentrocustos';
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

  getListCentroCustoUsuario(accessToken: string, _id: number)  {
    const listUrl = environment.urlbase + '/api/listcentrocustosuser';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(listUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }
}
