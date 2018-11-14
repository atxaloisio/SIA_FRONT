import { EnderecoService } from './../endereco.service';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { FornecedorService } from './fornecedor.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, Renderer } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router';
import { by } from 'protractor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ChangeDetectorRef, ViewChildren, ViewChild, ElementRef, Input } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { Fornecedor, FornecedorFiltro } from './fornecedor';
import { ActivatedRoute, Params} from '@angular/router';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Estado, Cidade } from './../endereco';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { environment } from '../../environments/environment';
import { booleanToStrSN, strToBoolean } from '../utilitario/utilitarios';
import { Funcao } from '../funcao/funcao';
import { Servico } from '../servico/servico';
import { FuncaoService } from '../funcao/funcao.service';
import { ServicoService } from '../servico/servico.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { Moment } from 'moment/moment';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS
} from '@angular/material-moment-adapter';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  FloatLabelType
} from '@angular/material';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-fornecedor-form',
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
})
export class FornecedorFormComponent implements OnInit, AfterViewInit, AfterViewChecked, CanDeactivate<NgForm> {

  fornecedor: Fornecedor;
  fornecedor_ant: Fornecedor;

  linkDownload = environment.urlbase + '/api/documentos/fornecedor/downloadanexo?arquivo=';
  emProcessamento = false;
  exibeIncluir = false;
  id_documento: number;
  estados: Estado[];
  cidades: Cidade[];
  funcoes: Funcao[];
  servicos: Servico[];
  usuarios: User[];
  ptn = '[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}|[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{4}-[0-9]{2}';

  valRazaoSocial = new FormControl('', [Validators.required]);
  valCnpjCpf = new FormControl('', [
    Validators.required,
    Validators.pattern(this.ptn)
  ]);
  valDDD = new FormControl('', [Validators.pattern('[0-9]{2}')]);
  valDDD2 = new FormControl('', [Validators.pattern('[0-9]{2}')]);
  valDDDFax = new FormControl('', [Validators.pattern('[0-9]{2}')]);
  valTelefone = new FormControl('', [
    Validators.pattern('[0-9]{4}-[0-9]{4}|[0-9]{5}-[0-9]{4}')
  ]);
  valTelefone2 = new FormControl('', [
    Validators.pattern('[0-9]{4}-[0-9]{4}|[0-9]{5}-[0-9]{4}')
  ]);
  valTelefoneFax = new FormControl('', [
    Validators.pattern('[0-9]{4}-[0-9]{4}|[0-9]{5}-[0-9]{4}')
  ]);
  cidadeFilter = new FormControl();

  valTipoDocumento = new FormControl();
  valNroLicenca = new FormControl();
  valDtnascimento = new FormControl();
  valDtVencimento = new FormControl();
  valNaturalidade = new FormControl();
  valNacionalidade = new FormControl();
  valEstadoCivil = new FormControl();
  valRaca = new FormControl();
  valGrauEscolaridade = new FormControl();
  valFuncao = new FormControl();
  valRG = new FormControl();
  valINSSPIS = new FormControl();
  valContratante = new FormControl();
  valServico = new FormControl();
  date = new FormControl();

  filteredOptions: Observable<Cidade[]>;

  @Input('inativo')
  set inativo(inativo: boolean) {
    this.fornecedor.inativo = booleanToStrSN(inativo);
  }
  get inativo(): boolean {
    return strToBoolean(this.fornecedor.inativo);
  }

  @Input('extensao')
  set extensao(extensao: boolean) {
    this.fornecedor.recolhe_inss = booleanToStrSN(extensao);
  }
  get extensao(): boolean {
    return strToBoolean(this.fornecedor.recolhe_inss);
  }

  @Input('dtNascimento')
  set dtNascimento(dt: any) {
    this.fornecedor.nascimento = new Date(dt);
  }
  get dtNascimento(): any {
    return new Date(this.fornecedor.nascimento);
  }

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;
  @ViewChild('fornecedorForm') public form: NgForm;

  constructor(
    private _fornecedorService: FornecedorService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private _enderecoService: EnderecoService,
    private _funcaoService: FuncaoService,
    private _servicoService: ServicoService,
    private _userService: UserService,
    private dialog: DialogService
  ) {}

