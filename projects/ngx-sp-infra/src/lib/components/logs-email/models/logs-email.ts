export class Logs {
    public Tenant_Id: number = 0;
    public Id: number = 0;
    public SessionId: number = 0;
    public InfraUsuarioLogado: string = "";
    public NomeUsuarioLogado: string = "";
    public DtHora: Date = new Date(1900, 1,1);
    public DtHoraFim: Date = new Date(1900, 1,1);
    public Modulo: string = "";
    public Destinatario: string = "";
    public CC: string = "";
    public Assunto: string = "";
    public EmailRemetente: string = "";
    public NomeRemetente: string = "";
    public MsgErro: string = "";
    public QtdAnexo: number = 0;
    public Is_Error: boolean = true;
}

