import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Subscription, map, take, timer } from 'rxjs';

import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, LogLevel, PublicClientApplication, RedirectRequest } from '@azure/msal-browser';

import { ToastrService } from 'ngx-toastr';

import { FormUtils, InfraModule, MessageService } from 'ngx-sp-infra';

import { AuthService } from '../../auth.service';
import { LibCustomEnvironmentService } from '../../custom/lib-custom-environment.service';
import { LibCustomLoginService } from '../../custom/lib-custom-login.service';
import { AuthStorageService } from '../../storage/auth-storage.service';
import { AuthUtilService } from '../../utils/auth-utils.service';

import { InfraIn2FaTypeId } from '../../models/infraIn2FaTypeId';
import { InfraInAuthTypeId } from '../../models/infraInAuthTypeId';

export enum LoginProgress {
	Domain = 1,
	Local = 2,
	Azure = 3
}
// ajustes ERICK
export enum SituacaoLogin {
	LOGIN = 0,
	AUTENTICACAO_2_FATORES = 1,
	ESQUECEU_SENHA = 2
};
// ajustes ERICK

@Component( {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        ReactiveFormsModule,
        InfraModule,
        CommonModule,
		NgIf
    ],
    preserveWhitespaces: true
} )
export class LoginComponent implements OnInit {

	constructor(
		@Inject(MSAL_GUARD_CONFIG) private _msalGuardConfiguration: MsalGuardConfiguration,
		private _msalService: MsalService,		
		public _customLoginService: LibCustomLoginService,
		private _formBuilder: FormBuilder,
		private _authUtilService: AuthUtilService,
		private _authService: AuthService,
		private _customEnvironmentService: LibCustomEnvironmentService,
		private _authStorageService: AuthStorageService,
		private _title: Title,
		private _router: Router,
		private _toastrService: ToastrService,
		
		// Exibição de alerta para caso o payload do login OS não seja infromado corretamente
		private _messageService: MessageService,
	) { }

	// #region ==========> PROPERTIES <==========

	// #region PRIVATE

	private _situacaoLogin: SituacaoLogin = SituacaoLogin.LOGIN;

	// #endregion PRIVATE

	// #region PUBLIC

	//  Variáveis específicas para funcionalidades padrões dos formulários
	public currentTime: Date = new Date();
	public year: number = this.currentTime.getFullYear();

	public isLoadingDomain: boolean = false;
	public isLoadingLogin: boolean = false;
	public isLoadingAzure: boolean = false;
	public isLoadingForgottenPassword: boolean = false;
	public isLoadingSendAuthentication2Fa: boolean = false;
	public isLoadingGetNewCode: boolean = false;
	public showParmsAuthentication2Fa = false;
	public loginProgress: number = LoginProgress.Domain;

	public get situacaoLogin(): SituacaoLogin { return this._situacaoLogin; }
	public set situacaoLogin(value: SituacaoLogin) {
		this._situacaoLogin = value;

		if (value === SituacaoLogin.ESQUECEU_SENHA) this.createFormForgottenPassword();
	}

	// #endregion PUBLIC

	// #region Timer

	private _subscription: Subscription = new Subscription();
	private timerDuration: number = 90;
	public secondsLeft: number = this.timerDuration;

	private countdown$ = timer(0, 1000).pipe(
		take(this.timerDuration + 1),

		map(secondsElapsed => this.timerDuration - secondsElapsed)
	);

	// #endregion Timer

	// #region ==========> FORM BUILDER <==========

	public formDomain!: FormGroup;
	public formLogin!: FormGroup;
	public formAzure!: FormGroup;
	public formFgtPsw!: FormGroup;
	public formAuthentication2Fa!: FormGroup;

	//  Propriedade necessário para que a classe static FormUtils possa ser utilizada no Html
	public get FormUtils(): typeof FormUtils {
		return FormUtils;
	}

	// #region FORM DATA

	//  Variáveis específicas para funcionalidades padrões dos formulários (Login)
	public get dominio(): string {
		return this.formDomain.get('dominio')?.value;
	}

	public get usuario(): string {
		return this.formLogin.get('usuario')?.value;
	}

	public get senha(): string {
		return this.formLogin.get('senha')?.value;
	}

