import { LogLevel, Configuration } from '@azure/msal-browser';

const isIE = false;
const hostAuthLogin = "http://localhost:4200/auth/login" ;

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
