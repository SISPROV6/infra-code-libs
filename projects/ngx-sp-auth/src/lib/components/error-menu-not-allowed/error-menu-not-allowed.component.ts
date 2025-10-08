import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthStorageService } from 'ngx-sp-auth';
import { NgIf } from '@angular/common';
import { InfraModule } from 'ngx-sp-infra';

@Component({
    selector: 'app-menu-not-allowed',
    templateUrl: './error-menu-not-allowed.component.html',
    styleUrls: ['./error-menu-not-allowed.component.css'],
    preserveWhitespaces: true,
    imports: [
      NgIf,
      InfraModule
    ]
})
export class Error404Component {

  constructor(private router: Router,
              public authStorageService: AuthStorageService
) { }

  onHome() {
    this.router.navigate(["/home"]);
  }

}