  validaCampos() {
    return (
      this.valRazaoSocial.valid && this.valCnpjCpf.valid
    );
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.fornecedor = new Fornecedor();
    this.fornecedor_ant = new Fornecedor();

    this._funcaoService.getListFuncao(this._tokenManager.retrieve()).subscribe( data => {
      this.funcoes = data.json();
    });

    this._servicoService.getListServicos(this._tokenManager.retrieve()).subscribe( data => {
      this.servicos = data.json();
    });

    this._userService.getListUsers(this._tokenManager.retrieve()).subscribe( data => {
      this.usuarios = data.json();
    });

    this._enderecoService
      .getListEstados(this._tokenManager.retrieve())
      .subscribe(data => {
        this.estados = data.json();
      });

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._fornecedorService
          .getFornecedor(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.fornecedor = data.json();
            this.fornecedor_ant = data.json();

            if (!isNullOrUndefined(this.fornecedor.estado)) {
              this.loadCidades(this.fornecedor.estado);
            }

            this.emProcessamento = false;
          });
      } else {
        this.emProcessamento = false;
      }
    });

    this.filteredOptions = this.cidadeFilter.valueChanges.pipe(
      startWith({} as Cidade),
      map(
        (cidade: any) =>
          cidade && typeof cidade === 'object' ? cidade.cCod : cidade
      ),
      map((cCod: any) => (cCod ? this.filter(cCod) : this.cidades))
    );
  }

  filter(name: string): Cidade[] {
    return this.cidades.filter(
      option => option.cCod.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  formataCnpjCpf(event: any) {
    // const namere = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');

    const cnpjcpf = event.target.value;

    let cnpjcpf_umask: string;
    cnpjcpf_umask = cnpjcpf;

    cnpjcpf_umask = cnpjcpf_umask
      .replace('.', '')
      .replace('.', '')
      .replace('/', '')
      .replace('-', '')
      .trim();

    let mcpf: string;

    if (cnpjcpf_umask.length === 11) {
      mcpf =
        cnpjcpf_umask.substr(0, 3) +
        '.' +
        cnpjcpf_umask.substr(3, 3) +
        '.' +
        cnpjcpf_umask.substr(6, 3) +
        '-' +
        cnpjcpf_umask.substr(9, 2);
      this.fornecedor.cnpj_cpf = mcpf;
    }

    if (cnpjcpf_umask.length === 14) {
      mcpf =
        cnpjcpf_umask.substr(0, 2) +
        '.' +
        cnpjcpf_umask.substr(3, 3) +
        '.' +
        cnpjcpf_umask.substr(6, 3) +
        '/' +
        cnpjcpf_umask.substr(9, 4) +
        '-' +
        cnpjcpf_umask.substr(12, 2);
      this.fornecedor.cnpj_cpf = mcpf;
    }

    if (this.fornecedor.cnpj_cpf) {
      let listfornecedor: Fornecedor[];
      let filtro: FornecedorFiltro;

      filtro = new FornecedorFiltro('', this.fornecedor.cnpj_cpf, '', '', '', '');

      this._fornecedorService.getFornecedors(this._tokenManager.retrieve(), 'id', 'id', 0, 15, filtro).subscribe(data => {
        listfornecedor = data.data;
        if (listfornecedor.length > 0) {
          if (listfornecedor[0].id !== this.fornecedor.id) {
            this.dialog.warning('SIA', 'CNPJ / CPF informado já se encontra cadastrado no sistema.');
            this.fornecedor.cnpj_cpf = '';
          }
        }
      });
    }

  }

  formataTelefone(event: any) {
    // const namere = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');

    const telefone = event.target.value;
    let telefone_umask: string = telefone;
    telefone_umask = telefone_umask.replace('-', '').trim();
    let tel: string;
    if (telefone_umask.length === 8) {
      tel = telefone_umask.substr(0, 4) + '-' + telefone_umask.substr(4, 4);
      this.fornecedor.telefone1_numero = tel;
    }

    if (telefone_umask.length === 9) {
      tel = telefone_umask.substr(0, 5) + '-' + telefone_umask.substr(5, 4);
      this.fornecedor.telefone1_numero = tel;
    }
  }

  formataTelefone2(event: any) {
    // const namere = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');

    const telefone = event.target.value;
    let telefone_umask: string = telefone;
    telefone_umask = telefone_umask.replace('-', '').trim();
    let tel: string;
    if (telefone_umask.length === 8) {
      tel = telefone_umask.substr(0, 4) + '-' + telefone_umask.substr(4, 4);
      this.fornecedor.telefone2_numero = tel;
    }

    if (telefone_umask.length === 9) {
      tel = telefone_umask.substr(0, 5) + '-' + telefone_umask.substr(5, 4);
      this.fornecedor.telefone2_numero = tel;
    }
  }

  formataTelefoneFax(event: any) {
    // const namere = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');

    const telefone = event.target.value;
    let telefone_umask: string = telefone;
    telefone_umask = telefone_umask.replace('-', '').trim();
    let tel: string;
    if (telefone_umask.length === 8) {
      tel = telefone_umask.substr(0, 4) + '-' + telefone_umask.substr(4, 4);
      this.fornecedor.fax_numero = tel;
    }

    if (telefone_umask.length === 9) {
      tel = telefone_umask.substr(0, 5) + '-' + telefone_umask.substr(5, 4);
      this.fornecedor.fax_numero = tel;
    }
  }

  estadoChange(event: any) {
    if (!this.emProcessamento) {
      this.loadCidades(event.value);
      this.fornecedor.cidade = '';
      this.cidadeFilter.reset();
    }

    // console.log('mudou estado ' + event.value);
  }

  loadCidades(cUF: string) {
    this._enderecoService
      .getListCidades(this._tokenManager.retrieve(), cUF)
      .subscribe(data => {
        this.cidades = data.json();
      });
  }

  // kpcpnjcpf(event: any) {
  //   const pattern = new RegExp('[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}');
  //   const inputChar = String.fromCharCode(event.charCode);
  //     if (!pattern.test(inputChar)) {
  //       event.preventDefault();
  //     }
  // }

  ngAfterViewChecked(): void {}

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
    // const dt = moment(this.date.value);
    // const dt = new Date(moment(this.date.value).toISOString().substring(0, 10));
    // const dtnas = new Date(moment(this.date.value).toISOString().substring(0, 10));
    // const dtnas = new Date();
    // this.fornecedor.nascimento = dtnas;
    if (this.validaCampos()) {
      if (isNullOrUndefined(this.fornecedor.id)) {
        this._fornecedorService
          .addFornecedor(this._tokenManager.retrieve(), this.fornecedor)
          .subscribe(
            data => {
              this.fornecedor = data;
              this.fornecedor_ant = data;
              this.limpaValidadores();
              this.emProcessamento = false;
              this.exibeIncluir = true;
              this.dialog.success('SIA', 'Fornecedor salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            }
          );
      } else {
        this._fornecedorService
          .editFornecedor(
            this._tokenManager.retrieve(),
            this.fornecedor.id,
            this.fornecedor
          )
          .subscribe(
            data => {
              this.fornecedor = data;
              this.fornecedor_ant = data;
              this.limpaValidadores();
              this.emProcessamento = false;
              this.exibeIncluir = true;
              this.dialog.success('SIA', 'Fornecedor salvo com sucesso.');

            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            }
          );
      }
    } else {
      this.emProcessamento = false;
      this.dialog.warning('SIA', 'Campos obrigatórios não preenchidos');
    }
  }

  btnIncluir_click() {
    this.fornecedor = new Fornecedor();
    this.fornecedor_ant = new Fornecedor();
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


  getRazaoSocialErrorMessage() {
    let mensagem = '';

    if (this.valRazaoSocial.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  getCnpjCpfErrorMessage() {
    let mensagem = '';

    if (this.valCnpjCpf.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }

    if (this.valCnpjCpf.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getDDDErrorMessage() {
    let mensagem = '';

    if (this.valDDD.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getTelefoneErrorMessage() {
    let mensagem = '';

    if (this.valTelefone.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getDDD2ErrorMessage() {
    let mensagem = '';

    if (this.valDDD2.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getTelefone2ErrorMessage() {
    let mensagem = '';

    if (this.valTelefone2.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getDDDFaxErrorMessage() {
    let mensagem = '';

    if (this.valDDDFax.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  getTelefoneFaxErrorMessage() {
    let mensagem = '';

    if (this.valTelefoneFax.hasError('pattern')) {
      mensagem = mensagem + 'Formato inválido para o campo';
    }
    return mensagem;
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    } else {
      return null;
    }
  }

  limpaValidadores() {
    this.valTipoDocumento.clearValidators();
    this.valNroLicenca.clearValidators();
    this.valDtVencimento.clearValidators();
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (JSON.stringify(this.fornecedor) === JSON.stringify(this.fornecedor_ant)) {
      return true;
    }

    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }


}
