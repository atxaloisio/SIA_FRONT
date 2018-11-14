import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsUsuarioEmpresa } from './dsusuarioempresa';
import { TokenManagerService } from './../token-manager.service';
import { UsuarioEmpresaService } from './usuarioempresa.service';
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
import { UsuarioEmpresa } from './usuarioempresa';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-usuarioempresa',
  templateUrl: './usuarioempresa-list.component.html',
  styleUrls: ['./usuarioempresa-list.component.css']
})
export class UsuarioEmpresaListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['select', 'centro_custo'];
  // displayedColumns = ['select', 'id', 'id_centro_custo', 'centro_custo'];
  // displayedColumns = ['id ', 'codigo', 'descricao'];
  dataSource: DsUsuarioEmpresa | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  usuarioempresas: UsuarioEmpresa[];
  usuarios: User[];
  isLoadingResults: boolean;
  selection = new SelectionModel<UsuarioEmpresa>(true, []);


  idFilter = new FormControl();
  descricaoFilter = new FormControl();
  usuarioFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private _usuarioempresaService: UsuarioEmpresaService,
              private _tokenManager: TokenManagerService,
              private _userService: UserService,
              private dialog: DialogService,
              private _router: Router) {}

  obterUsuarioEmpresas() {
    // const token = this._tokenManager.retrieve();
    // this._usuarioempresaService.getUsuarioEmpresas(token).subscribe(data => {
    //   this.usuarioempresas = data.data;
    //   console.log(data);
    //   console.log(this.usuarioempresas.length);
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
    // this._router.navigate(['/usuarioempresas/usuarioempresa', {id: row.id}]);
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

  btnSalvar_click() {
    this.salvarRegistro();
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
    this._router.navigate(['/usuarioempresas/usuarioempresa']);
  }


  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/usuarioempresas/usuarioempresa', {id: this.selectedRow.id}]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    this.dialog.question('SIA', 'Deseja realmente remover as associações de centro de custo com o usuario selecionado?').subscribe(
      result => {
        if (result.retorno) {
          this._usuarioempresaService.deleteUsuarioEmpresa(this._tokenManager.retrieve(), this.usuarioFilter.value).subscribe(
            data => {
              this.dialog.success('SIA', 'Associações de centro de custo removidas com sucesso.');
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
    // if (this.validaSelecao()) {

    // }
  }

  salvarRegistro() {
    if (this.selection.selected.length > 0) {
      this._usuarioempresaService.saveAllUsuarioEmpresa(this._tokenManager.retrieve(),
        this.usuarioFilter.value, this.selection.selected).subscribe(
          data => {
            this.dialog.success('SIA', 'Empresa associada ao usuário com sucesso.');
            this.dataSource.filter.id_usuario = this.usuarioFilter.value;
            this.dataSource.connect();
          },
          error => {
            this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
          },
        );
    } else {
      if (this.dataSource.data.length > 0) {
        this.excluirRegistro();
      }
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

    this._userService.getListUsers(this._tokenManager.retrieve()).subscribe(
      data => {
        this.usuarios = data.json();
      }
    );

    this.isLoadingResults = false;

    this.dataSource = new DsUsuarioEmpresa(this._tokenManager, this._usuarioempresaService, this.paginator, this.sort);

    const idFilter$ = this.idFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const descricaoFilter$ = this.descricaoFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    const usuarioFilters$ = this.usuarioFilter.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');

    Observable.combineLatest(idFilter$, descricaoFilter$, usuarioFilters$).debounceTime(500).distinctUntilChanged().
    map(
      ([id, descricao, id_usuario ]) => ({id, descricao, id_usuario})).subscribe(filter => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = filter;
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    if (this.isAllSelected()) {
      this.selection.clear();
      this.dataSource.data.forEach(row => {
        row.selecionado = false;
      });
    } else {
      this.dataSource.data.forEach(row => {
        row.selecionado = true;
        this.selection.select(row);
      });
    }

    // this.isAllSelected() ?
    //     this.selection.clear() :
    //     this.dataSource.data.forEach(row => {
    //       row.selecionado = true;
    //       this.selection.select(row);
    //     }
    //       );
  }
}

