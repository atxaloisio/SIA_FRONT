import { Fornecedor } from './../fornecedor/fornecedor';
import { OrdemPagamento } from './../ordempagamento/ordempagamento';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class RelatorioService {

  private ordempagamentos: OrdemPagamento[];
  private _fornecedores: Fornecedor[];


  public setOrdemPagamentos(_ordempagamentos: OrdemPagamento[]) {
    this.ordempagamentos = new Array<OrdemPagamento>();
    this.ordempagamentos.length = 0;
    this.ordempagamentos = _ordempagamentos;
  }

  public getOrdemPagamentos(): OrdemPagamento[] {
    return this.ordempagamentos;
  }

  public get Fornecedores(): Fornecedor[] {
    return this._fornecedores;
  }
  public set Fornecedores(value: Fornecedor[]) {
    this._fornecedores = value;
  }

  constructor() {}

}
