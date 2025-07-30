export interface ICustomStorageService {
    // Propriedades Customizadas do Storage
    isSaving: boolean;

    // Métodos customizados do Storage
    storageConstructor(): void;

    storageSaveLocalInstance(): void;

    storageLogout(): void;

    storageInitializeAutoStorage(): void;
    
}