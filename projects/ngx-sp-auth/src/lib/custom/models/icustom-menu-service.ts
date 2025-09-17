import { IMenuItemStructure } from "../../../public-api";

export interface ICustomMenuService {
    
    // Propriedades Customizadas do Menu
    get menuDynamic(): boolean;

    get menuDynamicCustom(): boolean;

    get moduleName(): string;

    get moduleSvg(): string;
    
    get themeColor(): string;

    // Propriedades específicas do Menu
    get menuItems(): IMenuItemStructure[];

    set menuItems(value: IMenuItemStructure[]);

    // Métodos customizados do Menu
    menuDynamicGetProjetoId(): number;

    menuDynamicOnInit(): void;

    menuStaticOnInit(): void;

    menuOpenExpansibleMenu(ref: HTMLDivElement): void;

    menuEmitEstabelecimentoEvent(): void;

}