	public get usuarioAzure(): string {
		return this.formAzure.get('usuario')?.value;
	}

	public get senhaAzure(): string {
		return this.formAzure.get('senha')?.value;
	}

	//  Variáveis específicas para funcionalidades padrões dos formulários (RequestRecoverPassword)
	public get dominioFgtPsw(): string {
		return this.formFgtPsw.get('dominioFgtPsw')?.value;
	}

	public get usuarioFgtPsw(): string {
		return this.formFgtPsw.get('usuarioFgtPsw')?.value;
	}

	//  Variáveis específicas para funcionalidades padrões dos formulários (Autenticação 2 Fatores)
	public get code(): string {
		return this.formAuthentication2Fa.get('code')?.value;
	}

	// #endregion FORM DATA

	// #endregion ==========> PROPERTIES <==========

	async ngOnInit() {

		this._title.setTitle(this._customLoginService.loginPageTitle);

		if (this._customLoginService.loginTitle != "") {
			document.getElementById("title")!.innerHTML = this._customLoginService.loginTitle;
		}

		if (this._customLoginService.loginSubtitle != "") {
			document.getElementById("subtitle")!.innerHTML = this._customLoginService.loginSubtitle;
		}

		this.loginProgress = LoginProgress.Domain;
		this.createFormDomain();
		
		if (this._router.url.toLowerCase().startsWith('/auth/login#code=')) {
			this.loginProgress = LoginProgress.Azure;
			this.createFormAzure();

			await this.initMsalForLoginOk().then;

			return;
		}
	}

	// #region FORM VALIDATORS

	//  Método para configuração dos campos de edição do formulário (Login)
	private createFormDomain(): void {
		//  Dados originais de Login (Domínio)

		if (this._customEnvironmentService.production)
		{
			this.formDomain = this._formBuilder.group({
				dominio: ['', [Validators.required, Validators.maxLength(50)]],
			});
			}
		else
		{
			this.formDomain = this._formBuilder.group({
				dominio: [this._customLoginService.loginDesenvDomain, [Validators.required, Validators.maxLength(50)]],
			});
		}

	}

	private createFormLogin(): void {
		//  Dados originais de Login (Usuário e Senha)

		if (this._customEnvironmentService.production)
		{
			this.formLogin = this._formBuilder.group({
				usuario: ['', [Validators.required, Validators.maxLength(100)]],
				senha: ['', [Validators.required, Validators.maxLength(100)]]
			});
			}
		else
		{
			this.formLogin = this._formBuilder.group({
				usuario: [this._customLoginService.loginDesenvUser, [Validators.required, Validators.maxLength(100)]],
				senha: [this._customLoginService.loginDesenvPassword, [Validators.required, Validators.maxLength(100)]]
			});
		}

	}

	private createFormAzure(): void {
		//  Dados originais de Login (Azure)

		this.formAzure = this._formBuilder.group({
			usuario: ['', [Validators.required, Validators.maxLength(100)]],
			senha: ['', [Validators.required, Validators.maxLength(100)]]
		});
	}

	//  Método para configuração dos campos de edição do formulário (RequestRecoverPassword)
	private createFormForgottenPassword(): void {

		this.formFgtPsw = this._formBuilder.group({
			dominioFgtPsw: ['', [Validators.required, Validators.maxLength(50)]],
			usuarioFgtPsw: ['', [Validators.required, Validators.maxLength(100)]],
		});

		this.formFgtPsw.get('dominioFgtPsw')?.setValue('');	
		this.formFgtPsw.get('usuarioFgtPsw')?.setValue('');	
	}

	//  Método para configuração dos campos de edição do formulário (Autenticação 2 Fatores)
	private createFormAuthentication2Fa(): void {

		this.formAuthentication2Fa = this._formBuilder.group({
			code: ['', [Validators.required, Validators.maxLength(6)]],
		});

		this.formAuthentication2Fa.get('code')?.setValue('');
	}

	// #endregion FORM VALIDATORS

	// #endregion ==========> FORM BUILDER <==========

	// #region ==========> SERVICE METHODS <==========

	// #region Azure

