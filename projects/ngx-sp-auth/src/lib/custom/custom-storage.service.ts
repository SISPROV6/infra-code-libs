import { Injectable } from '@angular/core';
import { ICustomStorageService } from './models/icustom-storage-service';

@Injectable(
    { providedIn: 'root' }
)
export class LibCustomStorageService {

    constructor() { }

    // #region Propriedades Customizadas para o Componente auth-storage.service.ts

    // indica se objeto já está marcado para salvar os dados no local storage.
    private __isSaving: boolean = false;

    // #endregion Propriedades Customizadas para o Componente auth-storage.service.ts


    // #region Métodos recebidos do projeto

    public storedStorageConstructor(): void { };
    public storedStorageSaveLocalInstance(): void { };
    public storedStorageLogout(): void { }
    public storedStorageInitializeAutoStorage(): void { };

    // #endregion Métodos recebidos do projeto

    // #region Métodos Customizadas para o Componente auth-storage.service.ts

    // Método executado no auth-storage.service.ts - método: constructor ()
    // Utilizado para inicializações diversas
    public storageConstructor(): void {
        this.storedStorageConstructor();
    }

    // Método executado no auth-storage.service.ts - método: saveLocalInstance ()
    // Utilizado para salvar informações no localStorage
    public storageSaveLocalInstance(): void {
        this.storedStorageSaveLocalInstance();
    }

    // Método executado no auth-storage.service.ts - método: logout ()
    // Utilizado para inicializar informações no localStorage na logout da aplicação
    public storageLogout(): void {
        this.storedStorageLogout();
    }

    // Método executado no auth-storage.service.ts - método: reCheckLogin ()
    // Utilizado para inicializações diversas quando o Login exeutado via Pré Portal
    public storageInitializeAutoStorage(): void {
        this.storedStorageInitializeAutoStorage();
    }

    // Método executado para salvar as propriedades no LocalStorage (não deve ser modificado)
    private async __authStorageSaveLocalInstance(): Promise<void> {

        if (this.__isSaving) {
            return
        }

        this.__isSaving = true

        this.storageSaveLocalInstance();

        this.__authStorageNotSaving()
    }

    // Método executado para salvar as propriedades no LocalStorage (não deve ser modificado)
    private async __authStorageNotSaving(): Promise<void> {
        this.__isSaving = false
    }
    // #endregion Métodos Customizadas para o Componente auth-storage.service.ts

    public ConfigurarCustomStorage(customStorageService: ICustomStorageService): void {

        //passando propriedades do projeto para a lib
        this.__isSaving = customStorageService.isSaving;

        //passando implementação dos métodos do projeto para a lib
        this.storedStorageConstructor = customStorageService.storageConstructor;
        this.storedStorageInitializeAutoStorage = customStorageService.storageInitializeAutoStorage;
        this.storedStorageLogout = customStorageService.storageLogout;
        this.storedStorageSaveLocalInstance = customStorageService.storageSaveLocalInstance;
    }

}
