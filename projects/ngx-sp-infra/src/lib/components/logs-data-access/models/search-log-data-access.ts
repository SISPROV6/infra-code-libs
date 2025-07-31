export class SearchLogDataAccess {
  TEXTO_PESQUISA: string = "";
  DATA_INI: Date | null = null;
  DATA_FIN: Date | null = null;
  IS_ERROR: Boolean = true;
  IS_SLOW: Boolean = false;
  ROW_LIMIT: number = 0;
  ROW_OFF_SET: number = 0;
  ORDERBY: string = "";
  ORDERISASC: boolean = false;
}
