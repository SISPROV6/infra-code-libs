import { Component, ElementRef, OnInit } from '@angular/core';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';
import {BreakpointObserver, Breakpoints, LayoutModule} from '@angular/cdk/layout';
import { NgClass } from '@angular/common';


@Component({
    selector: '[app-footer], app-footer, lib-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],

    imports: [LibIconsComponent, NgClass]
})
export class FooterComponent implements OnInit {
  constructor(private el: ElementRef, private _breakpointObserver: BreakpointObserver,) { }

  currentTime = new Date()
  year: number = this.currentTime.getFullYear();
  private _isMobile: boolean = false;

  public get isMobile(){ return this._isMobile }

  ngOnInit(): void {
    const htmlEl: HTMLElement = this.el.nativeElement as HTMLElement;
    htmlEl.style.height = "100%";
    htmlEl.style.display = "flex";
    htmlEl.style.alignItems = "flex-end";
    htmlEl.style.justifyContent = "center";
    htmlEl.style.backgroundColor = "#eee";    // [!]
    this.initMobileObserver();
  }

    public initMobileObserver(){
      this._breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this._isMobile = true;
      }else{
        this._isMobile = false;
      }
    });
  }
}
