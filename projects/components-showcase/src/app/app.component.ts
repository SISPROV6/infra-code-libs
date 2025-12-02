import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormUtils, InfraModule, RecordCombobox, } from 'ngx-sp-infra';
import { TestingService } from './testing.service';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    NgClass,
    FormsModule,

    InfraModule,
    NgxPaginationModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  public valorCustomizado?: string;
  public pokemons: { name: string, url: string }[] = [];

  public pokemonsCombobox: RecordCombobox[] = [
    { ID: 1, LABEL: 'Pikachu', AdditionalStringProperty1: '1' },
    { ID: 2, LABEL: 'Bulbasaur', AdditionalStringProperty1: '2' },
    { ID: 3, LABEL: 'Charmander', AdditionalStringProperty1: '3' },
    { ID: 4, LABEL: 'Vulpix', AdditionalStringProperty1: '4' },
    { ID: 5, LABEL: 'Umbreon', AdditionalStringProperty1: '5' },
    { ID: 6, LABEL: 'Eevee', AdditionalStringProperty1: '6' },
    { ID: 7, LABEL: 'Jolteon', AdditionalStringProperty1: '7' },
    { ID: 8, LABEL: 'Glaceon', AdditionalStringProperty1: '8' },
    { ID: 9, LABEL: 'Flareon', AdditionalStringProperty1: '9' },
    { ID: 10, LABEL: '', AdditionalStringProperty1: '10' },
    { ID: 11, LABEL: 'Vaporeon', AdditionalStringProperty1: '11' },
    { ID: 12, LABEL: 'Mewtwo', AdditionalStringProperty1: '12' },
    { ID: 13, LABEL: 'Machomp', AdditionalStringProperty1: '13' },
    { ID: 14, LABEL: 'Lopunny', AdditionalStringProperty1: '14' },
    { ID: 15, LABEL: 'Lucario', AdditionalStringProperty1: '15' },
    { ID: 16, LABEL: 'Mew', AdditionalStringProperty1: '16' },
  ];


  public recordsList?: any[] = [
    { ID: 1, LABEL: 'Pikachu' },
    { ID: 2, LABEL: 'Bulbasaur' },
    { ID: 3, LABEL: 'Charmander' },
    { ID: 4, LABEL: 'Vulpix' },
    { ID: 5, LABEL: 'Umbreon' },
    { ID: 6, LABEL: 'Eevee' },
    { ID: 7, LABEL: 'Jolteon' },
    { ID: 8, LABEL: 'Glaceon' },
    { ID: 9, LABEL: 'Flareon' },
    { ID: 10, LABEL: '' },
    { ID: 11, LABEL: 'Vaporeon' },
    { ID: 12, LABEL: 'Mewtwo' },
    { ID: 13, LABEL: 'Machomp' },
    { ID: 14, LABEL: 'Lopunny' },
    { ID: 15, LABEL: 'Lucario' },
    { ID: 16, LABEL: 'Mew' },
  ];  // Lista a ser usada, pode ser de qualquer tipo
  public page: number = 1;  // Propriedade necessária para explicitar qual página está selecionada atualmente
  public itemsPerPage: number = 5;  // Propriedade necessária para renderizar apenas determinada quantidade por página inicialmente
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
    this.form.valueChanges.subscribe(value => {
      console.log('form.valueChanges.subscribe() => value', value);
    });

    // this.getPokemons();
    this.getPokemonsStatic();
    // this.getRecord();
  }


  // #region ==========> API METHODS <==========

  // #region GET
  public getPokemons(): void {
    this._testingService.getPokemons().subscribe({
      next: res => {
        this.pokemons = res.results;

        this.pokemons[5].url = '';
        this.pokemons[5].name = '';
      },
      error: err => console.error(err)
    });
  }

  public getPokemonsStatic(filter: string = ""): void {
    this._testingService.getPokemonsStatic(filter).subscribe({
      next: res => { this.pokemons = res },
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
