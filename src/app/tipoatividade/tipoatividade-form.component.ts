import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { TipoAtividadeService } from './tipoatividade.service';
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
import { TipoAtividade } from './tipoatividade';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-tipoatividade-form',
  templateUrl: './tipoatividade-form.component.html',
  styleUrls: ['./tipoatividade-form.component.css']
})
export class TipoAtividadeFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  tipoatividade: TipoAtividade;
  tipoatividade_ant: TipoAtividade;
  emProcessamento = false;
  exibeIncluir = false;

  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _tipoatividadeService: TipoAtividadeService,
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
    this.tipoatividade = new TipoAtividade();
    this.tipoatividade_ant = new TipoAtividade();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._tipoatividadeService.getTipoAtividade(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.tipoatividade = JSON.parse(data._body);
          this.tipoatividade_ant = JSON.parse(data._body);
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
    Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
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
      if (isNullOrUndefined(this.tipoatividade.id)) {
        this._tipoatividadeService.addTipoAtividade(
          this._tokenManager.retrieve(),
          this.tipoatividade.descricao).subscribe(
            data => {
              this.emProcessamento = false;
              this.tipoatividade = data;
              this.tipoatividade_ant = data;
              this.exibeIncluir = true;
              this.dialog.success('SGR', 'TipoAtividade salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._tipoatividadeService.editTipoAtividade(
          this._tokenManager.retrieve(),
          this.tipoatividade.id,
          this.tipoatividade.descricao).subscribe(
          data => {
          this.emProcessamento = false;
          this.tipoatividade = data;
          this.tipoatividade_ant = data;
          this.exibeIncluir = true;
          this.dialog.success('SGR', 'TipoAtividade salvo com sucesso.');
        },
        error => {
          this.emProcessamento = false;
          this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
        },
      );
      }
    } else {
      this.emProcessamento = false;
      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos');
    }
  }

  btnIncluir_click() {
    this.tipoatividade = new TipoAtividade();
    this.tipoatividade_ant = new TipoAtividade();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (JSON.stringify(this.tipoatividade) === JSON.stringify(this.tipoatividade_ant)) {
      return true;
    }

    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }

}

