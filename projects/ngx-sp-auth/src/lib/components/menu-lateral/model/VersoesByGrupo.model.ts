export class GrupoProjeto {
  public grupo: string = "";
  public baseUrl?: string;
  public versao?: string;
  public projetos?: Projeto[];
}

export class Projeto {
  public nome: string = "";
  public baseUrl?: string;
  public versao?: string;
}