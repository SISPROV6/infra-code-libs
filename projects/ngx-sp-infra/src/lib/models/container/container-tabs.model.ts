export class ContainerTabsModel {
  /** Nome da aba que será exibida */
  name: string = "";
  
  /** Informa se a aba estará visível ou oculta. */
  visible: boolean = true;
  
  /** Informa se a aba pode ser selecionada. */
  available: boolean = true;
  
  /** Informa o tipo da aba, se é um simples texto ou se será um link para outra rota. */
  type: 'text' | 'link' = "text";
  
  /** Caso o 'type' seja um 'link' esta propriedade deve ser informada com a rota a ser redirecionada. */
  linkText?: string = "";
}