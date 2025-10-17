import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormUtils, InfraModule, ITelaRota, } from 'ngx-sp-infra';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    // NgClass,

    InfraModule,
    NgxPaginationModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  // [...]
  // #endregion PRIVATE

  // #region PUBLIC
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

  public disabledInputs: Map<string, boolean> = new Map<string, boolean>();

  public customRoutes: ITelaRota[] = [
    { icon: 'pp-menu-corporativo-ativo', modulo: 'Corporativo', menu: 'Administração', submenu: 'Usuários', label: 'Gestão de Usuários', route: 'gestao-usuarios' },
    { icon: 'pp-menu-corporativo-ativo', modulo: 'Corporativo', menu: 'Administração', submenu: 'Empresas', label: 'Gestão de Empresas', route: 'gestao-empresas' },
    { icon: 'pp-menu-corporativo-ativo', modulo: 'Corporativo', menu: 'Configurações', submenu: 'Listas Dinâmicas', label: 'Listas Dinâmicas', route: 'listas-dinamicas' },
    { icon: 'pp-menu-corporativo-ativo', modulo: 'Corporativo', menu: 'Configurações', submenu: 'Auditoria', label: 'Auditoria do Sistema', route: 'auditoria' },
    { icon: 'pp-menu-corporativo-ativo', modulo: 'Corporativo', menu: 'Pessoas', label: 'Pessoas', route: 'pessoas' },
    { icon: 'pp-menu-corporativo-ativo', modulo: 'Corporativo', label: 'Controle de Acesso', route: 'controle-acesso' },
    { icon: 'p-engrenagem', modulo: 'ERP Center', label: 'Cadastro de Produtos', route: 'produtos' },
    { icon: 'pp-menu-completo-contrato-ativo', modulo: 'Contratos', menu: 'Administração', submenu: 'Usuários', label: 'Usuários', route: 'usuarios' },
    { icon: 'pp-menu-completo-contrato-ativo', modulo: 'Contratos', menu: 'Cadastros', submenu: 'Unidades de Medida', label: 'Unidades de Medida', route: 'unidades-medida' },
    { icon: 'pp-menu-completo-suprimentos-ativo', modulo: 'Suprimentos', label: 'Gerenciamento de Pedidos', route: 'pedidos' },
    { icon: 'pp-menu-completo-suprimentos-ativo', modulo: 'Suprimentos', label: 'Histórico de Operações', route: 'historico' },
    { icon: 'pp-menu-completo-suprimentos-ativo', modulo: 'Vendas', label: 'Painel de Indicadores', route: 'indicadores' },
    { icon: 'pp-menu-completo-patrimonio-ativo', modulo: 'Patrimônio', label: 'Monitoramento de Serviços', route: 'monitoramento' },
  ].sort((a, b) => a.modulo.localeCompare(b.modulo));
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> FORM CONFIG <==========
  public control = new FormControl<any>(null, [ Validators.required ]);
  public get formUtils(): typeof FormUtils { return FormUtils; }
  // #endregion ==========> FORM CONFIG <==========


  constructor() { }

  ngOnInit(): void {
    this.filteredItems = this.items;

    // Usando via integração com formulários o valor será apenas o equivalente ao ID (customValue)
    this.control.valueChanges.subscribe(value => {
      console.log("Valor(es) ID selecionado(s):", value);
    });
  }


  // #region ==========> UTILS <==========
  log(value: any) {
    console.log("Valor(es) completo(s) selecionado(s):", value);
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
  // #endregion ==========> UTILS <==========

}
