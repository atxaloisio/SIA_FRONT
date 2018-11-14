import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsFuncao } from './dsfuncao';
import { TokenManagerService } from './../token-manager.service';
import { FuncaoService } from './funcao.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { Funcao } from './funcao';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-funcao',
  templateUrl: './funcao-list.component.html',
  styleUrls: ['./funcao-list.component.css']
})
export class FuncaoListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'descricao'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsFuncao | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  funcaos: Funcao[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  descricaoFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _funcaoService: FuncaoService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router) {}

  obterFuncaos() {
    // const token = this._tokenManager.retrieve();
    // this._funcaoService.getFuncaos(token).subscribe(data => {
    //   this.funcaos = data.data;
    //   console.log(data);
    //   console.log(this.funcaos.length);
    //   console.log(token);
    // });
  }

  highlight(row) {
    if (this.selectedRowIndex === row.id) {
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    } else {
      this.selectedRowIndex = row.id;
      this.selectedRow = row;
    }
  }

  dblck(row) {
    this._router.navigate(['/funcoes/funcao', {id: row.id}]);
  }


  //#region botões de ação
  btnEditar_click() {
    this.editarRegistro();
  }

  btnIncluir_click() {
    this.incluirRegistro();
  }

  btnExcluir_click() {
    this.excluirRegistro();
  }
  //#endregion

 /**
  * Metodo que verifica se existe registro selecionado na grid.
 */
  validaSelecao(): boolean {
    if (this.selectedRowIndex === -1) {
      this.dialog.warning('SIA', 'Nenhum registro selecionado na grade.');
      return false;
    } else {
      return true;
    }
  }

  incluirRegistro() {
    this._router.navigate(['/funcoes/funcao']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/funcoes/funcao', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SIA', 'Deseja realmente excluir o funcao: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._funcaoService.deleteFuncao(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SIA', 'Funcao excluído com sucesso.');
                this.ngOnInit();
              },
              error => {
                this.dialog.error('SIA', 'Erro ao excluir o registro.', error.error + ' - Detalhe: ' + error.message);
              },
            );
            this.selectedRowIndex = -1;
            this.selectedRow = null;
          }
        }
      );
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.onChange.subscribe({next: (event: boolean) => {
      this.isLoadingResults = event;
      // console.log('estatus do datasource: ' + event);
    }});
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Itens por pagina';
    this.paginator._intl.nextPageLabel = 'Próxima Página';
    this.paginator._intl.previousPageLabel = 'Voltar Página';

    this.isLoadingResults = false;

    this.dataSource = new DsFuncao(this._tokenManager, this._funcaoService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const descricaoFilter$ = this.descricaoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    combineLatest(idFilter$, descricaoFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, descricao ]) => ({id, descricao})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }
}

