/** Estrutura de headers que deve ser seguida para utiliza o componente de ```<lib-table>```.
 * Trate esta estrutura como as configurações de uma coluna específica (coluna falando de uma tabela HTML e não coluna de uma tabela de banco de dados) */
export class TableHeaderStructure {

  /** Nome da coluna */
  public name: string = "";
  
  /** [DEPRECIADA EM BREVE] Largura da coluna em cols do Bootstrap (máximo 12). Será removida em breve, utilize ```widthClass``` */
  public col?: number;
  
  /** Largura da coluna. Deve utilizar ou larguras específicas com porcentagem ou colunas (1 a 12).
   * NÃO utilizar tipos diferentes ao mesmo tempo.
   * 
   * Valores disponíveis para:
   * - Utilizar 'col' = col-{n} (n = 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)
   * - Utilizar 'w' = w-{n} (n = 1 em 1 até 100)
   */
  public widthClass?: string;

  /** Largura da coluna em pixels fixos. Deve ser utilizada apenas em caso de table scrollável, caso contrário o valor não será aplicado. */
  public widthPixels?: number;
  
  /** Utilize em caso de precisar de classes específicas para aquela coluna (será aplicada apenas á coluna no header da tabela e não no corpo).
   * @example 'text-center' para centralizar o texto da coluna.
   * @example 'text-end' para alinhar o texto à direita.
  */
  public customClasses?: string;
  
  /** Utilize quando quiser aplicar ordenação à coluna.
   * Deve informar o valor do nome da coluna trazida da lista que será utilizada para ordenação e não o nome informado no ````name```.
   * @example Supondo que minha lista seja um array com a seguinte estrutura:
   * ```{ CDPRODUTO: string, NOMEPRODUTO: string, VLATUAL: number, QTATUAL: number }```
   * Se eu quiser ordenar pela coluna de 'Valor atual' (informada na ```name``` desta estrutura) eu devo informar para esta propriedade o valor "VLATUAL".
  */
  public orderColumn?: string

  /** 
   * Configurações para utilizar ícones ao lado do nome da coluna.
   * Se não informada será exibido apenas o nome da coluna.
   * 
   * @param name Nome do ícone a ser exibido. Utilize os nomes disponíveis em https://siscandesv6.sispro.com.br/SisproErpCloud/InfraCodeDocs/icones
   * @param side Lado em que o ícone será exibido. Pode ser 'L' para esquerda ou 'R' para direita.
   * @param theme Cor tema do ícone baseado nas cores já utilizadas nos projetos. Pode ser 'default', 'primary', 'secondary', 'warning', 'danger' ou 'success'.
   * @param tooltip Texto que será exibido ao passar o mouse sobre o ícone.
   * @param emitClick Se o ícone deve emitir um evento de clique ao ser clicado.
   * 
   * @example ```{ name: 'info', side: 'R', theme: 'primary', tooltip: 'Indica as datas de prazo do pedido', emitClick: true }```
   */
  public icon?: TableHeaderIcon;

  /**
   * Indica se a coluna está visível ou não.
   * Usada principalmente na lógica de ocultar colunas dinamicamente.
   * @default true
   */
  public isVisible?: boolean = true;

  /** Informa a ordem de exibição das colunas. */
  public order?: number = 0;

  /** Tooltip para usar no texto do header. */
  public tooltip?: string;
}

/** Propriedades de confirguração para ícones exibidos ao lado do texto de uma coluna da ```<lib-table>``` */
export class TableHeaderIcon {

  /** Nome do ícone a ser exibido. Utilize os nomes disponíveis em https://siscandesv6.sispro.com.br/SisproErpCloud/InfraCodeDocs/icones */
  public name: string = "info";

  /** Lado em que o ícone será exibido. Pode ser 'L' para esquerda ou 'R' para direita. */
  public side?: "L" | "R" = "R";

  /** Cor tema do ícone baseado nas cores disponibilizados pelo componente ```<lib-icon>```: Pode ser "currentColor", "white", "black", "gray", "light-gray", "blue", "light-blue", "green", "yellow" ou "red". */
  public theme?: "currentColor" | "white" | "black" | "gray" | "light-gray" | "blue" | "light-blue" | "green" | "yellow" | "red" = "currentColor";

  /** Texto que será exibido ao passar o mouse sobre o ícone. */
  public tooltip?: string;

  /** Se o ícone deve emitir um evento de clique ao ser clicado. */
  public emitClick?: boolean;
}