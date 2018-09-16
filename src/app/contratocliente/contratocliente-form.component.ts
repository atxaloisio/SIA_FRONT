import { EquipamentoService } from './../equipamento/equipamento.service';
import { ContratoClienteEquipamentoService } from './contratoclienteequipamento.service';
import { Equipamento } from './../equipamento/equipamento';
import { ContratoClienteEquipamento } from './contratoclienteequipamento';
import { ContratoFornecedorResiduoService } from './../contratofornecedor/contratofornecedorresiduo.service';
import { ContratoFornecedorResiduo, ContratoFornecedorResiduoFiltro } from './../contratofornecedor/contratofornecedorresiduo';
import { TipoAtividadeEnum } from './../tipoatividade/tipoatividade.enum';
import { ContratoFornecedorFindComponent } from './../contratofornecedor/contratofornecedor-find.component';
import { ResiduoService } from './../residuo/residuo.service';
import { Residuo } from './../residuo/residuo';
import { ContratoFornecedorServicoService } from './../contratofornecedor/contratofornecedorservico.service';
import { ContratoFornecedorServico, ContratoFornecedorServicoFiltro } from './../contratofornecedor/contratofornecedorservico';
import { ContratoFornecedorService } from './../contratofornecedor/contratofornecedor.service';
import { UnidadeService } from './../unidade/unidade.service';
import { Unidade } from './../unidade/unidade';
import { ClienteFindComponent } from './../cliente/cliente-find.component';
import { ClienteService } from './../cliente/cliente.service';
import { ContratoClienteResiduoService } from './contratoclienteresiduo.service';
import { ServicoService } from './../servico/servico.service';
import { ContratoClienteResiduo } from './contratoclienteresiduo';
import { environment } from './../../environments/environment';
import { Moment } from 'moment/moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material/material-moment-adapter';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoDocumentoService } from './../tipodocumento/tipodocumento.service';
import { TipoDocumento } from './../tipodocumento/tipodocumento';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { ContratoClienteService } from './contratocliente.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { by, element } from 'protractor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ChangeDetectorRef, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { ContratoCliente } from './contratocliente';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Cliente } from '../cliente/cliente';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE,
         MAT_DATE_FORMATS,  FloatPlaceholderType } from '@angular/material';
import { Servico } from '../servico/servico';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ContratoFornecedor } from '../contratofornecedor/contratofornecedor';
import { DateValidator } from '../datevalidator';

