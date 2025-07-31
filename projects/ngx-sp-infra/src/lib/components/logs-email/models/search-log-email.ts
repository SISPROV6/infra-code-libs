export class SearchLogEmail {
  TEXTO_PESQUISA: string = "";
  DATA_INICIAL_INI: Date | null = null;
  DATA_INICIAL_FIN: Date | null = null;
  DATA_FINAL_INI: Date | null = null;
  DATA_FINAL_FIN: Date | null = null;
  IS_ERROR: Boolean = false;
  ROW_LIMIT: number = 0;
  ROW_OFF_SET: number = 0;
  ORDERBY: string = "";
  ORDERISASC: boolean = false;
}
