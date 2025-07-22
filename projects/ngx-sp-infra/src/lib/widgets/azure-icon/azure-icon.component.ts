import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AzureIconService, IconEntry } from '../../service/azure-icon.service';

@Component({
  selector: 'lib-azure-icon',
  imports: [
    FormsModule
  ],
  template: `
    <img [src]="currentIconData?.url" [alt]="currentIconData?.name" [style.width.px]="iconSize" [style.height.px]="iconSize" />
  `,
  styles: [
    ``
  ]
})
export class AzureIconComponent implements OnInit {

  // #region ==========> PROPERTIES <==========
  
  // #region PUBLIC
  @Input({ required: true }) public iconName!: string;
  @Input() public iconSize: number = 24;

  public currentIconData?: IconEntry;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor(
    private iconService: AzureIconService
  ) { }

  ngOnInit() {
    this.getIcon();
  }


  // #region ==========> API METHODS <==========

  // #region GET
  
  /** Busca a informação do ícone pelo nome fornecido.
   * Se o ícone não for encontrado, currentIconData será undefined.
  */
  public getIcon(): void {
    this.iconService.getIcon(this.iconName).subscribe(icon => {
      this.currentIconData = icon;
    });
  }

  // #endregion GET

  // #endregion ==========> API METHODS <==========


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
