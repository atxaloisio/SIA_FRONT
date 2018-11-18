import { TipoAtividadeEnum } from './../tipoatividade/tipoatividade.enum';
import { TipoAtividadeService } from './../tipoatividade/tipoatividade.service';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { PerfilService } from './perfil.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, Input } from '@angular/core';
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
import { Perfil } from '../perfil/perfil';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators, NgForm} from '@angular/forms';
import { booleanToStrSN, strToBoolean } from '../utilitario/utilitarios';

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.css']
})
export class PerfilFormComponent implements OnInit, AfterViewInit, AfterViewChecked {
  perfil: Perfil;
  perfil_ant: Perfil;
  emProcessamento = false;
  exibeIncluir = false;
  _cadastros = false;
  _desabilitacad = false;
  cadastros_indeterminado = false;
  _processos = false;
  _desabilitaproc = false;
  processos_indeterminado = false;
  _relatorios = false;
  _desabilitarel = false;
  relatorios_indeterminado = false;
  _aclcontrol = false;
  _desabilitaacl = false;
  aclcontrol_indeterminado = false;

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('perfilForm') public form: NgForm;

  //#region Campos cadastro
  @Input('servico')
  set servico(servico: boolean) {
    this.perfil.cadastros_servico = booleanToStrSN(servico);
    if (! this._desabilitacad) {
      this.marcaCadastro();
    }
  }
  get servico(): boolean {
    return strToBoolean(this.perfil.cadastros_servico);
  }

  @Input('fornecedor')
  set fornecedor(fornecedor: boolean) {
    this.perfil.cadastros_fornecedor = booleanToStrSN(fornecedor);
    if (! this._desabilitacad) {
      this.marcaCadastro();
    }
  }
  get fornecedor(): boolean {
    return strToBoolean(this.perfil.cadastros_fornecedor);
  }

  @Input('funcao')
  set funcao(funcao: boolean) {
    this.perfil.cadastros_funcao = booleanToStrSN(funcao);
    if (! this._desabilitacad) {
      this.marcaCadastro();
    }
  }
  get funcao(): boolean {
    return strToBoolean(this.perfil.cadastros_funcao);
  }

  @Input('centro_custo')
  set centro_custo(centro_custo: boolean) {
    this.perfil.cadastros_centro_custo = booleanToStrSN(centro_custo);
    if (! this._desabilitacad) {
      this.marcaCadastro();
    }
  }
  get centro_custo(): boolean {
    return strToBoolean(this.perfil.cadastros_centro_custo);
  }

  //#endregion

  //#region Campos Processos
  @Input('ordem_pagamento')
  set ordem_pagamento(ordem_pagamento: boolean) {
    this.perfil.processos_ordem_pagamento = booleanToStrSN(ordem_pagamento);
    if (! this._desabilitaproc) {
      this.marcaProcesso();
    }
  }
  get ordem_pagamento(): boolean {
    return strToBoolean(this.perfil.processos_ordem_pagamento);
  }

  @Input('aprovacao_pagamento')
  set aprovacao_pagamento(aprovacao_pagamento: boolean) {
    this.perfil.processos_aprovacao_pagamento = booleanToStrSN(aprovacao_pagamento);
    if (! this._desabilitaproc) {
      this.marcaProcesso();
    }
  }
  get aprovacao_pagamento(): boolean {
    return strToBoolean(this.perfil.processos_aprovacao_pagamento);
  }

  //#endregion

  @Input('cadastros')
  set cadastros(cadastros: boolean) {
    if (! this._desabilitacad) {
      this._cadastros = cadastros;
      this._desabilitacad = true;
      if (cadastros) {
        this.cadastros_indeterminado = false;
        this.servico = true;
        this.fornecedor = true;
        this.funcao = true;
        this.centro_custo = true;
        this.perfil.cadastros = booleanToStrSN(true);
      } else {
        this.cadastros_indeterminado = false;
        this.servico = false;
        this.fornecedor = false;
        this.funcao = false;
        this.centro_custo = false;
        this.perfil.cadastros = booleanToStrSN(false);
      }
      this._desabilitacad = false;
    }
  }
  get cadastros(): boolean {
    return this._cadastros;
  }