@Component({
  selector: 'app-contratocliente-form',
  templateUrl: './contratocliente-form.component.html',
  styleUrls: ['./contratocliente-form.component.css'],
  providers: [
    { provide: DateAdapter,  useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    {provide: LOCALE_ID, useValue: 'pt-BR'}
  ]
})
export class ContratoClienteFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  contratocliente: ContratoCliente;
  contratocliente_ant: ContratoCliente;
  contratoclienteresiduos: ContratoClienteResiduo[];
  contratoclienteresiduos_ant: ContratoClienteResiduo[];
  contratofornecedorresiduos: ContratoFornecedorResiduo[];
  contratoclienteresiduo: ContratoClienteResiduo;
  contratoclienteequipamento: ContratoClienteEquipamento;
  contratoclienteequipamentos: ContratoClienteEquipamento[];
  contratoclienteequipamentos_ant: ContratoClienteEquipamento[];
  equipamentos: Equipamento[];
  servicos: Servico[];
  unidades: Unidade[];
  residuos: Residuo[];
  emProcessamento = false;

  exibeIncluir = false;
  linkDownload = environment.urlbase + '/api/contratos/downloadanexo?arquivo=';
  opt: FloatPlaceholderType;

  trocacor = false;

  valCodigo = new FormControl('', [Validators.required]);
  valDescricao = new FormControl();
  valServico = new FormControl('', [Validators.required]);
  valUnidade = new FormControl('', [Validators.required]);
  valFornecedor = new FormControl('', [Validators.required]);
  valCtrFornecedor = new FormControl('', [Validators.required]);
  valResiduo = new FormControl('', [Validators.required]);
  valVigenciaInicio = new FormControl('', [Validators.required]);
  valVigenciaFinal = new FormControl('', Validators.compose([Validators.required, DateValidator.afterDate(this.valVigenciaInicio)]));
  valEquipamento = new FormControl('', [Validators.required]);
  valUnidadeEquip = new FormControl('', [Validators.required]);
  valPrecoEquipamento = new FormControl('', [Validators.required]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('fileInput') fileInput;
  @ViewChildren('combo') cb;

  constructor(
    private _contratoclienteService: ContratoClienteService,
    private _contratoclienteresiduoService: ContratoClienteResiduoService,
    private _contratofornecedorResiduoService: ContratoFornecedorResiduoService,
    private _contratofornecedorService: ContratoFornecedorService,
    private _contratoclienteequipamentoService: ContratoClienteEquipamentoService,
    private _clienteService: ClienteService,
    private _servicoService: ServicoService,
    private _residuoService: ResiduoService,
    private _equipamentoService: EquipamentoService,
    private _unidadeService: UnidadeService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog
  ) {
    this.opt = 'never';
  }

  validaCampos() {
    return this.valCodigo.valid && this.valVigenciaInicio.valid && this.valVigenciaFinal.valid;
  }

  /**
   * Validação de Serviços marcados
   */

  validaServicos(): boolean {
    let retorno: boolean;
    const msgRetorno = '';
    retorno = true;
    // for (let index = 0; index < this.contratoclienteresiduos.length; index++) {
    //   const cfs = this.contratoclienteresiduos[index];
    //   if (cfs.selecionado) {
    //     if (cfs.unidade === '') {
    //       msgRetorno = 'Unidade do serviço ' + cfs.descricao + ' deve ser informada.';
    //       break;
    //     }

    //     if (msgRetorno === '') {
    //       if (((isNullOrUndefined(cfs.preco_compra)) || (cfs.preco_compra === 0)) &&
    //         ((isNullOrUndefined(cfs.preco_servico)) || (cfs.preco_servico === 0))) {
    //           msgRetorno = 'Preço de compra ou preço de serviço deve ser informado em ' + cfs.descricao;
    //           break;
    //       }
    //     }
    //   }
    // }

    if (msgRetorno !== '') {
      retorno = false;
      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos. ', msgRetorno);
    }

    return retorno;
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.contratocliente = new ContratoCliente();
    this.contratocliente_ant = new ContratoCliente();
    this.contratoclienteresiduo = new ContratoClienteResiduo();
    this.contratoclienteresiduos = new Array<ContratoClienteResiduo>();
    this.contratoclienteresiduos_ant = new Array<ContratoClienteResiduo>();
    this.contratofornecedorresiduos = new Array<ContratoFornecedorResiduo>();
    this.contratoclienteequipamento = new ContratoClienteEquipamento();
    this.contratoclienteequipamentos = new Array<ContratoClienteEquipamento>();
    this.contratoclienteequipamentos_ant = new Array<ContratoClienteEquipamento>();
    // this.contratoclienteresiduos.push(new ContratoClienteResiduo(1, 1, 1, 1, 56.87, true, '', '', 'TRANSPORTE'));
    // this.contratoclienteresiduos.push(new ContratoClienteResiduo(1, 1, 1, 1, 123.47, true, '', '', 'RECEPÇÃO'));
    this._unidadeService.getListUnidades(this._tokenManager.retrieve()).subscribe(
      data => {
        this.unidades = JSON.parse(data._body);
      }
    );

    this._servicoService.getListServicos(this._tokenManager.retrieve()).subscribe(
      data => {
        this.servicos = JSON.parse(data._body);
      }
    );

    this._residuoService.getListResiduos(this._tokenManager.retrieve()).subscribe(
      data => {
        this.residuos = JSON.parse(data._body);
      }
    );

    this._equipamentoService.getListEquipamento(this._tokenManager.retrieve()).subscribe(
      data => {
        this.equipamentos = JSON.parse(data._body);
    });


    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._contratoclienteService
          .getContratoCliente(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.contratocliente = JSON.parse(data._body);
            this.contratocliente_ant = JSON.parse(data._body);

            if (this.contratocliente.caminho) {
              this.linkDownload = this.linkDownload + 'CLI_' +
                                this.contratocliente.id_cliente + '_CTR_' +
                                this.contratocliente.id + '_' +
                                this.contratocliente.caminho;
            }

            this.emProcessamento = false;
            // this.modelLoaded = true;
            // const tp = new TipoDocumento(this.contratocliente.id_tipo_documento, this.contratocliente.descricao);

            // this.valTipoDocumento.setValue(this.contratocliente.id_tipo_documento);
            // console.log('objeto: ' + this.contratocliente.id_tipo_documento.toString());
          });
        this._contratoclienteresiduoService
          .getContratoClienteResiduo(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.contratoclienteresiduos.length = 0;
            this.contratoclienteresiduos = JSON.parse(data._body);
            this.contratoclienteresiduos_ant = JSON.parse(data._body);
          });
        this._contratoclienteequipamentoService.getContratoClienteEquipamento(this._tokenManager.retrieve(), id)
          .subscribe(data => {
            this.contratoclienteequipamentos.length = 0;
            this.contratoclienteequipamentos = JSON.parse(data._body);
            this.contratoclienteequipamentos_ant = JSON.parse(data._body);
          });
      } else {
        this.emProcessamento = false;
      }
    });

    const idFilter$ = this.valCodigo.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');
    Observable.combineLatest(idFilter$)
      .debounceTime(500)
      .distinctUntilChanged()
      .map(([id]) => ({ id }))
      .subscribe(filter => {
        this.buscaCliente(filter);
      });

    // const idContratoTranspFilter$ = this.valCodigoCTRTransp.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    // Observable.combineLatest(idContratoTranspFilter$).debounceTime(500).distinctUntilChanged()
    //   .map(([id]) => ({ id }))
    //   .subscribe(filter => {
    //     this.buscaContratoTransp(filter);
    //   });

    // const idContratoDestFilter$ = this.valCodigoCTRDest.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    // Observable.combineLatest(idContratoDestFilter$).debounceTime(500).distinctUntilChanged()
    //   .map(([id]) => ({ id }))
    //   .subscribe(filter => {
    //     this.buscaContratoDest(filter);
    //   });



    // this._tipoDocumentoService.getListTipoDocumentos(this._tokenManager.retrieve())
    //     .subscribe(dt => {
    //       this.tipodocumentos = JSON.parse(dt._body);
    //       // if ((this.tipodocumentos.length > 0) && (!isNullOrUndefined(this.contratocliente.id_tipo_documento))) {
    //       //   const index = this.tipodocumentos.findIndex(d => d.id === this.contratocliente.id_tipo_documento);
    //       //   this.tipodocumentos.splice(index, 1);
    //       // }
    // });
  }

  ngAfterViewChecked(): void {}

  ngAfterViewInit(): void {
    // this.vc.first.nativeElement.focus();
    // Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
    // for (let index = 0; index < this.tipodocumentos2.length; index++) {
    //   const element = this.tipodocumentos2[index];
    //   this.tipodocumentos.push(element);
    // }
    // this.tipodocumentos2.forEach(element => {
    //   this.tipodocumentos.push(element);
    // });
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
    const fileBrowser = this.fileInput.nativeElement;
    if (this.validaCampos()) {
      if (isNullOrUndefined(this.contratocliente.id)) {
        this._contratoclienteService.addContratoCliente(this._tokenManager.retrieve(), this.contratocliente)
          .subscribe( data => {
              this.contratocliente = data;
              this.contratocliente_ant = data;
              // this.emProcessamento = false;
              //     this.exibeIncluir = true;
              //     this.dialog.success('SGR', 'Contrato salvo com sucesso.');
              // Salvando lista de serviços
              for (let index = 0; index < this.contratoclienteresiduos.length; index++) {
                this.contratoclienteresiduos[index].id_contrato_cliente = this.contratocliente.id;
              }

              this._contratoclienteresiduoService.addContratoClienteResiduo(this._tokenManager.retrieve(),
                this.contratocliente.id, this.contratoclienteresiduos)
                .subscribe( ctrfsrv => {
                  this.contratoclienteresiduos.length = 0;
                  this.contratoclienteresiduos_ant.length = 0;
                  this.contratoclienteresiduos = ctrfsrv;
                  this.contratoclienteresiduos_ant = ctrfsrv;
                  this.limpaValidadores();

                  for (let index = 0; index < this.contratoclienteequipamentos.length; index++) {
                    this.contratoclienteequipamentos[index].id_contrato_cliente = this.contratocliente.id;
                  }

                  this._contratoclienteequipamentoService.addContratoClienteEquipamento(this._tokenManager.retrieve(),
                  this.contratocliente.id, this.contratoclienteequipamentos)
                  .subscribe( ctrequip => {
                    this.contratoclienteequipamentos.length = 0;
                    this.contratoclienteequipamentos_ant.length = 0;
                    this.contratoclienteequipamentos = ctrequip;
                    this.contratoclienteequipamentos_ant = ctrequip;
                    this.limpaValidadoresEquipamento();
                    this.contratoclienteequipamento = new ContratoClienteEquipamento();
                    this.emProcessamento = false;
                    this.exibeIncluir = true;
                    this.dialog.success('SGR', 'Contrato salvo com sucesso.');
                  },
                  error => {
                    this.emProcessamento = false;
                    this.dialog.error('SGR', 'Erro ao salvar lista de equipamentos.', error.error + ' - Detalhe: ' + error.message);
                  });
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de resíduos.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              if (fileBrowser.files.length > 0) {
                this.uploadContrato(this.contratocliente, fileBrowser.files[0]);
              }
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Documento salvo com sucesso.');
              // this.valTipoDocumento.setValue(this.contratocliente.id_tipo_documento);
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
            }
          );
      } else {
        this._contratoclienteService.editContratoCliente(this._tokenManager.retrieve(), this.contratocliente.id, this.contratocliente)
          .subscribe(
            data => {
              // this.emProcessamento = false;
              // fileBrowser.files[0]
              this.contratocliente = data;
              this.contratocliente_ant = data;
              for (let index = 0; index < this.contratoclienteresiduos.length; index++) {
                this.contratoclienteresiduos[index].id_contrato_cliente = this.contratocliente.id;
              }
              this._contratoclienteresiduoService.addContratoClienteResiduo(this._tokenManager.retrieve(),
                this.contratocliente.id, this.contratoclienteresiduos)
                .subscribe( ctrfsrv => {
                  this.contratoclienteresiduos.length = 0;
                  this.contratoclienteresiduos = ctrfsrv;
                  this.contratoclienteresiduos_ant.length = 0;
                  this.contratoclienteresiduos_ant = ctrfsrv;
                  this.limpaValidadores();
                  for (let index = 0; index < this.contratoclienteequipamentos.length; index++) {
                    this.contratoclienteequipamentos[index].id_contrato_cliente = this.contratocliente.id;
                  }

                  this._contratoclienteequipamentoService.addContratoClienteEquipamento(this._tokenManager.retrieve(),
                  this.contratocliente.id, this.contratoclienteequipamentos)
                  .subscribe( ctrequip => {
                    this.contratoclienteequipamentos.length = 0;
                    this.contratoclienteequipamentos = ctrequip;
                    this.contratoclienteequipamentos_ant.length = 0;
                    this.contratoclienteequipamentos_ant = ctrequip;
                    this.limpaValidadoresEquipamento();
                    this.contratoclienteequipamento = new ContratoClienteEquipamento();
                    this.emProcessamento = false;
                    this.exibeIncluir = true;
                    this.dialog.success('SGR', 'Contrato salvo com sucesso.');
                  },
                  error => {
                    this.emProcessamento = false;
                    this.dialog.error('SGR', 'Erro ao salvar lista de equipamentos.', error.error + ' - Detalhe: ' + error.message);
                  });
                },
                error => {
                  this.emProcessamento = false;
                  this.dialog.error('SGR', 'Erro ao salvar lista de serviços.', error.error + ' - Detalhe: ' + error.message);
                }
              );
              if (fileBrowser.files.length > 0) {
                this.uploadContrato(this.contratocliente, fileBrowser.files[0]);
              }
              // this.exibeIncluir = true;
              // this.dialog.success('SGR', 'Documento salvo com sucesso.');
              // this.valTipoDocumento.setValue(this.contratocliente.id_tipo_documento);
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error(
                'SGR',
                'Erro ao salvar o registro.',
                error.error + ' - Detalhe: ' + error.message
              );
            }
          );
      }
    } else {
      this.emProcessamento = false;
      let msgDetalhe = '';
      if (this.valCodigo.invalid) {
        if (this.valCodigo.hasError('required')) {
          msgDetalhe = msgDetalhe + 'Campo código do Cliente não informado.';
          document.getElementById('id_cliente').focus();
        }
      }

      if ((this.valVigenciaInicio.invalid) && (msgDetalhe === '')) {
        if (this.valVigenciaInicio.hasError('required')) {
          msgDetalhe = msgDetalhe + 'Campo Data Inicio Vigência não informado.';
          document.getElementById('vigencia_inicio').focus();
        }
      }

      if ((this.valVigenciaFinal.invalid) && (msgDetalhe === '')) {
        if (this.valVigenciaFinal.hasError('required')) {
          msgDetalhe = msgDetalhe + 'Campo Data Final Vigência não informado.';
          document.getElementById('vigencia_final').focus();
        }
      }

      this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos', msgDetalhe);
    }
  }

  uploadContrato(_contratocliente: ContratoCliente, _file: File) {
    this._contratoclienteService.uploadContrato(this._tokenManager.retrieve(), _contratocliente, _file).subscribe(
      data => {
        this.contratocliente.caminho = data.anexo;
        if (this.contratocliente.caminho) {
          this.linkDownload = this.linkDownload + 'CLI_' +
                              this.contratocliente.id_cliente + '_CTR_' +
                              this.contratocliente.id + '_' +
                              this.contratocliente.caminho;
        }
        // console.log('upload ok ' + data.anexo);
      },
      error => {
        console.log('falha no upload ' + error.error + ' - ' + error.message);
      },
    );
  }

  btnIncluir_click() {
    this.contratocliente = new ContratoCliente();
    this.contratocliente_ant = new ContratoCliente();
    this.contratoclienteresiduo = new ContratoClienteResiduo();
    this.contratoclienteequipamento = new ContratoClienteEquipamento();
    this.contratoclienteresiduos.length = 0;
    this.contratoclienteequipamentos.length = 0;
    this.contratoclienteresiduos_ant.length = 0;
    this.contratoclienteequipamentos_ant.length = 0;
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
      this.contratocliente.id_cliente = null;
      this.contratocliente.cliente = '';
    }
  }

  buscaCliente(event: any) {
    let cliente: Cliente;
    if (event.id) {
      this._clienteService
        .getCliente(this._tokenManager.retrieve(), Number(event.id))
        .subscribe(
          data => {
            cliente = JSON.parse(data._body);
            this.contratocliente.id_cliente = cliente.id;
            this.contratocliente.cliente = cliente.razao_social;
          },
          (err: HttpErrorResponse) => {
            this.contratocliente.id_cliente = null;
            this.contratocliente.cliente = '';
          }
        );
    }
  }

  openPesquisa(): void {
    const dialogLoginRef = this.pesquisa.open(ClienteFindComponent, {
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
        this.contratocliente.id_cliente = result.id;
        this.contratocliente.cliente = result.razao_social;
      }
      // console.log('The dialog was closed');
      // alert('sua mensagem de retorno foi' + result.retorno );
      // console.log(result.retorno);
      // if ((result.Usuario != null) || (result.Usuario !== undefined)) {
      //   this.Usuario = result.Usuario;
      //   this.Logado = result.logado;
      //   this.tokenManager.store(result.token);
      //   localStorage.setItem('currentUser', JSON.stringify(this.Usuario));
      //   localStorage.setItem('Logado', JSON.stringify({Logado: this.Logado}));
      // }
    });
  }

  // setDate(event: Date) {
  //   this.contratocliente.vigencia_inicio = new Date(event.toLocaleString());
  // }

  // formatadata(data: Date): Date {
  //   const d = data.toString().substring(0, 10);
  //   return new Date(d.toString());
  // }

  limpacampo(servico: ContratoClienteResiduo, event: any) {
    servico.preco_compra = null;
    servico.preco_servico = null;
    servico.unidade = '';
  }

  servicoChange(event: any) {
    this.contratoclienteresiduo.id_residuo = null;
    this.contratoclienteresiduo.unidade = '';
    this.contratoclienteresiduo.id_contrato_fornecedor = null;
    this.contratoclienteresiduo.residuo = '';
    this.contratoclienteresiduo.fornecedor = '';
    this.contratoclienteresiduo.preco_compra = 0;
    this.contratoclienteresiduo.preco_servico = 0;
  }

  residuoChange(event: any) {
    this.contratoclienteresiduo.unidade = '';
    this.contratoclienteresiduo.id_contrato_fornecedor = null;
    this.contratoclienteresiduo.fornecedor = '';
    this.contratoclienteresiduo.preco_compra = 0;
    this.contratoclienteresiduo.preco_servico = 0;
  }

  unidadeChange(event: any) {
    // this.contratofornecedorservicos.length = 0;
    if (!isNullOrUndefined(this.contratocliente.id_cliente)) {
      if (!isNullOrUndefined(this.contratoclienteresiduo.id_residuo)) {
        if (!isNullOrUndefined(this.contratoclienteresiduo.id_servico)) {
          this.contratoclienteresiduo.id_contrato_fornecedor = null;
          this.contratoclienteresiduo.fornecedor = null;
          this.contratoclienteresiduo.preco_compra = 0;
          this.contratoclienteresiduo.preco_servico = 0;
          this.loadContratos(this.contratoclienteresiduo.id_servico, this.contratoclienteresiduo.id_residuo, event.value).subscribe();
        } else {
          this.dialog.warning('SGR', 'Serviço não informado');
          document.getElementById('id_servico').focus();
        }
      } else {
        this.dialog.warning('SGR', 'Residuo não informado');
        document.getElementById('id_residuo').focus();
      }
    } else {
      this.dialog.warning('SGR', 'Cliente não informado');
      // document.getElementById('id_cliente').focus();
    }
    // console.log('mudou estado ' + event.value);
  }

  loadContratos(cId_Servico: number, cId_Residuo: number, cUnidade: string): Observable<any> {
    const retorno = Observable.create(observer => {
      let filtro: ContratoFornecedorResiduoFiltro;
      filtro = new ContratoFornecedorResiduoFiltro();
      filtro.id_servico = cId_Servico;
      filtro.id_cliente = this.contratocliente.id_cliente;
      filtro.id_residuo = cId_Residuo;
      filtro.unidade = cUnidade;
      this.contratofornecedorresiduos.length = 0;
      this._contratofornecedorResiduoService.getContratoFornecedorResiduos(this._tokenManager.retrieve(), filtro)
        .subscribe(data => {
          this.contratofornecedorresiduos = JSON.parse(data._body);
          observer.next(true);
      });
    });

    return retorno;
  }

  addlinha() {
    // validar se ja foi inserido na lista
    let mensagem = '';

    if ((this.valServico.invalid) && (mensagem === '')) {
      mensagem = 'Serviço não informado.';
    }

    if ((this.valResiduo.invalid) && (mensagem === '')) {
      mensagem = 'Resíduo não informado.';
    }

    if ((this.valUnidade.invalid) && (mensagem === '')) {
      mensagem = 'Unidade não informada.';
    }

    if ((this.valCtrFornecedor.invalid) && (mensagem === '')) {
      mensagem = 'Contrato do fornecedor não informado.';
    }

    if (mensagem === '') {
      const index = this.contratoclienteresiduos.findIndex(
        p => p.id_contrato_fornecedor === this.contratoclienteresiduo.id_contrato_fornecedor &&
             p.id_residuo === this.contratoclienteresiduo.id_residuo &&
             p.id_servico === this.contratoclienteresiduo.id_servico &&
             p.unidade === this.contratoclienteresiduo.unidade);

      if ((!isNullOrUndefined(index)) && (index > -1)) {
        mensagem = 'Resíduo já foi relacionado';
      }
    }

    // if (mensagem === '') {
    //   if (((isNullOrUndefined(this.contratoclienteresiduo.preco_compra)) || (this.contratoclienteresiduo.preco_compra === 0)) &&
    //      ((isNullOrUndefined(this.contratoclienteresiduo.preco_servico) || (this.contratoclienteresiduo.preco_servico === 0)))) {
    //     mensagem = 'Campo preço não informado.';
    //   }
    // }


    if (mensagem === '') {
      this.contratoclienteresiduo.residuo = this.residuos.find(p => p.id === this.contratoclienteresiduo.id_residuo).descricao;
      this.contratoclienteresiduo.servico = this.servicos.find(p => p.id === this.contratoclienteresiduo.id_servico).descricao;
        this.contratoclienteresiduos.push(this.contratoclienteresiduo);
        // this.contratoclienteresiduo = null;
        this.contratofornecedorresiduos.length = 0;
        this.limpaValidadores();
        this.contratoclienteresiduo = new ContratoClienteResiduo();
        document.getElementById('id_servico').focus();
    } else {
      this.dialog.warning('SGR', 'Resíduo não adicionado', 'Detalhe: ' + mensagem);
    }
  }

  limpaValidadores() {
    this.valServico.clearValidators();
    this.valResiduo.clearValidators();
    this.valUnidade.clearValidators();
    this.valCtrFornecedor.clearValidators();
  }

  remlinha(serv: ContratoClienteResiduo) {
    if (!isNullOrUndefined(serv.id)) {
      this.dialog.question('SGR', 'Deseja realmente excluir o servico: ' + serv.servico + ' do resíduo:' + serv.residuo + ' ?').subscribe(
      result => {
        if (result.retorno) {
          this._contratoclienteresiduoService.deleteContratoClienteResiduo(this._tokenManager.retrieve(), serv.id).subscribe(
            data => {
              this.dialog.success('SGR', 'Servico excluído do contrato com sucesso.');
              const index = this.contratoclienteresiduos.indexOf(serv);
              this.contratoclienteresiduos.splice(index, 1);
            },
            error => {
              this.dialog.error('SGR', 'Erro ao excluir o serviço.', error.error + ' - Detalhe: ' + error.message);
            },
          );
        }
      });
    } else {
      this.dialog.question('SGR', 'Deseja realmente excluir o servico: ' + serv.servico + ' do resíduo:' + serv.residuo + ' ?').subscribe(
      result => {
        if (result.retorno) {
          const index = this.contratoclienteresiduos.indexOf(serv);
          this.contratoclienteresiduos.splice(index, 1);
        }
      });
    }
  }

  editlinha(serv: ContratoClienteResiduo) {
    if (!isNullOrUndefined(this.contratoclienteresiduo.id_contrato_fornecedor)) {
      this.dialog.question('SGR', 'Deseja cancelar a edição?').subscribe(
        result => {
          if (result.retorno) {
            this.addlinha();
              this.loadContratos(serv.id_servico, serv.id_residuo, serv.unidade)
            .delay(500)
            .subscribe(data => {
              if (data) {
                this.contratoclienteresiduo = serv;
                const index = this.contratoclienteresiduos.indexOf(serv);
                this.contratoclienteresiduos.splice(index, 1);
              }
            });
          }
        });
    } else {
      this.loadContratos(serv.id_servico, serv.id_residuo, serv.unidade)
      .delay(500)
      .subscribe(data => {
        if (data) {
          this.contratoclienteresiduo = serv;
          const index = this.contratoclienteresiduos.indexOf(serv);
          this.contratoclienteresiduos.splice(index, 1);
        }
      });
    }
  }

  addGridEquipamentos() {
    // validar se ja foi inserido na lista
    let mensagem = '';

    if ((this.valEquipamento.invalid) && (mensagem === '')) {
      mensagem = 'Equipamento não informado.';
    }

    if ((this.valUnidadeEquip.invalid) && (mensagem === '')) {
      mensagem = 'Unidade não informada.';
    }

    if ((this.valPrecoEquipamento.invalid) && (mensagem === '')) {
      mensagem = 'Preço da locação não informado.';
    }

    if (mensagem === '') {
      const index = this.contratoclienteequipamentos.findIndex(
        p => p.id_equipamento === this.contratoclienteequipamento.id_equipamento);

      if ((!isNullOrUndefined(index)) && (index > -1)) {
        mensagem = 'Equipamento já foi relacionado';
      }
    }

    if (mensagem === '') {
      this.contratoclienteequipamento.equipamento = this.equipamentos.find(p => p.id === this.contratoclienteequipamento.id_equipamento)
      .descricao;

      this.contratoclienteequipamentos.push(this.contratoclienteequipamento);
      this.limpaValidadoresEquipamento();
      this.contratoclienteequipamento = new ContratoClienteEquipamento();
      document.getElementById('id_equipamento').focus();
    } else {
      this.dialog.warning('SGR', 'Equipamento não adicionado', 'Detalhe: ' + mensagem);
    }
  }

  editGridEquipamentos(item: ContratoClienteEquipamento) {
    this.contratoclienteequipamento = item;
    const index = this.contratoclienteequipamentos.indexOf(item);
    this.contratoclienteequipamentos.splice(index, 1);
  }

  deleteGridEquipamentos(item: ContratoClienteEquipamento) {
    if (!isNullOrUndefined(item.id)) {
      this.dialog.question('SGR', 'Deseja realmente excluir o Equipamento: ' + item.equipamento + ' ?').subscribe(
      result => {
        if (result.retorno) {
          this._contratoclienteequipamentoService.deleteContratoClienteEquipamento(this._tokenManager.retrieve(), item.id).subscribe(
            data => {
              this.dialog.success('SGR', 'Equipamento excluído do contrato com sucesso.');
              const index = this.contratoclienteequipamentos.indexOf(item);
              this.contratoclienteequipamentos.splice(index, 1);
            },
            error => {
              this.dialog.error('SGR', 'Erro ao excluir o Equipamento.', error.error + ' - Detalhe: ' + error.message);
            },
          );
        }
      });
    } else {
      this.dialog.question('SGR', 'Deseja realmente excluir o Equipamento: ' + item.equipamento + ' ?').subscribe(
      result => {
        if (result.retorno) {
          const index = this.contratoclienteequipamentos.indexOf(item);
          this.contratoclienteequipamentos.splice(index, 1);
        }
      });
    }
  }

  limpaValidadoresEquipamento() {
    this.valEquipamento.clearValidators();
    this.valUnidadeEquip.clearValidators();
    this.valPrecoEquipamento.clearValidators();
  }

  equipamentoChange(event: any) {
    this.contratoclienteequipamento.unidade = '';
    this.contratoclienteequipamento.preco = 0;
  }

  unidadeEquipamentoChange(event: any) {
    this.contratoclienteequipamento.preco = 0;
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (((JSON.stringify(this.contratocliente) === JSON.stringify(this.contratocliente_ant))) &&
       ((JSON.stringify(this.contratoclienteresiduos) === JSON.stringify(this.contratoclienteresiduos_ant))) &&
       ((JSON.stringify(this.contratoclienteequipamentos) === JSON.stringify(this.contratoclienteequipamentos_ant)))) {
      return true;
    }
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // if (!this.crisis || this.crisis.name === this.editName) {
    //   return true;
    // }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }
}
