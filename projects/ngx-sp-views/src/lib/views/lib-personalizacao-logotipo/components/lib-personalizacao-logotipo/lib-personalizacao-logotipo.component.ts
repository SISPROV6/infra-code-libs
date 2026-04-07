import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { InfraLicBinariesRecord } from '../../models/infra-licbinaries.record';
import { ImagesRecord } from '../../models/images.record';
import { Router } from '@angular/router';
import { PersonalizacaoLogotipoService } from '../../services/personalizacao-logotipo.service';
import { ImageCropperComponent, InfraModule, MessageService, ModalUtilsService } from 'ngx-sp-infra';
import { AuthUtilService } from 'ngx-sp-auth';
import { TenantService } from '../../../../services/tenant.service';

@Component({
  selector: 'lib-personalizacao-logotipo',
  imports: [
    InfraModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperComponent,
    TooltipModule
  ],
  providers: [TenantService],
  templateUrl: './lib-personalizacao-logotipo.component.html',
  styleUrl: './lib-personalizacao-logotipo.component.scss'
})
export class LibPersonalizacaoLogotipoComponent {

public module: "Corporativo" | "ConfigErp";
  
public loginImg: InfraLicBinariesRecord = new InfraLicBinariesRecord();
public menuImg: InfraLicBinariesRecord = new InfraLicBinariesRecord();
public emailImg: InfraLicBinariesRecord = new InfraLicBinariesRecord();

public imgsRecord: ImagesRecord = new ImagesRecord();

public showSpinner1: boolean = false;

private readonly user_auth_v6 = localStorage["user_auth_v6"] ?? "{}";
private readonly __tokenPayload = JSON.parse(this.user_auth_v6).__tokenPayload ?? { tenantId: 1579 };
private _localTenantId = this.__tokenPayload.tenantId ?? 0;

constructor(
  private _router: Router,
  private _messageService: MessageService,
  private _authUtilService: AuthUtilService,
  private _dominio: TenantService,
  private _personalizacaoservice: PersonalizacaoLogotipoService,
  public modalUtils: ModalUtilsService
) { 
  this.module = window.location.href.includes('Corporativo') ? "Corporativo" : "ConfigErp";

  if (this.module == 'ConfigErp') 
  {
    this._dominio.validateTenant(this._localTenantId);
  }
}

ngOnInit(): void {
  this.GetLoginImg();
  this.GetMenuImg();
  this.GetEmailImg();
}

public GetLoginImg() {
  this._personalizacaoservice.getLoginImg().subscribe({
    next: response => { 
      this.loginImg = response.Image;
    },
    error: error => {
      this._authUtilService.showHttpError(error);
    }
  });
}

public GetMenuImg() {
  this._personalizacaoservice.getMenuImg().subscribe({
    next: response => { 
      this.menuImg = response.Image;
    },
    error: error => {
      this._authUtilService.showHttpError(error);
    }
  });
}

public GetEmailImg() {
  this._personalizacaoservice.getEmailImg().subscribe({
    next: response => { 
      this.emailImg = response.Image;
    },
    error: error => {
      this._authUtilService.showHttpError(error);
    }
  });
}
// #endregion GET

// #region POST
public Salvar(): void {
  this.showSpinner1 = true;
  this.imgsRecord.BinaryLogin = this.imagemCortadaLogin;
  this.imgsRecord.BinaryMenu = this.imagemCortadaMenu;
  this.imgsRecord.BinaryEmail = this.imagemCortadaEmail;

  this._personalizacaoservice.enviarImgs(this.imgsRecord).subscribe({
    next: () => {
      this.GetLoginImg();
      this.GetMenuImg();
      this.GetEmailImg();

      this.imagemCortadaLogin = null;
      this.imagemCortadaMenu = null;
      this.imagemCortadaEmail = null;
      
      this._messageService.showAlertSuccess('Dados atualizados com sucesso.');
      this.showSpinner1 = false;
    },
    error: error => { this._authUtilService.showHttpError(error); this.showSpinner1 = false;}
  });
}

public DeleteLoginImg(): void {
  this._personalizacaoservice.removeLoginImg().subscribe({
    next: () => {
      this.GetLoginImg();
      this.imagemCortadaLogin = null;
      this._messageService.showAlertSuccess('Imagem removida com sucesso.');
    },
    error: error => { this._authUtilService.showHttpError(error); }
  });
}

public DeleteMenuImg(): void {
  this._personalizacaoservice.removeMenuImg().subscribe({
    next: () => {
      this.GetMenuImg();
      this.imagemCortadaMenu = null;
      this._messageService.showAlertSuccess('Imagem removida com sucesso.');
    },
    error: error => { this._authUtilService.showHttpError(error); }
  });
}

public DeleteEmailImg(): void {
  this._personalizacaoservice.removeEmailImg().subscribe({
    next: () => {
      this.GetEmailImg();
      this.imagemCortadaEmail = null;
      this._messageService.showAlertSuccess('Imagem removida com sucesso.');
    },
    error: error => { this._authUtilService.showHttpError(error); }
  });
}

public returnToList() { 
  this._router.navigate(["/home"]); 
}

readerLogin = new FileReader();
readerMenu = new FileReader();
readerEmail = new FileReader();
@ViewChild('cropperLogin') imageCropperLogin!: ImageCropperComponent;
@ViewChild('cropperMenu') imageCropperMenu!: ImageCropperComponent;
@ViewChild('cropperEmail') imageCropperEmail!: ImageCropperComponent;
imagemCortadaLogin: string | null = null;
imagemCortadaMenu: string | null = null;
imagemCortadaEmail: string | null = null;

abrirDialogDeImagemLogin() {
  this.imageCropperLogin.openFileDialog();
}
abrirDialogDeImagemMenu() {
  this.imageCropperMenu.openFileDialog();
}
abrirDialogDeImagemEmail() {
  this.imageCropperEmail.openFileDialog();
}
receberImagemLogin(imagem: File) {  
  this.readerLogin.readAsDataURL(imagem);
  this.readerLogin.onload = () => {
    this.imagemCortadaLogin = this.readerLogin.result as string;
  }
}
receberImagemMenu(imagem: File) {  
  this.readerMenu.readAsDataURL(imagem);
  this.readerMenu.onload = () => {
    this.imagemCortadaMenu = this.readerMenu.result as string;
  }
}
receberImagemEmail(imagem: File) {  
  this.readerEmail.readAsDataURL(imagem);
  this.readerEmail.onload = () => {
    this.imagemCortadaEmail = this.readerEmail.result as string;
  }
}

}
