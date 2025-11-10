import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

  // #region PRIVATE
  private readonly _APIURL: string = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0";
  // #endregion PRIVATE

  // #region PUBLIC
  public valorCustomizado?: string;

  public page: number = 1;  // Propriedade necessária para explicitar qual página está selecionada atualmente
  public itemsPerPage: number = 5;  // Propriedade necessária para renderizar apenas determinada quantidade por página inicialmente
  public recordsList?: any[] = [
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
    { nome: 'Nome', descricao: 'Descrição', isAtivo: true },
  ];

  filteredItems: { name: string | number, surname: string }[] = [];
  items = [
    { name: 1, surname: 'Erick Carvalho Paulette de Oliveira', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 2, surname: 'Solturne', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 3, surname: 'Mare Itami', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 4, surname: 'Wylow Zeppelli', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 5, surname: 'Sol', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 6, surname: 'Saturno', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 7, surname: 'Seven', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 8, surname: 'Eight', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 9, surname: 'Nine', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 10, surname: 'Ten', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 11, surname: 'Eleven', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 12, surname: 'Twelve', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 13, surname: 'Thirteen', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 14, surname: 'Fourteen', AdditionalStringProperty1: 'Additional Info 1' },
    { name: 15, surname: 'Fifteen', AdditionalStringProperty1: 'Additional Info 1' },
  ];
  combobox = [
    { ID: 1, LABEL: 'One', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 2, LABEL: 'Two', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 3, LABEL: 'Three', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 4, LABEL: 'Four', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 5, LABEL: 'Five', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 6, LABEL: 'Six', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 7, LABEL: 'Seven', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 8, LABEL: 'Eight', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 9, LABEL: 'Nine', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 10, LABEL: 'Ten', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 11, LABEL: 'Eleven', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 12, LABEL: 'Twelve', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 13, LABEL: 'Thirteen', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 14, LABEL: 'Fourteen', AdditionalStringProperty1: 'Additional Info 1' },
    { ID: 15, LABEL: 'Fifteen', AdditionalStringProperty1: 'Additional Info 1' },
  ];

  public pokemons: { name: string, url: string }[] = [];

  public disabledInputs: Map<string, boolean> = new Map<string, boolean>();
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> FORM CONFIG <==========
  public control = new FormControl<any>(null, [ Validators.required ]);
  
  public form: FormGroup = new FormGroup({
    pokemon: new FormControl<any>(null),
    pokemonExterno: new FormControl<any>(null)
  });

  public get formUtils(): typeof FormUtils { return FormUtils; }
  // #endregion ==========> FORM CONFIG <==========


  constructor(
    private _testingService: TestingService
  ) { }

  ngOnInit(): void {
    this.filteredItems = this.items;

    // Usando via integração com formulários o valor será apenas o equivalente ao ID (customValue)
    this.control.valueChanges.subscribe(value => {
      console.log("control.valueChanges.subscribe => value:", value);
    });
    
    this.form.controls['pokemon'].valueChanges.subscribe(value => {
      console.log("form.controls['pokemon'].valueChanges.subscribe => value:", value);
    });

    this.getPokemons();
  }


  // #region ==========> API METHODS <==========

  // #region GET
  public getPokemons() {
    this._testingService.getPokemons().subscribe({
      next: res => {
        console.log('res.results:', res.results);
        this.pokemons = res.results;

        setTimeout(() => {
          this.form.controls['pokemon'].setValue(this.pokemons[2].name);
          this.form.controls['pokemon'].disable();
        }, 5000);
      },
      error: err => console.error(err)
    });
  }
  // #endregion GET

  // #endregion ==========> API METHODS <==========


  // #region ==========> UTILS <==========
  log(value: any) {
    console.log("log() => value:", value);
  }

  filter(search: string | null) {
    this.log(this.filteredItems);

    this.filteredItems = this.items.filter(e => {
      return e.surname.toLowerCase().includes(search ? search.toLowerCase() : "")
    });

    this.log(search);
    this.log(this.filteredItems);
  }

  setValue() {
    this.control.setValue(2);
  }
  setValueList() {
    this.control.setValue([2, 3]);
  }


  /**
   * Este método é para demonstração, ele possui as 3 principais formas de definir o valor pré-selecionado do combobox sem precisar selecioná-lo diretamente.
   * Lembre-se também que o valor aqui deve ser referente ao ID, pois é por ele que o apontamento é feito.
   * @param value Valor informado no input ou vindo de uma requisição. Sua origem não importa.
  */
  public setExternalValue(value: string): void {
    this.form.get('pokemonExterno')?.setValue(value);
  }
  // #endregion ==========> UTILS <==========

}
