import { Observable } from 'rxjs';
import { IMenuItemStructure } from "../../components/menu-lateral/model/imenu-item-structure.model";

export interface IMenuService {
    // Propriedades Customizadas do Menu
    menuDynamic: boolean;
    moduleName: string;
    moduleImg: string;
    moduleSvg: string;
    themeColor: string;

    // Propriedades do Menu
    menuItems: IMenuItemStructure[];
    applyEmpresa$: Observable<{ estabelecimentoID: string, empresaID: string }>;

    // Métodos do Menu
    menuDynamicOnInit(): void;
    menuStaticOnInit(): void;
    menuopenExpansibleMenu(ref: HTMLDivElement): void;
    emitEstabelecimentoEvent(): void;
    setEmpresa(value: { estabelecimentoID: string, empresaID: string }): void;
}