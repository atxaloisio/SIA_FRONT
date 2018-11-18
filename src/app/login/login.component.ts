import { User } from './../user';
import { LoginService } from './../login.service';
import { isNullOrUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';
import { Data } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { OmieService } from '../omie/omie.service';
import { Empresa } from '../omie/empresa';
import { Perfil } from '../perfil/perfil';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  erroLogin: boolean;
  msgErroLogin = '';
  emProcessamento = false;
  empresas: Empresa[];

  valEmpresa = new FormControl('', [Validators.required]);
  valEmail = new FormControl('', [Validators.email, Validators.required]);
  valPassword = new FormControl('', [Validators.required]);

  constructor(private loginService: LoginService,
    private _omieService: OmieService,
    private _snackBar: MatSnackBar,
    public dialogLoginRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this._omieService.getListEmpresas().subscribe(
      data => {
        this.empresas = data.json();
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  onEntrarClick(): void {
    this.data.logado = false;
    let mensagem = '';
    this.emProcessamento = true;
    if (isNullOrUndefined(this.data.email)) {
      mensagem = 'e-mail do usuário não informado.';
    }

    if (isNullOrUndefined(this.data.password)) {
      if (!isNullOrUndefined(mensagem)) {
          mensagem = mensagem + '/n';
      }
      mensagem = mensagem + 'e-mail do usuário não informado.';
    }

    if ((!isNullOrUndefined(this.data.email)) &&
       (!isNullOrUndefined(this.data.password))) {
        this.loginService.Login(this.data.email, this.data.password, this.data.id_empresa).subscribe(data => {
          // console.log(data);
          this.data.Usuario = data.usuario;
          this.data.Perfil = data.perfil;
          // console.log(this.Usuario.name);
          // console.log(data.token);
          // this.getUsuarios(data.token);
          this.data.token = data.token;
          this.data.logado = data.logado;
          if (data.aprov_pendentes > 0) {
            if (data.aprov_pendentes > 1) {
              this.openSnackBar('Você possui ' + data.aprov_pendentes + ' ordens de pagamento pendentes para aprovação' , 'SIA');
            } else {
              this.openSnackBar('Você possui ' + data.aprov_pendentes + ' ordem de pagamento pendente para aprovação' , 'SIA');
            }
          }
          // this.emProcessamento = false;
          this.dialogLoginRef.close(this.data);
        },
          error => {
            this.setErroLogin(error);
        });
    }
  }

  setErroLogin(erro: any) {
    // console.log(erro.message);
    if ((!isNullOrUndefined(erro.error))) {
      this.msgErroLogin = erro.error + ': ' + erro.message;
    } else {
      this.msgErroLogin = 'Não foi possivel se comunicar com o servidor';
    }

    this.erroLogin = true;
    this.emProcessamento = false;
  }


  onNoClick(): void {
    this.data.Usuario = null;
    this.data.Perfil = new Perfil();
    this.data.token = '';
    this.data.logado = false;
    this.dialogLoginRef.close(this.data);
  }

  onResetClick(): void {
    this.data.Usuario = null;
    this.data.Perfil = new Perfil();
    this.data.token = '';
    this.data.logado = false;
    this.data.reset = true;
    this.dialogLoginRef.close(this.data);
  }

  getEmailErrorMessage() {
    let mensagem = '';
    if (this.valEmail.hasError('required')) {
      mensagem = 'Campo e-mail não informado.';
    }

    if (mensagem === '') {
      if (this.valEmail.hasError('email')) {
        mensagem = 'e-mail inválido.';
      }
    }
    return mensagem;
  }

  onEnter(value: string) {
    if (value !== '') {
      this.onEntrarClick();
    }
  }

  getPasswordErrorMessage() {
    let mensagem = '';

    if (this.valPassword.hasError('required')) {
      mensagem = mensagem + 'Campo senha não informado.';
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

}
