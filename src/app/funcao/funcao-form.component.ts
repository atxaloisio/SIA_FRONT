import { TipoAtividadeEnum } from './../tipoatividade/tipoatividade.enum';
import { TipoAtividadeService } from './../tipoatividade/tipoatividade.service';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { FuncaoService } from './funcao.service';
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
import { Funcao } from './funcao';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators, NgForm} from '@angular/forms';

@Component({
  selector: 'app-funcao-form',
  templateUrl: './funcao-form.component.html',
  styleUrls: ['./funcao-form.component.css']
})
export class FuncaoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  funcao: Funcao;
  funcao_ant: Funcao;
  emProcessamento = false;
  exibeIncluir = false;

  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('funcaoForm') public form: NgForm;

  constructor(private _funcaoService: FuncaoService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService) {}

  validaCampos(form: NgForm) {
    return (
      form.form.valid
    );
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.funcao = new Funcao();
    this.funcao_ant = new Funcao();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._funcaoService.getFuncao(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.funcao = data.json();
          this.funcao_ant = data.json();
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

  btnSalvar_click(form: NgForm) {
    this.emProcessamento = true;
    if (this.validaCampos(form)) {
      if (isNullOrUndefined(this.funcao.id)) {
        this._funcaoService.addFuncao(
          this._tokenManager.retrieve(),
          this.funcao.descricao).subscribe(
            data => {
              this.emProcessamento = false;
              this.funcao = data;
              this.funcao_ant = data;
              this.exibeIncluir = true;
              form.form.clearValidators();
              this.dialog.success('SIA', 'Funcao salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._funcaoService.editFuncao(
          this._tokenManager.retrieve(),
          this.funcao.id,
          this.funcao.descricao).subscribe(
          data => {
          this.emProcessamento = false;
          this.funcao = data;
          this.funcao_ant = data;
          this.exibeIncluir = true;
          form.form.clearValidators();
          this.dialog.success('SIA', 'Funcao salvo com sucesso.');
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

  btnIncluir_click(form: NgForm) {
    this.funcao = new Funcao();
    this.funcao_ant = new Funcao();
    form.form.clearValidators();
    document.getElementById('descricao').focus();
  }

  getDescricaoErrorMessage(control: any) {
    let mensagem = '';

    if (control.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (JSON.stringify(this.funcao) === JSON.stringify(this.funcao_ant)) {
      return true;
    }

    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }

}
