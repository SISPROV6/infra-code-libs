export interface ICustomMenuService {
    // Propriedades Customizadas do Menu
    menuDynamic: boolean;
    moduleName: string;
    moduleImg: string;
    moduleSvg: string;
    themeColor: string;

    // Métodos do Menu
    menuDynamicOnInit(): void;
    menuStaticOnInit(): void;
    menuopenExpansibleMenu(ref: HTMLDivElement): void;
}