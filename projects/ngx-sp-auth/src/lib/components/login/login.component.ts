import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { map, Subscription, take, timer } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { FormUtils, MessageService } from 'ngx-sp-infra';
import { AuthService } from '../../auth.service';
import { EnvironmentService } from '../../environments/environments.service';
import { LibCustomLoginService } from '../../custom/custom-login.service';
import { ServerService } from '../../server/server.service';
import { AuthStorageService } from '../../storage/auth-storage.service';

@Component({
	selector: 'lib-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	standalone: false,
	preserveWhitespaces: true,
})
export class LoginComponent implements OnInit {

	constructor(
		private _bsModalService: BsModalService,
		private _messageService: MessageService,
		private _formBuilder: FormBuilder,
		private _authService: AuthService,
		private _serverService: ServerService,
		private _environmentService: EnvironmentService,
		private _authStorageService: AuthStorageService,
		public _customLoginService: LibCustomLoginService,
		private _title: Title,
		private _router: Router,
		private _toastrService: ToastrService
	) { }

	// #region ==========> PROPERTIES <==========

	// #region PRIVATE

	private idFgtPsw: number = 1;

	// #endregion PRIVATE

	// #region PUBLIC

	public modalRef?: BsModalRef;

	//  Variáveis específicas para funcionalidades padrões dos formulários
	public currentTime: Date = new Date();
	public year: number = this.currentTime.getFullYear();

	public isLoading: boolean = false;
	public isLoadingSendAuthentication2Fa: boolean = false;
	public showParmsAuthentication2Fa = false;
	public isLoadingGetNewCode: boolean = false;

	//propriedades que vão receber os valores do customLoginService ####VERIFICAR DEPOIS####

	// @Input() customPropriedadesLogin?: CustomPropriedadesLogin;

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
	public form: FormGroup = new FormGroup({});
	public formFgtPsw: FormGroup = new FormGroup({});;
	public formAuthentication2Fa: FormGroup = new FormGroup({});;

	//  Propriedade necessário para que a classe static FormUtils possa ser utilizada no Html
	public get FormUtils(): typeof FormUtils {
		return FormUtils;
	}

	// #region FORM DATA

	//  Variáveis específicas para funcionalidades padrões dos formulários (Login)
	public get dominio(): string {
		return this.form.get('dominio')?.value;
	}

	public get usuario(): string {
		return this.form.get('usuario')?.value;
	}

