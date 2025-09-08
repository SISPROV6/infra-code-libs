import { Component, ElementRef, OnInit } from '@angular/core';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

@Component({
    selector: '[app-footer], app-footer, lib-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    
    imports: [LibIconsComponent]
})
export class FooterComponent implements OnInit {
  constructor(private el: ElementRef) { }

  currentTime = new Date()
  year: number = this.currentTime.getFullYear();

  ngOnInit(): void {
    const htmlEl: HTMLElement = this.el.nativeElement as HTMLElement;
    htmlEl.style.height = "100%";
    htmlEl.style.display = "flex";
    htmlEl.style.alignItems = "flex-end";
    htmlEl.style.justifyContent = "center";
    htmlEl.style.backgroundColor = "#eee";    // [!]    
  }

}
