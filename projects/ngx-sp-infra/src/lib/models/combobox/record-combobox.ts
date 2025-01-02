/**
 * Estrutura principal usada para padronizar o preenchimento de elementos <select> ou <lib-combobox>.
 * Sua classe equivalente no C# é GUIDRecordCombobox ou NumberRecordCombobox (ambas terão seus nomes trocados em breve).
*/
export class RecordCombobox implements IRecordsCombobox {

    /** ID ou CÓDIGO do registro, em casos de FK, ele que deve ser usado para preencher o valor no modelo de dados pai */
    public ID: string | number = 0;

    /** Texto de exibição, o que estiver nesta propriedade geralmente será exibida para o usuário seja em um <select> ou <lib-combobox> */
    public LABEL: string = "";

    /** Propriedade string adicional caso seja necessária. Se preenchida, seu valor será exibido por padrão ao lado esquerdo do LABEL no componente <lib-combobox>. */
    public AdditionalStringProperty1?: string = "";

    /** Propriedade string adicional caso seja necessária. */
    public AdditionalStringProperty2?: string = "";

    /** Propriedade numérica adicional caso seja necessária. */
    public AdditionalLongProperty1?: number = 0;

    /** Propriedade numérica adicional caso seja necessária. */
    public AdditionalLongProperty2?: number = 0;

    /** Propriedade booleana adicional caso seja necessária. */
    public AdditionalBooleanProperty1?: boolean = false;

    /** Propriedade booleana adicional caso seja necessária. */
    public AdditionalBooleanProperty2?: boolean = false;

    /** Usada apenas em casos muito específicos. */
    public IS_SELECTED?: boolean | null = false;
}


// #region Interface IRecordsCombobox
export interface IRecordsCombobox {
    ID: string | number;
    LABEL: string;
}
// #endregion Interface IRecordsCombobox