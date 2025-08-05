import { LogLevel, Configuration } from '@azure/msal-browser';

//???i
//const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
//const hostAuthLogin = !environment.production ? "http://localhost:4200/auth/login" : `${ environment.hostName }/SisproErpCloud/${ environment.product }/auth/login`;
const isIE = false;
const hostAuthLogin = "http://localhost:4200/auth/login" ;

//???f

export const msalConfig: Configuration = {
     auth: {
        clientId: "clientId",
        authority: "https://login.microsoftonline.com/tenantId",
        redirectUri: hostAuthLogin + "/",
        postLogoutRedirectUri: hostAuthLogin,
        navigateToLoginRequestUrl: true
     },
     cache: {
         cacheLocation: "localStorage",
         storeAuthStateInCookie: isIE,
     },
     system: {
         loggerOptions: {
            loggerCallback: (logLevel, message, containsPii) => {
                console.log(message);
             },
             logLevel: LogLevel.Error, // .Verbose
             
             piiLoggingEnabled: false
         }
     }
 }
