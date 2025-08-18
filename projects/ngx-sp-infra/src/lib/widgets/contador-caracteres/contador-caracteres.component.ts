import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contador-caracteres',
  imports: [],
  templateUrl: './contador-caracteres.component.html',
  styleUrl: './contador-caracteres.component.scss'
})
export class ContadorCaracteresComponent implements OnInit  {

    ngOnInit (): void {
      this.contadorDeCaracteresRestantes();
    }

    @Input() valorAtual: string | number = 0;
    @Input() valorMaximo: string | number = 0;

    public valor: number = 0

    public contadorDeCaracteresRestantes(valorAtual: string | number = 0, valorMaximo: string | number = 0) {

      valorAtual = valorAtual == null ? "" : valorAtual;

      if(+valorAtual.toString().length <= +valorMaximo){
       this.valor = valorAtual.toString().length
      }

      return (this.valor < +valorMaximo ? this.valor : +valorMaximo)
  }

}
