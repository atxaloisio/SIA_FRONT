import { TokenManagerService } from './../token-manager.service';
import { ContratanteService } from './contratante.service';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { DataSource} from '@angular/cdk/collections';
import { MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { Contratante, ContratanteFilter } from './contratante';
import { merge } from 'rxjs';

export class DsContratante extends DataSource<Contratante> {
  _filterChange = new BehaviorSubject( {id: '', descricao: ''} );

  public onChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  get filter(): ContratanteFilter {
    return this._filterChange.value;
  }

  set filter(filter: ContratanteFilter) {
    this._filterChange.next(filter);
  }

  resultsLength = 0;
  // isLoadingResults: boolean;

  paginaInicial: number;
  paginaAtual: number;
  paginaFinal: number;
  registroDe: number;
  registroAte: number;
  nrRegistros: number;

  constructor(private _tokenManager: TokenManagerService,
              private _contratanteService: ContratanteService,
              private _paginator: MatPaginator,
              private _sort: MatSort) {
    super();
    this.onChange.emit(false);
  }
  connect(): Observable<Contratante[]> {
    const displayDataChanges = [
      this._sort.sortChange,
      this._paginator.page,
      this._filterChange,
    ];
    this._sort.sortChange.subscribe(() => this._paginator.pageIndex = 0);

    return merge(...displayDataChanges)
    .startWith(null)
    .switchMap(() => {
      // this.isLoadingResults = true;
      this.onChange.emit(true);
      return this._contratanteService.getContratantes(this._tokenManager.retrieve(),
        this._sort.active, this._sort.direction, this._paginator.pageIndex, this._paginator.pageSize, this.filter);
    })
    .retry(3)
    .map(data => {
      // Flip flag to show that loading has finished.
      // this.isLoadingResults = false;
      this.onChange.emit(false);
      this.paginaInicial = 1;
      this.paginaFinal = data.meta.last_page;
      this.registroDe = data.meta.from;
      this.registroAte = data.meta.to;
      this.nrRegistros = data.meta.total;
      return data.data;
    })
    .catch(err => {
      console.log(err);
      return Observable.of([]);
    });
  }
  disconnect(): void {

  }
}
