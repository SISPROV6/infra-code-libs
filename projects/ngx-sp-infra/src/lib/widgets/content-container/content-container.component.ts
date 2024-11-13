import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'lib-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.scss']
})
export class ContentContainerComponent implements OnInit, OnChanges {
  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _currentTab?: string;
  // #endregion PRIVATE

  // #region PUBLIC
  @Input('tabs') public navTabsList?: string[];
  @Input() public containerTitle?: string;
  
  @Input()
  public get currentTab(): string | undefined { return this._currentTab; }
  public set currentTab(value: string | undefined) {
    this._currentTab = value;
    this.onChangeTab.emit(value);
  }

  @Output() public onChangeTab: EventEmitter<string> = new EventEmitter<string>();

  public currentContent: number = 0;

  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> INITIALIZATION <==========
  constructor() { }

  ngOnInit(): void {
    this.setTab();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["navTabsList"] && changes["navTabsList"].currentValue) {
      this.setTab();
    }

    if (changes["currentTab"] && changes["currentTab"].currentValue) {
      this.setTab();
    }
  }
  // #endregion ==========> INITIALIZATION <==========


  // #region ==========> UTILS <==========
  private setTab(): void {
    // Se não houverem múltiplas abas, inicializa com a primeira para evitar problemas de renderização
    if (!this.navTabsList || this.navTabsList.length <= 0) {
      this.currentContent = 0;
      return;
    }

    // Validação se há uma informação de aba já preenchida...
    if (!Utils.propertyIsNullUndefinedOrEmpty(this.currentTab)) {
      const tabIndex = this.navTabsList.findIndex(tab => tab === this.currentTab);
      
      // Se a aba preenchida não for encontrada dentro da lista de abas disponíveis, define como a primeira
      if (tabIndex === -1) {
        this.currentTab = this.navTabsList[0];
        this.currentContent = 0;
        return;
      }

      // ...caso contrário, define como a aba encontrada
      this.currentContent = tabIndex;
    }
    // ...caso não haja, define a propriedade como a primeira aba e conteúdo
    else {
      this.currentTab = this.navTabsList[0];
      this.currentContent = 0;
    }
  }
  // #endregion ==========> UTILS <==========

}
