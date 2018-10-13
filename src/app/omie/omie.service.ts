import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Categoria, CategoriaRequest } from './categoria';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class OmieService {
  private omieUrl = 'http://localhost:4200/api/v1/geral/categorias';

  constructor(private _http: Http) {}

  getListCategorias(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listcategorias';
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

  getListContaCorrente(accessToken: string)  {
    const listUrl = environment.urlbase + '/api/listcontacorrente';
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

  getListEmpresas()  {
    const listUrl = environment.urlbase + '/api/listempresas';
    // const headers = new Headers({
    //   Accept: 'application/json',
    //   Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    // });

    const headers = new Headers({
      Accept: 'application/json'
    });

    return this._http
      .get(listUrl, { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) =>
        Observable.throw(error.json() || 'Server error')
      );
  }

}
