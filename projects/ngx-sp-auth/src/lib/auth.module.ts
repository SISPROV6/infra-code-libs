import { importProvidersFrom, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MsalGuard, MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './auth-config';

@NgModule({
    providers: [
      importProvidersFrom(
                MsalModule.forRoot(new PublicClientApplication(msalConfig), 
          {
              // The routing guard configuration.
              interactionType: InteractionType.Redirect,
              authRequest: {
                  scopes: [
                      "user.read"
                  ]
              }
          }, 
          {
              // MSAL interceptor configuration.
              // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
              interactionType: InteractionType.Redirect,
              protectedResourceMap: new Map([])
          }
  )),
  {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
  },
  MsalGuard, // MsalGuard added as provider here
  ]
})
export class AuthModule { }