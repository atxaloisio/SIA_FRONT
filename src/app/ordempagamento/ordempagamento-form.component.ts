import { FornecedorService } from './../fornecedor/fornecedor.service';
import { CentroCustoService } from './../centrocusto/centrocusto.service';
import { CentroCusto } from './../centrocusto/centrocusto';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { OrdemPagamentoService } from './ordempagamento.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { by } from 'protractor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ChangeDetectorRef, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { OrdemPagamento } from './ordempagamento';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { Servico } from '../servico/servico';
import { ServicoService } from '../servico/servico.service';
import { Fornecedor } from '../fornecedor/fornecedor';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { FornecedorFindComponent } from '../fornecedor/fornecedor-find.component';
import { User } from '../user';
import { UserService } from '../user.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-ordempagamento-form',
  templateUrl: './ordempagamento-form.component.html',
  styleUrls: ['./ordempagamento-form.component.css']
})
export class OrdemPagamentoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  ordempagamento: OrdemPagamento;
  ordempagamento_ant: OrdemPagamento;
  servicos: Servico[];
  centrocustos: CentroCusto[];
  usuarios: User[];
  emProcessamento = false;
  exibeIncluir = false;

  valCodigo = new FormControl('', [Validators.required]);
  valDescricao = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  valNotaFiscal = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  valParcela = new FormControl('', [Validators.required]);
  valDtVencimento = new FormControl('', [Validators.required]);
  valCentroCusto = new FormControl('', [Validators.required]);
  valServico = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _ordempagamentoService: OrdemPagamentoService,
    private _servicoService: ServicoService,
    private _centroCustoService: CentroCustoService,
    private _fornecedorService: FornecedorService,
    private _userService: UserService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog) {}

  validaCampos() {
    return (
      this.valDescricao.valid
    );
  }

  ngOnInit() {
    const usuario: User = JSON.parse(localStorage.getItem('currentUser'));
    this.emProcessamento = true;
    this.ordempagamento = new OrdemPagamento();
    this.ordempagamento_ant = new OrdemPagamento();
    this.centrocustos = new Array<CentroCusto>();

    this._servicoService.getListServicos(this._tokenManager.retrieve()).subscribe(
      data => {
        this.servicos = data.json();
      }
    );

    this._centroCustoService.getListCentroCustoUsuario(this._tokenManager.retrieve(), usuario.id).subscribe(
      data2 => {
        this.centrocustos = data2.json();
        // seta como default o centro de custo retornado
        if (this.centrocustos.length === 1) {
          this.ordempagamento.id_centro_custo = this.centrocustos[0].id;
        }
        // console.log(localStorage.getItem('currentUser'));
      }
    );

    this._userService.getListUsers(this._tokenManager.retrieve()).subscribe(
      data3 => {
        this.usuarios = data3.json();
      }
    );

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._ordempagamentoService.getOrdemPagamento(this._tokenManager.retrieve(), id)
        .subscribe( data1 => {
          this.ordempagamento = data1.json();
          this.ordempagamento_ant = data1.json();
          this.emProcessamento = false;
        });
      } else {
        this.emProcessamento = false;
      }
    });

    const idFilter$ = this.valCodigo.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');
    combineLatest(idFilter$)
      .debounceTime(500)
      .distinctUntilChanged()
      .map(([id]) => ({ id }))
      .subscribe(filter => {
        this.buscaFornecedor(filter);
      });
  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    // this.vc.first.nativeElement.focus();
    // Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
  }

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
  }

  btnSalvar_click() {
    this.emProcessamento = true;
    if (this.validaCampos()) {
      if (isNullOrUndefined(this.ordempagamento.id)) {
        this._ordempagamentoService.addOrdemPagamento(
          this._tokenManager.retrieve(),
          this.ordempagamento).subscribe(
            data => {
              this.emProcessamento = false;
              this.ordempagamento = data;
              this.ordempagamento_ant = data;
              this.exibeIncluir = true;
              this.dialog.success('SIA', 'OrdemPagamento salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._ordempagamentoService.editOrdemPagamento(
          this._tokenManager.retrieve(),
          this.ordempagamento).subscribe(
          data => {
          this.emProcessamento = false;
          this.ordempagamento = data;
          this.ordempagamento_ant = data;
          this.exibeIncluir = true;
          this.dialog.success('SIA', 'OrdemPagamento salvo com sucesso.');
        },
        error => {
          this.emProcessamento = false;
          this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
        },
      );
      }
    } else {
      this.emProcessamento = false;
      this.dialog.warning('SIA', 'Campos obrigatórios não preenchidos');
    }
  }

  btnIncluir_click() {
    this.ordempagamento = new OrdemPagamento();
    this.ordempagamento_ant = new OrdemPagamento();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  getErrorMessage(control: FormControl) {
    let mensagem = '';

    if (control.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }

    if (control.hasError('date')) {
      const data = new Date(control.getError('date').value);
      data.setDate(data.getDate() + 1);
      mensagem = mensagem + 'Data informada inferior a ' + data.toLocaleDateString();
    }

    if (control.hasError('date.null')) {
      mensagem = mensagem + control.getError('date.null').value;
    }
    return mensagem;
  }

  validaSaida(event: string) {
    if (event === '') {
      this.ordempagamento.id_fornecedor = null;
      this.ordempagamento.fornecedor = '';
    }
  }

  buscaFornecedor(event: any) {
    let fornecedor: Fornecedor;
    if (event.id) {
      this._fornecedorService
        .getFornecedor(this._tokenManager.retrieve(), Number(event.id))
        .subscribe(
          data => {
            fornecedor = data.json();
            this.ordempagamento.id_fornecedor = fornecedor.id;
            this.ordempagamento.fornecedor = fornecedor.razao_social;
          },
          (err: HttpErrorResponse) => {
            this.ordempagamento.id_fornecedor = null;
            this.ordempagamento.fornecedor = '';
          }
        );
    }
  }

  openPesquisa(): void {
    const dialogLoginRef = this.pesquisa.open(FornecedorFindComponent, {
      width: '900px',
      height: '460px',
      disableClose: true,
      data: {
        id: null,
        razao_social: null
      }
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      if (result.id != null && result.id !== undefined) {
        this.ordempagamento.id_fornecedor = result.id;
        this.ordempagamento.fornecedor = result.razao_social;
      }
    });
  }

  compareServico(s1: Servico, s2: Servico): boolean {
    return s1 && s2 ? s1.id === s2.id : s1 === s2;
  }

  compareCentroCusto(c1: CentroCusto, c2: CentroCusto): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (JSON.stringify(this.ordempagamento) === JSON.stringify(this.ordempagamento_ant)) {
      return true;
    }

    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }

}