	private async configMsal() {
		const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
		const hostAuthLogin = !this._customEnvironmentService.production ? "http://localhost:4200/auth/login" : `${ this._customEnvironmentService.hostName }/SisproErpCloud/${ this._customEnvironmentService.product }/auth/login`;

		this._msalService.instance = new PublicClientApplication({
			auth: {
				clientId: `${ this._authStorageService.azureClientId }`,
				authority: `https://login.microsoftonline.com/${ this._authStorageService.azureTenantId }`,
				redirectUri: hostAuthLogin + "/",
				postLogoutRedirectUri: hostAuthLogin,
				navigateToLoginRequestUrl: true
				},
			cache: {
				cacheLocation: "localStorage",
				storeAuthStateInCookie: isIE
			},
			system: {
				loggerOptions: {
					loggerCallback: (logLevel, message, containsPii) => {
						console.log(message);
						},
						logLevel: LogLevel.Error,
						piiLoggingEnabled: false
				}
			}
		});
	}

	private async initMsal() {
		await this.configMsal().then(() => {
			this._msalService.handleRedirectObservable().subscribe({
				next: (result: AuthenticationResult) => {

					if (!this._msalService.instance.getActiveAccount() && this._msalService.instance.getAllAccounts().length > 0) {
						this._msalService.instance.setActiveAccount(result.account);
					}

				},
				error: (error) => {
					this._toastrService.warning(`Erro na inicialização dos parâmetros de configuração do 'Azure': ${ error }`, '', { timeOut: 3000, extendedTimeOut: 2000 } );
				}
			});
		});
	}

	private async initMsalForLoginOk() {
		await this.configMsal().then(() => {
			this._msalService.handleRedirectObservable().subscribe({
				next: (result: AuthenticationResult) => {
					
					if (!this._msalService.instance.getActiveAccount() && this._msalService.instance.getAllAccounts().length > 0) {
						this._msalService.instance.setActiveAccount(result.account);
					}

					this.logOnAzureOk();
 				},
				error: (error) => {
					this.loginProgress = LoginProgress.Domain;
					this.createFormDomain();

					this._router.navigate(["/auth/login"]);
			
					this._toastrService.warning(`Erro na inicialização dos parâmetros de configuração do 'Azure': ${ error }`, '', { timeOut: 3000, extendedTimeOut: 2000 } );
				}
			});
		});
	}

	// #endregion Azure
	
	// #region GET

	// Obtém a Url do Config Erp
	public geturlErpConfig(): string {
		// verificar depois 
		return `${this._customEnvironmentService.hostName}/SisproErpCloud/ConfigErp`;
	}

	/*
	* Obtém os parâmetros de método de autenticação
	*/
	public async getAuthentication() {

		if (this.formDomain.valid) {
			this.isLoadingDomain = true;

			this._authService.getAuthentication(this.dominio).subscribe({
				next: async response => {

					if (response.InfraInAuthTypeId == InfraInAuthTypeId.Local) {
						this.loginProgress = LoginProgress.Local;
						this.createFormLogin();
					} else if (response.InfraInAuthTypeId == InfraInAuthTypeId.Azure) {
						this.loginProgress = LoginProgress.Azure;
						this.createFormAzure();

						await this.initMsal();
					} else if (response.InfraInAuthTypeId == InfraInAuthTypeId.LDAP) {
						this.loginProgress = LoginProgress.Local;
						this.createFormLogin();						
					}

					this.isLoadingDomain = false;
				},
				error: (error) => {
					this.isLoadingDomain = false;

					this._authUtilService.showHttpError(error);
				},
			})
		} else {
			FormUtils.validateFields(this.formDomain);
		}
	}

	// #endregion GET

	// #region POST

