export class Logs {
    public Tenant_Id: number= 0;
    public Id: number= 0;
    public SessionId: number= 0;
    public InfraUsuarioLogado: string = "";
    public DtHora: Date = new Date(1900,1,1);
    public DtHoraFim: Date = new Date(1900,1,1);
    public MsgErro: string = "";
    public StackTrace: string = "";
    public MetodoOrigem: string = "";
    public NomeUsuarioLogado: string = "";
    public Is_Error: boolean = true;
    public Is_Slow: boolean = false;}