  @Input('processos')
  set processos(processos: boolean) {
    if (! this._desabilitaproc) {
      this._processos = processos;
      this._desabilitaproc = true;
      if (processos) {
        this.processos_indeterminado = false;
        this.ordem_pagamento = true;
        this.aprovacao_pagamento = true;
        this.perfil.processos = booleanToStrSN(true);
      } else {
        this.processos_indeterminado = false;
        this.ordem_pagamento = false;
        this.aprovacao_pagamento = false;
        this.perfil.processos = booleanToStrSN(false);
      }
      this._desabilitaproc = false;
    }
  }
  get processos(): boolean {
    return this._processos;
  }

  constructor(private _perfilService: PerfilService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService) {}

  validaCampos(form: NgForm) {
    return (
      form.form.valid
    );
  }

  marcaCadastro() {
    if (this.servico &&
      this.fornecedor &&
      this.centro_custo &&
      this.funcao) {
      this.cadastros = true;
      this.perfil.cadastros = booleanToStrSN(true);
      this.cadastros_indeterminado = false;
    } else {
      if ((this.servico ||
        this.fornecedor ||
        this.centro_custo ||
        this.funcao) && (!this.cadastros_indeterminado)) {
        this.cadastros_indeterminado = true;
        this.perfil.cadastros = booleanToStrSN(true);
      } else {
        if (!this.servico && !this.fornecedor && !this.funcao && !this.centro_custo) {
          this.cadastros = false;
          this.cadastros_indeterminado = false;
          this.perfil.cadastros = booleanToStrSN(false);
        }
      }
    }
  }

  marcaProcesso() {
    if (this.ordem_pagamento &&
      this.aprovacao_pagamento) {
      this.processos = true;
      this.perfil.processos = booleanToStrSN(true);
      this.processos_indeterminado = false;
    } else {
      if ((this.ordem_pagamento ||
        this.aprovacao_pagamento) && (!this.processos_indeterminado)) {
        this.processos_indeterminado = true;
        this.perfil.processos = booleanToStrSN(true);
      } else {
        if (!this.ordem_pagamento && !this.aprovacao_pagamento) {
          this.processos = false;
          this.processos_indeterminado = false;
          this.perfil.processos = booleanToStrSN(false);
        }
      }
    }
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.perfil = new Perfil();
    this.perfil_ant = new Perfil();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._perfilService.getPerfil(this._tokenManager.retrieve(), id)
        .retry(3)
        .subscribe( dt => {
          this.perfil = dt.json();
          this.perfil_ant = dt.json();
          // console.log(1);
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
      if (isNullOrUndefined(this.perfil.id)) {
        this._perfilService.addPerfil(
          this._tokenManager.retrieve(),
          this.perfil).subscribe(
            data => {
              this.emProcessamento = false;
              this.perfil = data;
              this.perfil_ant = data;
              this.exibeIncluir = true;
              form.resetForm();
              this.dialog.success('SIA', 'Perfil salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._perfilService.editPerfil(
          this._tokenManager.retrieve(),
          this.perfil.id,
          this.perfil).subscribe(
          data => {
          this.emProcessamento = false;
          this.perfil = data;
          this.perfil_ant = data;
          this.exibeIncluir = true;
          form.resetForm();
          this.dialog.success('SIA', 'Perfil salvo com sucesso.');
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
    this.perfil = new Perfil();
    this.perfil_ant = new Perfil();
    // form.form.reset();
    // form.controls['descricao'].reset('');
    form.controls['descricao'].clearValidators();
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

    if (JSON.stringify(this.perfil) === JSON.stringify(this.perfil_ant)) {
      return true;
    }
    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }

}
