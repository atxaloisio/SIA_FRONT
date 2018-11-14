import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { CentroCustoService } from './centrocusto.service';
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
import { CentroCusto } from './centrocusto';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { OmieService } from '../omie/omie.service';
import { Categoria } from '../omie/categoria';
import { ContaCorrente } from '../omie/contacorrente';

@Component({
  selector: 'app-centrocusto-form',
  templateUrl: './centrocusto-form.component.html',
  styleUrls: ['./centrocusto-form.component.css']
})
export class CentroCustoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  centrocusto: CentroCusto;
  centrocusto_ant: CentroCusto;
  emProcessamento = false;
  exibeIncluir = false;
  categorias: Categoria[];
  contacorrentes: ContaCorrente[];

  valDescricao = new FormControl('', [Validators.required]);
  valCategoria = new FormControl();
  valContaCorrente = new FormControl();

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _centrocustoService: CentroCustoService,
    private _omieService: OmieService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService) {}

  validaCampos() {
    return (
      this.valDescricao.valid
    );
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.centrocusto = new CentroCusto();
    this.centrocusto_ant = new CentroCusto();

    this._omieService.getListCategorias(this._tokenManager.retrieve()).subscribe(
      data => {
        this.categorias = data.json();
      }
    );

    this._omieService.getListContaCorrente(this._tokenManager.retrieve()).subscribe(
      data => {
        this.contacorrentes = data.json();
      }
    );

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._centrocustoService.getCentroCusto(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.centrocusto = data.json();
          this.centrocusto_ant = data.json();
          this.emProcessamento = false;
        });
      } else {
        this.emProcessamento = false;
      }
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
      if (isNullOrUndefined(this.centrocusto.id)) {
        this._centrocustoService.addCentroCusto(
          this._tokenManager.retrieve(),
          this.centrocusto).subscribe(
            data => {
              this.emProcessamento = false;
              this.centrocusto = data;
              this.centrocusto_ant = data;
              this.exibeIncluir = true;
              this.dialog.success('SIA', 'Centro de Custo salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._centrocustoService.editCentroCusto(
          this._tokenManager.retrieve(),
          this.centrocusto).subscribe(
          data => {
          this.emProcessamento = false;
          this.centrocusto = data;
          this.centrocusto_ant = data;
          this.exibeIncluir = true;
          this.dialog.success('SIA', 'Centro de Custo salvo com sucesso.');
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
    this.centrocusto = new CentroCusto();
    this.centrocusto_ant = new CentroCusto();
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

  limpaValidadores() {

  }

  canDeactivate(): Observable<boolean> | boolean {

    if (JSON.stringify(this.centrocusto) === JSON.stringify(this.centrocusto_ant)) {
      return true;
    }

    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }

}
