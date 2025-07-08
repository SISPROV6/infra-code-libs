export class Logs {
    public Tenant_Id: number=0;
    public Id: number=0;
    public SessionId: number=0;
    public InfraUsuarioLogado: string= "";
    public NomeUsuarioLogado: string= "";
    public DtHora: Date = new Date(1900,1,1);
    public Modulo: string= "";
    public ReportId: number=0;
    public MetodoOrigem: string= "";
    public MetodoProc: string= "";
    public URL: string= "";
    public Erp: string= "";
    public Product: string= "";
    public Report: string= "";
    public Json: string= "";
    public Job: string= "";
    public DataSource: string= "";
    public MsgErro: string= "";
    public Is_Error: boolean = true;
}