	public get senha(): string {
		return this.form.get('senha')?.value;
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

	ngOnInit(): void {

		this._title.setTitle(this._customLoginService.loginPageTitle);

		if (this._customLoginService.loginTitle != "") {
			document.getElementById("title")!.innerHTML = this._customLoginService.loginTitle;
		}

		if (this._customLoginService.loginSubtitle != "") {
			document.getElementById("subtitle")!.innerHTML = this._customLoginService.loginSubtitle;
		}
		this.createForm();
	}

	// #region FORM VALIDATORS

	//  Método para configuração dos campos de edição do formulário (Login)
	private createForm(): void {

		//  Dados originais de Login
		if (this._environmentService.production) {
			this.form = this._formBuilder.group({
				dominio: ['', [Validators.required, Validators.maxLength(50)]],
				usuario: ['', [Validators.required, Validators.maxLength(100)]],
				senha: ['', [Validators.required, Validators.maxLength(100)]]
			});
		}
		else {
			this.form = this._formBuilder.group({
				dominio: [this._customLoginService.loginDesenvDomain, [Validators.required, Validators.maxLength(50)]],
				usuario: [this._customLoginService.loginDesenvUser, [Validators.required, Validators.maxLength(100)]],
				senha: [this._customLoginService.loginDesenvPassword, [Validators.required, Validators.maxLength(100)]]
			});
		}
	}

	//  Método para configuração dos campos de edição do formulário (RequestRecoverPassword)
	private createFormForgottenPassword(): void {

		this.formFgtPsw = this._formBuilder.group({
			dominioFgtPsw: ['', [Validators.required, Validators.maxLength(50)]],
			usuarioFgtPsw: ['', [Validators.required, Validators.maxLength(100)]],
		});

		this.formFgtPsw.get('recoverCdominioFgtPswodeRecPsw')?.setValue('');
		this.formFgtPsw.get('usuarioFgtPsw')?.setValue('');
	}

	//  Método para configuração dos campos de edição do formulário (Autenticação 2 Fatores)
	private createFormAuthentication2Fa(): void {

		this.formAuthentication2Fa = this._formBuilder.group({
			code: ['', [Validators.required, Validators.maxLength(6)]],
		});

		this.form.get('code')?.setValue('');
	}

	// #endregion FORM VALIDATORS

	// #endregion ==========> FORM BUILDER <==========

	// #region ==========> SERVICE METHODS <==========

	// #region GET

	// Obtém a Url do Config Erp
	public geturlErpConfig(): string {
		// verificar depois 
		return `${this._environmentService.hostName}/SisproErpCloud/ConfigErp`;
	}

	/*
	* Obtém os parâmetros de configuração do servidor para Autenticação Básica de segurança
	*/
	public getServer(): void {

		if (this.form.valid) {
			this.isLoading = true;

			this._serverService.getServer().subscribe({
				next: response => {
					this.logOn();
				},
				error: (error) => {
					this.isLoading = false;

					//this._projectUtilservice.showHttpError(error);
					this._messageService.showAlertDanger(error);

					//pode ser substituido por console.error
					throw new Error(error)
				},
			})
		} else {
			FormUtils.validateFields(this.form);
		}
	}

	// #endregion GET

	// #region POST

	//  Executa o Login
	public logOn(): void {
		this._authService.login(this.form.value).subscribe({
			next: (response) => {
				this.isLoading = false;

				if (response.FeedbackMessage != "") {
					this._toastrService.warning(response.FeedbackMessage,
						'',
						{
							timeOut: 3000,
							extendedTimeOut: 2000
						}
					);

					return;
				}

				//Incialização de Senha
				if (response.InitializePassword) {
					let param: string = btoa(`true$${ this.dominio }$${ this.usuario }$${response.statusSenha}`);

					this._router.navigate([`auth/login/novaSenha/${param}`]);

					this._toastrService.success("Verifique no seu e-mail o código de validação.");
				}

				if (response.InfraInAuthTypeId == 1 && response.InfraIn2FaTypeId != null && response.InfraIn2FaTypeId == 1 && response.Is2FaEnabled) {
					this.createFormAuthentication2Fa();

					this._subscription = this.countdown$.subscribe(secondsLeft => {
						this.secondsLeft = secondsLeft;
					});

					this.showParmsAuthentication2Fa = true;

					this._toastrService.success("Verifique no seu e-mail o código de validação.");
				}

			},
			error: (error) => {
				this.isLoading = false;

				//this._projectUtilservice.showHttpError(error);
				this._messageService.showAlertDanger(error);
				throw new Error(error)
			},
		});

	}

	// Envia requisição para esquecer senha
	public sendForgottenPassword(): void {

		if (this.formFgtPsw.valid) {
			this._serverService.getServer().subscribe({
				next: response => {
					this.forgottenPassword();
				},
				error: (error) => {
					//this._projectUtilservice.showHttpError(error);
					this._messageService.showAlertDanger(error);
					throw new Error(error)
				},
			})

		} else {
			FormUtils.validateFields(this.formFgtPsw);
		}

	}

	// Requisição para esquecer senha
	public forgottenPassword(): void {

		this._authService.forgottenPassword(this.formFgtPsw.value).subscribe({
			next: (response) => {
				this.closeForgottenPasswordModal();

				let param: string = btoa(`false$${this.dominioFgtPsw}$${this.usuarioFgtPsw}$${3}`);

				this._router.navigate([`auth/login/novaSenha/${param}`]);

				this._toastrService.success("Verifique no seu e-mail o código de validação.");
			},
			error: (error) => {
				//this._projectUtilservice.showHttpError(error);
				this._messageService.showAlertDanger(error);
				throw new Error(error)
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

				//this._projectUtilservice.showHttpError(error);
				this._messageService.showAlertDanger(error);
				throw new Error(error)
			},
		});

	}

	// Envia requisição para validar código 2 fatores
	public getNewCode(): void {
		this.isLoadingGetNewCode = true;

		this._serverService.getServer().subscribe({
			next: response => {
				this._subscription = this.countdown$.subscribe(secondsLeft => {
					this.secondsLeft = secondsLeft;
				});

				this.GetNewCode2Fa();
			},
			error: (error) => {
				//this._projectUtilservice.showHttpError(error);
				this._messageService.showAlertDanger(error);
				throw new Error(error)
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

				//this._projectUtilservice.showHttpError(error);
				this._messageService.showAlertDanger(error);
				throw new Error(error);
			},
		});

	}

	// #endregion POST

	// #region UTILIDADES

	// Retorno para a tela de login
	public voltar(): void {
		this._subscription.unsubscribe();
		this.showParmsAuthentication2Fa = false;

		this._authStorageService.logout();

		this._router.navigate(["/auth/login"]);
	}

	// #endregion UTILIDADES

	// #endregion ==========> SERVICE METHODS <==========

	// #region ==========> MODALS <==========

	// Executa esquecer senha
	public openForgottenPasswordModal(template: TemplateRef<any>): void {
		this.createFormForgottenPassword();

		this.modalRef = this._bsModalService.show(template, {
			class: 'modal-dialog-centered',
			ignoreBackdropClick: false,
			keyboard: false,
			id: this.idFgtPsw
		});

	}

	// Encerra esquecer senha
	public closeForgottenPasswordModal(): void {
		this._bsModalService.hide(this.idFgtPsw);
	}

	// #endregion ==========> MODALS <==========

}
