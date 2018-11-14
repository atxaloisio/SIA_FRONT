import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ContratanteService } from './contratante.service';
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
import { Contratante } from './contratante';
import { ActivatedRoute, Params} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-contratante-form',
  templateUrl: './contratante-form.component.html',
  styleUrls: ['./contratante-form.component.css']
})
export class ContratanteFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  contratante: Contratante;
  contratante_ant: Contratante;
  emProcessamento = false;
  exibeIncluir = false;

  valDescricao = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;

  constructor(private _contratanteService: ContratanteService,
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
    this.contratante = new Contratante();
    this.contratante_ant = new Contratante();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._contratanteService.getContratante(this._tokenManager.retrieve(), id)
        .subscribe( data => {
          this.contratante = data.json();
          this.contratante_ant = data.json();
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
      if (isNullOrUndefined(this.contratante.id)) {
        this._contratanteService.addContratante(
          this._tokenManager.retrieve(),
          this.contratante.descricao).subscribe(
            data => {
              this.emProcessamento = false;
              this.contratante = data;
              this.contratante_ant = data;
              this.exibeIncluir = true;
              this.dialog.success('SIA', 'Contratante salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            },
          );
      } else {
        this._contratanteService.editContratante(
          this._tokenManager.retrieve(),
          this.contratante.id,
          this.contratante.descricao).subscribe(
          data => {
          this.emProcessamento = false;
          this.contratante = data;
          this.contratante_ant = data;
          this.exibeIncluir = true;
          this.dialog.success('SIA', 'Contratante salvo com sucesso.');
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
    this.contratante = new Contratante();
    this.contratante_ant = new Contratante();
  }

  getDescricaoErrorMessage() {
    let mensagem = '';

    if (this.valDescricao.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (JSON.stringify(this.contratante) === JSON.stringify(this.contratante_ant)) {
      return true;
    }

    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }

}
