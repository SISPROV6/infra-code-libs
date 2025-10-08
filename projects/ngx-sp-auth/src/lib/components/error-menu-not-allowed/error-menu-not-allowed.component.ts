import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgIf } from '@angular/common';
import { InfraModule } from 'ngx-sp-infra';
import { AuthStorageService } from '../../storage/auth-storage.service';

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
export class ErrorMenuNotAllowed {

  constructor(private router: Router,
              public authStorageService: AuthStorageService
) { }

  onHome() {
    this.router.navigate(["/home"]);
  }

}
