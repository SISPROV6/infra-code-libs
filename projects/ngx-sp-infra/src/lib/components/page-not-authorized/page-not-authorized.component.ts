import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-page-not-authorized, page-not-authorized',
    templateUrl: './page-not-authorized.component.html',
    styleUrls: ['./page-not-authorized.component.css'],
    preserveWhitespaces: true,
    standalone: true
})
export class PageNotAuthorizedComponent {
  constructor(private router: Router) { }
  
  onHome() { this.router.navigate(["/home"]); }
}
