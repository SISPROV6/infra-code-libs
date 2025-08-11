export interface ICustomStorageService {

    // Métodos customizados do Storage
    storageConstructor(): void;

    storageSaveLocalInstance(): void;

    storageLogout(): void;

    storageInitializeAutoStorage(): void;
}