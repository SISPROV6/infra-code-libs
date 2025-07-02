import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ContainerTabsModel } from '../../models/container/container-tabs.model';
import { Utils } from '../../utils/utils';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

@Component({
    selector: 'lib-container',
    templateUrl: './content-container.component.html',
    styleUrls: ['./content-container.component.scss'],
    
    imports: [NgClass, NgIf, RouterLinkActive, TooltipModule, RouterLink, LibIconsComponent]
})
export class ContentContainerComponent implements OnInit, OnChanges {
  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _currentTab?: string;
  // #endregion PRIVATE

  // #region PUBLIC

  /** Parâmetro secreto que informa se o componente deve adotar comportamento/visual igual exibido no portal de documentação */
  public documentation = input<{ use: boolean; theme: 'dark' | 'light' }>({ use: false, theme: 'light' });
  
  @Input() public tabs?: string[];
  @Input() public advancedTabs?: ContainerTabsModel[];

  @Input() public containerTitle?: string;
  
  @Input()
  public get currentTab(): string | undefined { return this._currentTab; }
  public set currentTab(value: string | undefined) {
    this._currentTab = value;
    this.onChangeTab.emit(value);
  }

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onChangeTab: EventEmitter<string> = new EventEmitter<string>();

  public currentContent: number = 0;
  public isTabsString: boolean = true;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor() { }

  ngOnInit(): void {
    this.setTab();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tabs"] && changes["tabs"].currentValue) {
      this.setTab();
    }
    if (changes["advancedTabs"] && changes["advancedTabs"].currentValue) {
      this.setTab();
    }

    if (changes["currentTab"] && changes["currentTab"].currentValue) {
      this.setTab();
    }
  }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> UTILS <==========
  private setTab(): void {
    this.validateType();

    // Valida se o tipo das tabs é 'string', se for...
    if (this.isTabsString) {

      // Se não houverem múltiplas abas, inicializa com a primeira para evitar problemas de renderização
      if (!this.tabs || this.tabs.length <= 0) {
        this.currentContent = 0;
        return;
      }
  
      // Validação se há uma informação de aba já preenchida...
      if (!Utils.propertyIsNullUndefinedOrEmpty(this.currentTab)) {
        const tabIndex = this.tabs.findIndex(tab => tab === this.currentTab);
        
        // Se a aba preenchida não for encontrada dentro da lista de abas disponíveis, define como a primeira
        if (tabIndex === -1) {
          this.currentTab = this.tabs[0];
          this.currentContent = 0;
          return;
        }
  
        // ...caso contrário, define como a aba encontrada
        this.currentContent = tabIndex;
      }
      // ...caso não haja, define a propriedade como a primeira aba e conteúdo
      else {
        this.currentTab = this.tabs[0];
        this.currentContent = 0;
      }

    }
    else {  // ...e se não forem...
      
      // Se não houverem múltiplas abas, inicializa com a primeira para evitar problemas de renderização
      if (!this.advancedTabs || this.advancedTabs.length <= 0) {
        this.currentContent = 0;
        return;
      }
  
      // Validação se há uma informação de aba já preenchida...
      if (!Utils.propertyIsNullUndefinedOrEmpty(this.currentTab)) {
        const tabIndex = this.advancedTabs.findIndex(tab => tab.name === this.currentTab);
        
        // Se a aba preenchida não for encontrada dentro da lista de abas disponíveis, define como a primeira
        if (tabIndex === -1) {
          this.currentTab = this.advancedTabs[0].name;
          this.currentContent = 0;
          return;
        }
  
        // ...caso contrário, define como a aba encontrada
        this.currentContent = tabIndex;
      }
      // ...caso não haja, define a propriedade como a primeira aba e conteúdo
      else {
        this.currentTab = this.advancedTabs[0].name;
        this.currentContent = 0;
      }

    }

  }


  private validateType(): void {
    if (this.tabs && this.advancedTabs) throw new Error("Não utilize ambas listas. Preencha 'tabs' ou 'advancedTabs'!");
    this.isTabsString = (this.tabs && !this.advancedTabs) ?? false;
  }
  // #endregion ==========> UTILS <==========

}
