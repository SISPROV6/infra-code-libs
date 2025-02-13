import { RecordCombobox } from "../combobox/record-combobox";

/** Estrutura de dados de configuração das listas que fazem parte do componente de lista de transferência (<lib-transfer-list>) */
export class TransferListConfig {
   /** Título da lista. Por padrão assume "Lista de opções" */
   title?: string;

   /** Propriedade de lista que será exibida */
   list!: RecordCombobox[];
   
   /** Lista de opções de count (mesma propriedade utilizada na <lib-table>) */
   listCounts?: number[] = [ 5, 10, 20 ];
   
   /** Informa se uma caixa de pesquisa deve ser exibida para filtrar as opções da lista */
   useSearch?: boolean = true;

   /** Informa um texto de placeholder para a caixa de pesquisa da lista */
   searchPlaceholder?: string = "Digite aqui para filtrar os dados";


   /** Informa que nome de coluna deve ser usada na tabela para o campo de ID */
   identifierColumn?: string = "Código";

   /** Informa que nome de coluna deve ser usada na tabela para o campo de LABEL */
   labelColumn?: string = "Descrição";
   

   /** Informa se as caixas de seleção na lista devem ser exibidas */
   useSelection?: boolean = true;

   /** Classes customizadas referentes à estrutura inteira da lista  */
   customClass?: string;
}