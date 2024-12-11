import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgxSpAuthService {

  constructor() { }

  public ngxAuth(): void {
    console.log("Método para exemplo que a lib de auth está pronta para uso.");
  }
}
