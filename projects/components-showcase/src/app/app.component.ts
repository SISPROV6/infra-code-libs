import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormUtils, InfraModule, } from 'ngx-sp-infra';
import { TestingService } from './testing.service';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    NgClass,
    FormsModule,

    InfraModule,
    NgxPaginationModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  public valorCustomizado?: string;
  public pokemons: { name: string, url: string }[] = [];
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> FORM CONFIG <==========
  public form: FormGroup = new FormGroup({
    pokemon: new FormControl<string | null>(null),
  });

  public get formUtils(): typeof FormUtils { return FormUtils; }
  // #endregion ==========> FORM CONFIG <==========


  constructor(
    private _testingService: TestingService
  ) { }

  ngOnInit(): void {
    this.getPokemons();
    this.getRecord();
  }


  // #region ==========> API METHODS <==========

  // #region GET
  public getPokemons(): void {
    this._testingService.getPokemons().subscribe({
      next: res => {
        this.pokemons = res.results;
      },
      error: err => console.error(err)
    });
  }

  public getRecord(): void {
    this._testingService.simulateRecord().subscribe({
      next: res => {

        this.form.patchValue({
          ...res
        });

      }
    });
  }
  // #endregion GET

  // #endregion ==========> API METHODS <==========


  // #region ==========> UTILS <==========
  log(value: any) {
    console.log("log() => value:", value);
  }

  /**
   * Este método é para demonstração, ele possui as 3 principais formas de definir o valor pré-selecionado do combobox sem precisar selecioná-lo diretamente.
   * Lembre-se também que o valor aqui deve ser referente ao ID, pois é por ele que o apontamento é feito.
   * @param value Valor informado no input ou vindo de uma requisição. Sua origem não importa.
  */
  public setExternalValue(value: string): void {
    this.form.get('pokemon')?.setValue(value);
  }
  // #endregion ==========> UTILS <==========

}
