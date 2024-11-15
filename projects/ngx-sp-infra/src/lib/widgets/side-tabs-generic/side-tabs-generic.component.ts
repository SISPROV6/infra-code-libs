import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface CustomIconsConfig {
  class: string;
  iconName: string;
  iconColor: string;
  iconSize: number;
  iconTooltip: string;
}

@Component({
  selector: 'app-side-tabs-generic',
  templateUrl: './side-tabs-generic.component.html',
  styleUrls: ['./side-tabs-generic.component.scss']
})
export class SideTabsGenericComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    
  }

  @Input({ required:true }) public useCustomIcons!: boolean;
  
  @Input() public titleList: string[] = [];
  @Input() public subtitleList: string[] = [];
  @Input() public selectedIndex: number = 0;
  
  @Input() public icons: any[] = [];
  @Input() public customIcons: CustomIconsConfig[] = [];

  // VERIFICAR
  @Input() public extra: { color: string, tooltip: string }[] = [];

  @Output() public indexPage: EventEmitter<number> = new EventEmitter<number>();


  public sendIndexPage(index: number): void {
    this.selectedIndex = index;
    this.indexPage.emit(this.selectedIndex);
  }
}
