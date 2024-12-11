import { Component, inject } from '@angular/core';
import { NgxSpAuthService } from './ngx-sp-auth.service';

@Component({
  selector: 'lib-ngx-sp-auth',
  standalone: true,
  imports: [],
  template: `
    <p>
      ngx-sp-auth works!
    </p>
  `,
  styles: ``
})
export class NgxSpAuthComponent {

  private authService = inject(NgxSpAuthService);

}
