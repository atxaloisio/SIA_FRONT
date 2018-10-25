import { Router } from '@angular/router';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
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
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DsFiltroListagemOrdemPagamento } from './dsfiltrolistagemordempagamento';
import { OrdemPagamento } from '../../ordempagamento/ordempagamento';
import { OrdemPagamentoService } from '../../ordempagamento/ordempagamento.service';
import { TokenManagerService } from '../../token-manager.service';
import { RelatorioService } from '../relatorio.service';
import { DialogService } from '../../dialog/dialog.service';

@Component({
  selector: 'app-filtrolistagemordempagamento',
  templateUrl: './filtrolistagemordempagamento-list.component.html',
  styleUrls: ['./filtrolistagemordempagamento-list.component.css']
})
export class FiltroListagemOrdemPagamentoListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'descricao', 'servico', 'centrocusto', 'fornecedor', 'contratante', 'vencimento', 'valor_total'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsFiltroListagemOrdemPagamento | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  ordempagamentos: OrdemPagamento[];
  isLoadingResults: boolean;
  selection = new SelectionModel<OrdemPagamento>(true, []);


  idFilter = new FormControl();
  descricaoFilter = new FormControl();
  servicoFilter = new FormControl();
  centrocustoFilter = new FormControl();
  fornecedorFilter = new FormControl();
  contratanteFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _ordempagamentoService: OrdemPagamentoService,
              private _tokenManager: TokenManagerService,
              public _relatorioService: RelatorioService,
              private dialog: DialogService,
              private _router: Router) {}

  obterOrdemPagamentos() {
    // const token = this._tokenManager.retrieve();
    // this._ordempagamentoService.getOrdemPagamentos(token).subscribe(data => {
    //   this.ordempagamentos = data.data;
    //   console.log(data);
    //   console.log(this.ordempagamentos.length);
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
    this._router.navigate(['/ordempagamentos/ordempagamento', {id: row.id}]);
  }


  //#region botões de ação
  btnEditar_click() {
    this.editarRegistro();
  }

  btnAprovar_click() {
    this.aprovarRegistro();
  }

  btnReprovar_click() {
    this.reprovarRegistro();
  }

  btnIncluir_click() {
    this.incluirRegistro();
  }

  btnExcluir_click() {
    this.excluirRegistro();
  }

  btnFiltrar_click() {
    this.filtrarRegistro();
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
    this._router.navigate(['/ordempagamentos/ordempagamento']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/ordempagamentos/ordempagamento', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  filtrarRegistro() {
    if (this.dataSource.data.length > 0) {
      this._relatorioService.setOrdemPagamentos(this.dataSource.data);
      this._router.navigate(['/relatorios/listagemordempagamento']);
    }
  }

  aprovarRegistro() {
    if (this.selection.selected.length > 0) {
      let msg = '';
      this.selection.selected.length > 1 ?
      msg = 'Deseja realmente Aprovar as ordens pagamento selecionadas?' :
      msg = 'Deseja realmente Aprovar a ordem pagamento selecionada?';
      this.dialog.question('SIA', msg).subscribe(
        result => {
          if (result.retorno) {
            this._ordempagamentoService.aprovarOrdemPagamento(this._tokenManager.retrieve(), this.selection.selected).subscribe(
              data => {
                this.dialog.success('SIA', 'Ordem Pagamento Aprovada com sucesso.');
                this.ngOnInit();
              },
              error => {
                this.dialog.error('SIA', 'Erro ao Aprovar a Ordem de Pagamento.', error.error + ' - Detalhe: ' + error.message);
              },
            );
            this.selectedRowIndex = -1;
            this.selectedRow = null;
          }
        }
      );
    }
  }

  reprovarRegistro() {
    if (this.selection.selected.length > 0) {
      let msg = '';
      this.selection.selected.length > 1 ?
      msg = 'Deseja realmente Reprovar as ordens pagamento selecionadas?' :
      msg = 'Deseja realmente Reprovar a ordem pagamento selecionada?';
      this.dialog.question('SIA', msg).subscribe(
        result => {
          if (result.retorno) {
            this._ordempagamentoService.reprovarOrdemPagamento(this._tokenManager.retrieve(), this.selection.selected).subscribe(
              data => {
                this.dialog.success('SIA', 'Ordem Pagamento Reprovada com sucesso.');
                this.ngOnInit();
              },
              error => {
                this.dialog.error('SIA', 'Erro ao Reprovar a Ordem de Pagamento.', error.error + ' - Detalhe: ' + error.message);
              },
            );
            this.selectedRowIndex = -1;
            this.selectedRow = null;
          }
        }
      );
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog.question('SIA', 'Deseja realmente excluir o ordempagamento: ' + this.selectedRow.id + '?').subscribe(
        result => {
          if (result.retorno) {
            this._ordempagamentoService.deleteOrdemPagamento(this._tokenManager.retrieve(), this.selectedRow.id).subscribe(
              data => {
                this.dialog.success('SIA', 'OrdemPagamento excluído com sucesso.');
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

    this.dataSource = new DsFiltroListagemOrdemPagamento(this._tokenManager, this._ordempagamentoService, this.paginator, this.sort);
    this.selection.clear();
    this.dataSource.data = new Array<OrdemPagamento>();

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const descricaoFilter$ = this.descricaoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const servicoFilter$ = this.servicoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const centrocustoFilter$ = this.centrocustoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const fornecedorFilter$ = this.fornecedorFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const contratanteFilter$ = this.contratanteFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');


    Observable.combineLatest(idFilter$, descricaoFilter$, servicoFilter$,
      centrocustoFilter$, fornecedorFilter$, contratanteFilter$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, descricao, servico, centrocusto, fornecedor, contratante]) =>
      ({id, descricao, servico, centrocusto, fornecedor, contratante})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
}

