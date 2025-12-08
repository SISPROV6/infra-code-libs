import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { FormUtils, InfraModule, MessageService } from 'ngx-sp-infra';
import { AuthService } from '../../auth.service';
import { AuthStorageService } from '../../storage/auth-storage.service';
import { AuthUtilService } from '../../utils/auth-utils.service';

@Component( {
    selector: 'app-nova-senha',
    templateUrl: './nova-senha.component.html',
    styleUrls: ['./nova-senha.component.scss'],
    imports: [
        ReactiveFormsModule,
        InfraModule,
    ],
    preserveWhitespaces: true
} )
export class NovaSenhaComponent implements OnInit {

	constructor (
		private _formBuilder: FormBuilder,
		private _authUtilService: AuthUtilService,
		private _messageService: MessageService,
		private _authService: AuthService,
		private _authStorageService: AuthStorageService,
		private _title: Title,
		private _router: Router,
		private _route: ActivatedRoute
		) { }

	ngOnInit (): void {

		this._title.setTitle("Nova Senha");

		this.createForm();

		this.getParmsFromRoute();	
	
		this.form.get('password')?.disable();
		this.form.get('confirmPassword')?.disable();

		this.form.get('code')?.setValue('');

		this.form.get('code')?.valueChanges.subscribe(value => {
			if (value && value.length === 6) {
			  this.form.get('password')?.enable();
			  this.form.get('confirmPassword')?.enable();
			} else {
			  this.form.get('password')?.disable();
			  this.form.get('confirmPassword')?.disable();
			}
		  });
	}

	// #region ==========> PROPERTIES <==========

	// #region PRIVATE
	private domain: string | null = "";
	private user: string | null = "";
	private createPassword: boolean = false;

	isDisabled: boolean = true;

	public esqueceuSenhaText: string = "Enviamos um código para o seu e-mail.<br>Insira-o abaixo para redefinir sua senha."
	public primeiroAcessoText: string = "Este é o seu primeiro acesso. Por favor,<br>Insira abaixo o código enviado pare seu<br>e-mail para definir sua senha."
	public senhaExpiradaText: string = "Sua senha expirou e precisa ser atualizada.<br>Enviamos um código para o seu e-mail.<br>Insira-o abaixo para definir sua senha."

	public cadeadoImg = 'assets/imgs/cadeado.png'
	public maoImg = 'assets/imgs/mao.png'
	public calendarioImg = 'assets/imgs/calendario-fino.png'

	public statusSenha!: number;

	// #region PRIVATE

	// #region PUBLIC
	public isLoading: boolean = false;

	// #region ==========> FORM BUILDER <==========
	public form!: FormGroup;

	//  Propriedade necessário para que a classe static FormUtils possa ser utilizada no Html
	public get FormUtils(): typeof FormUtils {
		return FormUtils;
	}

	public passwordLabel: string = "";

	// #region FORM DATA

	//  Variáveis específicas para funcionalidades padrões dos formulários
	public get code(): string | null {
		return this.form.get('code')?.value;
	}

	public get password(): string {
		return this.form.get('password')?.value;
	}

	public get confirmPassword(): string {
		return this.form.get('confirmPassword')?.value;
	}

	// #endregion FORM DATA

	// #region FORM VALIDATORS

	// #region PUBLIC

	//  Método para configuração dos campos de edição do formulário
	private createForm(): void {

		this.form = this._formBuilder.group({
			code: ['', [Validators.required, Validators.maxLength(6)]],
			password: ['', [Validators.required, Validators.maxLength(100)]],
			confirmPassword: ['', [Validators.required, Validators.maxLength(100)]]
		});

		this.form.get('code')?.setValue('');	
		this.form.get('password')?.setValue('');	
		this.form.get('confirmPassword')?.setValue('');	
	}

	// #endregion FORM VALIDATORS

	// #endregion ==========> FORM BUILDER <==========

	// #region ==========> SERVICE METHODS <==========
	

	// #region GET
	
	/**
	 * Puxa o nome do servidor salvo na configuração da máquina
	 */
	public getAuthentication(): void {

		if (this.form.valid) {
			this._authService.getAuthentication(this.domain!).subscribe({
				next: response => {
				},
				error: (error) => {
					this._authUtilService.showHttpError(error);
				},
			})
		} else {
			FormUtils.validateFields(this.form);
		}
	}
	// #endregion GET

	// #region POST
	
	// Envia requisição para recuperar de senha
	public sendPassword(): void {

		if (this.form.valid) {
			this.isLoading = true;

			this._authService.getAuthentication(this.domain!).subscribe({
				next: response => {
					this.updatePassword();
				},
				error: (error) => {
					this.isLoading = false;
					this._authUtilService.showHttpError(error);
				},
			})

		} else {
			FormUtils.validateFields(this.form);
		}

	}

	// Recuperar senha
	public updatePassword(): void {

		if (this.createPassword) {
			this._authService.createPassword(this.domain!, this.user!, this.form.value).subscribe({
				next: () => {
					this.isLoading = false;

					this._messageService.showAlertSuccess('Você definiu sua senha com sucesso. Preencha suas novas credenciais para acessar o sistema.');
					this.cancelar();
				},
				error: (error) => {
					this.isLoading = false;
					this._authUtilService.showHttpError(error);
				}
			});

		} else {
			this._authService.recoverPassword(this.domain!, this.user!, this.form.value).subscribe({
				next: () => {
					this.isLoading = false;

					this._messageService.showAlertSuccess('Você redefiniu sua senha com sucesso. Preencha suas novas credenciais para acessar o sistema.');
					this.cancelar();
				},
				error: (error) => {
					this.isLoading = false;
					this._authUtilService.showHttpError(error);
				}
			});
		}

	}

	// #endregion POST

	// #region UTILIDADES
	private getParmsFromRoute(): void {
	
		if (this._route.snapshot.paramMap.get('param') != null) {
			let param: string = atob(this._route.snapshot.paramMap.get('param')!);

			var params = param.split('$');

            let numero: number = +params[params.length - 1].slice(-1)

			this.statusSenha = numero;
          
			this.createPassword = (params[0] == 'true' ? true : false);
			this.domain = params[1];
			this.user = params[2];
			this.passwordLabel = (this.createPassword ? "Escolha sua nova senha" :  "Digite uma nova Senha");

			if (params[3] != null) {
				this.form.get('code')?.setValue(params[3]);			}

		} else {
			this.createPassword = false;
			this.domain = "";
			this.user = "";
		}

	}
 
	// Retorno para o login
	public cancelar(): void {
		this._authStorageService.logout();
		this._router.navigate(["/auth/login"]);
	}	

  // #endregion UTILIDADES

  // #endregion ==========> SERVICE METHODS <==========

// #endregion ==========> MODALS <==========

}
