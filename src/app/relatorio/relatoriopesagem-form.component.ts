import { ContratoClienteService } from './../contratocliente/contratocliente.service';
import { ClienteFindComponent } from './../cliente/cliente-find.component';
import { ClienteService } from './../cliente/cliente.service';
import { environment } from './../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, LOCALE_ID } from '@angular/core';
import { Router, Data } from '@angular/router';
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
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Cliente } from '../cliente/cliente';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE,
         MAT_DATE_FORMATS,  FloatPlaceholderType } from '@angular/material';
import { Servico } from '../servico/servico';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ContratoFornecedor } from '../contratofornecedor/contratofornecedor';
import { RelatorioService } from './relatorio.service';
import { FiltroPesagem } from './filtropesagem';
import * as jsPDF from 'jspdf';
import * as FileSaver from 'file-saver';
import { RelatorioPesagem } from './relatoriopesagem';


@Component({
  selector: 'app-relatoriopesagem-form',
  templateUrl: './relatoriopesagem-form.component.html',
  styleUrls: ['./relatoriopesagem-form.component.css']
})
export class RelatorioPesagemFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  // relatorio: Relatorio;
  emProcessamento = false;
  exibeIncluir = false;
  hoje: Date;
  filtropesagem: FiltroPesagem;
  pesagens: RelatorioPesagem[];
  sumTotalPesagens: number;

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('relatorio') el: ElementRef;

  constructor(private _relatorioService: RelatorioService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService,
    private pesquisa: MatDialog) {}

  validaCampos() {
    return (
      true
    );
  }

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.hoje = new Date();
    this.hoje.setDate(this.hoje.getDate() - 1);
    // this.relatorio = new Relatorio();

    // this._route.data.subscribe(data => {
    //   console.log(data.objeto);
    // });
    this.filtropesagem = new FiltroPesagem();
    this.pesagens = new Array<RelatorioPesagem>();

    // this.receitas.push(new Receita(new Date(Date.now()), '2323', 'AÇO INOX', 'KARDEC', 'KARDEC', 200, 'KG', 2.50, 250));


    if (this._route.snapshot.paramMap.has('id')) {
      this.filtropesagem.id = +this._route.snapshot.paramMap.get('id');
      // console.log(this._route.snapshot.paramMap.get('id'));
    }
    if (this._route.snapshot.paramMap.has('id_cliente')) {
      if ((!isNullOrUndefined(this._route.snapshot.paramMap.get('id_cliente'))) &&
         (+this._route.snapshot.paramMap.get('id_cliente') !== NaN)) {
        this.filtropesagem.id_cliente = +this._route.snapshot.paramMap.get('id_cliente');
      }
      // console.log(this._route.snapshot.paramMap.get('id_cliente'));
    }

    if (this._route.snapshot.paramMap.has('cliente')) {
      this.filtropesagem.cliente = this._route.snapshot.paramMap.get('cliente');
      // console.log(this._route.snapshot.paramMap.get('cliente'));
    }

    if (this._route.snapshot.paramMap.has('id_residuo')) {
      this.filtropesagem.id_residuo = +this._route.snapshot.paramMap.get('id_residuo');
      // console.log(this._route.snapshot.paramMap.get('id_residuo'));
    }

    if (this._route.snapshot.paramMap.has('datade')) {
      if ((!isNullOrUndefined(this._route.snapshot.paramMap.get('datade')))
        && (this._route.snapshot.paramMap.get('datade') !== 'null')) {
        this.filtropesagem.datade = new Date(this._route.snapshot.paramMap.get('datade'));
      }
      // console.log(this._route.snapshot.paramMap.get('id_residuo'));
    }

    if (this._route.snapshot.paramMap.has('dataate')) {
      if (!isNullOrUndefined(this._route.snapshot.paramMap.get('dataate'))) {
        this.filtropesagem.dataate = new Date(this._route.snapshot.paramMap.get('dataate'));
      }
      // console.log(this._route.snapshot.paramMap.get('id_residuo'));
    }

    if (this.filtropesagem) {
      this._relatorioService.getRelatorioPesagemCliente(this._tokenManager.retrieve(), this.filtropesagem)
      .subscribe(data => {
        this.pesagens = data;
        this.sumTotalPesagens = 0;

        this.sumTotalPesagens = this.pesagens.reduce((sum, item) => sum + Number(item.peso), 0);

        this.emProcessamento = false;
      });
    }

    // console.log(this.filtropesagem);

    // public id: number = null,
    // public id_cliente: number = null,
    // public cliente: string = '',
    // public receita: boolean = true,
    // public despesa: boolean = true,
    // public agrupar_classe: boolean = true,
    // public id_residuo: number = null,
    // public datade: Date = null,
    // public dataate: Date = null,
    // public descricao: string = '',
    // public id_manifesto: number = null,
    // public manifesto: string = '',
    // public created_at: string = '',
    // public updated_at: string = '',




    // const ta = this._tipoatividadeService.getListTipoAtividades(this._tokenManager.retrieve())
    //   .retry(3)
    //   .subscribe(
    //     data => {
    //       this.tipoatividades = JSON.parse(data._body);
    //       // console.log(2);
    //       this._route.params.forEach((params: Params) => {
    //         const id: number = +params['id'];
    //         if (id) {
    //           this._relatorioService.getRelatorio(this._tokenManager.retrieve(), id)
    //           .retry(3)
    //           .subscribe( dt => {
    //             this.relatorio = JSON.parse(dt._body);
    //             // console.log(1);
    //             this.emProcessamento = false;
    //           });
    //         } else {
    //           this.emProcessamento = false;
    //         }
    //       });
    //     },
    //     error => {
    //       this.emProcessamento = false;
    //       this.dialog.error('SGR', 'Erro ao carregar o registro.', error.error + ' - Detalhe: ' + error.message);
    //     }
    //   );
    // const idFilter$ = this.valCodigo.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    // Observable.combineLatest(idFilter$).debounceTime(500).distinctUntilChanged().map(([id]) => ({ id })).subscribe(filter => {
    //     this.buscaCliente(filter);
    //   });

    // const idManifesto$ = this.valManifesto.valueChanges.debounceTime(500).distinctUntilChanged().startWith('');
    // Observable.combineLatest(idManifesto$).debounceTime(500).distinctUntilChanged().map(([id]) => ({ id })).subscribe(filter => {
    //     this.buscaManifesto(filter);
    //   });

  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    // this.vc.first.nativeElement.focus();
    // Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
  }

  btnImprimir_click() {
    window.print();
    // this.emProcessamento = true;
    // this._relatorioService
    //   .getRelatorioRelatorioPesagem(this._tokenManager.retrieve(), this.relatorio)
    //   .subscribe(data => {
    //     this.emProcessamento = false;
    //     const fileUrl = URL.createObjectURL(data);
    //     const tab = window.open();
    //     tab.location.href = fileUrl;
    //   },
    //   error => {
    //     this.emProcessamento = false;
    //     const err = new HttpErrorResponse(error);
    //     console.log(err);
    //     this.dialog.error('SGR', 'Erro ao gerar o relatório.', '');
    //   },
    // );
  }

  btnSalvar_click() {
    // this.emProcessamento = true;
    // if (this.validaCampos()) {
    //   if (isNullOrUndefined(this.relatorio.id)) {
    //     this._relatorioService.addRelatorio(
    //       this._tokenManager.retrieve(),
    //       this.relatorio).subscribe(
    //         data => {
    //           this.emProcessamento = false;
    //           this.relatorio = data;
    //           this.exibeIncluir = true;
    //           this.dialog.success('SGR', 'Relatorio salvo com sucesso.');
    //         },
    //         error => {
    //           this.emProcessamento = false;
    //           this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
    //         },
    //       );
    //   } else {
    //     this._relatorioService.editRelatorio(
    //       this._tokenManager.retrieve(),
    //       this.relatorio.id,
    //       this.relatorio).subscribe(
    //       data => {
    //       this.emProcessamento = false;
    //       this.relatorio = data;
    //       this.exibeIncluir = true;
    //       this.dialog.success('SGR', 'Relatorio salvo com sucesso.');
    //     },
    //     error => {
    //       this.emProcessamento = false;
    //       this.dialog.error('SGR', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
    //     },
    //   );
    //   }
    // } else {
    //   this.emProcessamento = false;
    //   this.dialog.warning('SGR', 'Campos obrigatórios não preenchidos');
    // }
  }

  btnIncluir_click() {
    // this.relatorio = new Relatorio();
  }

  validaSaida(event: string) {
    // if (event === '') {
    //   this.relatorio.id_cliente = null;
    //   this.relatorio.cliente = '';
    // }
  }

  validaSaidaManifesto(event: string) {
    // if (event === '') {
    //   this.relatorio.id_manifesto = null;
    //   this.relatorio.manifesto = '';
    // }
  }

  buscaCliente(event: any) {
    // let cliente: Cliente;
    // if (event.id) {
    //   this._clienteService
    //     .getCliente(this._tokenManager.retrieve(), Number(event.id))
    //     .subscribe(
    //       data => {
    //         cliente = JSON.parse(data._body);
    //         this.relatorio.id_cliente = cliente.id;
    //         this.relatorio.cliente = cliente.razao_social;
    //       },
    //       (err: HttpErrorResponse) => {
    //         this.relatorio.id_cliente = null;
    //         this.relatorio.cliente = '';
    //       }
    //     );
    // }
  }

  buscaManifesto(event: any) {
    // let manifesto: Manifesto;
    // if (event.id) {
    //   this._manifestoService
    //     .getManifesto(this._tokenManager.retrieve(), Number(event.id))
    //     .subscribe(
    //       data => {
    //         manifesto = JSON.parse(data._body);
    //         this.relatorio.id_manifesto = manifesto.id;
    //         this.relatorio.manifesto = manifesto.descricao;
    //       },
    //       (err: HttpErrorResponse) => {
    //         this.relatorio.id_manifesto = null;
    //         this.relatorio.manifesto = '';
    //       }
    //     );
    // }
  }

  openPesquisa(): void {
    // const dialogLoginRef = this.pesquisa.open(ClienteFindComponent, {
    //   width: '600px',
    //   height: '400px',
    //   disableClose: true,
    //   data: {
    //     id: null,
    //     razao_social: null
    //   }
    // });

    // dialogLoginRef.afterClosed().subscribe(result => {
    //   if (result.id != null && result.id !== undefined) {
    //     this.relatorio.id_cliente = result.id;
    //     this.relatorio.cliente = result.razao_social;
    //   }
    // });
  }

  openPesquisaManifesto(): void {
    // const dialogLoginRef = this.pesquisa.open(ManifestoFindComponent, {
    //   width: '600px',
    //   height: '400px',
    //   disableClose: true,
    //   data: {
    //     id: null,
    //     descricao: null
    //   }
    // });

    // dialogLoginRef.afterClosed().subscribe(result => {
    //   if (result.id != null && result.id !== undefined) {
    //     this.relatorio.id_manifesto = result.id;
    //     this.relatorio.manifesto = result.descricao;
    //   }
    // });
  }

  // exportarPDF() {

  //   this.emProcessamento = true;
  //   this._relatorioService
  //     .getPrintPdf2(this._tokenManager.retrieve(), this.filtropesagem)
  //     .subscribe(data => {
  //       this.emProcessamento = false;
  //       FileSaver.saveAs(data, 'relatorio.pdf');
  //       // const fileUrl = URL.createObjectURL(data);
  //       // const tab = window.open();
  //       // tab.location.href = fileUrl;
  //     },
  //     error => {
  //       this.emProcessamento = false;
  //       const err = new HttpErrorResponse(error);
  //       console.log(err);
  //       this.dialog.error('SGR', 'Erro ao gerar o relatório.', '');
  //     },
  //   );

  //   // const pdf = new jsPDF('l', 'mm', 'a4');
  //   // const options = {
  //   //   pagesplit: false
  //   // };
  //   // pdf.addHTML(this.el.nativeElement, 10, 10, options, () => {
  //   //   pdf.save('relatorio.pdf');
  //   // });
  // }

  // exportarPDF() {

  //   this.emProcessamento = true;
  //   this._relatorioService
  //     .getPrintPdf(this._tokenManager.retrieve(), this.el.nativeElement.innerHTML)
  //     .subscribe(data => {
  //       this.emProcessamento = false;
  //       FileSaver.saveAs(data, 'relatorio.pdf');
  //       // const fileUrl = URL.createObjectURL(data);
  //       // const tab = window.open();
  //       // tab.location.href = fileUrl;
  //     },
  //     error => {
  //       this.emProcessamento = false;
  //       const err = new HttpErrorResponse(error);
  //       console.log(err);
  //       this.dialog.error('SGR', 'Erro ao gerar o relatório.', '');
  //     },
  //   );

  //   // const pdf = new jsPDF('l', 'mm', 'a4');
  //   // const options = {
  //   //   pagesplit: false
  //   // };
  //   // pdf.addHTML(this.el.nativeElement, 10, 10, options, () => {
  //   //   pdf.save('relatorio.pdf');
  //   // });
  // }

}
