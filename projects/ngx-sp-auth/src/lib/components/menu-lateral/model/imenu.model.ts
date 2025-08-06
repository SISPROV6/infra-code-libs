export class IMenu {
  ID: number = 0;
  UNICOID: number = 0;
  LABEL: string= "";
  DESCRICAO: string= "";
  URL: string= "";
  CLASS_ICON: string= "";
  IS_EXIBEMENU: boolean = false;
  URL_DASHBOARD: string= "";
  TAG: string= "";
  FK: number = 0;
    STRUCT_LIST!: [] | [{
        ID: number;
        UNICOID: number;
        LABEL: string;
        DESCRICAO: string;
        URL: string;
        CLASS_ICON: string;
        IS_EXIBEMENU: boolean;
        URL_DASHBOARD: string;
        TAG: string;
        FK: number;
        STRUCT_LIST: [] | [{
          ID: number;
          UNICOID: number;
          LABEL: string;
          DESCRICAO: string;
          URL: string;
          CLASS_ICON: string;
          IS_EXIBEMENU: boolean;
          URL_DASHBOARD: string;
          TAG: string;
          FK: number;
          }]
    }]
}