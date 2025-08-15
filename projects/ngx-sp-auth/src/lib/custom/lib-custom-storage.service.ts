import { Inject, Injectable } from '@angular/core';

import { ICustomStorageService } from './models/icustom-storage-service';
import { LIB_CUSTOM_STORAGE_SERVICE } from './token';

@Injectable(
    { providedIn: 'root' }
)
export class LibCustomStorageService {

    constructor( 
        @Inject(LIB_CUSTOM_STORAGE_SERVICE) private _customStorageService: ICustomStorageService
    ) { }

    // #region Métodos Customizadas para o Componente auth-storage.service.ts

    // Método executado no auth-storage.service.ts - método: constructor ()
    // Utilizado para inicializações diversas
    public storageConstructor(): void {
        this._customStorageService.storageConstructor();
    }

    // Método executado no auth-storage.service.ts - método: saveLocalInstance ()
    // Utilizado para salvar informações no localStorage
    public storageSaveLocalInstance(): void {
        this._customStorageService.storageSaveLocalInstance();
    }

    // Método executado no auth-storage.service.ts - método: logout ()
    // Utilizado para inicializar informações no localStorage na logout da aplicação
    public storageLogout(): void {
        this._customStorageService.storageLogout();
    }

    // Método executado no auth-storage.service.ts - método: reCheckLogin ()
    // Utilizado para inicializações diversas quando o Login exeutado via Pré Portal
    public storageInitializeAutoStorage(): void {
        this._customStorageService.storageInitializeAutoStorage();
    }

    // #endregion Métodos Customizadas para o Componente auth-storage.service.ts

}