	//  Executa o Login
	public logOn(): void {

		if (this.formLogin.valid) {
			this.isLoadingLogin = true;

			this._authService.login(this.dominio, this.usuario, this.senha).subscribe({
				next: (response) => {
					this.isLoadingLogin = false;
					
					if (response.FeedbackMessage != "") {
						this._toastrService.warning( response.FeedbackMessage, '', { timeOut: 3000, extendedTimeOut: 2000 } );
						return;
					}
	
					//Incialização de Senha
					if (response.InitializePassword) {
						let param: string = btoa(`true$${ this.dominio }$${ this.usuario }$${response.StatusSenha}`);
						this._router.navigate([`auth/login/novaSenha/${ param }`]);
						this._toastrService.success("Verifique no seu e-mail o código de validação.");
					}
	
					if (this._authStorageService.infraInAuthTypeId == InfraInAuthTypeId.Local && this._authStorageService.infraIn2FaTypeId != null && this._authStorageService.infraIn2FaTypeId == InfraIn2FaTypeId.Email && this._authStorageService.is2FaEnabled) {
						this.createFormAuthentication2Fa();
	
						this._subscription = this.countdown$.subscribe(secondsLeft => {
							this.secondsLeft = secondsLeft;
						});
						
						this.showParmsAuthentication2Fa = true;
						this._toastrService.success("Verifique no seu e-mail o código de validação.");
					}
				},
				error: (error) => {
					this.isLoadingLogin = false;
					this._authUtilService.showHttpError(error);
				},
			});
		} else {
			FormUtils.validateFields(this.formLogin);
		}
			
	}

	//  Executa o Login (Admin)
	public logOnAdmin(): void {

		if (this.formAzure.valid) {

			if (this.usuarioAzure.toUpperCase() != "ADMIN") {
					this._toastrService.warning( "Esta opção é somente permitida para o usuário 'Admin'.", '', { timeOut: 3000, extendedTimeOut: 2000 } );
			} else {
				const infraInAuthTypeId: number = this._authStorageService.infraInAuthTypeId;
				const infraIn2FaTypeId: number | null | undefined = this._authStorageService.infraIn2FaTypeId;
				const is2FaEnabled: boolean = this._authStorageService.is2FaEnabled;
	
				this._authStorageService.infraInAuthTypeId = InfraInAuthTypeId.Local;
				this._authStorageService.infraIn2FaTypeId = null;
				this._authStorageService.is2FaEnabled = false;
				
				this.isLoadingAzure = true;

				this._authService.login(this.dominio, this.usuarioAzure, this.senhaAzure).subscribe({
					next: (response) => {
						this.isLoadingAzure = false;
						
						if (response.FeedbackMessage != "") {
							this._toastrService.warning( response.FeedbackMessage, '', { timeOut: 3000, extendedTimeOut: 2000 } );
							return;
						}
		
						//Incialização de Senha
						if (response.InitializePassword) {
							let param: string = btoa(`true$${ this.dominio }$${ this.usuarioAzure }$${response.StatusSenha}`);
							this._router.navigate([`auth/login/novaSenha/${ param }`]);
							this._toastrService.success("Verifique no seu e-mail o código de validação.");
						}
		
						if (this._authStorageService.infraInAuthTypeId == InfraInAuthTypeId.Local && this._authStorageService.infraIn2FaTypeId != null && this._authStorageService.infraIn2FaTypeId == InfraIn2FaTypeId.Email && this._authStorageService.is2FaEnabled) {
							this.createFormAuthentication2Fa();
		
							this._subscription = this.countdown$.subscribe(secondsLeft => {
								this.secondsLeft = secondsLeft;
							});
							
							this.showParmsAuthentication2Fa = true;
							this._toastrService.success("Verifique no seu e-mail o código de validação.");
						}
					},
					error: (error) => {
						this.isLoadingAzure = false;
						this._authUtilService.showHttpError(error);
					},
				});
		
				this._authStorageService.infraInAuthTypeId = infraInAuthTypeId;
				this._authStorageService.infraIn2FaTypeId = infraIn2FaTypeId;
				this._authStorageService.is2FaEnabled = is2FaEnabled;
			}
		} else {
			FormUtils.validateFields(this.formAzure);
		}	
		
	}

	//  Executa o Login (Azure)
	public logOnAzure(): void {

		if (this._msalGuardConfiguration.authRequest){
			this._msalService.loginRedirect({...this._msalGuardConfiguration.authRequest} as RedirectRequest);
		} else {
			this._msalService.loginRedirect();
		}
		
	}

