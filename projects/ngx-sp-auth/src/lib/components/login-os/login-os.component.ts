import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfraModule, MessageService } from 'ngx-sp-infra';
import { Subscription, take, timer } from 'rxjs';
import { AuthService } from '../../auth.service';
import { LoginForm } from '../../models/login-form';
import { LoginOSModel } from '../../models/login-os.model';
import { ProjectUtilservice } from '../../project/project-utils.service';
import { AuthStorageService } from '../../storage/auth-storage.service';

@Component({
  selector: 'login-os',
	standalone: true,
  imports: [
    InfraModule
  ],
  template: `
    <div class="d-flex flex-column justify-content-center align-items-center h-100 w-100 bg-light" >

      @switch (loginStatus) {
        @case ("loading") {
          <div class="text-center">
            <img src="assets/imgs/logo.png" alt="Loading Logo" class="mb-3" style="max-width: 150px;">
            <h2 class="fw-bold">Carregando Informações...</h2>
            <p class="text-muted">Por favor, aguarde enquanto os dados são carregados.</p>
          </div>
          <div class="spinner-border text-primary" role="status"></div>
        }
        @case ("success") {
          <div class="text-center">
            <img src="assets/imgs/logo.png" alt="Loading Logo" class="mb-3" style="max-width: 150px;">
            <h2 class="fw-bold">Login efetuado com sucesso</h2>
            <h2 class="fw-bold">Bem-vindo à V6!</h2>
            @if (timer > 0) { <span class="text-muted">Redirecionando você em {{ timer }} segundos...</span> }
            @else { <span class="text-muted">Se você não foi redirecionado automaticamente, <b class="text-primary glb-cursor-pointer" (click)="redirect()">clique aqui</b></span> }
            <div><lib-icon iconName="p-check" iconColor="green" [iconSize]="50" /></div>
          </div>
        }
        @case ("error") {
          <div class="text-center">
            <img src="assets/imgs/logo.png" alt="Loading Logo" class="mb-3" style="max-width: 150px;">
            <h2 class="text-danger fw-bold">Não foi possível efetuar o login</h2>
            <span class="text-muted">Verifique os parâmetros enviados e tente novamente.</span>
            <div><lib-icon iconName="p-pare" iconColor="red" [iconSize]="50" /></div>
          </div>
        }
        @case ("updated") {
          <div class="text-center">
            <img src="assets/imgs/logo.png" alt="Loading Logo" class="mb-3" style="max-width: 150px;">
            <h2 class="fw-bold">Sessão atualizada com sucesso</h2>
            @if (timer > 0) { <span class="text-muted">Redirecionando você em {{ timer }} segundos...</span> }
            @else { <span class="text-muted">Se você não foi redirecionado automaticamente, <b class="text-primary glb-cursor-pointer" (click)="redirect()">clique aqui</b></span> }
            <div><lib-icon iconName="p-check" iconColor="green" [iconSize]="50" /></div>
          </div>
        }
        @default {
          <div class="text-center">
            <img src="assets/imgs/logo.png" alt="Loading Logo" class="mb-3" style="max-width: 150px;">
            <h2 class="fw-bold">Carregando Informações...</h2>
            <p class="text-muted">Por favor, aguarde enquanto os dados são carregados.</p>
          </div>
          <div class="spinner-border text-primary" role="status"></div>
        }
      }

    </div>
  `,
  styles: ``
})
export class LoginOSComponent implements OnInit, OnDestroy {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _parmsLogin!: LoginForm;
  private _loginOSModel?: LoginOSModel;
  
  private _timerSubscription: Subscription | undefined;
  // #endregion PRIVATE

  // #region PUBLIC
  public loginStatus: "loading" | "success" | "error" | "updated" = "loading";
  public timer: number = 3;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor(
    private _authService: AuthService,
		private _projectUtilService: ProjectUtilservice,
    private _route: ActivatedRoute,
    private _router: Router,
    private _storageService: AuthStorageService,
    private _messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getParams();
    this.logOn();
  }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> API METHODS <==========

  // #region LOGIN
  public logOn(): void {
      this.loginStatus = "loading";

      let status: "none" | "keep" | "updated" = "none";

      const currDominio = this._storageService.dominio ?? undefined;
      const currUsuario = this._storageService.user ?? undefined;
  
      this._authService.getAuthentication(this._loginOSModel!.dominio).subscribe({
        next: () => {

          if (currDominio === this._loginOSModel!.dominio && currUsuario === this._loginOSModel!.usuario) {
            status = "keep";
            this.redirect();
            return;
          }

          status = (!currDominio || !currUsuario) ? "none" : "updated";

          this._authService.loginOS(this._parmsLogin, this._loginOSModel!.serialV6).subscribe({
            next: () => {
              if (status === "none") {
                this.startTimer();
                this.loginStatus = "success";
              }
              else {
                this.startTimer();
                this.loginStatus = "updated";
              }
            },
            error: (error) => {
              this.loginStatus = "error";
              this._projectUtilService.showHttpError(error);
            },
          });
        },
        error: (error) => {
          this.loginStatus = "error";
          this._projectUtilService.showHttpError(error);
        }
      });
    }
  // #endregion LOGIN

  // #endregion ==========> API METHODS <==========


  // #region ==========> UTILS <==========
  public redirect(): void {
    let hostname = window.location.host == "localhost" ? "siscandesv6.sispro.com.br" : window.location.host;
    let baseURL = `https://${hostname}/SisproErpCloud`;

    if (!this._loginOSModel!.redirectUrl) this._router.navigateByUrl("/home");
    else window.location.replace(`${baseURL}${this._loginOSModel!.redirectUrl}`);
  }

  private startTimer(): void {
    this._timerSubscription = timer(0, 1000)
      .pipe(take(this.timer + 1))
      .subscribe(count => {
        this.timer = this.timer - count;
        if (this.timer === 0) this.redirect();
    });
  }



  private getParams(): void {
    const payloadString = this._route.snapshot.queryParamMap.get('payload');

    if (!payloadString) {
      this._messageService.showAlertDanger('Payload não encontrado na URL.');
      this.loginStatus = "error";
      
      console.warn('Payload não encontrado na URL.');
      throw new Error('Payload não encontrado na URL.');
    }

    try {
      const payloadJson = JSON.parse(atob(payloadString)) as LoginOSModel;
      
      this._loginOSModel = new LoginOSModel({
        dominio: payloadJson.dominio ?? '',
        usuario: payloadJson.usuario ?? '',
        redirectUrl: payloadJson.redirectUrl ?? '',
        serialV6: payloadJson.serialV6 ?? ''
      });

      this._parmsLogin = {
        dominio: payloadJson.dominio,
        usuario: payloadJson.usuario,
        senha: ""
      };
    }
    catch (error) {
      this._messageService.showAlertDanger('Erro ao fazer parse do payload.');
      this.loginStatus = "error";

      console.error('Erro ao fazer parse do payload:', error);
      throw error;
    }
  }
  // #endregion ==========> UTILS <==========


  ngOnDestroy(): void {
    this._timerSubscription?.unsubscribe();
  }

}
