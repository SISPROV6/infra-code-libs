import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { NovaSenhaComponent } from "./components/nova-senha/nova-senhacomponent";

export const AUTH_ROUTES: Routes = [
  { path: '', component: LoginComponent, data: {title: "SisproERP | Meu portal"} },
  { path: 'novaSenha/:param', component: NovaSenhaComponent, data: {title: "Nova Senha"} }
];