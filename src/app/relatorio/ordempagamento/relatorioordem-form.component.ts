import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ViewChildren, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { OrdemPagamento } from '../../ordempagamento/ordempagamento';
import { RelatorioService } from '../relatorio.service';

@Component({
  selector: 'app-relatorioordem-form',
  templateUrl: './relatorioordem-form.component.html',
  styleUrls: ['./relatorioordem-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RelatorioOrdemFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  // relatorio: Relatorio;
  emProcessamento = false;
  exibeIncluir = false;
  hoje: Date;
  ordempagamentos: OrdemPagamento[];
  contagem = 0;

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('relatorio') el: ElementRef;

  constructor(private _relatorioService: RelatorioService) {}

  ngOnInit() {
    this.emProcessamento = true;
    this.hoje = new Date();
    this.hoje.setDate(this.hoje.getDate() - 1);
    // this.relatorio = new Relatorio();

    // this._route.data.subscribe(data => {
    //   console.log(data.objeto);
    // });
    this.ordempagamentos = new Array<OrdemPagamento>();
    this.ordempagamentos = this._relatorioService.getOrdemPagamentos();
    this.emProcessamento = false;

    // this.receitas.push(new Receita(new Date(Date.now()), '2323', 'AÇO INOX', 'KARDEC', 'KARDEC', 200, 'KG', 2.50, 250));
    //#region Campos filtragem

    //#endregion
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
    //   .getRelatorioRelatorioCliente(this._tokenManager.retrieve(), this.relatorio)
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
    //     this.dialog.error('SIA', 'Erro ao gerar o relatório.', '');
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
    //           this.dialog.success('SIA', 'Relatorio salvo com sucesso.');
    //         },
    //         error => {
    //           this.emProcessamento = false;
    //           this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
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
    //       this.dialog.success('SIA', 'Relatorio salvo com sucesso.');
    //     },
    //     error => {
    //       this.emProcessamento = false;
    //       this.dialog.error('SIA', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
    //     },
    //   );
    //   }
    // } else {
    //   this.emProcessamento = false;
    //   this.dialog.warning('SIA', 'Campos obrigatórios não preenchidos');
    // }
  }

  btnIncluir_click() {
    // this.relatorio = new Relatorio();
  }



  validaSaida() {
    // if (event === '') {
    //   this.relatorio.id_cliente = null;
    //   this.relatorio.cliente = '';
    // }
  }

  validaSaidaManifesto() {
    // if (event === '') {
    //   this.relatorio.id_manifesto = null;
    //   this.relatorio.manifesto = '';
    // }
  }

  buscaCliente() {
    // let cliente: Cliente;
    // if (event.id) {
    //   this._clienteService
    //     .getCliente(this._tokenManager.retrieve(), Number(event.id))
    //     .subscribe(
    //       data => {
    //         cliente = data.json();
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

  buscaManifesto() {
    // let manifesto: Manifesto;
    // if (event.id) {
    //   this._manifestoService
    //     .getManifesto(this._tokenManager.retrieve(), Number(event.id))
    //     .subscribe(
    //       data => {
    //         manifesto = data.json();
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

  exportarPDF() {

    // this.emProcessamento = true;
    // this._relatorioService
    //   .getPrintPdf2(this._tokenManager.retrieve(), this.filtroRelatorio)
    //   .subscribe(data => {
    //     this.emProcessamento = false;
    //     FileSaver.saveAs(data, 'relatorio.pdf');
    //     // const fileUrl = URL.createObjectURL(data);
    //     // const tab = window.open();
    //     // tab.location.href = fileUrl;
    //   },
    //   error => {
    //     this.emProcessamento = false;
    //     const err = new HttpErrorResponse(error);
    //     console.log(err);
    //     this.dialog.error('SIA', 'Erro ao gerar o relatório.', '');
    //   },
    // );

    // const pdf = new jsPDF('l', 'mm', 'a4');
    // const options = {
    //   pagesplit: false
    // };
    // pdf.addHTML(this.el.nativeElement, 10, 10, options, () => {
    //   pdf.save('relatorio.pdf');
    // });
  }

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
  //       this.dialog.error('SIA', 'Erro ao gerar o relatório.', '');
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

  quebraPagina(): boolean {
    this.contagem += 1;
    if (this.contagem === 3) {
      this.contagem = 0;
      return true;
    } else {
      return false;
    }
  }
}
