import { TipoAtividadeService } from './../tipoatividade/tipoatividade.service';
import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsServico } from './dsservico';
import { TokenManagerService } from './../token-manager.service';
import { ServicoService } from './servico.service';
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
import { Servico } from './servico';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { TipoAtividade } from '../tipoatividade/tipoatividade';

@Component({
  selector: 'app-servico',
  templateUrl: './servico-list.component.html',
  styleUrls: ['./servico-list.component.css']
})
export class ServicoListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'descricao', 'tipo_atividade'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsServico | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  servicos: Servico[];
  tipoatividades: TipoAtividade[];
  isLoadingResults: boolean;


  idFilter = new FormControl();
  descricaoFilter = new FormControl();
  tipoatividadeFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _servicoService: ServicoService,
              private _tipoatividadeService: TipoAtividadeService,
              private _tokenManager: TokenManagerService,
              private dialog: DialogService,
              private _router: Router) {}

  obterServicos() {
    // const token = this._tokenManager.retrieve();
    // this._servicoService.getServicos(token).subscribe(data => {
    //   this.servicos = data.data;
    //   console.log(data);
    //   console.log(this.servicos.length);
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
    this._router.navigate(['/servicos/servico', {id: row.id}]);
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
      this.dialog.warning('SGR', 'Nenhum registro selecionado na grade.');
      return false;
    } else {
      return true;
    }
  }

  incluirRegistro() {
    this._router.navigate(['/servicos/servico']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/servicos/servico', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SGR', 'Deseja realmente excluir o servico: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._servicoService.deleteServico(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SGR', 'Servico excluído com sucesso.');
                this.ngOnInit();
              },
              error => {
                this.dialog.error('SGR', 'Erro ao excluir o registro.', error.error + ' - Detalhe: ' + error.message);
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

    this._tipoatividadeService.getListTipoAtividades(this._tokenManager.retrieve())
      .subscribe(data => {
        this.tipoatividades = JSON.parse(data._body);
    });

    this.dataSource = new DsServico(this._tokenManager, this._servicoService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const descricaoFilter$ = this.descricaoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const tipoatividadeFilter$ = this.tipoatividadeFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(idFilter$, descricaoFilter$, tipoatividadeFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, descricao, tipo_atividade ]) => ({id, descricao, tipo_atividade})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }
}

