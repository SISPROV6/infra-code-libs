export interface ICustomMenuService {
    
    // Propriedades Customizadas do Menu
    menuDynamic: boolean;
    menuDynamicCustom: false;
    moduleName: string;
    moduleImg: string;
    moduleSvg: string;
    themeColor: string;

    // Métodos customizados do Menu
    menuDynamicGetModuloId(): number;

    menuDynamicOnInit(): void;

    menuStaticOnInit(): void;

    menuopenExpansibleMenu(ref: HTMLDivElement): void;
}