	//  Executa o Login após o retorno ok do Azure
	public async logOnAzureOk() {
		let username = this._msalService.instance.getActiveAccount()?.idTokenClaims?.preferred_username;

		this._authService.loginAzure(this._authStorageService.dominio, username ?? "").subscribe({
			next: (response) => {

				if (response.FeedbackMessage != "") {
					this._toastrService.warning( response.FeedbackMessage, '', { timeOut: 3000, extendedTimeOut: 2000 } );
				}

			},
			error: (error) => {
				this.loginProgress = LoginProgress.Domain;
				this.createFormDomain();

				this._router.navigate(["/auth/login"]);

				this._authUtilService.showHttpError(error);
			},
		});

	}

	// Envia requisição para esquecer senha
	public sendForgottenPassword(): void {

		if (this.formFgtPsw.valid) {
			this.isLoadingForgottenPassword = true;

			this._authService.getAuthentication(this.dominio).subscribe({
				next: response => {
					this.forgottenPassword();
				},
				error: (error) => {
					this.isLoadingForgottenPassword = false;
					this._authUtilService.showHttpError(error);
				}
			});
		} else {
			FormUtils.validateFields(this.formFgtPsw);
		}
	}

	// Requisição para esquecer senha
	public forgottenPassword(): void {

		this._authService.forgottenPassword(this.formFgtPsw.value).subscribe({
			next: () => {
				this.isLoadingForgottenPassword = false;

				let param: string = btoa(`false$${ this.dominioFgtPsw }$${ this.usuarioFgtPsw }$${3}`);
				this._router.navigate([`auth/login/novaSenha/${ param }`]).then(() => {
					this._toastrService.success("Verifique no seu e-mail o código de validação.");
				});
			},
			error: (error) => {
				this.isLoadingForgottenPassword = false;
				this._authUtilService.showHttpError(error);
			},
		});

	}

	// Envia requisição para validar código 2 fatores
	public sendCode(): void {

		if (this.formAuthentication2Fa.valid) {
			this.isLoadingSendAuthentication2Fa = true;

			this.validateCode();
		} else {
			FormUtils.validateFields(this.formAuthentication2Fa);
		}
		
	}

	// Validação do código 2 fatores
	public validateCode(): void {

		this._authService.validateAuthentication2Fa(this.code).subscribe({
			next: (response) => {
				this._subscription.unsubscribe();

				this.isLoadingSendAuthentication2Fa = false;
			},
			error: (error) => {
				this.isLoadingSendAuthentication2Fa = false;

				this._authUtilService.showHttpError(error);
			},
		});

	}

	// Envia requisição para validar código 2 fatores
	public getNewCode(): void {
		this.isLoadingGetNewCode = true;

		this._authService.getAuthentication(this._authStorageService.dominio).subscribe({
			next: response => {
				this._subscription = this.countdown$.subscribe(secondsLeft => {
					this.secondsLeft = secondsLeft;
				});

				this.GetNewCode2Fa();
			},
			error: (error) => {
				this._authUtilService.showHttpError(error);
			},
		});

	}

	// Validação do código 2 fatores
	public GetNewCode2Fa(): void {

		this._authService.GetNewCode2Fa().subscribe({
			next: (response) => {
				this.isLoadingGetNewCode = false;

				this._toastrService.success("Enviamos um novo código para o endereço de e-mail vinculado ao seu usuário. Verifique o lixo eletrônico (SPAM) da sua caixa de entrada, caso não tenha encontrado nossa mensagem.");
			},
			error: (error) => {
				this.isLoadingGetNewCode = false;
				
				this._authUtilService.showHttpError(error);
			},
		});

	}

	// #endregion POST

	// #region UTILIDADES

	// Retorno para a tela de login
	public voltar(): void {
		this.loginProgress = LoginProgress.Domain;
		this.createFormDomain();

		this._subscription.unsubscribe();
		this.showParmsAuthentication2Fa = false;

		this._authStorageService.logout();

		this._router.navigate(["/auth/login"]);
	}	

	// Retorno para a tela de login
	public returnDomain(): void {
		this.loginProgress = LoginProgress.Domain;
		this.createFormDomain();

		this._authStorageService.logout();

		this._router.navigate(["/auth/login"]);
	}

	private showIntegracaoAlert(): void {
		const warningMessage = this._authService.consumePendingWarning();

		if (warningMessage) {
		this._messageService.showAlertWarning(warningMessage);
		}
	}

	// #endregion UTILIDADES

	// #endregion ==========> SERVICE METHODS <==========

}
