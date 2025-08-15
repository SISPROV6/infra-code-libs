export interface ICustomMenuService {
    
    // Propriedades Customizadas do Menu
    get menuDynamic(): boolean;

    get menuDynamicCustom(): false;

    get moduleName(): string;

    get moduleImg(): string;

    get moduleSvg(): string;
    
    get themeColor(): string;

    // Métodos customizados do Menu
    menuDynamicGetModuloId(): number;

    menuDynamicOnInit(): void;

    menuStaticOnInit(): void;

    menuopenExpansibleMenu(ref: HTMLDivElement): void;
}