export class Count {
  TotalPendente: number;
  TotalConcluido: number;
  TotalComFalha: number;
  TotalCancelado: number;
  TotalProcessando: number;
  TotalAbandonado: number;

  constructor() {
    this.TotalAbandonado = 0;
    this.TotalProcessando = 0;
    this.TotalCancelado = 0;
    this.TotalComFalha = 0;
    this.TotalConcluido = 0;
    this.TotalPendente = 0;
  }
}