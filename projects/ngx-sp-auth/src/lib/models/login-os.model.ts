export class LoginOSModel {
  public dominio: string = "";
  public usuario: string = "";
  public redirectUrl: string = "";
  public serialV6: string = "";

  // Sugestão do GPT: "Pra facilitar instanciar a partir de objetos."
  constructor(init?: Partial<LoginOSModel>) {
    Object.assign(this, init);
  }
}